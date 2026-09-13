import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  },
  deployment: {
    appId: "mi4rl7n4a8i09u0y19gihybj",
  },
  typegen: {
    path: "../web/src/lib/sanity/queries.ts",
    schema: "schema.json",
    generates: "../web/src/lib/sanity/sanity.types.ts",
    overloadClientMethods: false,
  },
});
