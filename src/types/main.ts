export interface HeaderLogo {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Header {
  header_logo: HeaderLogo;
}
