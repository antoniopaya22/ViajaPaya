import AsyncStorage from '@react-native-async-storage/async-storage';

const UNSPLASH_ACCESS_KEY = 'RszSIwq2WVr-tEM3bQHt_zhSZH56xl3ywSn53N58Wl0';
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';
const IMAGE_CACHE_KEY = 'trip_images_cache';

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
}

interface ImageCacheEntry {
  url: string;
  timestamp: number;
  destination: string;
}

// Cache en memoria para acceso rápido
const memoryCache = new Map<string, string>();

// Función para cargar el cache desde AsyncStorage
export const loadImageCache = async (): Promise<{ [tripId: string]: string }> => {
  try {
    const cacheData = await AsyncStorage.getItem(IMAGE_CACHE_KEY);
    if (cacheData) {
      const cache: { [tripId: string]: ImageCacheEntry } = JSON.parse(cacheData);
      const imageMap: { [tripId: string]: string } = {};
      
      // Convertir cache a mapa simple y cargar en memoria
      Object.entries(cache).forEach(([tripId, entry]) => {
        imageMap[tripId] = entry.url;
        memoryCache.set(tripId, entry.url);
      });
      
      return imageMap;
    }
  } catch (error) {
    console.warn('Error loading image cache:', error);
  }
  return {};
};

// Función para guardar una imagen en el cache
export const saveImageToCache = async (tripId: string, destination: string, imageUrl: string): Promise<void> => {
  try {
    // Guardar en memoria
    memoryCache.set(tripId, imageUrl);
    
    // Cargar cache existente
    const existingCacheData = await AsyncStorage.getItem(IMAGE_CACHE_KEY);
    const existingCache: { [tripId: string]: ImageCacheEntry } = existingCacheData 
      ? JSON.parse(existingCacheData) 
      : {};
    
    // Agregar nueva entrada
    existingCache[tripId] = {
      url: imageUrl,
      timestamp: Date.now(),
      destination
    };
    
    // Guardar cache actualizado
    await AsyncStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(existingCache));
  } catch (error) {
    console.warn('Error saving image to cache:', error);
  }
};

// Función para obtener imagen desde cache
export const getImageFromCache = (tripId: string): string | null => {
  return memoryCache.get(tripId) || null;
};

// Función para buscar imagen de destino (solo si no está en cache)
export const searchDestinationImage = async (tripId: string, destination: string): Promise<string> => {
  // Verificar cache primero
  const cachedImage = getImageFromCache(tripId);
  if (cachedImage) {
    return cachedImage;
  }

  try {
    // Extraer ciudad/país principal y limpiar el texto
    const cleanDestination = destination
      .split(',')[0]
      .trim()
      .toLowerCase()
      // Normalizar caracteres especiales
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c');

    // Términos de búsqueda mejorados para ciudades conocidas
    const searchTerms = getSearchTerms(cleanDestination);
    
    const searchQuery = encodeURIComponent(searchTerms);
    const url = `${UNSPLASH_BASE_URL}/search/photos?query=${searchQuery}&per_page=5&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UnsplashSearchResponse = await response.json();
    
    let imageUrl: string;
    
    if (data.results && data.results.length > 0) {
      // Tomar la primera imagen de los resultados
      imageUrl = data.results[0].urls.regular;
    } else {
      // Si no hay resultados, usar imagen por defecto
      imageUrl = getFallbackImage(cleanDestination);
    }
    
    // Guardar en cache
    await saveImageToCache(tripId, destination, imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.warn('Error fetching image from Unsplash:', error);
    // En caso de error, devolver imagen por defecto
    const fallbackUrl = getFallbackImage(destination);
    await saveImageToCache(tripId, destination, fallbackUrl);
    return fallbackUrl;
  }
};

// Función para obtener términos de búsqueda optimizados
const getSearchTerms = (destination: string): string => {
  const cityMappings: { [key: string]: string } = {
    // Europa
    'paris': 'Paris Eiffel Tower France',
    'londres': 'London Big Ben England',
    'london': 'London Big Ben England',
    'roma': 'Rome Colosseum Italy',
    'rome': 'Rome Colosseum Italy',
    'madrid': 'Madrid Royal Palace Spain',
    'barcelona': 'Barcelona Sagrada Familia Spain',
    'berlin': 'Berlin Brandenburg Gate Germany',
    'amsterdam': 'Amsterdam canals Netherlands',
    'venecia': 'Venice canals Italy',
    'venice': 'Venice canals Italy',
    'florencia': 'Florence cathedral Italy',
    'florence': 'Florence cathedral Italy',
    'praga': 'Prague castle Czech Republic',
    'prague': 'Prague castle Czech Republic',
    'viena': 'Vienna Austria architecture',
    'vienna': 'Vienna Austria architecture',
    
    // Asia
    'tokio': 'Tokyo skyline Japan',
    'tokyo': 'Tokyo skyline Japan',
    'beijing': 'Beijing Forbidden City China',
    'shanghai': 'Shanghai skyline China',
    'seoul': 'Seoul South Korea skyline',
    'bangkok': 'Bangkok temples Thailand',
    'singapore': 'Singapore Marina Bay',
    'singapur': 'Singapore Marina Bay',
    'mumbai': 'Mumbai India Gateway',
    'delhi': 'Delhi India Red Fort',
    'dubai': 'Dubai Burj Khalifa UAE',
    
    // América
    'nueva york': 'New York Manhattan skyline',
    'new york': 'New York Manhattan skyline',
    'los angeles': 'Los Angeles Hollywood California',
    'san francisco': 'San Francisco Golden Gate',
    'mexico': 'Mexico City Zocalo',
    'rio de janeiro': 'Rio de Janeiro Christ Redeemer',
    'buenos aires': 'Buenos Aires Obelisk Argentina',
    'lima': 'Lima Peru cathedral',
    'santiago': 'Santiago Chile Andes',
    'bogota': 'Bogota Colombia mountains',
    'cusco': 'Cusco Peru Machu Picchu',
    
    // África y Oceanía
    'cairo': 'Cairo Egypt pyramids',
    'nairobi': 'Nairobi Kenya safari',
    'sydney': 'Sydney Opera House Australia',
    'melbourne': 'Melbourne Australia skyline',
  };

  return cityMappings[destination] || `${destination} city landmarks architecture`;
};

// Función para imagen por defecto usando Unsplash Source
const getFallbackImage = (destination: string): string => {
  const searchTerm = encodeURIComponent(`${destination} travel destination`);
  return `https://source.unsplash.com/800x400/?${searchTerm}`;
};

// Función para limpiar el cache si es necesario
export const clearImageCache = async () => {
  try {
    memoryCache.clear();
    await AsyncStorage.removeItem(IMAGE_CACHE_KEY);
  } catch (error) {
    console.warn('Error clearing image cache:', error);
  }
};
