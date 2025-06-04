import { extendTheme } from '@chakra-ui/react';

// Design System Values from Project Plan
const projectColors = {
  primary: '#007BFF',      // Vibrant Blue
  secondary: '#F8F9FA',    // Light Gray (Backgrounds, borders)
  accent: '#28A745',       // Success Green (CTAs, positive info)
  textDark: '#343A40',     // Dark Text
  textLight: '#6C757D',    // Secondary Text
  borderColor: '#E9ECEF',  // Lighter Gray (Subtle dividers)
  feedback: {
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
  },
};

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: { // Mapping primary color to 'brand' for easier use with Chakra colorSchemes
      50: '#e6f2ff',
      100: '#b3d7ff',
      200: '#80bcff',
      300: '#4da0ff',
      400: '#1a85ff',
      500: projectColors.primary, // #007BFF
      600: '#0062cc',
      700: '#004a99',
      800: '#003166',
      900: '#001933',
    },
    secondary: projectColors.secondary, // #F8F9FA
    accent: projectColors.accent,       // #28A745
    textDark: projectColors.textDark,   // #343A40
    textLight: projectColors.textLight, // #6C757D
    borderColor: projectColors.borderColor, // #E9ECEF
    success: projectColors.feedback.success,
    warning: projectColors.feedback.warning,
    error: projectColors.feedback.error,
    // You can extend Chakra's default gray scale or other scales if needed
    // For example, to make projectColors.secondary the default 'gray.50' for backgrounds:
    gray: {
      50: projectColors.secondary, // #F8F9FA - for light backgrounds
      100: projectColors.borderColor, // #E9ECEF - for borders
      // ... add other shades if necessary
      700: projectColors.textLight, // #6C757D
      800: projectColors.textDark, // #343A40
    }
  },
  fonts: {
    heading: `'Poppins', sans-serif`, // As per Design System
    body: `'Inter', sans-serif`,        // As per Design System
  },
  styles: {
    global: {
      body: {
        fontFamily: 'body',
        color: 'textDark',
        bg: 'white', // Default page background, can be overridden by page-specific bg
        lineHeight: '1.6',
      },
      'h1, h2, h3, h4, h5, h6': {
        fontFamily: 'heading',
        fontWeight: '600', // Default for Poppins headings
        color: 'textDark',
      },
      a: {
        color: 'brand.500',
        _hover: {
          textDecoration: 'underline',
        },
      },
      // Scrollbar styles from index.html preview, adapted for Chakra theme
      '::-webkit-scrollbar': {
        width: '10px',
      },
      '::-webkit-scrollbar-track': {
        background: 'borderColor',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'brand.500',
        borderRadius: '5px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: 'brand.600',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: 'heading', // Use Poppins for buttons
        fontWeight: '600',
      },
      variants: {
        solid: (props) => ({
          // Ensure primary buttons use brand colors by default if colorScheme="brand"
          // Accent buttons can use colorScheme="green" (Chakra maps 'green' to projectColors.accent if defined)
        }),
      },
      defaultProps: {
        // colorScheme: 'brand', // Uncomment to make 'brand' the default for all buttons
      },
    },
    Container: {
      baseStyle: {
        width: '90%', // Default width for responsiveness on smaller screens
        px: '15px',   // Default horizontal padding
      },
      variants: {
        // Corresponds to: Aim for a max-width around 1400px for search/homepage
        main: {
          maxWidth: '1400px',
        },
        // Corresponds to: 1300px for listing details
        detail: {
          maxWidth: '1300px',
        },
        // Corresponds to: form page retaining a narrower max-width (around 800px)
        form: {
          maxWidth: '800px',
        },
        // Corresponds to: header maintains consistent width across pages (using the widest common value)
        header: {
          maxWidth: '1400px',
        },
      },
    },
    // Further component customizations can be added here, e.g., Card, Input, FormLabel
  },
});

export default theme;
