import { defineConfig } from "astro/config";
import AstroPWA from "@vite-pwa/astro";

export default defineConfig({
  site: "https://nynt-schedule.netlify.app/",
  integrations: [
    AstroPWA({
      /* other options */
      /* enable sw on development */
      base: "/",
      scope: "/",
      includeAssets: ["favicon.svg"],
      registerType: "autoUpdate",
      manifest: {
        name: "NYNT 25 Schedule",
        short_name: "NYNT25",
        description: "The schedule for NYNT 25",
        theme_color: "#ab0f29",
        orientation: "portrait",
        display_override: [
          "standalone",
          "window-controls-overlay",
          "fullscreen",
          "minimal-ui",
        ],
        icons: [
          {
            src: "ios/512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "android/android-launchericon-512-512.png",
            sizes: "512x512",
          },
          {
            src: "android/android-launchericon-192-192.png",
            sizes: "192x192",
          },
          {
            src: "android/android-launchericon-144-144.png",
            sizes: "144x144",
          },
          {
            src: "android/android-launchericon-96-96.png",
            sizes: "96x96",
          },
          {
            src: "android/android-launchericon-72-72.png",
            sizes: "72x72",
          },
          {
            src: "android/android-launchericon-48-48.png",
            sizes: "48x48",
          },
          {
            src: "ios/16.png",
            sizes: "16x16",
          },
          {
            src: "ios/20.png",
            sizes: "20x20",
          },
          {
            src: "ios/29.png",
            sizes: "29x29",
          },
          {
            src: "ios/32.png",
            sizes: "32x32",
          },
          {
            src: "ios/40.png",
            sizes: "40x40",
          },
          {
            src: "ios/50.png",
            sizes: "50x50",
          },
          {
            src: "ios/57.png",
            sizes: "57x57",
          },
          {
            src: "ios/58.png",
            sizes: "58x58",
          },
          {
            src: "ios/60.png",
            sizes: "60x60",
          },
          {
            src: "ios/64.png",
            sizes: "64x64",
          },
          {
            src: "ios/72.png",
            sizes: "72x72",
          },
          {
            src: "ios/76.png",
            sizes: "76x76",
          },
          {
            src: "ios/80.png",
            sizes: "80x80",
          },
          {
            src: "ios/87.png",
            sizes: "87x87",
          },
          {
            src: "ios/100.png",
            sizes: "100x100",
          },
          {
            src: "ios/114.png",
            sizes: "114x114",
          },
          {
            src: "ios/120.png",
            sizes: "120x120",
          },
          {
            src: "ios/128.png",
            sizes: "128x128",
          },
          {
            src: "ios/144.png",
            sizes: "144x144",
          },
          {
            src: "ios/152.png",
            sizes: "152x152",
          },
          {
            src: "ios/167.png",
            sizes: "167x167",
          },
          {
            src: "ios/180.png",
            sizes: "180x180",
          },
          {
            src: "ios/192.png",
            sizes: "192x192",
          },
          {
            src: "ios/256.png",
            sizes: "256x256",
          },
          {
            src: "ios/512.png",
            sizes: "512x512",
          },
          {
            src: "ios/1024.png",
            sizes: "1024x1024",
          },
        ],
        screenshots: [
          {
            src: "screenshot-1.png",
            sizes: "729x1320",
            type: "image/png",
            form_factor: "narrow",
            label: "Schedule",
          },
          {
            src: "screenshot-2.png",
            sizes: "729x1320",
            type: "image/png",
            form_factor: "narrow",
            label: "Schedule",
          },
          {
            src: "screenshot-1.png",
            sizes: "729x1320",
            type: "image/png",
            form_factor: "wide",
            label: "Schedule",
          },
          {
            src: "screenshot-2.png",
            sizes: "729x1320",
            type: "image/png",
            form_factor: "wide",
            label: "Schedule",
          },
        ],
      },
      workbox: {
        navigateFallback: "/",
        globPatterns: ["**/*.{css,js,html,svg,png,ico,txt}"],
      },
      devOptions: {
        enabled: true,
        /* other options */
      },
      navigateFallback: "/404",
    }),
  ],
});
