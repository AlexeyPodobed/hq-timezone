export interface CityNameWP {
  id: string;
  name: string;
  latitude: string | null;
  longitude: string | null;
  timezone: string;
  country_name: string;
  region: string | null;
  isTimezoneNotActive?: boolean;
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

export interface CityFull extends CityNameWP {
  timeData?: CityTime;
}
