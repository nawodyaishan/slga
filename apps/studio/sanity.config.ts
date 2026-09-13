import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { singletonTypes, structure } from "./structure";

export default defineConfig({
  name: "slga-studio",
  title: "SLGA Content",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "lcgep8ux",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (previous, context) =>
      context.creationContext.type === "global"
        ? previous.filter((template) => !singletonTypes.has(template.templateId))
        : previous,
    actions: (previous, context) =>
      singletonTypes.has(context.schemaType)
        ? previous.filter(
            (action) => !["create", "duplicate", "delete"].includes(action.action ?? ""),
          )
        : previous,
  },
});
