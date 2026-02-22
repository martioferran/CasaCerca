import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

// Page Components
import HeroSection from "@/features/hero/components/HeroSection.jsx";
import Workingflow from "@/features/home/components/HomeSearch.jsx";
import Footer from "@/components/layout/Footer/index.jsx";
import SobreNosotros from '@/pages/about/index.jsx';
import Addition from '@/pages/additional-services/index.jsx';
import Privacy from '@/pages/legal/privacy.jsx';
import Terms from '@/pages/legal/terms.jsx';
import Contact from '@/pages/contact/index.jsx';
import TestLogos from '@/components/common/TestLogos/index.jsx';

// Blog Pages
import { BlogPage } from '@/pages/blog/index.jsx';
import { BlogPost } from '@/features/blog/components/BlogPost.jsx';

// Map Downloader Tool (only in development)
import { MapDownloader } from '@/utils/MapDownloader.jsx';

function App() {
  const [resultData, setResultData] = useState(null);
  const workflowRef = useRef(null);

  const handleResultData = (data) => {
    setResultData(data);
  };

  useEffect(() => {
    if (resultData) {
      workflowRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [resultData]);

  // Helper function to wrap elements with Footer
  const withFooter = (Element, props = {}) => (
    <>
      {React.createElement(Element, props)}
      <Footer />
    </>
  );

  return (
    <HelmetProvider>
      <Router>
        <div>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection 
                    onResultData={handleResultData} 
                    initialData={Object.fromEntries(new URLSearchParams(window.location.search))}
                  />
                  <div ref={workflowRef}>
                    <Workingflow resultData={resultData} />
                  </div>
                  <Footer />
                </>
              }
            />
            <Route path="/sobre" element={withFooter(SobreNosotros)} />
            <Route path="/addition" element={withFooter(Addition)} />
            <Route path="/privacy" element={withFooter(Privacy)} />
            <Route path="/terms" element={withFooter(Terms)} />
            <Route path="/contact" element={withFooter(Contact)} />
            <Route path="/test-logos" element={withFooter(TestLogos)} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={withFooter(BlogPage)} />
            <Route path="/blog/:slug" element={withFooter(BlogPost)} />
            
            {/* Map Downloader Tool - only available in development */}
            {process.env.NODE_ENV === 'development' && (
              <Route path="/mapdownloader" element={<MapDownloader />} />
            )}
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;