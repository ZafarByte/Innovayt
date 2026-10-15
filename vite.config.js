import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import contactHandler from "./api/contact.js";

export default defineConfig(({ mode }) => {
  const localEnv = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(localEnv)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
    plugins: [
      react(),
      {
        name: "local-contact-api",
        configureServer(server) {
          server.middlewares.use("/api/contact", contactHandler);
        },
      },
    ],
  };
});
