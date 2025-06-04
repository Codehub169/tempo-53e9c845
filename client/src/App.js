import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage'; 
import ListingDetailPage from './pages/ListingDetailPage'; 
import ListApartmentPage from './pages/ListApartmentPage';

// Placeholder for AboutPage, ContactPage if they become actual pages
// import AboutPage from './pages/AboutPage';
// import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/list-apartment" element={<ListApartmentPage />} />
        {/* 
          The HTML previews have links like "#about" and "#contact". 
          These might be sections on the homepage or separate pages.
          If they become separate pages, routes would be added here:
          <Route path="/about-wws" element={<AboutWWSPage />} />
          <Route path="/contact" element={<ContactPage />} /> 
        */}
      </Routes>
    </Layout>
  );
}

export default App;
