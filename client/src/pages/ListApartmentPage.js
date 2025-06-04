import React, { useState, useEffect } from 'react';
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
  Text,
} from '@chakra-ui/react';
import { FaCloudUploadAlt, FaPaperPlane } from 'react-icons/fa';
import Layout from '../components/Layout';
import { createListing } from '../services/api';

const initialFormData = {
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
  photos: [],
  rentPrice: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
};

const ListApartmentPage = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const formBg = useColorModeValue('white', 'gray.700');
  const sectionBorderColor = useColorModeValue('gray.200', 'gray.600');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const groupName = e.target.getAttribute('data-group');
      if (!groupName) return; // Defensive check
      setFormData(prev => ({
        ...prev,
        [groupName]: checked
          ? [...prev[groupName], value]
          : prev[groupName].filter(item => item !== value),
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

    const currentPhotoCount = formData.photos.length;
    const currentPreviewCount = photoPreviews.length;
    const remainingSlots = 10 - currentPhotoCount;
    const filesToUpload = files.slice(0, remainingSlots);

    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...filesToUpload] }));

    const newPreviews = filesToUpload.map(file => URL.createObjectURL(file));
    setPhotoPreviews(prev => [...prev, ...newPreviews.slice(0, 10 - currentPreviewCount)]);
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));

    setPhotoPreviews(prevPreviews => {
      const removedPreviewUrl = prevPreviews[index];
      if (removedPreviewUrl) {
        URL.revokeObjectURL(removedPreviewUrl);
      }
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await createListing(formData);
      toast({
        title: 'Woning Geplaatst!',
        description: `Uw woning '${response.title}' is succesvol aangemeld.`,
        status: 'success',
        duration: 7000,
        isClosable: true,
      });
      
      photoPreviews.forEach(url => URL.revokeObjectURL(url));
      setPhotoPreviews([]);
      setFormData(initialFormData);
      // Consider redirecting the user e.g., history.push(`/listing/${response.id}`);
    } catch (error) {
      console.error('Failed to create listing:', error);
      toast({
        title: 'Fout bij Plaatsen',
        description: error.response?.data?.message || 'Er is iets misgegaan. Probeer het later opnieuw.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      photoPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoPreviews]); // photoPreviews itself is a dependency to ensure cleanup runs if it changes before unmount
  // However, for unmount only, an empty array [] is typical. Here, if previews change and component *doesn't* unmount,
  // the old URLs are handled by removePhoto or handleSubmit. This is primarily for unmount with active previews.
  // For simplicity and safety, ensure it runs if photoPreviews changes. Better: only on unmount for *current* previews.
  // Correct approach for unmount cleanup: save photoPreviews ref or use empty dep array and access state via ref if needed.
  // The current form is acceptable for most cases, but for strictness: 
  // useEffect(() => { return () => { /* access photoPreviews via a ref if needed here */ }; }, []);
  // Given removePhoto and handleSubmit handle individual/bulk revocation, this is a final safety net.

  const energyLabels = ['A++++', 'A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <Layout>
      <Container variant="form" py={{ base: 8, md: 12 }}>
        <Box bg={formBg} p={{ base: 6, md: 10 }} borderRadius="xl" boxShadow="xl">
          <Heading as="h1" size="xl" fontFamily="heading" color="brand.500" textAlign="center" mb={8}>
            Plaats Uw Woning Gratis
          </Heading>
          <form onSubmit={handleSubmit}>
            <Box mb={8} pb={6} borderBottomWidth="1px" borderColor={sectionBorderColor}>
              <Heading as="h2" size="lg" fontFamily="heading" mb={6}>Basis Informatie</Heading>
              <Stack spacing={5}>
                <FormControl isRequired>
                  <FormLabel htmlFor="title">Titel van de Advertentie</FormLabel>
                  <Input id="title" name="title" placeholder="bijv. Ruim appartement in centrum" value={formData.title} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="address">Volledig Adres</FormLabel>
                  <Input id="address" name="address" placeholder="Straatnaam Huisnummer, Postcode Plaats" value={formData.address} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="description">Beschrijving</FormLabel>
                  <Textarea id="description" name="description" placeholder="Geef een uitgebreide beschrijving van de woning..." value={formData.description} onChange={handleChange} rows={5}/>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="apartmentType">Type Woning</FormLabel>
                  <Select id="apartmentType" name="apartmentType" placeholder="-- Selecteer type --" value={formData.apartmentType} onChange={handleChange}>
                    <option value="appartement">Appartement</option>
                    <option value="studio">Studio</option>
                    <option value="kamer">Kamer</option>
                    <option value="huis">Huis</option>
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            <Box mb={8} pb={6} borderBottomWidth="1px" borderColor={sectionBorderColor}>
              <Heading as="h2" size="lg" fontFamily="heading" mb={6}>Woning Details (voor WWS)</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                <FormControl isRequired>
                  <FormLabel htmlFor="size">Oppervlakte (m²)</FormLabel>
                  <NumberInput id="size" name="size" min={10} value={String(formData.size)} onChange={(valStr, valNum) => handleNumberChange('size', valStr, valNum)}>
                    <NumberInputField placeholder="bijv. 75" />
                    <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="rooms">Aantal Kamers (incl. woonkamer)</FormLabel>
                  <NumberInput id="rooms" name="rooms" min={1} value={String(formData.rooms)} onChange={(valStr, valNum) => handleNumberChange('rooms', valStr, valNum)}>
                    <NumberInputField placeholder="bijv. 3" />
                    <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="bedrooms">Aantal Slaapkamers</FormLabel>
                  <NumberInput id="bedrooms" name="bedrooms" min={0} value={String(formData.bedrooms)} onChange={(valStr, valNum) => handleNumberChange('bedrooms', valStr, valNum)}>
                    <NumberInputField placeholder="bijv. 2" />
                    <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="energyLabel">Energielabel</FormLabel>
                  <Select id="energyLabel" name="energyLabel" placeholder="-- Selecteer label --" value={formData.energyLabel} onChange={handleChange}>
                    {energyLabels.map(label => <option key={label} value={label}>{label}</option>)}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="woz">WOZ-waarde (€)</FormLabel>
                  <NumberInput id="woz" name="woz" min={0} precision={2} value={String(formData.woz)} onChange={(valStr, valNum) => handleNumberChange('woz', valStr, valNum)}>
                     <NumberInputField placeholder="bijv. 350000" />
                  </NumberInput>
                  <FormHelperText>Recente WOZ-beschikking</FormHelperText>
                </FormControl>
              </SimpleGrid>
              
              <FormControl mt={5}>
                <FormLabel>Keukenvoorzieningen</FormLabel>
                <CheckboxGroup colorScheme="brand">
                  <SimpleGrid columns={{ base: 1, sm:2, md: 3 }} spacing={3}>
                    <Checkbox data-group="kitchenAmenities" value="sink" onChange={handleChange} isChecked={formData.kitchenAmenities.includes('sink')}>Aanrecht</Checkbox>
                    <Checkbox data-group="kitchenAmenities" value="stove" onChange={handleChange} isChecked={formData.kitchenAmenities.includes('stove')}>Kookplaat (min. 4 pits)</Checkbox>
                    <Checkbox data-group="kitchenAmenities" value="oven" onChange={handleChange} isChecked={formData.kitchenAmenities.includes('oven')}>Oven</Checkbox>
                    <Checkbox data-group="kitchenAmenities" value="extractor" onChange={handleChange} isChecked={formData.kitchenAmenities.includes('extractor')}>Afzuigkap</Checkbox>
                    <Checkbox data-group="kitchenAmenities" value="fridge" onChange={handleChange} isChecked={formData.kitchenAmenities.includes('fridge')}>Koelkast</Checkbox>
                    <Checkbox data-group="kitchenAmenities" value="dishwasher" onChange={handleChange} isChecked={formData.kitchenAmenities.includes('dishwasher')}>Vaatwasser</Checkbox>
                  </SimpleGrid>
                </CheckboxGroup>
              </FormControl>

              <FormControl mt={5}>
                <FormLabel>Sanitaire voorzieningen</FormLabel>
                <CheckboxGroup colorScheme="brand">
                  <SimpleGrid columns={{ base: 1, sm:2, md: 3 }} spacing={3}>
                    <Checkbox data-group="bathroomAmenities" value="toilet" onChange={handleChange} isChecked={formData.bathroomAmenities.includes('toilet')}>Toilet</Checkbox>
                    <Checkbox data-group="bathroomAmenities" value="sink" onChange={handleChange} isChecked={formData.bathroomAmenities.includes('sink')}>Wastafel</Checkbox>
                    <Checkbox data-group="bathroomAmenities" value="shower" onChange={handleChange} isChecked={formData.bathroomAmenities.includes('shower')}>Douche</Checkbox>
                    <Checkbox data-group="bathroomAmenities" value="tub" onChange={handleChange} isChecked={formData.bathroomAmenities.includes('tub')}>Ligbad</Checkbox>
                  </SimpleGrid>
                </CheckboxGroup>
              </FormControl>

              <FormControl mt={5}>
                <FormLabel htmlFor="outdoorSpaceType">Type Buitenruimte</FormLabel>
                <Select id="outdoorSpaceType" name="outdoorSpaceType" value={formData.outdoorSpaceType} onChange={handleChange}>
                  <option value="none">Geen</option>
                  <option value="balcony">Balkon</option>
                  <option value="garden">Tuin</option>
                  <option value="terrace">Dakterras/Terras</option>
                </Select>
              </FormControl>
              {formData.outdoorSpaceType !== 'none' && (
                <FormControl mt={3} isRequired={formData.outdoorSpaceType !== 'none'}>
                  <FormLabel htmlFor="outdoorSpaceSize">Oppervlakte Buitenruimte (m²)</FormLabel>
                  <NumberInput id="outdoorSpaceSize" name="outdoorSpaceSize" min={0} value={String(formData.outdoorSpaceSize)} onChange={(valStr, valNum) => handleNumberChange('outdoorSpaceSize', valStr, valNum)}>
                    <NumberInputField placeholder="bijv. 10" />
                  </NumberInput>
                </FormControl>
              )}
            </Box>
            
            <Box mb={8} pb={6} borderBottomWidth="1px" borderColor={sectionBorderColor}>
              <Heading as="h2" size="lg" fontFamily="heading" mb={6}>Foto's</Heading>
              <FormControl>
                <FormLabel htmlFor="photoInputLabel">Upload Foto's (max. 10)</FormLabel>
                <Box 
                  id="photoInputLabel"
                  borderWidth="2px" 
                  borderStyle="dashed" 
                  borderColor="gray.300" 
                  borderRadius="lg" 
                  p={8} 
                  textAlign="center" 
                  cursor="pointer" 
                  onClick={() => document.getElementById('photoInput')?.click()}
                  _hover={{ borderColor: 'brand.500' }}
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  aria-label="Upload foto's"
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
                    <Box key={preview} position="relative" borderWidth="1px" borderRadius="md" overflow="hidden">
                      <Image src={preview} alt={`Preview ${index + 1}`} boxSize="120px" objectFit="cover" />
                      <Button size="xs" colorScheme="red" position="absolute" top="2px" right="2px" onClick={() => removePhoto(index)} aria-label={`Verwijder foto ${index + 1}`}>X</Button>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>

            <Box mb={8}>
              <Heading as="h2" size="lg" fontFamily="heading" mb={6}>Prijs & Contact</Heading>
              <Stack spacing={5}>
                <FormControl isRequired>
                  <FormLabel htmlFor="rentPrice">Vraagprijs per maand (€)</FormLabel>
                  <NumberInput id="rentPrice" name="rentPrice" min={0} precision={2} value={String(formData.rentPrice)} onChange={(valStr, valNum) => handleNumberChange('rentPrice', valStr, valNum)}>
                    <NumberInputField placeholder="bijv. 1250" />
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="contactName">Naam Contactpersoon</FormLabel>
                  <Input id="contactName" name="contactName" value={formData.contactName} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="contactEmail">E-mailadres Contactpersoon</FormLabel>
                  <Input id="contactEmail" type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="contactPhone">Telefoonnummer (optioneel)</FormLabel>
                  <Input id="contactPhone" type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
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
