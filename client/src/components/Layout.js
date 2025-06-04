import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './Navbar'; // To be created
import Footer from './Footer'; // To be created

const Layout = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Box 
        as="main" 
        flexGrow={1} 
        width="100%" // Ensure main content takes full width before container inside pages limits it
        // Vertical padding can be applied here or within individual page containers
        // py={{ base: 4, md: 6 }} // Example responsive vertical padding
      >
        {children} 
        {/* Children (page components) will typically use <Container variant="..."> for max-width and centering */}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
