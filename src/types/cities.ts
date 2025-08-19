export interface CityName {
  name: string;
  toponymName: string;
  lat: string;
  lng: string;
  geonameId: number;
  countryCode: string;
  countryName: string;
  fcl: string;
  fcode: string;
}

export interface CityTime {
  time: string;
  sunrise: string;
  sunset: string;
  timezoneId: string;
  gmtOffset: number;
  dstOffset: number;
  rawOffset: number;
  countryCode: string;
  countryName: string;
}

export interface CityFull extends CityName {
  timeData: CityTime;
}

export interface CitiesResponse {
  totalResultsCount: number;
  geonames: CityName[];
}
