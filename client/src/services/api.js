import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api'; // Use environment variable or default

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Mock Data for Initial Frontend Development ---
const mockListings = [
  {
    id: '1',
    title: 'Stijlvol Appartement Centrum',
    location: 'Amsterdam Oud-West',
    price: 1650,
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    wwsPoints: 152,
    maxRent: 845.60,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    ],
    address: 'Overtoom 301, 1054 HW Amsterdam',
    apartmentType: 'Appartement',
    description: 'Dit prachtige, lichte appartement in het hart van Amsterdam Oud-West biedt een perfecte combinatie van moderne luxe en authentieke charme. Gelegen aan de levendige Overtoom, met het Vondelpark op loopafstand, is dit de ideale uitvalsbasis. Het appartement is recentelijk gerenoveerd en beschikt over een ruime woonkamer, twee slaapkamers, een moderne keuken voorzien van alle gemakken, en een luxe badkamer. Het balkon aan de achterzijde biedt een rustige plek om te ontspannen.',
    amenities: ['Wifi', 'Kabel TV', 'Moderne Keuken', 'Balkon', 'Luxe Badkamer', 'Centrale Verwarming', 'Wasmachine', 'Vaatwasser'],
    wwsDetails: [
      { item: 'Oppervlakte woning (75m
ickel)', points: 60 },
      { item: 'Energieprestatie (Label B)', points: 20 },
      { item: 'Sanitair (Luxe badkamer)', points: 15 },
      { item: 'Keuken (Moderne keuken)', points: 15 },
      { item: 'WOZ-waarde (
20ac450.000)', points: 28 },
      { item: 'Buitenruimte (Balkon 5m
ickel)', points: 14 },
    ],
    lister: { name: 'Anna de Vries', type: 'Particuliere verhuurder', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
  },
  {
    id: '2',
    title: 'Licht Studio met Balkon',
    location: 'Utrecht Centrum',
    price: 950,
    bedrooms: 0, // Studio
    bathrooms: 1,
    area: 40,
    wwsPoints: 120,
    maxRent: 680.25,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
    // ... add more detail fields if needed for detail page
  },
  {
    id: '3',
    title: 'Ruim Familiehuis met Tuin',
    location: 'Rotterdam Kralingen',
    price: 2100,
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    wwsPoints: 185,
    maxRent: 1050.12,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: '4',
    title: 'Modern Penthouse Zeezicht',
    location: 'Den Haag Scheveningen',
    price: 2800,
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    wwsPoints: 195,
    maxRent: 1180.70,
    imageUrl: 'https://images.unsplash.com/photo-1494203484021-3c454daf695d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
];
// --- End Mock Data ---

/**
 * Fetches all apartment listings.
 * @param {object} filters - Optional filters to apply.
 * @returns {Promise<Array>} A promise that resolves to an array of listings.
 */
export const getListings = async (filters = {}) => {
  console.log('Fetching listings with filters:', filters);
  // Replace with actual API call: return apiClient.get('/listings', { params: filters });
  return new Promise((resolve) => {
    setTimeout(() => {
      // Basic filtering for mock data
      let filteredListings = mockListings;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        filteredListings = filteredListings.filter(l => l.price >= (min || 0) && l.price <= (max || Infinity));
      }
      if (filters.minArea) {
        filteredListings = filteredListings.filter(l => l.area >= Number(filters.minArea));
      }
      if (filters.rooms) {
        // Simplified: exact match or '4+' means >= 4
        if (filters.rooms === '4+') {
            filteredListings = filteredListings.filter(l => l.bedrooms + 1 >= 4); // Assuming rooms = bedrooms + 1 living room
        } else {
            filteredListings = filteredListings.filter(l => l.bedrooms + 1 === Number(filters.rooms));
        }
      }
      if (filters.minWwsPoints) {
        filteredListings = filteredListings.filter(l => l.wwsPoints >= Number(filters.minWwsPoints));
      }
      resolve(filteredListings);
    }, 500); // Simulate network delay
  });
};

/**
 * Fetches a single apartment listing by its ID.
 * @param {string} id - The ID of the listing.
 * @returns {Promise<object>} A promise that resolves to the listing object.
 */
export const getListingById = async (id) => {
  console.log(`Fetching listing with ID: ${id}`);
  // Replace with actual API call: return apiClient.get(`/listings/${id}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const listing = mockListings.find((l) => l.id === id);
      if (listing) {
        resolve(listing);
      } else {
        reject(new Error('Listing not found'));
      }
    }, 300);
  });
};

/**
 * Creates a new apartment listing.
 * @param {object} listingData - The data for the new listing.
 * @returns {Promise<object>} A promise that resolves to the created listing object.
 */
export const createListing = async (listingData) => {
  console.log('Creating new listing with data:', listingData);
  // Replace with actual API call: return apiClient.post('/listings', listingData);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newListing = { ...listingData, id: String(mockListings.length + 1), wwsPoints: 100 + Math.floor(Math.random() * 100), maxRent: 500 + Math.floor(Math.random() * 500), imageUrl: listingData.photos?.[0] ? URL.createObjectURL(listingData.photos[0]) : 'https://via.placeholder.com/320x220.png?text=Nieuwe+Woning' };
      mockListings.push(newListing);
      resolve(newListing);
    }, 700);
  });
};

export default {
  getListings,
  getListingById,
  createListing,
};
