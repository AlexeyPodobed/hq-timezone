export interface CityFull {
  id: string;
  name: string;
  latitude: string | null;
  longitude: string | null;
  timezone: string;
  timezone_gmt_offset_jan?: string | null;
  timezone_gmt_offset_jul?: string | null;
  country_name: string;
  region: string | null;
  isTimezoneNotActive?: boolean;
}
