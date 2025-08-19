export interface CityNameWP {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  timezone: string;
}

export interface SunInfoResult {
  daily: {
    sunrise: string[];
    sunset: string[];
    daylight_duration: number[];
  };
}

export interface CityFull extends CityNameWP {
  sunData: {
    sunrise: string;
    sunset: string;
    daylight_duration: string;
  };
}
