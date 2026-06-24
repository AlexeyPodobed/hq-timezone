interface WpImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface HeroCityListItem {
  city_name: string;
  city_timezone: string;
}

interface PostCard {
  tag: string;
  title: string;
  text: string;
  image: WpImage & {
    width: number;
    height: number;
  };
  icon: string;
}

export interface HeroSectionBlock {
  acf_fc_layout: "hero";
  background_image: WpImage & {
    ID: number;
    title: string;
  };
  cities_list: HeroCityListItem[];
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
  posts: PostCard[];
}

export interface ContactSectionBlock {
  acf_fc_layout: "contact";
  background_image: WpImage;
  image: WpImage;
}

export type HomePageFlexibleContent = HeroSectionBlock | MeetSectionBlock | DifferenceBlock | PostsSectionBlock | ContactSectionBlock;

export interface HomePageAPI {
  homepage_flexible_content: HomePageFlexibleContent[];
}

export interface HomePageID {
  page_on_front: number;
}
