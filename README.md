# Jotihunt Map

Jotihunt Map is a Next.js app that shows an interactive Google Maps view with markers, 2D/3D toggle, and directions. The main page has an overlay panel with settings and route controls tailored for scouting/Jotihunt gameplay.

## Getting Started

Setup:

1. Copy the example env file and set your Google Maps API key (enable Maps JavaScript API and either Routes API or Directions API):

```bat
copy .env.example .env.local
```

Then edit .env.local and set:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
NEXT_PUBLIC_GOOGLE_MAP_ID=optional_map_id
```

1. Install dependencies and run the development server:

```bat
npm run dev
```

Open <http://localhost:3000> to see the interactive map. The overlay in the bottom-right lets you switch Satellite/Roadmap, toggle 2D/3D, show markers, and calculate a route.

You can adjust the map implementation in `app/page.tsx`.

If you see an error about a legacy Directions API, enable one of: Routes API (preferred) or Directions API in Google Cloud Console. Advanced Markers require a vector map style with a Map ID; without it, classic markers will be used.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Notes

- For Jotihunt, you can replace the demo markers and default center with live hunt data when ready.
- Directions use the Google Routes or Directions API; consider quotas/billing.
