import { defineConfig } from "vite";
// @ts-ignore - The @vitejs/plugin-react package may be absent from the installed dependencies.
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});