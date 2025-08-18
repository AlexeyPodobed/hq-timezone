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
