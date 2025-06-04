import React from 'react';
import {
  Box,
  Container,
  Text,
  Link,
  VStack,
  HStack,
  Icon
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box as="footer" bg="text.dark" color="secondary.main" py={12}>
      <Container variant="header">
        <VStack spacing={4} textAlign="center">
          <Text fontSize="sm">
            &copy; {new Date().getFullYear()} WWS Apartment Finder. Alle rechten voorbehouden.
          </Text>
          <HStack spacing={1} alignItems="center">
            <Text fontSize="sm">Gebouwd met</Text>
            <Icon as={FaHeart} color="red.400" />
            <Text fontSize="sm">voor transparantie op de huurmarkt.</Text>
          </HStack>
          <HStack spacing={4}>
            <Link href="#privacy" fontSize="sm" color="brand.300" _hover={{ textDecoration: 'underline' }}>
              Privacybeleid
            </Link>
            <Text fontSize="sm">|</Text>
            <Link href="#terms" fontSize="sm" color="brand.300" _hover={{ textDecoration: 'underline' }}>
              Gebruiksvoorwaarden
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer;
