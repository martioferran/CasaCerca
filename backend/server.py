from flask import Flask, request, jsonify, render_template
import requests
import json
import polyline
from shapely.geometry import LineString
from urllib.parse import quote
from flask_cors import CORS
import os
import staticmaps
from io import BytesIO
from PIL import Image
from time import time  # Add this import
import base64
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return render_template('index.html', google_api_key=os.environ.get('GOOGLE_API_KEY', ''))

def process_coordinates(latitude, longitude, dep_time, trav_time, trans_method, area_type):
    api_url = "https://api.traveltimeapp.com/v4/time-map"
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Application-Id': os.environ.get('TRAVELTIME_APP_ID'),
        'X-Api-Key': os.environ.get('TRAVELTIME_API_KEY')
    }

    payload = {
        "departure_searches": [
            {
                "id": "isochrone_search",
                "coords": {
                    "lat": latitude,
                    "lng": longitude
                },
                "departure_time": dep_time,
                "travel_time": trav_time,
                "transportation": {
                    "type": trans_method
                }
            }
        ]
    }

    print(f"Sending request to TravelTime API with payload: {payload}")  # Debug log
    
    response = requests.post(api_url, headers=headers, json=payload)
    print(f"TravelTime API response status: {response.status_code}")  # Debug log

    if response.status_code == 200:
        geojson_data = response.json()
        print(f"TravelTime API response: {geojson_data}")  # Debug log
        
        if 'results' not in geojson_data or not geojson_data['results']:
            print("No results in TravelTime API response")
            return []
            
        shapes = geojson_data['results'][0]['shapes']
        shapes_with_size = [(shape, len(shape['shell'])) for shape in shapes]
        print(f"Found {len(shapes)} shapes")  # Debug log

        shapes_with_size.sort(key=lambda x: x[1])
        results = []
        
        for shape in shapes_with_size:
            coordinates = shape[0]['shell']
            points = [(coord['lat'], coord['lng']) for coord in coordinates]

            line = LineString(points)
            simplified_line = line.simplify(0.01)
            simplified_points = list(simplified_line.coords)
            encoded_polyline = polyline.encode(simplified_points)
            url_encoded_polyline = quote(encoded_polyline)

            final_url = f"https://www.idealista.com/areas/{area_type}/mapa-google?shape=%28%28{url_encoded_polyline}%29%29"

            results.append({
                'coordinates': points,
                'url': final_url
            })

        print(f"Processed {len(results)} areas")  # Debug log
        return results
    else:
        print(f"TravelTime API error: {response.text}")  # Debug log
        return []

# In the process route, modify the error handling:
@app.route('/process', methods=['POST'])
def process():
    try:
        data = request.json
        
        # Validate and adjust date
        current_date = datetime.now()
        max_future_date = current_date + timedelta(days=14)
        requested_date = datetime.strptime(data['dep_time'][:10], '%Y-%m-%d')
        
        if requested_date > max_future_date:
            # Use a date within the supported range
            adjusted_date = current_date + timedelta(days=1)
            data['dep_time'] = adjusted_date.strftime('%Y-%m-%dT') + data['dep_time'][11:]
            print(f"Adjusted date to: {data['dep_time']}")

        latitude = data['latitude']
        longitude = data['longitude']
        dep_time = data['dep_time']
        trav_time = data['trav_time']
        trans_method = data['trans_method']
        area_type = data['area_type']

        result = process_coordinates(latitude, longitude, dep_time, trav_time, trans_method, area_type)
        
        if not result:
            return jsonify({
                'error': 'No areas found',
                'details': 'The TravelTime API returned no results for these parameters'
            }), 404
        
        colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33F6", "#F6FF33"]
        context = staticmaps.Context()
        context.set_tile_provider(staticmaps.tile_provider_OSM)
        areas_info = []
        
        start_time = time()

        for idx, res in enumerate(result):
            if res['coordinates']:
                points = res['coordinates']
                color_hex = colors[idx % len(colors)]
                
                area = staticmaps.Area(
                    [staticmaps.create_latlng(lat, lng) for lat, lng in points],
                    fill_color=staticmaps.parse_color(color_hex + "3F"),
                    width=2,
                    color=staticmaps.parse_color(color_hex),
                )
                context.add_object(area)
                
                areas_info.append({
                    'url': res['url'],
                    'index': idx + 1,
                    'color': color_hex
                })

        image = context.render_pillow(800, 500)
        img_io = BytesIO()
        image.save(img_io, 'PNG')
        img_io.seek(0)
        
        # Properly encode image as base64
        image_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
        
        response_data = {
            'result': result,
            'combined_map': {
                'map_image': image_base64,  # Now properly base64 encoded
                'areas': areas_info,
                'time_taken': time() - start_time
            }
        }
        return jsonify(response_data)

    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({
            'error': 'Server error',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
