export interface CityNameWP {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  timezone: string;
}

export interface SunInfoResult {
  sunrise: string;
  sunset: string;
  solar_noon: string;
  day_length: string;
  civil_twilight_begin: string;
  civil_twilight_end: string;
  nautical_twilight_begin: string;
  nautical_twilight_end: string;
  astronomical_twilight_begin: string;
  astronomical_twilight_end: string;
}

export interface CityFull extends CityNameWP {
  sunData: SunInfoResult;
}
