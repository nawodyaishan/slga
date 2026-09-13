import { createReadStream } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { SanityDocumentLike } from "sanity";
import { getCliClient } from "sanity/cli";
import { seedAdapter } from "../../web/src/lib/content/seed";

const API_VERSION = "2026-09-13";
const EXPECTED_PROJECT = "lcgep8ux";
const EXPECTED_DATASET = "production";
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const confirmed = args.has("--confirm-production");

const assetNames = [
  "experience1.jpg",
  "experience2.jpg",
  "favicon.png",
  "home1.jpg",
  "memo1.jpg",
  "memo2.jpg",
  "memo3.jpg",
  "memo4.jpg",
  "memo5.jpg",
  "memo6.jpg",
  "memo7.jpg",
  "memo8.jpg",
  "memo9.jpg",
] as const;

const assetsDirectory = fileURLToPath(new URL("../../../assets/img/", import.meta.url));
const client = getCliClient({ apiVersion: API_VERSION });

function paragraph(text: string, key: string) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
  };
}

function imageWithAlt(assetId: string, alt: string) {
  return {
    _type: "imageWithAlt",
    asset: { _type: "reference", _ref: assetId },
    alt,
  };
}

async function buildDocuments(assetIds: ReadonlyMap<string, string>): Promise<SanityDocumentLike[]> {
  const [settings, rules, privacy] = await Promise.all([
    seedAdapter.getSiteSettings(),
    seedAdapter.getRules(),
    seedAdapter.getPrivacyNotice(),
  ]);
  const heroAssetId = assetIds.get("home1.jpg");

  if (!heroAssetId && !dryRun) throw new Error("home1.jpg was not uploaded");

  const siteSettings: SanityDocumentLike = {
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: settings.siteName,
    shortName: settings.shortName,
    heroEyebrow: settings.heroEyebrow,
    heroHeading: settings.heroHeading.join("\n"),
    heroBody: settings.heroBody,
    ...(heroAssetId
      ? { heroImage: imageWithAlt(heroAssetId, "Sri Lankan Gaming Alliance community artwork") }
      : {}),
    memberCount: settings.memberCount,
    memberCountLabel: settings.memberCountLabel,
    memberCountSource: settings.memberCountSource,
    aboutHeading: settings.aboutHeading.join("\n"),
    aboutBody: settings.aboutBody.map((text, index) => paragraph(text, `about-${index + 1}`)),
    aboutFacts: settings.aboutFacts.map((fact, index) => ({
      _key: `fact-${index + 1}`,
      key: fact.key,
      title: fact.title,
      description: fact.description,
    })),
    socialLinks: settings.social.map((link, index) => ({
      _key: `social-${link.platform}`,
      platform: link.platform,
      label: link.label,
      url: link.url,
      enabled: true,
      order: index + 1,
    })),
    rulesHeadingEn: settings.rules.heading.en,
    rulesHeadingSi: settings.rules.heading.si,
    rulesIntroEn: settings.rules.intro.en,
    rulesIntroSi: settings.rules.intro.si,
    rulesOutroTitleEn: settings.rules.outroTitle.en,
    rulesOutroTitleSi: settings.rules.outroTitle.si,
    rulesOutroBodyEn: settings.rules.outroBody.en,
    rulesOutroBodySi: settings.rules.outroBody.si,
    rulesLastUpdated: settings.rules.lastUpdated,
    seoTitle: settings.seoTitle,
    seoDescription: settings.seoDescription,
    ...(heroAssetId
      ? { defaultOgImage: imageWithAlt(heroAssetId, "Sri Lankan Gaming Alliance") }
      : {}),
  };

  const ruleDocuments: SanityDocumentLike[] = rules.map((rule) => ({
    _id: rule.id,
    _type: "rule",
    title: { _type: "localizedString", en: rule.title.en, si: rule.title.si },
    body: { en: rule.body.en, si: rule.body.si },
    displayOrder: rule.displayOrder,
    anchorId: { _type: "slug", current: rule.id },
    enabled: true,
  }));

  const privacyNotice: SanityDocumentLike = {
    _id: "privacyNotice",
    _type: "privacyNotice",
    lastReviewed: privacy.lastReviewed,
    intro: privacy.intro,
    sections: privacy.sections.map((section, index) => ({
      _key: `privacy-${index + 1}`,
      heading: section.heading,
      paragraphs: [...section.paragraphs],
    })),
  };

  return [siteSettings, privacyNotice, ...ruleDocuments];
}

async function main() {
  const config = client.config();
  console.log(`Target: ${config.projectId}/${config.dataset}`);
  console.log(`Assets: ${assetNames.length}; documents: 12; mock announcements/features: excluded`);

  if (config.projectId !== EXPECTED_PROJECT || config.dataset !== EXPECTED_DATASET) {
    throw new Error(`Refusing unexpected target ${config.projectId}/${config.dataset}`);
  }

  if (dryRun) {
    await buildDocuments(new Map());
    console.log("Dry run complete; no dataset writes performed.");
    return;
  }
  if (!confirmed) {
    throw new Error("Refusing dataset mutation without --confirm-production");
  }

  const assetIds = new Map<string, string>();
  for (const filename of assetNames) {
    const source = join(assetsDirectory, filename);
    const asset = await client.assets.upload("image", createReadStream(source), {
      filename: basename(source),
    });
    assetIds.set(filename, asset._id);
    console.log(`Uploaded ${filename} -> ${asset._id}`);
  }

  const documents = await buildDocuments(assetIds);
  let transaction = client.transaction();
  for (const document of documents) transaction = transaction.createOrReplace(document);
  const result = await transaction.commit({ visibility: "sync" });
  console.log(`Imported ${result.results.length} documents with stable IDs.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
