import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  SimpleGrid,
  Flex,
  Select,
  Spinner,
  Center,
  Icon,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import ListingCard from '../components/ListingCard';
import ApartmentFilter from '../components/ApartmentFilter';
import { useApartments } from '../contexts/ApartmentContext';

const HomePage = () => {
  const {
    listings,
    loading,
    error,
    filters,
    searchTerm,
    sortOption,
    fetchListings,
    updateFilters,
    updateSearchTerm,
    updateSortOption,
  } = useApartments();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const toast = useToast();

  const heroBgColor = useColorModeValue('gray.100', 'gray.700');
  const searchBarBg = useColorModeValue('white', 'gray.800');

  // Fetch listings when filters, searchTerm, or sortOption from context change
  useEffect(() => {
    fetchListings();
  }, [filters, searchTerm, sortOption, fetchListings]);

  // Sync localSearchTerm if searchTerm from context changes (e.g. on navigation or clear)
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Handle local search input change
  const handleSearchInputChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  // Apply search term to context on form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateSearchTerm(localSearchTerm);
    // fetchListings will be triggered by context change via useEffect
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
    // fetchListings will be triggered by context change via useEffect
  };

  // This function is called by ApartmentFilter's explicit apply button (typically on mobile)
  const handleApplyFilters = () => {
     fetchListings(); // Explicitly fetch with current context state
  };

  const handleSortChange = (e) => {
    updateSortOption(e.target.value);
    // fetchListings will be triggered by context change via useEffect
  };

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error fetching listings',
        description: error, // error is expected to be a string message from context
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  return (
    <>
      <Box bg={heroBgColor} py={{ base: 12, md: 20 }}>
        <Container variant="main">
          <Heading as="h1" size={{ base: 'xl', md: '2xl' }} fontFamily="heading" textAlign="center" mb={4}>
            Vind Jouw Perfecte Huurwoning
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="text.light" textAlign="center" mb={8} maxW="700px" mx="auto">
            Transparant, eerlijk en makkelijk. Ontdek woningen met duidelijke WWS-puntentelling en maximale huurprijs.
          </Text>
          <Flex 
            as="form" 
            onSubmit={handleSearchSubmit}
            maxW="800px" 
            mx="auto" 
            bg={searchBarBg} 
            p={4} 
            borderRadius="lg" 
            boxShadow="lg"
            direction={{ base: 'column', md: 'row' }}
            gap={3}
          >
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaMapMarkerAlt} color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Zoek op stad, buurt of trefwoord..." 
                value={localSearchTerm}
                onChange={handleSearchInputChange}
                size="lg"
                variant="filled"
                focusBorderColor="brand.500"
              />
            </InputGroup>
            <Button 
              type="submit" 
              colorScheme="brand" 
              size="lg" 
              px={8} 
              leftIcon={<FaSearch />}
              isLoading={loading}
            >
              Zoeken
            </Button>
          </Flex>
        </Container>
      </Box>

      <Box py={{ base: 6, md: 10 }}>
        <Container variant="main">
          <ApartmentFilter 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onApplyFilters={handleApplyFilters} 
          />
        </Container>
      </Box>

      <Container variant="main" pb={{ base: 12, md: 20 }}>
        <Flex justify="space-between" align="center" mb={8} wrap="wrap" gap={4}>
          <Heading as="h2" size="lg" fontFamily="heading">
            {loading ? 'Woningen Laden...' : listings.length > 0 ? `${listings.length} Woning${listings.length !== 1 ? 'en' : ''} Gevonden` : 'Geen Woningen Gevonden'}
          </Heading>
          <Select 
            w={{ base: '100%', sm: 'auto' }} 
            minWidth="200px" 
            value={sortOption} 
            onChange={handleSortChange}
            borderColor="border.medium" // Ensure this key exists in theme or use a valid one e.g. gray.300
            focusBorderColor="brand.500"
          >
            <option value="newest">Nieuwste eerst</option>
            <option value="price-asc">Prijs (laag naar hoog)</option>
            <option value="price-desc">Prijs (hoog naar laag)</option>
            <option value="wws-asc">WWS Punten (laag naar hoog)</option>
            <option value="wws-desc">WWS Punten (hoog naar laag)</option>
          </Select>
        </Flex>

        {loading && listings.length === 0 ? (
          <Center minH="300px">
            <Spinner size="xl" color="brand.500" thickness="4px" />
          </Center>
        ) : !loading && listings.length === 0 && !error ? (
          <Center minH="200px">
            <Text fontSize="xl" color="text.light">Geen woningen gevonden die aan uw criteria voldoen. Pas uw zoekcriteria aan of probeer het later opnieuw.</Text>
          </Center>
        ) : !loading && listings.length === 0 && error ? (
          <Center minH="200px">
            <Text fontSize="xl" color="text.light">Kon woningen niet laden. Probeer het later opnieuw.</Text>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {listings.map((listing) => (
              <ListingCard 
                key={listing.id} 
                {...listing} 
                // Provide imageUrl for ListingCard, defaulting to a placeholder if no photos
                imageUrl={(listing.photos && listing.photos.length > 0) ? listing.photos[0] : 'https://via.placeholder.com/400x300.png?text=Geen+foto'}
                // Ensure maxRent is passed if ListingCard expects it, or maxLegalRent
                maxRent={listing.maxLegalRent} // Or ensure ListingCard uses maxLegalRent
              />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </>
  );
};

export default HomePage;
