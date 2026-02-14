// Tipo City separado para reutilización y claridad
export interface City {
  name: string;
  country: string;
  countryCode: string;
  population?: number;
  lat: number;
  lng: number;
  displayName: string;
  geonameId: number;
}
