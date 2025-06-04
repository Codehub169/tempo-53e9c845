import React from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  Icon,
  useDisclosure,
  Collapse,
  // Flex, // Not used
  Heading
} from '@chakra-ui/react';
import { FaFilter } from 'react-icons/fa';

const FilterContent = ({ filters, handleInputChange, handleSelectChange, onApplyFilters, isMobile }) => (
    <VStack spacing={6} align="stretch">
        <FormControl>
          <FormLabel htmlFor="priceRange" fontSize="sm" fontWeight="semibold">Prijs (per maand)</FormLabel>
          <Select 
            id="priceRange" 
            name="priceRange" 
            value={filters.priceRange || ''} 
            onChange={(e) => handleSelectChange('priceRange', e.target.value)}
            focusBorderColor="brand.500"
            bg="white"
          >
            <option value="">Alle prijzen</option>
            <option value="0-750">€0 - €750</option>
            <option value="750-1000">€750 - €1000</option>
            <option value="1000-1500">€1000 - €1500</option>
            <option value="1500-2000">€1500 - €2000</option>
            <option value="2000+">€2000+</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="minArea" fontSize="sm" fontWeight="semibold">Min. Oppervlakte (m²)</FormLabel>
          <Input 
            id="minArea" 
            name="minArea" 
            type="number" 
            placeholder="bijv. 50"
            value={filters.minArea || ''} 
            onChange={handleInputChange} 
            focusBorderColor="brand.500"
            bg="white"
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="rooms" fontSize="sm" fontWeight="semibold">Aantal Kamers</FormLabel>
          <Select 
            id="rooms" 
            name="rooms" 
            value={filters.rooms || ''} 
            onChange={(e) => handleSelectChange('rooms', e.target.value)}
            focusBorderColor="brand.500"
            bg="white"
          >
            <option value="">Alle</option>
            <option value="1">1 kamer</option>
            <option value="2">2 kamers</option>
            <option value="3">3 kamers</option>
            <option value="4">4 kamers</option>
            <option value="5+">5+ kamers</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="minWwsPoints" fontSize="sm" fontWeight="semibold">Min. WWS Punten</FormLabel>
          <Input 
            id="minWwsPoints" 
            name="minWwsPoints" 
            type="number" 
            placeholder="bijv. 145"
            value={filters.minWwsPoints || ''} 
            onChange={handleInputChange} 
            focusBorderColor="brand.500"
            bg="white"
          />
        </FormControl>
        
        {isMobile && (
            <Button colorScheme="brand" onClick={onApplyFilters} mt={4} width="100%">
                Filters Toepassen
            </Button>
        )}
      </VStack>
);

const ApartmentFilter = ({ filters, onFilterChange, onApplyFilters }) => {
  const { isOpen, onToggle } = useDisclosure();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <Box width="100%" py={6} px={{ base: 0, md: 4}} bg={{ base: 'white', md: 'transparent'}} borderRadius={{ base: 'none', md: 'lg'}}>
      <Button 
        onClick={onToggle} 
        display={{ md: 'none' }} 
        mb={4} 
        width="100%" 
        colorScheme="gray" 
        variant="outline"
        leftIcon={<Icon as={FaFilter} />}
      >
        Filters Tonen/Verbergen
      </Button>
      
      <Collapse in={isOpen} animateOpacity unmountOnExit={false} style={{ width: '100%'}}>
         <Box display={{md: 'none'}}><Heading size="sm" mb={4}>Filters</Heading></Box> 
        <FilterContent 
            filters={filters} 
            handleInputChange={handleInputChange} 
            handleSelectChange={handleSelectChange} 
            onApplyFilters={onApplyFilters} 
            isMobile={true} 
        />
      </Collapse>

      {/* Always visible on md and up */}
      <Box display={{ base: 'none', md: 'block' }}>
        <FilterContent 
            filters={filters} 
            handleInputChange={handleInputChange} 
            handleSelectChange={handleSelectChange} 
            onApplyFilters={onApplyFilters} 
            isMobile={false} 
        />
      </Box>
    </Box>
  );
};

export default ApartmentFilter;
