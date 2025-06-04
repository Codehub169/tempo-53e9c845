import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Heading,
  Link,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Container,
  Icon,
  Spacer
} from '@chakra-ui/react';
import { FaHome, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const NavLink = ({ to, children, isButton, onClose }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (isButton) {
    return (
      <Button
        as={RouterLink}
        to={to}
        variant="solid"
        bg="accent.500"
        color="white"
        fontWeight="semibold"
        fontFamily="heading"
        px={6}
        py={3}
        _hover={{ bg: 'accent.600' }}
        onClick={onClose}
      >
        {children}
      </Button>
    );
  }

  return (
    <Link
      as={RouterLink}
      to={to}
      fontWeight={isActive ? 'bold' : 'medium'}
      color={isActive ? 'brand.500' : 'text.dark'}
      _hover={{ color: 'brand.500' }}
      onClick={onClose}
      py={2}
      px={3}
      borderRadius="md"
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navItems = [
    { label: 'Zoeken', path: '/' },
    { label: 'Plaats Woning', path: '/list-apartment' },
    // { label: 'Over WWS', path: '/over-wws' }, // Placeholder for future page, matching App.js
    // { label: 'Contact', path: '/contact' }, // Placeholder for future page, matching App.js
  ];

  return (
    <Box
      as="header"
      bg="white"
      py={3}
      borderBottomWidth="1px"
      borderColor="border.light"
      position="sticky"
      top={0}
      zIndex="sticky"
      boxShadow="sm"
    >
      <Container variant="header">
        <Flex alignItems="center">
          <IconButton
            aria-label="Open menu"
            icon={<FaBars />}
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="ghost"
            size="lg"
            mr={2}
          />
          <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
            <Heading as="h1" size="lg" color="brand.500" fontFamily="heading" display="flex" alignItems="center">
              <Icon as={FaHome} mr={2} />
              WWS Finder
            </Heading>
          </Link>

          <Spacer display={{ base: 'flex', md: 'none' }} />

          <HStack
            spacing={4}
            display={{ base: 'none', md: 'flex' }}
            ml={10}
          >
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
            ))}
          </HStack>

          <Spacer display={{ base: 'none', md: 'flex' }} />

          <HStack spacing={4} alignItems="center">
            <Box display={{ base: 'none', md: 'block' }}>
                <NavLink to="/list-apartment" isButton>Gratis Plaatsen</NavLink>
            </Box>
            <IconButton
              aria-label="User profile"
              icon={<FaUserCircle size="24px" />}
              variant="ghost"
              color="text.light"
              _hover={{ color: 'brand.500' }}
              size="lg"
            />
          </HStack>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" borderColor="border.light">
            <Flex justify="space-between" align="center">
                <Heading as="h2" size="md" color="brand.500" fontFamily="heading">
                    Menu
                </Heading>
                <IconButton
                    aria-label="Close menu"
                    icon={<FaTimes />}
                    onClick={onClose}
                    variant="ghost"
                />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path} onClose={onClose}>{item.label}</NavLink>
              ))}
              <NavLink to="/list-apartment" isButton onClose={onClose}>Gratis Plaatsen</NavLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
