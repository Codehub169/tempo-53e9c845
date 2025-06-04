import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import {
  getListings as apiGetListings,
  getListingById as apiGetListingById,
  createListing as apiCreateListing
} from '../services/api';

const ApartmentContext = createContext();

const initialState = {
  listings: [],
  currentListing: null,
  loading: false,
  error: null,
  filters: {
    priceRange: '',
    minArea: '',
    rooms: '',
    wwsPoints: '',
  },
  searchTerm: '',
  sortOption: 'newest',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalListings: 0,
  }
};

function apartmentReducer(state, action) {
  switch (action.type) {
    case 'FETCH_LISTINGS_START':
    case 'FETCH_LISTING_START':
    case 'CREATE_LISTING_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_LISTINGS_SUCCESS':
      return {
        ...state,
        loading: false,
        listings: action.payload.listings,
        // pagination: action.payload.pagination, // Assuming API returns pagination info
      };
    case 'FETCH_LISTING_SUCCESS':
      return { ...state, loading: false, currentListing: action.payload };
    case 'CREATE_LISTING_SUCCESS':
      return { ...state, loading: false, listings: [...state.listings, action.payload] }; // Or refetch
    case 'FETCH_LISTINGS_ERROR':
    case 'FETCH_LISTING_ERROR':
    case 'CREATE_LISTING_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SORT_OPTION':
      return { ...state, sortOption: action.payload };
    case 'CLEAR_CURRENT_LISTING':
      return { ...state, currentListing: null };
    default:
      return state;
  }
}

export function ApartmentProvider({ children }) {
  const [state, dispatch] = useReducer(apartmentReducer, initialState);

  const fetchListings = useCallback(async (appliedFilters, appliedSearchTerm, appliedSortOption) => {
    dispatch({ type: 'FETCH_LISTINGS_START' });
    try {
      // Combine filters from state with any directly applied ones
      const queryParams = {
        ...state.filters,
        ...appliedFilters,
        search: appliedSearchTerm !== undefined ? appliedSearchTerm : state.searchTerm,
        sort: appliedSortOption !== undefined ? appliedSortOption : state.sortOption,
        // page: state.pagination.currentPage, // Add pagination later
      };
      const data = await apiGetListings(queryParams);
      dispatch({ type: 'FETCH_LISTINGS_SUCCESS', payload: { listings: data } }); // Adjust if API returns pagination
    } catch (error) {
      dispatch({ type: 'FETCH_LISTINGS_ERROR', payload: error.message });
    }
  }, [state.filters, state.searchTerm, state.sortOption]); // state.pagination.currentPage

  const fetchListingById = useCallback(async (id) => {
    dispatch({ type: 'FETCH_LISTING_START' });
    try {
      const data = await apiGetListingById(id);
      dispatch({ type: 'FETCH_LISTING_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_LISTING_ERROR', payload: error.message });
    }
  }, []);

  const createListing = useCallback(async (listingData) => {
    dispatch({ type: 'CREATE_LISTING_START' });
    try {
      const newListing = await apiCreateListing(listingData);
      dispatch({ type: 'CREATE_LISTING_SUCCESS', payload: newListing });
      // Optionally, refetch all listings or navigate
      return newListing; // Return for potential immediate use
    } catch (error) {
      dispatch({ type: 'CREATE_LISTING_ERROR', payload: error.message });
      throw error; // Re-throw for form error handling
    }
  }, []);

  const updateFilters = useCallback((newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, []);

  const updateSearchTerm = useCallback((term) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  const updateSortOption = useCallback((option) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: option });
  }, []);

  const clearCurrentListing = useCallback(() => {
    dispatch({ type: 'CLEAR_CURRENT_LISTING' });
  }, []);

  // Initial fetch of listings - can be triggered from a component if preferred
  // useEffect(() => {
  //  fetchListings();
  // }, [fetchListings]);

  const contextValue = useMemo(() => ({
    ...state,
    fetchListings,
    fetchListingById,
    createListing,
    updateFilters,
    updateSearchTerm,
    updateSortOption,
    clearCurrentListing,
  }), [state, fetchListings, fetchListingById, createListing, updateFilters, updateSearchTerm, updateSortOption, clearCurrentListing]);

  return (
    <ApartmentContext.Provider value={contextValue}>
      {children}
    </ApartmentContext.Provider>
  );
}

export function useApartments() {
  const context = useContext(ApartmentContext);
  if (context === undefined) {
    throw new Error('useApartments must be used within an ApartmentProvider');
  }
  return context;
}
