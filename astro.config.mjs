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
        icons: [
          {
            src: "favicon.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "favicon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
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
