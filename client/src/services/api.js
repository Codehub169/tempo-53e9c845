import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API call error raw:', error.config?.url, error.response || error.message);
    // Prefer backend error message if available, otherwise use generic Axios error or custom message
    if (error.response && error.response.data && error.response.data.message) {
      return Promise.reject(new Error(error.response.data.message));
    } else if (error.message) {
      return Promise.reject(new Error(error.message));
    }
    return Promise.reject(new Error('An unexpected API error occurred.'));
  }
);

export const getListings = async (filters = {}) => {
  try {
    const response = await apiClient.get('/listings', { params: filters });
    return response.data;
  } catch (error) {
    // Error already processed by interceptor, just re-throw for component handling
    throw error;
  }
};

export const getListingById = async (id) => {
  try {
    const response = await apiClient.get(`/listings/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createListing = async (listingDataFromForm) => {
  const formData = new FormData();

  if (listingDataFromForm.photos && listingDataFromForm.photos.length > 0) {
    listingDataFromForm.photos.forEach(photoFile => {
      formData.append('photos', photoFile, photoFile.name);
    });
  }

  for (const key in listingDataFromForm) {
    if (key !== 'photos') {
      const value = listingDataFromForm[key];
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(`${key}[]`, item)); 
      } else if (value !== null && value !== undefined && value !== '') { 
        formData.append(key, value);
      }
      // Consider if empty strings should be sent for optional fields, or if backend handles their absence.
      // Current logic omits empty strings. For example, if contactPhone is '', it's not sent.
    }
  }

  try {
    const response = await apiClient.post('/listings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const apiService = {
  getListings,
  getListingById,
  createListing,
  apiClient,
};

export default apiService;
