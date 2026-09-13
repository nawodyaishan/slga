import { defineConfig } from "sanity";
import { visionTool } from "@sanity/vision";

export default defineConfig({
  name: "slga-studio",
  title: "SLGA Content",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  plugins: [visionTool()],
  schema: { types: [] },
});

