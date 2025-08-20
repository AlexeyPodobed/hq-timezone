interface Image {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface Link {
  url: string;
  title: string;
  target?: string;
}

interface LinkObj {
  link: Link;
}

export interface Header {
  header_logo: Image;
}

export interface Footer {
  footer_logo: Image;
  footer_menu: Link[];
  footer_buttons: LinkObj[];
  footer_text: string;
}
