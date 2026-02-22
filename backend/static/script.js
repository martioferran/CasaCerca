//const googleApiKey = 'REDACTED';
const googleApiKey = '{{ GOOGLE_API_KEY }}';
let autocompleteService;
let geocoder;
let selectedAddress = '';

function initializeServices() {
    autocompleteService = new google.maps.places.AutocompleteService();
    geocoder = new google.maps.Geocoder();
    populateDepartureTimes();
}

function populateDepartureTimes() {
    const depTimeSelect = document.getElementById('dep_time');
    
    for (let i = 0; i < 24; i++) {
        const hour = String(i).padStart(2, '0');
        depTimeSelect.innerHTML += `<option value="${hour}:00">${hour}:00</option>`;
        depTimeSelect.innerHTML += `<option value="${hour}:30">${hour}:30</option>`;
    }
}

function getSuggestions(address) {
    if (!autocompleteService) return;
    autocompleteService.getPlacePredictions({ input: address }, displaySuggestions);
}

function displaySuggestions(predictions, status) {
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = '';

    if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
        return;
    }

    predictions.forEach(prediction => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'suggestion';
        suggestionDiv.textContent = prediction.description;
        suggestionDiv.onclick = () => selectSuggestion(prediction.description);
        suggestionsDiv.appendChild(suggestionDiv);
    });
}

function selectSuggestion(address) {
    selectedAddress = address;
    document.getElementById('address').value = address;
    document.getElementById('get-coordinates').disabled = false;
    document.getElementById('suggestions').innerHTML = '';
}

document.getElementById('get-coordinates').addEventListener('click', async () => {
    const resultDiv = document.getElementById('result');
    const depDate = document.getElementById('dep_date').value;
    const depTime = document.getElementById('dep_time').value;
    const travTime = parseInt(document.getElementById('trav_time').value) * 60; // convert to seconds
    const areaType = document.getElementById('area_type').value;

    const formattedDepTime = new Date(depDate);
    formattedDepTime.setHours(parseInt(depTime.split(':')[0]), parseInt(depTime.split(':')[1]), 0);
    const isoDepTime = formattedDepTime.toISOString();

    geocoder.geocode({ address: selectedAddress }, async (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            const location = results[0].geometry.location;
            const latitude = location.lat();
            const longitude = location.lng();
            resultDiv.innerHTML = `Selected Address: ${results[0].formatted_address}<br/>Latitude: ${latitude}<br/>Longitude: ${longitude}`;

            // to change to local ip to run locally
            const serverResponse = await fetch('https://ideas-7gxa.onrender.com/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    latitude: latitude,
                    longitude: longitude,
                    dep_time: isoDepTime,
                    trav_time: travTime,
                    trans_method: document.getElementById('trans_method').value,
                    area_type: areaType
                })
            });

            const resultData = await serverResponse.json();
            if (resultData.length > 0) {
                resultDiv.innerHTML += '<h2>Idealista Links:</h2>';
                resultData.forEach(url => {
                    const link = document.createElement('a');
                    link.href = url;
                    link.textContent = url;
                    link.target = '_blank';
                    resultDiv.appendChild(link);
                    resultDiv.appendChild(document.createElement('br'));
                });
            } else {
                resultDiv.innerHTML += '<p>No links found.</p>';
            }
        } else {
            resultDiv.innerHTML = 'No coordinates found.';
        }
    });
});


document.getElementById('address').addEventListener('input', (event) => {
    const address = event.target.value;
    if (address) {
        getSuggestions(address);
    } else {
        document.getElementById('suggestions').innerHTML = '';
        document.getElementById('get-coordinates').disabled = true;
    }
});

window.onload = initializeServices;
