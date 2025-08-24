This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Web App Manifest

The app includes a Web App Manifest (`src/app/manifest.ts`) that defines:

```typescript
import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js PWA',
    short_name: 'NextPWA',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    scope: '/',
    id: '/',
    icons: [
      {
        src: '/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
    ],
  }
}
```

### Apple Device Optimization

The layout includes comprehensive Apple device support with:

- **Apple Touch Icons**: Optimized icons for iOS home screen
- **Apple Splash Screens**: Custom splash screens for all iOS device sizes
- **Apple Web App Configuration**: Status bar styling and web app capabilities

### Generating PWA Assets

To regenerate PWA assets, use the following command:

```bash
npx pwa-asset-generator public/next.svg public -m src/app/manifest.ts --padding "calc(50vh - 25%) calc(50vw - 25%)" -q 100 -i public/asset-generator-changes.html --favicon
```

This command:

- Uses `public/next.svg` as the source icon
- Generates assets in the `public` folder
- Updates the manifest file at `src/app/manifest.ts`
- Applies custom padding for better icon appearance
- Sets quality to 100%
- Generates a change log in `public/asset-generator-changes.html`
- Includes favicon generation

### Layout Configuration

The root layout (`src/app/layout.tsx`) includes:

- **Metadata Configuration**: Icons, Apple touch icons, and startup images
- **Viewport Settings**: Optimized for mobile with maximum scale and user scalable settings
- **Apple Web App Settings**: Status bar styling and startup images for various device sizes
- **Theme Provider**: System theme support with class-based theming

### Supported Devices

The PWA includes splash screens for:

- iPad Pro (12.9-inch and 11-inch)
- iPad Air and iPad Mini
- iPhone 14 Pro Max, iPhone 14 Pro, iPhone 14, iPhone 14 Plus
- iPhone 13 series
- iPhone 12 series
- iPhone 11 series
- iPhone X series
- iPhone 8 series
- iPhone SE
