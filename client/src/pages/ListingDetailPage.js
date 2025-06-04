import React, { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Flex,
  Icon,
  Button,
  Divider,
  Spinner,
  Center,
  Tag,
  List,
  ListItem,
  ListIcon,
  AspectRatio,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Grid,
  GridItem,
  Avatar,
  Link,
  useToast
} from '@chakra-ui/react';
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaHome,
  FaRulerCombined,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEnvelope,
  FaExternalLinkAlt,
  FaWifi, FaTv, FaSink, FaDoorOpen, FaTemperatureLow, FaTshirt, FaUtensils
} from 'react-icons/fa';
import { useApartments } from '../contexts/ApartmentContext';

// Standardized amenity keys based on form values from ListApartmentPage.js
// and common descriptive terms.
const amenityIcons = {
  // From Form
  'sink': FaSink,
  'stove': FaUtensils,
  'oven': FaUtensils,
  'extractor': FaTemperatureLow, // Consider a more specific icon if available
  'fridge': FaTemperatureLow,    // Consider a more specific icon
  'dishwasher': FaUtensils,
  'toilet': FaBath,
  'shower': FaBath,
  'tub': FaBath,
  // Common general amenities (ensure these values are used consistently when creating listings)
  'Wifi': FaWifi,
  'Kabel TV': FaTv,
  'Balkon': FaDoorOpen,
  'Centrale Verwarming': FaTemperatureLow,
  'Wasmachine': FaTshirt,
  // Add other potential amenities here if they are stored with these exact string values
};

const ListingDetailPage = () => {
  const { id } = useParams();
  const {
    currentListing: listing,
    loading,
    error,
    fetchListingById,
    clearCurrentListing
  } = useApartments();
  const toast = useToast();

  const wwsCardBg = useColorModeValue('gray.50', 'gray.700');
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const mainImageBorderColor = useColorModeValue('gray.200', 'gray.600');
  const listerInfoBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    if (id) {
      fetchListingById(id);
    }
    return () => {
      clearCurrentListing();
    };
  }, [id, fetchListingById, clearCurrentListing]);

  useEffect(() => {
    if (error && !listing) {
      toast({
        title: 'Error fetching listing details',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast, listing]);

  if (loading) {
    return (
      <Center flexGrow={1} py={10} minHeight="300px">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  if (error && !listing) {
    return (
      <Container variant="main" py={10} flexGrow={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="300px" textAlign="center">
        <Heading as="h2" size="lg" mb={4}>Fout bij Laden</Heading>
        <Text fontSize="xl" color="text.light" mb={4}>{error}</Text>
        <Button as={RouterLink} to="/" colorScheme="brand" mt={6}>Terug naar Home</Button>
      </Container>
    );
  }

  if (!listing) return null;

  const { 
    title = 'Onbekende Titel',
    address,
    location, // Fallback for address if 'address' is not detailed enough or missing
    price = 0,
    bedrooms = 0,
    bathrooms = 0,
    area = 0,
    apartmentType = 'Appartement',
    photos = [], // Expecting 'photos' array from listing data
    description = 'Geen beschrijving beschikbaar.',
    amenities = [], // Assuming this is a combined list of kitchen/bathroom/other amenities
    wwsPoints = 0,
    maxLegalRent = 0,
    wwsDetails = [], // Placeholder for detailed WWS breakdown if available
    lister = { name: 'Verhuurder', type: 'Verhuurder', email: 'verhuurder@example.com', avatarUrl: '' } 
  } = listing;

  const safePrice = Number(price) || 0;
  const safeMaxLegalRent = Number(maxLegalRent) || 0;

  const isOverpriced = safePrice > safeMaxLegalRent;
  const priceDifference = Math.abs(safePrice - safeMaxLegalRent);
  
  const displayImages = (Array.isArray(photos) && photos.length > 0) 
    ? photos 
    : ['https://via.placeholder.com/800x600.png?text=Geen+foto'];

  return (
    <Container variant="detail" py={{ base: 6, md: 10 }}>
      <Grid 
        templateAreas={{
          base: `"main" "thumb1" "thumb2" "thumb3" "thumb4"`,
          md: `"main main thumb1 thumb2" 
               "main main thumb3 thumb4"`
        }}
        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }}
        gridTemplateRows={{ base: 'auto', md: 'minmax(0, 1fr) minmax(0, 1fr)'}}
        gap={2}
        mb={{ base: 6, md: 10 }}
        maxH={{ base: 'auto', md: '510px'}}
        overflow="hidden"
        borderRadius="xl"
      >
        <GridItem area="main" minH="0">
          <AspectRatio ratio={(displayImages.length > 1) ? 4/3 : 16/9} h="100%">
            <Image src={displayImages[0]} alt={title} objectFit="cover" borderRadius="lg" border={`1px solid ${mainImageBorderColor}`}/>
          </AspectRatio>
        </GridItem>
        {displayImages.slice(1, 5).map((img, index) => (
          <GridItem area={`thumb${index + 1}`} key={index} display={{ base: index >= 2 && displayImages.length <=3 ? 'none' : 'block' , md: 'block'}} minH="0">
            <AspectRatio ratio={4/3} h="100%">
              <Image src={img} alt={`${title} - detail ${index + 1}`} objectFit="cover" borderRadius="md" />
            </AspectRatio>
          </GridItem>
        ))}
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '2.5fr 1fr' }} gap={{ base: 8, md: 12 }}>
        <Box>
          <Heading as="h1" size={{ base: 'xl', md: '2xl' }} fontFamily="heading" mb={2}>{title}</Heading>
          <Text fontSize="lg" color="text.light" mb={4} display="flex" alignItems="center">
            <Icon as={FaMapMarkerAlt} mr={2} color="brand.500" /> {address || location || 'Locatie onbekend'}
          </Text>

          <Flex wrap="wrap" gap={{ base: 3, md: 5 }} mb={6} pb={6} borderBottomWidth="1px" borderColor="border.medium">
            <Tag size="lg" variant="subtle" colorScheme="brand"><Icon as={FaHome} mr={2}/>{apartmentType}</Tag>
            <Tag size="lg"><Icon as={FaBed} mr={2}/>{bedrooms === 0 ? 'Studio' : `${bedrooms} slpk`}</Tag>
            <Tag size="lg"><Icon as={FaBath} mr={2}/>{bathrooms} badk</Tag>
            <Tag size="lg"><Icon as={FaRulerCombined} mr={2}/>{area} m²</Tag>
          </Flex>

          <Box bg={wwsCardBg} p={{ base: 4, md: 6 }} borderRadius="lg" borderWidth="1px" borderColor="border.light" mb={8} boxShadow="md">
            <Heading as="h2" size="lg" fontFamily="heading" color="brand.500" mb={4}>Woningwaarderingsstelsel (WWS)</Heading>
            {Array.isArray(wwsDetails) && wwsDetails.length > 0 ? (
              wwsDetails.map((item, idx) => (
                <Flex key={idx} justify="space-between" py={2} borderBottomWidth={idx === wwsDetails.length - 1 ? 0 : '1px'} borderStyle="dashed" borderColor="border.medium">
                  <Text>{item.item}</Text>
                  <Text fontWeight="bold">{item.points} pnt</Text>
                </Flex>
              ))
            ) : (
              <Text color="text.light">WWS detail specificatie (nog) niet beschikbaar.</Text>
            )}
            <Divider my={3} />
            <Flex justify="space-between" py={2} fontWeight="bold" fontSize="lg">
              <Text>Totaal WWS Punten</Text>
              <Text color="brand.500">{wwsPoints} pnt</Text>
            </Flex>
            <Flex justify="space-between" py={2} fontWeight="bold" fontSize="lg">
              <Text>Max. Legale Huurprijs</Text>
              <Text color="accent.500">€ {safeMaxLegalRent.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </Flex>
            { wwsPoints > 0 && (
              <Alert 
                status={isOverpriced ? 'error' : 'success'} 
                variant="subtle" 
                mt={4} 
                borderRadius="md"
              >
                <AlertIcon as={isOverpriced ? FaExclamationTriangle : FaCheckCircle} />
                <Box flex="1">
                  <AlertTitle>{isOverpriced ? 'Hoger dan Max. Huur' : 'Eerlijke Prijsstelling'}</AlertTitle>
                  <AlertDescription>
                    Vraagprijs (€{safePrice.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) is €{priceDifference.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {isOverpriced ? 'hoger dan' : 'lager dan of gelijk aan'} de max. legale huur.
                  </AlertDescription>
                </Box>
              </Alert>
            )}
            <Link href="https://www.rijksoverheid.nl/onderwerpen/woning-huren/vraagbaak/hoeveel-huur-betaal-ik-maximaal-voor-mijn-woning" isExternal color="brand.500" mt={4} display="inline-flex" alignItems="center">
              Meer over WWS <Icon as={FaExternalLinkAlt} ml={1.5} />
            </Link>
          </Box>

          <Heading as="h2" size="lg" fontFamily="heading" mb={3}>Beschrijving</Heading>
          <Text whiteSpace="pre-wrap" lineHeight="tall" mb={8} pb={8} borderBottomWidth="1px" borderColor="border.medium">
            {description}
          </Text>

          <Heading as="h2" size="lg" fontFamily="heading" mb={4}>Voorzieningen</Heading>
          {Array.isArray(amenities) && amenities.length > 0 ? (
            <List spacing={3} mb={8} pb={8} borderBottomWidth="1px" borderColor="border.medium">
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3}} spacing={3}>
                {amenities.map((amenity, idx) => (
                  <ListItem key={idx} display="flex" alignItems="center">
                    <ListIcon as={amenityIcons[amenity] || FaCheckCircle} color="accent.500" />
                    {amenity}
                  </ListItem>
                ))}
              </SimpleGrid>
            </List>
            ) : (
            <Text color="text.light" mb={8} pb={8} borderBottomWidth="1px" borderColor="border.medium">
                Geen voorzieningen gespecificeerd.
            </Text>
          )}
          
          <Heading as="h2" size="lg" fontFamily="heading" mb={4}>Locatie</Heading>
          <AspectRatio ratio={16 / 9} mb={8} borderRadius="md" overflow="hidden" boxShadow="sm">
            <Box as="iframe"
              title={`Kaart van ${address || location || title}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(address || location || 'Nederland')}&hl=nl&z=15&output=embed`}
              allowFullScreen
              loading="lazy"
            />
          </AspectRatio>

        </Box>

        <Box position={{ base: 'static', lg: 'sticky' }} top="100px" alignSelf="start" h="fit-content">
          <Box bg={sidebarBg} p={{ base: 5, md: 7 }} borderRadius="xl" borderWidth="1px" borderColor="border.light" boxShadow="xl">
            <Heading as="h3" size="md" fontFamily="heading" mb={1}>Huurprijs</Heading>
            <Text fontSize="3xl" fontWeight="bold" color="brand.500" mb={4}>
              € {safePrice.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <Text as="span" fontSize="md" fontWeight="normal" color="text.light">/maand</Text>
            </Text>
            
            {lister && (
              <Flex align="center" mb={6} p={3} bg={listerInfoBg} borderRadius="md">
                <Avatar src={lister.avatarUrl || undefined} name={lister.name} size="md" mr={3}/>
                <Box>
                  <Text fontWeight="bold">{lister.name}</Text>
                  <Text fontSize="sm" color="text.light">{lister.type}</Text>
                </Box>
              </Flex>
            )}

            <Button 
              as="a" 
              href={`mailto:${lister.email}?subject=Interesse%20in%20woning:%20${encodeURIComponent(title)}`}
              colorScheme="accent"
              size="lg"
              w="100%" 
              leftIcon={<FaEnvelope />}
              boxShadow="md"
              _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)'}}
            >
              Neem Contact Op
            </Button>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

export default ListingDetailPage;
