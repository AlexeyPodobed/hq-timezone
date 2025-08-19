interface HeaderLogo {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Header {
  header_logo: HeaderLogo;
}

interface FooterLogo {
	url: string;
	alt: string;
	width: number;
	height: number;
}

interface FooterMenu {
	title: string;
	url: string;
	target: string;
}

interface FooterButtons {
	link: {
		url: string;
		title: string;
		target: string;
	};
}[]

interface FooterText {
	text: string;
}

export interface Footer {
	footer_logo: FooterLogo;
	footer_menu: FooterMenu[];
	footer_buttons: FooterButtons[];
	footer_text: FooterText;
}