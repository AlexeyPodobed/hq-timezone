import { HeroSectionProps } from "@/components/sections/HeroSection/HeroSection";
import { MeetSectionProps } from "@/components/sections/MeetSection/MeetSection";

export interface HomePageAPI {
  homepage_flexible_content: (
		| {
			acf_fc_layout: "hero";
			background_image: {
				ID: number;
				url: string;
				title: string;
				alt?: string;
				width?: number;
				height?: number;
			};
			cities_list: { city_name: string }[];
		}
		| {
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
				}[];
		}
	)[];
}

export type HomePage = HeroSectionProps | MeetSectionProps;
