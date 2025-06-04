import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import theme from './theme';
import './index.css';
import { ApartmentProvider } from './contexts/ApartmentContext'; // Import ApartmentProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ApartmentProvider> {/* Wrap App with ApartmentProvider */}
          <App />
        </ApartmentProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
