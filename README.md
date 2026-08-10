# HQ Timezone

HQ Timezone is a Next.js web application for checking the current time in different cities and comparing time zones.

The project receives content, pages, city data, and contact form data from the WordPress API. On the client side, it uses interactive city selectors, time difference calculations, locally saved selected cities, and responsive homepage sections.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- SCSS / Tailwind CSS
- Zustand
- TanStack Query
- date-fns, date-fns-tz, Luxon
- GSAP, Lenis, Swiper
- WordPress REST API / Contact Form 7

## Project Structure

- `src/app` - application pages, layout, sitemap, and error/not-found pages.
- `src/components` - UI components, homepage sections, header, and footer.
- `src/api` - functions for WordPress API requests.
- `src/hooks` - hooks for time, cities, URL parameters, and responsive behavior.
- `src/store` - Zustand store for time and seconds.
- `src/utils` - helper functions for dates, time zones, cities, and coordinates.
- `src/assets` - global styles, fonts, icons, and animations.
- `public` - public images, favicon, and `robots.txt`.

## Environment Variables

For local development, create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_WORDPRESS_API=https://example.com
NEXT_PUBLIC_WORDPRESS_HOST=example.com
CONTACT_FORM_ID=123
CONTACT_FORM_UNIT_TAG=your-unit-tag
```

Variable descriptions:

- `NEXT_PUBLIC_WORDPRESS_API` - base URL of the WordPress site without a trailing `/`.
- `NEXT_PUBLIC_WORDPRESS_HOST` - WordPress site hostname used for loading remote images via `next/image`.
- `CONTACT_FORM_ID` - Contact Form 7 form ID.
- `CONTACT_FORM_UNIT_TAG` - Contact Form 7 form unit tag.

## Installation and Running

Install dependencies:

```bash
npm install
```

Run the project in development mode:

```bash
npm run dev
```

After startup, the application will be available at:

```text
http://localhost:3000
```

## Build

Create a production build:

```bash
npm run build
```

Run the production build locally:

```bash
npm run start
```

## Code Check

```bash
npm run lint
```

## Deployment

The project can be deployed as a standard Next.js application, for example on Vercel. Before deployment, configure the environment variables from the section above.

Current published example:

https://next-gsap-test-task.vercel.app/
