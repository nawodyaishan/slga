import type { StructureResolver } from "sanity/structure";

export const singletonTypes = new Set(["siteSettings", "privacyNotice"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("SLGA Content")
    .items([
      S.listItem()
        .id("siteSettings")
        .title("Site & Homepage")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.documentTypeListItem("rule").title("Rules"),
      S.documentTypeListItem("announcement").title("Announcements"),
      S.documentTypeListItem("artwork").title("Artwork Showcase"),
      S.documentTypeListItem("facebookFeature").title("Featured Facebook Posts"),
      S.listItem()
        .id("privacyNotice")
        .title("Privacy notice")
        .child(S.document().schemaType("privacyNotice").documentId("privacyNotice")),
    ]);

