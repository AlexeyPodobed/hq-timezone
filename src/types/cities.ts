export interface CityFull {
  id: string;
  name: string;
  latitude: string | null;
  longitude: string | null;
  timezone: string;
  country_name: string;
  region: string | null;
  isTimezoneNotActive?: boolean;
}
