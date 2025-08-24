import { MetaOptions } from "./main";

export interface HeroSectionBlock {
  acf_fc_layout: "hero";
  background_image: {
    ID: number;
    url: string;
    title: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  cities_list: {
    city_name: string;
    city_timezone: string;
  }[];
}

export interface MeetSectionBlock {
  acf_fc_layout: "meet";
  title: string;
}

export interface DifferenceBlock {
  acf_fc_layout: "difference";
}

export interface PostsSectionBlock {
  acf_fc_layout: "posts";
  posts: {
    tag: string;
    title: string;
    image: {
      url: string;
      alt?: string;
      width: number;
      height: number;
    };
    icon: {
      url: string;
      alt?: string;
      width: number;
      height: number;
    };
  }[];
}

export interface ContactSectionBlock {
  acf_fc_layout: "contact";
  background_image: {
    url: string;
    alt: string;
    height: number;
    width: number;
  };
  image: {
    url: string;
    alt: string;
    height: number;
    width: number;
  };
}

export type HomePageFlexibleContent = HeroSectionBlock | MeetSectionBlock | DifferenceBlock | PostsSectionBlock | ContactSectionBlock;

export interface HomePageAPI {
  meta: MetaOptions;
  homepage_flexible_content: HomePageFlexibleContent[];
}
