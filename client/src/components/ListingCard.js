import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Image,
  Text,
  Heading,
  VStack,
  HStack,
  Icon,
  Divider,
  LinkBox,
  LinkOverlay
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';

const ListingCard = ({ id, imageUrl, title, location, price, bedrooms, bathrooms, area, wwsPoints, maxRent }) => {
  return (
    <LinkBox 
      as="article"
      borderWidth="1px"
      borderColor="border.light"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="md"
      transition="all 0.3s ease-in-out"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
    >
      <Image src={imageUrl} alt={title} objectFit="cover" w="100%" h={{ base: '200px', md: '220px' }} />
      <VStack p={4} spacing={3} align="stretch" flexGrow={1}>
        <LinkOverlay as={RouterLink} to={`/listing/${id}`}>
          <Heading as="h3" size="md" fontFamily="heading" noOfLines={2} color="text.dark">
            {title}
          </Heading>
        </LinkOverlay>
        <HStack spacing={1} color="text.light" fontSize="sm">
          <Icon as={FaMapMarkerAlt} color="brand.500" />
          <Text noOfLines={1}>{location}</Text>
        </HStack>
        <Text fontSize="xl" fontWeight="bold" color="brand.500" fontFamily="heading">
          € {price.toLocaleString('nl-NL')} /mnd
        </Text>
        <HStack spacing={4} color="text.light" fontSize="sm">
          <HStack spacing={1}>
            <Icon as={FaBed} />
            <Text>{bedrooms} slpk</Text>
          </HStack>
          <HStack spacing={1}>
            <Icon as={FaBath} />
            <Text>{bathrooms} badk</Text>
          </HStack>
          <HStack spacing={1}>
            <Icon as={FaRulerCombined} />
            <Text>{area} m²</Text>
          </HStack>
        </HStack>
        <Divider borderColor="border.medium" pt={2}/>
        <Box pt={2}>
          <HStack justify="space-between">
            <Text fontSize="sm">WWS Punten:</Text>
            <Text fontWeight="bold" color="brand.500">{wwsPoints} pnt</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm">Max. Legale Huur:</Text>
            <Text fontWeight="bold" color="accent.500">€ {maxRent.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </HStack>
        </Box>
      </VStack>
    </LinkBox>
  );
};

export default ListingCard;
