// Servicio para búsqueda de ciudades usando múltiples APIs
import { City } from '@/types/city';

// Cache para evitar llamadas repetidas a la API
const apiCache = new Map<string, City[]>();

// Autocompletado solo con ciudades locales (sin llamadas a API)
export const getLocalCitySuggestions = (query: string): City[] => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  // Función para calcular qué tan bien coincide una ciudad con la búsqueda
  const getMatchScore = (city: City): number => {
    const cityName = city.name.toLowerCase();
    const countryName = city.country.toLowerCase();
    const displayName = city.displayName.toLowerCase();
    
    let score = 0;
    
    // Coincidencia exacta al inicio tiene la puntuación más alta
    if (cityName.startsWith(normalizedQuery)) {
      score += 100;
    }
    // Coincidencia exacta en cualquier parte del nombre
    else if (cityName.includes(normalizedQuery)) {
      score += 50;
    }
    // Coincidencia en el país
    else if (countryName.includes(normalizedQuery)) {
      score += 25;
    }
    // Coincidencia en el display name completo
    else if (displayName.includes(normalizedQuery)) {
      score += 30;
    }
    
    // Bonus por población (ciudades más grandes son más relevantes)
    if (city.population) {
      score += Math.log10(city.population) * 2;
    }
    
    return score;
  };
  
  const filtered = fallbackCities
    .map(city => ({ city, score: getMatchScore(city) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.city)
    .slice(0, 8); // Limitar a 8 sugerencias para autocompletado
  
  console.log(`🔍 Autocompletado local para "${query}": ${filtered.length} resultados`);
  return filtered;
};

// Búsqueda completa usando la API de GeoNames (solo cuando se presiona "Buscar")
export const searchCitiesWithAPI = async (query: string): Promise<City[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();
  
  // Verificar cache primero
  if (apiCache.has(normalizedQuery)) {
    console.log('🗄️ Usando cache para búsqueda API:', normalizedQuery);
    return apiCache.get(normalizedQuery)!;
  }

  console.log('🌐 Buscando en GeoNames API para:', query);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
    
    const response = await fetch(
      `http://api.geonames.org/searchJSON?q=${encodeURIComponent(query)}&maxRows=15&username=antonioalfa22&featureClass=P&orderby=population`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('🌐 Respuesta de GeoNames:', data.geonames?.length || 0, 'resultados');
    
    if (data.geonames && Array.isArray(data.geonames) && data.geonames.length > 0) {
      const apiCities: City[] = data.geonames.map((item: any) => ({
        name: item.name,
        country: item.countryName,
        countryCode: item.countryCode,
        population: item.population || 0,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lng),
        displayName: `${item.name}, ${item.countryName}`,
        geonameId: item.geonameId
      }));

      console.log('✅ Ciudades procesadas de GeoNames API:', apiCities.length);
      
      // Guardar en cache
      apiCache.set(normalizedQuery, apiCities);
      return apiCities;
    }

    // Si no hay resultados de la API, devolver array vacío
    console.log('⚠️ No se encontraron ciudades en la API');
    apiCache.set(normalizedQuery, []);
    return [];

  } catch (error) {
    console.error('❌ Error en GeoNames API:', error);
    
    // En caso de error, devolver array vacío
    return [];
  }
};

// Ciudades de fallback con más opciones, especialmente españolas
const fallbackCities: City[] = [
  // Ciudades españolas
  { name: 'Madrid', country: 'España', countryCode: 'ES', lat: 40.4168, lng: -3.7038, displayName: 'Madrid, España', geonameId: 3117735, population: 3223000 },
  { name: 'Barcelona', country: 'España', countryCode: 'ES', lat: 41.3851, lng: 2.1734, displayName: 'Barcelona, España', geonameId: 3128760, population: 1620000 },
  { name: 'Valencia', country: 'España', countryCode: 'ES', lat: 39.4699, lng: -0.3763, displayName: 'Valencia, España', geonameId: 2509954, population: 791413 },
  { name: 'Sevilla', country: 'España', countryCode: 'ES', lat: 37.3891, lng: -5.9845, displayName: 'Sevilla, España', geonameId: 2510911, population: 688711 },
  { name: 'Zaragoza', country: 'España', countryCode: 'ES', lat: 41.6488, lng: -0.8891, displayName: 'Zaragoza, España', geonameId: 3104324, population: 674317 },
  { name: 'Málaga', country: 'España', countryCode: 'ES', lat: 36.7213, lng: -4.4214, displayName: 'Málaga, España', geonameId: 2514256, population: 571026 },
  { name: 'Murcia', country: 'España', countryCode: 'ES', lat: 37.9922, lng: -1.1307, displayName: 'Murcia, España', geonameId: 2513413, population: 447182 },
  { name: 'Palma', country: 'España', countryCode: 'ES', lat: 39.5696, lng: 2.6502, displayName: 'Palma, España', geonameId: 2512989, population: 416065 },
  { name: 'Las Palmas', country: 'España', countryCode: 'ES', lat: 28.1248, lng: -15.4300, displayName: 'Las Palmas, España', geonameId: 2515270, population: 381847 },
  { name: 'Bilbao', country: 'España', countryCode: 'ES', lat: 43.2627, lng: -2.9253, displayName: 'Bilbao, España', geonameId: 3128026, population: 345821 },
  { name: 'Alicante', country: 'España', countryCode: 'ES', lat: 38.3452, lng: -0.4815, displayName: 'Alicante, España', geonameId: 2521978, population: 334757 },
  { name: 'Córdoba', country: 'España', countryCode: 'ES', lat: 37.8882, lng: -4.7794, displayName: 'Córdoba, España', geonameId: 2519240, population: 325708 },
  { name: 'Valladolid', country: 'España', countryCode: 'ES', lat: 41.6523, lng: -4.7245, displayName: 'Valladolid, España', geonameId: 3106672, population: 298866 },
  { name: 'Vigo', country: 'España', countryCode: 'ES', lat: 42.2328, lng: -8.7226, displayName: 'Vigo, España', geonameId: 3106672, population: 295364 },
  { name: 'Gijón', country: 'España', countryCode: 'ES', lat: 43.5322, lng: -5.6611, displayName: 'Gijón, España', geonameId: 3123526, population: 271039 },
  { name: 'Hospitalet', country: 'España', countryCode: 'ES', lat: 41.3598, lng: 2.1075, displayName: 'Hospitalet, España', geonameId: 3122760, population: 257349 },
  { name: 'A Coruña', country: 'España', countryCode: 'ES', lat: 43.3623, lng: -8.4115, displayName: 'A Coruña, España', geonameId: 3129857, population: 245711 },
  { name: 'Vitoria', country: 'España', countryCode: 'ES', lat: 42.8467, lng: -2.6716, displayName: 'Vitoria, España', geonameId: 3106050, population: 249176 },
  { name: 'Granada', country: 'España', countryCode: 'ES', lat: 37.1773, lng: -3.5986, displayName: 'Granada, España', geonameId: 2517117, population: 232208 },
  { name: 'Elche', country: 'España', countryCode: 'ES', lat: 38.2622, lng: -0.7011, displayName: 'Elche, España', geonameId: 2518559, population: 230354 },
  { name: 'Oviedo', country: 'España', countryCode: 'ES', lat: 43.3614, lng: -5.8593, displayName: 'Oviedo, España', geonameId: 3114711, population: 220301 },
  { name: 'Santa Cruz', country: 'España', countryCode: 'ES', lat: 28.4636, lng: -16.2518, displayName: 'Santa Cruz, España', geonameId: 3111108, population: 207312 },
  { name: 'Badalona', country: 'España', countryCode: 'ES', lat: 41.4507, lng: 2.2487, displayName: 'Badalona, España', geonameId: 3129028, population: 216968 },
  { name: 'Cartagena', country: 'España', countryCode: 'ES', lat: 37.6000, lng: -0.9833, displayName: 'Cartagena, España', geonameId: 2520058, population: 218210 },
  { name: 'Terrassa', country: 'España', countryCode: 'ES', lat: 41.5641, lng: 2.0060, displayName: 'Terrassa, España', geonameId: 3108286, population: 215517 },
  { name: 'Jerez', country: 'España', countryCode: 'ES', lat: 36.6866, lng: -6.1364, displayName: 'Jerez, España', geonameId: 2516395, population: 212226 },
  { name: 'Sabadell', country: 'España', countryCode: 'ES', lat: 41.5433, lng: 2.1090, displayName: 'Sabadell, España', geonameId: 3111933, population: 209931 },
  { name: 'Móstoles', country: 'España', countryCode: 'ES', lat: 40.3237, lng: -3.8649, displayName: 'Móstoles, España', geonameId: 3117814, population: 206403 },
  { name: 'Alcalá de Henares', country: 'España', countryCode: 'ES', lat: 40.4817, lng: -3.3649, displayName: 'Alcalá de Henares, España', geonameId: 3130025, population: 195649 },
  { name: 'Pamplona', country: 'España', countryCode: 'ES', lat: 42.8125, lng: -1.6458, displayName: 'Pamplona, España', geonameId: 3114472, population: 198491 },
  { name: 'Fuenlabrada', country: 'España', countryCode: 'ES', lat: 40.2842, lng: -3.7936, displayName: 'Fuenlabrada, España', geonameId: 3123394, population: 194714 },
  { name: 'Almería', country: 'España', countryCode: 'ES', lat: 36.8381, lng: -2.4597, displayName: 'Almería, España', geonameId: 2521886, population: 196851 },
  { name: 'Leganés', country: 'España', countryCode: 'ES', lat: 40.3167, lng: -3.7667, displayName: 'Leganés, España', geonameId: 3118532, population: 188425 },
  { name: 'Santander', country: 'España', countryCode: 'ES', lat: 43.4623, lng: -3.8100, displayName: 'Santander, España', geonameId: 3111108, population: 172656 },
  { name: 'Burgos', country: 'España', countryCode: 'ES', lat: 42.3439, lng: -3.6967, displayName: 'Burgos, España', geonameId: 3126917, population: 176608 },
  { name: 'Castellón', country: 'España', countryCode: 'ES', lat: 39.9864, lng: -0.0513, displayName: 'Castellón, España', geonameId: 2520058, population: 171669 },
  { name: 'Getafe', country: 'España', countryCode: 'ES', lat: 40.3058, lng: -3.7325, displayName: 'Getafe, España', geonameId: 3123394, population: 180747 },
  { name: 'Albacete', country: 'España', countryCode: 'ES', lat: 38.9943, lng: -1.8564, displayName: 'Albacete, España', geonameId: 2522258, population: 172816 },
  { name: 'Alcorcón', country: 'España', countryCode: 'ES', lat: 40.3456, lng: -3.8242, displayName: 'Alcorcón, España', geonameId: 3130025, population: 168141 },
  { name: 'Logroño', country: 'España', countryCode: 'ES', lat: 42.4627, lng: -2.4500, displayName: 'Logroño, España', geonameId: 3118417, population: 151136 },
  { name: 'Badajoz', country: 'España', countryCode: 'ES', lat: 38.8794, lng: -6.9706, displayName: 'Badajoz, España', geonameId: 2521961, population: 151565 },
  { name: 'Salamanca', country: 'España', countryCode: 'ES', lat: 40.9651, lng: -5.6640, displayName: 'Salamanca, España', geonameId: 3111108, population: 144228 },
  
  // Ciudades internacionales populares
  { name: 'París', country: 'Francia', countryCode: 'FR', lat: 48.8566, lng: 2.3522, displayName: 'París, Francia', geonameId: 2988507, population: 2161000 },
  { name: 'Londres', country: 'Reino Unido', countryCode: 'GB', lat: 51.5074, lng: -0.1278, displayName: 'Londres, Reino Unido', geonameId: 2643743, population: 8982000 },
  { name: 'Nueva York', country: 'Estados Unidos', countryCode: 'US', lat: 40.7128, lng: -74.0060, displayName: 'Nueva York, Estados Unidos', geonameId: 5128581, population: 8175000 },
  { name: 'Tokio', country: 'Japón', countryCode: 'JP', lat: 35.6762, lng: 139.6503, displayName: 'Tokio, Japón', geonameId: 1850147, population: 13960000 },
  { name: 'Roma', country: 'Italia', countryCode: 'IT', lat: 41.9028, lng: 12.4964, displayName: 'Roma, Italia', geonameId: 3169070, population: 2873000 },
  { name: 'Amsterdam', country: 'Países Bajos', countryCode: 'NL', lat: 52.3676, lng: 4.9041, displayName: 'Amsterdam, Países Bajos', geonameId: 2759794, population: 821752 },
  { name: 'Berlín', country: 'Alemania', countryCode: 'DE', lat: 52.5200, lng: 13.4050, displayName: 'Berlín, Alemania', geonameId: 2950159, population: 3644826 },
  { name: 'Bangkok', country: 'Tailandia', countryCode: 'TH', lat: 13.7563, lng: 100.5018, displayName: 'Bangkok, Tailandia', geonameId: 1609350, population: 8281000 },
  { name: 'Sydney', country: 'Australia', countryCode: 'AU', lat: -33.8688, lng: 151.2093, displayName: 'Sydney, Australia', geonameId: 2147714, population: 4627000 },
  { name: 'Dubai', country: 'Emiratos Árabes Unidos', countryCode: 'AE', lat: 25.2048, lng: 55.2708, displayName: 'Dubai, Emiratos Árabes Unidos', geonameId: 292223, population: 2415000 },
  { name: 'Singapur', country: 'Singapur', countryCode: 'SG', lat: 1.3521, lng: 103.8198, displayName: 'Singapur', geonameId: 1880251, population: 5850000 },
  { name: 'Ciudad de México', country: 'México', countryCode: 'MX', lat: 19.4326, lng: -99.1332, displayName: 'Ciudad de México, México', geonameId: 3530597, population: 8918000 },
  { name: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', lat: -34.6118, lng: -58.3960, displayName: 'Buenos Aires, Argentina', geonameId: 3435910, population: 2890000 },
  { name: 'Rio de Janeiro', country: 'Brasil', countryCode: 'BR', lat: -22.9068, lng: -43.1729, displayName: 'Rio de Janeiro, Brasil', geonameId: 3451190, population: 6320000 },
  { name: 'Lima', country: 'Perú', countryCode: 'PE', lat: -12.0464, lng: -77.0428, displayName: 'Lima, Perú', geonameId: 3936456, population: 9674000 },
  { name: 'Santiago', country: 'Chile', countryCode: 'CL', lat: -33.4489, lng: -70.6693, displayName: 'Santiago, Chile', geonameId: 3871336, population: 4837000 },
  { name: 'Mumbai', country: 'India', countryCode: 'IN', lat: 19.0760, lng: 72.8777, displayName: 'Mumbai, India', geonameId: 1275339, population: 12442000 },
  { name: 'Seúl', country: 'Corea del Sur', countryCode: 'KR', lat: 37.5665, lng: 126.9780, displayName: 'Seúl, Corea del Sur', geonameId: 1835848, population: 9776000 },
  { name: 'Los Ángeles', country: 'Estados Unidos', countryCode: 'US', lat: 34.0522, lng: -118.2437, displayName: 'Los Ángeles, Estados Unidos', geonameId: 5368361, population: 3971000 },
  { name: 'Chicago', country: 'Estados Unidos', countryCode: 'US', lat: 41.8781, lng: -87.6298, displayName: 'Chicago, Estados Unidos', geonameId: 4887398, population: 2746000 },
  { name: 'Toronto', country: 'Canadá', countryCode: 'CA', lat: 43.6532, lng: -79.3832, displayName: 'Toronto, Canadá', geonameId: 6167865, population: 2731000 },
  { name: 'Vancouver', country: 'Canadá', countryCode: 'CA', lat: 49.2827, lng: -123.1207, displayName: 'Vancouver, Canadá', geonameId: 6173331, population: 631000 },
  { name: 'Lisboa', country: 'Portugal', countryCode: 'PT', lat: 38.7223, lng: -9.1393, displayName: 'Lisboa, Portugal', geonameId: 2267057, population: 545000 },
  { name: 'Estocolmo', country: 'Suecia', countryCode: 'SE', lat: 59.3293, lng: 18.0686, displayName: 'Estocolmo, Suecia', geonameId: 2673730, population: 975000 },
  { name: 'Viena', country: 'Austria', countryCode: 'AT', lat: 48.2082, lng: 16.3738, displayName: 'Viena, Austria', geonameId: 2761369, population: 1911000 },
  { name: 'Praga', country: 'República Checa', countryCode: 'CZ', lat: 50.0755, lng: 14.4378, displayName: 'Praga, República Checa', geonameId: 3067696, population: 1309000 },
  { name: 'Budapest', country: 'Hungría', countryCode: 'HU', lat: 47.4979, lng: 19.0402, displayName: 'Budapest, Hungría', geonameId: 3054643, population: 1752000 },
  { name: 'Estambul', country: 'Turquía', countryCode: 'TR', lat: 41.0082, lng: 28.9784, displayName: 'Estambul, Turquía', geonameId: 745044, population: 15029000 }
];

const getFallbackCities = (query: string): City[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Función para calcular qué tan bien coincide una ciudad con la búsqueda
  const getMatchScore = (city: City): number => {
    const cityName = city.name.toLowerCase();
    const countryName = city.country.toLowerCase();
    const displayName = city.displayName.toLowerCase();
    
    let score = 0;
    
    // Coincidencia exacta al inicio tiene la puntuación más alta
    if (cityName.startsWith(normalizedQuery)) {
      score += 100;
    }
    // Coincidencia exacta en cualquier parte del nombre
    else if (cityName.includes(normalizedQuery)) {
      score += 50;
    }
    // Coincidencia en el país
    else if (countryName.includes(normalizedQuery)) {
      score += 25;
    }
    // Coincidencia en el display name completo
    else if (displayName.includes(normalizedQuery)) {
      score += 30;
    }
    
    // Bonus por población (ciudades más grandes son más relevantes)
    if (city.population) {
      score += Math.log10(city.population) * 2;
    }
    
    return score;
  };
  
  const filtered = fallbackCities
    .map(city => ({ city, score: getMatchScore(city) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.city)
    .slice(0, 15);
  
  console.log(`🔍 Búsqueda local para "${query}": ${filtered.length} resultados`);
  return filtered;
};

// Limpiar cache periódicamente
export const clearCitySearchCache = () => {
  apiCache.clear();
};

// Obtener ciudades sugeridas populares
export const getPopularCitySuggestions = (): City[] => {
  return fallbackCities.slice(0, 12);
};
