import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle API errors more globally if needed
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Could add more sophisticated error handling here
    // e.g., for auth errors, redirect to login
    console.error('API call error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// --- Mock Data for Initial Frontend Development ---
// This will be mutated by createListing in the mock scenario
let mockListings = [
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
      { item: 'Oppervlakte woning (75m²)', points: 60 },
      { item: 'Energieprestatie (Label B)', points: 20 },
      { item: 'Sanitair (Luxe badkamer)', points: 15 },
      { item: 'Keuken (Moderne keuken)', points: 15 },
      { item: 'WOZ-waarde (€450.000)', points: 28 },
      { item: 'Buitenruimte (Balkon 5m²)', points: 14 },
    ],
    lister: { name: 'Anna de Vries', type: 'Particuliere verhuurder', email: 'anna.devries@example.com', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
  },
  {
    id: '2',
    title: 'Licht Studio met Balkon',
    location: 'Utrecht Centrum',
    address: 'Oudegracht 123, 3511 AD Utrecht',
    price: 950,
    bedrooms: 0, 
    bathrooms: 1,
    area: 40,
    wwsPoints: 120,
    maxRent: 680.25,
    apartmentType: 'Studio',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'],
    description: 'Lichte en moderne studio in het bruisende centrum van Utrecht. Perfect voor een starter of student.',
    amenities: ['Wifi', 'Moderne Keuken', 'Balkon'],
    wwsDetails: [{item: 'Oppervlakte (40m²)', points: 32}, {item: 'WOZ (€200.000)', points: 15}],
    lister: { name: 'Stads Wonen BV', type: 'Makelaar', email: 'info@stadswonen.nl', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
  },
  // Add more listings with full details for better mock experience
];
// --- End Mock Data ---

/**
 * Fetches all apartment listings.
 * @param {object} filters - Optional filters to apply.
 * @returns {Promise<Array>} A promise that resolves to an array of listings.
 */
export const getListings = async (filters = {}) => {
  console.log('Mock API: Fetching listings with filters:', filters);
  // To use actual API: return (await apiClient.get('/listings', { params: filters })).data;
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredListings = [...mockListings]; // Work with a copy
      if (filters.priceRange && filters.priceRange !== '') {
        const [minStr, maxStr] = filters.priceRange.split('-');
        const min = minStr ? parseFloat(minStr) : 0;
        const max = maxStr ? parseFloat(maxStr) : Infinity;
        filteredListings = filteredListings.filter(l => l.price >= min && l.price <= max);
      }
      if (filters.minArea && filters.minArea !== '') {
        filteredListings = filteredListings.filter(l => l.area >= Number(filters.minArea));
      }
      if (filters.rooms && filters.rooms !== '') {
        if (filters.rooms.endsWith('+')) {
            const minRooms = parseInt(filters.rooms.slice(0, -1), 10);
            filteredListings = filteredListings.filter(l => (l.bedrooms + 1) >= minRooms); 
        } else {
            filteredListings = filteredListings.filter(l => (l.bedrooms + 1) === Number(filters.rooms));
        }
      }
      if (filters.minWwsPoints && filters.minWwsPoints !== '') {
        filteredListings = filteredListings.filter(l => l.wwsPoints >= Number(filters.minWwsPoints));
      }
      resolve(filteredListings);
    }, 500); 
  });
};

/**
 * Fetches a single apartment listing by its ID.
 * @param {string} id - The ID of the listing.
 * @returns {Promise<object>} A promise that resolves to the listing object.
 */
export const getListingById = async (id) => {
  console.log(`Mock API: Fetching listing with ID: ${id}`);
  // To use actual API: return (await apiClient.get(`/listings/${id}`)).data;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const listing = mockListings.find((l) => String(l.id) === String(id));
      if (listing) {
        resolve(listing);
      } else {
        // Simulate API error structure
        const error = new Error('Listing not found');
        error.response = { data: { message: 'Woning niet gevonden in mock data.' }, status: 404 };
        reject(error);
      }
    }, 300);
  });
};

/**
 * Creates a new apartment listing.
 * @param {object} listingData - The data for the new listing (expects File objects in photos array).
 * @returns {Promise<object>} A promise that resolves to the created listing object.
 */
export const createListing = async (listingData) => {
  console.log('Mock API: Creating new listing with data:', listingData);
  
  // For actual API with FormData for file uploads:
  // const formData = new FormData();
  // Object.keys(listingData).forEach(key => {
  //   if (key === 'photos') {
  //     listingData.photos.forEach(photoFile => formData.append('photos', photoFile));
  //   } else if (Array.isArray(listingData[key])) {
  //     listingData[key].forEach(item => formData.append(`${key}[]`, item)); // or JSON.stringify
  //   } else {
  //     formData.append(key, listingData[key]);
  //   }
  // });
  // return (await apiClient.post('/listings', formData, { headers: { 'Content-Type': 'multipart/form-data' }})).data;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const photoUrls = listingData.photos?.map(file => URL.createObjectURL(file)) || [];
      const newListing = {
        ...listingData,
        id: String(mockListings.length + 1 + Math.floor(Math.random() * 1000)), // More unique ID for mock
        wwsPoints: 100 + Math.floor(Math.random() * 100), // Mock WWS calculation
        maxRent: 500 + Math.floor(Math.random() * 500),    // Mock max rent
        imageUrl: photoUrls[0] || 'https://via.placeholder.com/320x220.png?text=Nieuwe+Woning',
        images: photoUrls.length > 0 ? photoUrls : ['https://via.placeholder.com/320x220.png?text=Nieuwe+Woning'],
        // Simulate other fields that might be generated or defaulted by backend
        status: 'pending', 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lister: { // Mock lister info based on contact details
          name: listingData.contactName || 'Nieuwe Verhuurder',
          type: 'Particuliere Verhuurder',
          email: listingData.contactEmail || 'contact@example.com',
          avatarUrl: 'https://randomuser.me/api/portraits/lego/1.jpg'
        }
      };
      mockListings.push(newListing);
      resolve(newListing);
    }, 700);
  });
};

export default {
  getListings,
  getListingById,
  createListing,
  apiClient, // Expose apiClient if needed for direct use elsewhere (e.g., specific configurations)
};
