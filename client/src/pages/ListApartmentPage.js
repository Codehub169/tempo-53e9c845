import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Textarea,
  Select,
  Button,
  SimpleGrid,
  Checkbox,
  CheckboxGroup,
  Stack,
  Icon,
  Image,
  Flex,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCloudUploadAlt, FaPaperPlane } from 'react-icons/fa';
import Layout from '../components/Layout';
import { createListing } from '../services/api'; // Using mock API for now

const ListApartmentPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    description: '',
    apartmentType: '',
    size: '',
    rooms: '',
    bedrooms: '',
    energyLabel: '',
    woz: '',
    kitchenAmenities: [],
    bathroomAmenities: [],
    outdoorSpaceType: 'none',
    outdoorSpaceSize: '',
    photos: [], // Store File objects
    rentPrice: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const formBg = useColorModeValue('white', 'gray.700');
  const sectionBorderColor = useColorModeValue('gray.200', 'gray.600');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      // Handle checkbox groups (kitchenAmenities, bathroomAmenities)
      const groupName = e.target.getAttribute('data-group');
      setFormData(prev => ({
        ...prev,
        [groupName]: checked 
          ? [...prev[groupName], value] 
          : prev[groupName].filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNumberChange = (name, valueAsString, valueAsNumber) => {
    setFormData(prev => ({ ...prev, [name]: valueAsNumber }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.photos.length > 10) {
      toast({
        title: 'Te veel foto\'s',
        description: 'U kunt maximaal 10 foto\'s uploaden.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files.slice(0, 10 - prev.photos.length)] }));

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(prev => [...prev, ...newPreviews.slice(0, 10 - prev.length)]);
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPhotoPreviews(prev => {
      const updatedPreviews = prev.filter((_, i) => i !== index);
      updatedPreviews.forEach(preview => URL.revokeObjectURL(preview)); // Clean up old URL
      return updatedPreviews;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // In a real app, you might want to upload photos to a service first
      // and then send URLs to the backend.
      // For now, api.js mock handles File objects if needed or just uses the first for a placeholder.
      const response = await createListing(formData);
      toast({
        title: 'Woning Geplaatst!',
        description: `Uw woning '${response.title}' is succesvol aangemeld.`,
        status: 'success',
        duration: 7000,
        isClosable: true,
      });
      // Reset form or redirect
      setFormData({ /* initial state */ }); 
      setPhotoPreviews([]);
      // e.target.reset(); // May not work well with controlled components
    } catch (error) {
      console.error('Failed to create listing:', error);
      toast({
        title: 'Fout bij Plaatsen',
        description: 'Er is iets misgegaan. Probeer het later opnieuw.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const energyLabels = ['A++++', 'A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <Layout>
      <Container variant="form" py={{ base: 8, md: 12 }}>
        <Box bg={formBg} p={{ base: 6, md: 10 }} borderRadius="xl" boxShadow="xl">
          <Heading as="h1" size="xl" fontFamily="heading" color="brand.500" textAlign="center" mb={8}>
            Plaats Uw Woning Gratis
          </Heading>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <Box mb={8} pb={6} borderBottomWidth="1px" borderColor={sectionBorderColor}>
              <Heading as="h2" size="lg" fontFamily="heading" mb={6}>Basis Informatie</Heading>
              <Stack spacing={5}>
                <FormControl isRequired>
                  <FormLabel>Titel van de Advertentie</FormLabel>
                  <Input name="title" placeholder="bijv. Ruim appartement in centrum" value={formData.title} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Volledig Adres</FormLabel>
                  <Input name="address" placeholder="Straatnaam Huisnummer, Postcode Plaats" value={formData.address} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Beschrijving</FormLabel>
                  <Textarea name="description" placeholder="Geef een uitgebreide beschrijving van de woning..." value={formData.description} onChange={handleChange} rows={5}/>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Type Woning</FormLabel>
                  <Select name="apartmentType" placeholder="-- Selecteer type --" value={formData.apartmentType} onChange={handleChange}>
                    <option value="appartement">Appartement</option>
                    <option value="studio">Studio</option>
                    <option value="kamer">Kamer</option>
                    <option value="huis">Huis</option>
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            {/* Woning Details (voor WWS) */}
            <Box mb={8} pb={6} borderBottomWidth="1px" borderColor={sectionBorderColor}>
              <Heading as="h2" size="lg" fontFamily="heading" mb={6}>Woning Details (voor WWS)</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                <FormControl isRequired>
                  <FormLabel>Oppervlakte (m
ickel)</FormLabel>
                  <NumberInput name="size" min={10} value={formData.size} onChange={(valStr, valNum) => handleNumberChange('size', valStr, valNum)}>
                    <NumberInputField placeholder="bijv. 75" />
                    <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Aantal Kamers (incl. woonkamer)</FormLabel>
                  <NumberInput name="rooms" min={1} value={formData.rooms} onChange={(valStr, valNum) => handleNumberChange('rooms', valStr, valNum)}>
                    <NumberInputField placeholder="bijv. 3" />
                    <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Aantal Slaapkamers</FormLabel>
                  <NumberInput name="bedrooms" min={0} value={formData.bedrooms} onChange={(valStr, valNum) => handleNumberChange('bedrooms', valStr, valNum)}>
                    <NumberInputField placeholder="bijv. 2" />
                    <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Energielabel</FormLabel>
                  <Select name="energyLabel" placeholder="-- Selecteer label --" value={formData.energyLabel} onChange={handleChange}>
                    {energyLabels.map(label => <option key={label} value={label}>{label}</option>)}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>WOZ-waarde (
20ac)</FormLabel>
                  <NumberInput name="woz" min={0} precision={2} value={formData.woz} onChange={(valStr, valNum) => handleNumberChange('woz', valStr, valNum)}>
                     <NumberInputField placeholder="bijv. 350000" />
                  </NumberInput>
                  <FormHelperText>Recente WOZ-beschikking</FormHelperText>
                </FormControl>
              </SimpleGrid>
              
              <FormControl mt={5}>
                <FormLabel>Keukenvoorzieningen</FormLabel>
                <CheckboxGroup colorScheme="brand">
                  <SimpleGrid columns={{ base: 1, sm:2, md: 3 }} spacing={3}>
                    <Checkbox name="kitchen-sink" data-group="kitchenAmenities" value="sink" onChange={handleChange} isChecked={formData.kitchenAmenities.includes('sink')}>Aanrecht</Checkbox>
                    <Checkbox name="kitchen-stove" data-group="kitchenAmenities" value="stove" onChange={handleChange} isChecked={formData.kitchenAmenities.includes('stove')}>Kookplaat (min. 4 pits)</Checkbox>
                    <Checkbox name="kitchen-oven" data-group="kitchenAmenities" value="oven" onChange={handleChange} isChecked={formData.kitchenAmenities.includes('oven')}>Oven</Checkbox>
                    <Checkbox name="kitchen-extractor" data-group="kitchenAmenities" value="extractor" onChange={handleChange} isChecked={formData.kitchenAmenities.includes('extractor')}>Afzuigkap</Checkbox>
                    <Checkbox name="kitchen-fridge" data-group="kitchenAmenities" value="fridge" onChange={handleChange} isChecked={formData.kitchenAmenities.includes('fridge')}>Koelkast</Checkbox>
                    <Checkbox name="kitchen-dishwasher" data-group="kitchenAmenities" value="dishwasher" onChange={handleChange} isChecked={formData.kitchenAmenities.includes('dishwasher')}>Vaatwasser</Checkbox>
                  </SimpleGrid>
                </CheckboxGroup>
              </FormControl>

              <FormControl mt={5}>
                <FormLabel>Sanitaire voorzieningen</FormLabel>
                <CheckboxGroup colorScheme="brand">
                  <SimpleGrid columns={{ base: 1, sm:2, md: 3 }} spacing={3}>
                    <Checkbox name="bath-toilet" data-group="bathroomAmenities" value="toilet" onChange={handleChange} isChecked={formData.bathroomAmenities.includes('toilet')}>Toilet</Checkbox>
                    <Checkbox name="bath-sink" data-group="bathroomAmenities" value="sink" onChange={handleChange} isChecked={formData.bathroomAmenities.includes('sink')}>Wastafel</Checkbox>
                    <Checkbox name="bath-shower" data-group="bathroomAmenities" value="shower" onChange={handleChange} isChecked={formData.bathroomAmenities.includes('shower')}>Douche</Checkbox>
                    <Checkbox name="bath-tub" data-group="bathroomAmenities" value="tub" onChange={handleChange} isChecked={formData.bathroomAmenities.includes('tub')}>Ligbad</Checkbox>
                  </SimpleGrid>
                </CheckboxGroup>
              </FormControl>

              <FormControl mt={5}>
                <FormLabel>Type Buitenruimte</FormLabel>
                <Select name="outdoorSpaceType" value={formData.outdoorSpaceType} onChange={handleChange}>
                  <option value="none">Geen</option>
                  <option value="balcony">Balkon</option>
                  <option value="garden">Tuin</option>
                  <option value="terrace">Dakterras/Terras</option>
                </Select>
              </FormControl>
              {formData.outdoorSpaceType !== 'none' && (
                <FormControl mt={3} isRequired>
                  <FormLabel>Oppervlakte Buitenruimte (m
ickel)</FormLabel>
                  <NumberInput name="outdoorSpaceSize" min={0} value={formData.outdoorSpaceSize} onChange={(valStr, valNum) => handleNumberChange('outdoorSpaceSize', valStr, valNum)}>
                    <NumberInputField placeholder="bijv. 10" />
                  </NumberInput>
                </FormControl>
              )}
            </Box>
            
            {/* Photos */}
            <Box mb={8} pb={6} borderBottomWidth="1px" borderColor={sectionBorderColor}>
              <Heading as="h2" size="lg" fontFamily="heading" mb={6}>Foto's</Heading>
              <FormControl>
                <FormLabel>Upload Foto's (max. 10)</FormLabel>
                <Box 
                  borderWidth="2px" 
                  borderStyle="dashed" 
                  borderColor="border.medium" 
                  borderRadius="lg" 
                  p={8} 
                  textAlign="center" 
                  cursor="pointer" 
                  onClick={() => document.getElementById('photoInput').click()}
                  _hover={{ borderColor: 'brand.500' }}
                  bg={useColorModeValue('gray.50', 'gray.800')}
                >
                  <Icon as={FaCloudUploadAlt} boxSize={12} color="brand.500" mb={3} />
                  <Text>Klik hier of sleep bestanden om te uploaden</Text>
                </Box>
                <Input id="photoInput" type="file" multiple accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                <FormHelperText>Voeg duidelijke foto's toe van alle ruimtes.</FormHelperText>
              </FormControl>
              {photoPreviews.length > 0 && (
                <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={4} mt={4}>
                  {photoPreviews.map((preview, index) => (
                    <Box key={index} position="relative" borderWidth="1px" borderRadius="md" overflow="hidden">
                      <Image src={preview} alt={`Preview ${index + 1}`} boxSize="120px" objectFit="cover" />
                      <Button size="xs" colorScheme="red" position="absolute" top="2px" right="2px" onClick={() => removePhoto(index)}>X</Button>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>

            {/* Price & Contact */}
            <Box mb={8}>
              <Heading as="h2" size="lg" fontFamily="heading" mb={6}>Prijs & Contact</Heading>
              <Stack spacing={5}>
                <FormControl isRequired>
                  <FormLabel>Vraagprijs per maand (
20ac)</FormLabel>
                  <NumberInput name="rentPrice" min={0} precision={2} value={formData.rentPrice} onChange={(valStr, valNum) => handleNumberChange('rentPrice', valStr, valNum)}>
                    <NumberInputField placeholder="bijv. 1250" />
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Naam Contactpersoon</FormLabel>
                  <Input name="contactName" value={formData.contactName} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>E-mailadres Contactpersoon</FormLabel>
                  <Input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Telefoonnummer (optioneel)</FormLabel>
                  <Input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
                </FormControl>
              </Stack>
            </Box>

            <Button 
              type="submit" 
              colorScheme="accent" 
              size="lg" 
              w="100%" 
              leftIcon={<FaPaperPlane />} 
              isLoading={isSubmitting}
              boxShadow="lg"
              _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)'}}
            >
              Woning Plaatsen
            </Button>
          </form>
        </Box>
      </Container>
    </Layout>
  );
};

export default ListApartmentPage;
