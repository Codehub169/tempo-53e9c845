import React, { useState, useEffect, useCallback } from 'react';
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
} from '@chakra-ui/react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import ListingCard from '../components/ListingCard';
import ApartmentFilter from '../components/ApartmentFilter';
import { getListings } from '../services/api'; // Using mock API for now

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priceRange: '',
    minArea: '',
    rooms: '',
    minWwsPoints: '',
  });
  const [sortOption, setSortOption] = useState('newest');

  const heroBgColor = useColorModeValue('gray.100', 'gray.700');
  const searchBarBg = useColorModeValue('white', 'gray.800');

  const fetchApartments = useCallback(async () => {
    setIsLoading(true);
    try {
      // Combine searchTerm with filters for API call if backend supports it
      // For now, mock API handles basic filters, searchTerm is local
      const fetchedListings = await getListings(filters);
      
      let processedListings = fetchedListings;

      // Local search term filtering (if API doesn't handle it)
      if (searchTerm) {
        processedListings = processedListings.filter(listing => 
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          listing.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Local sorting
      processedListings.sort((a, b) => {
        switch (sortOption) {
          case 'price-asc': return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          case 'wws-asc': return a.wwsPoints - b.wwsPoints;
          case 'wws-desc': return b.wwsPoints - a.wwsPoints;
          case 'newest': // Assuming higher ID is newer, or add a date field like createdAt
          default:
            // Fallback to ID or a date field if available. Mock uses ID.
            // Real API might return `createdAt` for more reliable sorting.
            return (b.createdAt || b.id) > (a.createdAt || a.id) ? 1 : -1;
        }
      });

      setListings(processedListings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      // TODO: Add user-friendly error display (e.g., Toast)
    } finally {
      setIsLoading(false);
    }
  }, [filters, searchTerm, sortOption]);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    fetchApartments(); // Re-fetch or re-process with new filters
  };

  return (
    <>
      {/* Hero Section */}
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
            onSubmit={(e) => { e.preventDefault(); fetchApartments(); }}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              isLoading={isLoading}
            >
              Zoeken
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Filters Section */}
      <Box py={{ base: 6, md: 10 }}> {/* Adjusted padding slightly for rhythm */}
        <Container variant="main">
          <ApartmentFilter 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onApplyFilters={handleApplyFilters} 
          />
        </Container>
      </Box>

      {/* Listings Section */}
      <Container variant="main" pb={{ base: 12, md: 20 }}>
        <Flex justify="space-between" align="center" mb={8} wrap="wrap" gap={4}>
          <Heading as="h2" size="lg" fontFamily="heading">
            {isLoading ? 'Woningen Laden...' : listings.length > 0 ? `${listings.length} Woning${listings.length > 1 ? 'en' : ''} Gevonden` : 'Geen Woningen Gevonden'}
          </Heading>
          <Select 
            w={{ base: '100%', sm: 'auto' }} 
            minWidth="200px" 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            borderColor="border.medium"
            focusBorderColor="brand.500"
          >
            <option value="newest">Nieuwste eerst</option>
            <option value="price-asc">Prijs (laag naar hoog)</option>
            <option value="price-desc">Prijs (hoog naar laag)</option>
            <option value="wws-asc">WWS Punten (laag naar hoog)</option>
            <option value="wws-desc">WWS Punten (hoog naar laag)</option>
          </Select>
        </Flex>

        {isLoading ? (
          <Center minH="300px">
            <Spinner size="xl" color="brand.500" thickness="4px" />
          </Center>
        ) : listings.length === 0 ? (
          <Center minH="200px">
            <Text fontSize="xl" color="text.light">Pas uw zoekcriteria aan of probeer het later opnieuw.</Text>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {listings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </>
  );
};

export default HomePage;
