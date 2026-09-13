import type {
  AboutFact,
  Announcement,
  ContentAdapter,
  FacebookFeature,
  PrivacyNotice,
  Rule,
  SiteSettings,
  SocialLink,
} from "./types";
import { h2, p, prose, quote, ul } from "./blocks";

/**
 * Content migrated from `design/phase_1/SLGA Phase 1.dc.html`'s prototype
 * mock data (`rulesData`, `announcementsData`, `featuresData`, `privacyData`,
 * `socialsData`). This is migration input, not approved copy - every rule
 * body's English translation and every "MOCK CONTENT" announcement body
 * requires founder sign-off before it can ship to production
 * (TECH-SPEC.md §21). `provisional: true` below keeps the PROTOTYPE banner
 * on screen until a real Sanity dataset replaces this adapter.
 *
 * The legacy site's "24,000+ members" figure is stale; the prototype's own
 * copy already moved on to 66,000, which is what is seeded here.
 */

const social: readonly SocialLink[] = [
  { platform: "facebook", label: "Facebook Group", url: "https://www.facebook.com/groups/slgaofficial", mark: "f" },
  { platform: "discord", label: "Discord Server", url: "https://discord.com/invite/kHyyWcftg", mark: "D" },
  { platform: "steam", label: "Steam Group", url: "https://steamcommunity.com/groups/Sri-Lankan-Gaming-Alliance", mark: "S" },
  { platform: "reddit", label: "Reddit", url: "https://www.reddit.com/r/SL_Gaming_Alliance/", mark: "R" },
];

const aboutFacts: readonly AboutFact[] = [
  {
    key: "facebook",
    title: "66,000+ members",
    description: "The main room: posts, screenshots and discussion, moderated since 2021.",
  },
  {
    key: "discord",
    title: "Voice, LFG, sessions",
    description: "Where people actually get into a game together on a weekday evening.",
  },
  {
    key: "rules",
    title: "English & සිංහල",
    description: "One set of rules, published in both languages and updated together.",
  },
];

const siteSettings: SiteSettings = {
  siteName: "Sri Lankan Gaming Alliance",
  shortName: "SLGA",
  heroEyebrow: "Sri Lankan Gaming Alliance",
  heroHeading: ["Home for", "Sri Lankan", "Gamers"],
  heroBody:
    "SLGA connects Sri Lankan gamers across platforms. The Facebook group carries the reach and the conversation the community grew up with. Discord adds voice, LFG and everyday company. Between the two you get game sessions, screenshots, and questions answered by people playing the same things you are.",
  heroImage: null,
  memberCount: 66_000,
  memberCountLabel: "community members",
  memberCountSource:
    "Migrated from the prototype's static copy; not yet backed by a live count. Replace with a founder-verified figure before launch (TECH-SPEC.md §21).",
  aboutHeading: ["This site is a public information page for the", "Sri Lankan Gaming Alliance community."],
  aboutBody: [
    "This site is a public information page for the Sri Lankan Gaming Alliance community. It has no accounts, no sign-in and no member database.",
  ],
  aboutFacts,
  social,
  rules: {
    lastUpdated: "2026-09-13",
    heading: { en: "Community rules & guidelines", si: "සමූහයේ නීති සහ මාර්ගෝපදේශ" },
    intro: {
      en: "Read all ten rules before you join. They apply identically in the Facebook group and on the Discord server, and every post is reviewed against them.",
      si: "SLGA සමූහයට සම්බන්ධ වීමට පෙර සියලුම නීති කියවා බලන්න. මෙම නීති Facebook සමූහයට සහ Discord සේවාදායකයට එක හා සමානව අදාළ වේ.",
    },
    outroTitle: { en: "Something unclear?", si: "නීති පැහැදිලි නැද්ද?" },
    outroBody: {
      en: "Ask an admin in the Discord server. Rules are enforced by people, and we would rather explain one than remove a post.",
      si: "නීතියක් පිළිබඳ ගැටලුවක් ඇත්නම් Discord සේවාදායකයේ admin කෙනෙකුගෙන් අසන්න.",
    },
  },
  seoTitle: "Sri Lankan Gaming Alliance",
  seoDescription:
    "SLGA is the home for Sri Lankan gamers on PC, PlayStation, Xbox and Switch - community rules, announcements and where to find the group.",
  defaultOgImage: null,
};

/**
 * The prototype's rule bodies are English draft translations of a Sinhala-only
 * legacy site and are explicitly flagged there as unverified - see the
 * `draftNotice` mock in the prototype: "the legacy site published rule
 * bodies in Sinhala only ... must be approved by founders before launch."
 */
const rules: readonly Rule[] = [
  {
    id: "rule-1",
    displayOrder: 1,
    title: { en: "Allowed Gaming Platforms", si: "අනුමත වීඩියෝ ක්‍රීඩා මාධ්‍යයන්" },
    body: {
      en: prose(
        p(
          "Discussion must stay with video games, hardware and software for the four supported platforms: PC, PlayStation, Xbox and Switch. Anything outside those platforms is not allowed in the group.",
        ),
      ),
      si: prose(
        p(
          "PC , Playstation , Xbox, Switch Gaming Platforms හතරට අදාල වීඩියෝ ක්‍රීඩා/දෘඨාංග/මෘදුකාංග වලට අයත් නොවන කරුණු පිළිබඳව සාකච්ඡා කිරීම මේ සමූහය තුල සම්පූර්ණයෙන්ම තහනම් වේ!",
        ),
      ),
    },
  },
  {
    id: "rule-2",
    displayOrder: 2,
    title: { en: "Active Engaging Community Environment", si: "ක්‍රියාකාරී සමූහයක් පවත්වාගෙන යාම." },
    body: {
      en: prose(
        p(
          "Members who only post their own gaming content - live streams, pages, YouTube videos - to promote themselves, and never take part otherwise, will be acted on firmly.",
        ),
      ),
      si: prose(
        p(
          "තමන්ගේ Gaming Content (Live Streams, Pages, YouTube Videos) පමණක් පලකර, ඒවා Promote කරන ආත්මාර්ථකාමී සාමාජිකයන්ට එරෙහිව දැඩි ක්‍රියාමාර්ග ගනිමු!",
        ),
      ),
    },
  },
  {
    id: "rule-3",
    displayOrder: 3,
    title: {
      en: "No NSFW Content, No Cursing/Swearing & No Drug References",
      si: "අසභ්‍ය නොවන, නීතිවිරෝධී මත්ද්‍රව්‍ය වලින් තොර අන්තර්ගතයක් පවත්වාගෙන යාම හා නිවැරදි භාෂා භාවිතය",
    },
    body: {
      en: prose(
        p(
          "Posting 18+ video or images (full or half nude) is banned. Posts and comments containing profanity in any language are banned, as is addressing members with profanity. Any content referring directly or indirectly to drugs - other than alcohol and cigarettes, including cannabis - is banned.",
        ),
      ),
      si: prose(
        p(
          "18+ වීඩියෝපට/ඡායාරූප (Full Nude/Half Nude) පළ කිරීම, කිසිම භාෂාවකින් කුණුහරප අඩංගු posts, comments පළ කිරීම, කුණුහරපයෙන් ඇමතීම සහ මත්පැන්, සිගරට් හැර ගංජා ඇතුළු අනෙකුත් මත්ද්‍රව්‍ය සම්බන්ධව directly හෝ indirectly සඳහන් වන කිසිම දෙයක් පළ කිරීම තහනම්.",
        ),
      ),
    },
  },
  {
    id: "rule-4",
    displayOrder: 4,
    title: { en: "No Spoilers", si: "Spoilers අඩංගු දෑ පල කිරීම තහනම්." },
    body: {
      en: prose(
        p(
          "No spoilers may be posted until 3-4 weeks after a game releases, especially for AAA titles. This window often shifts slightly depending on the game, so we make sure to announce the applicable period a few days before a release. Whether the rule has been changed for a particular game can be checked in the group's announcements tab.",
        ),
      ),
      si: prose(
        p(
          "Game එකක්, විශේෂයෙන්ම AAA කාණ්ඩයට අයිති game එකක්, නිකුත් වීමෙන් සති 3-4 යනතුරු කිසිම spoiler එකක් පල කිරීම නොකළ යුතුය. මෙම නීතිය බොහෝවිට අදාල game එක අනුව සුළු සුළු වෙනස්වීම් වලට ලක්වන බැවින් ඒ පිළිබඳව අපි අදාල game එක release වීමට දවස් කිහිපයකට පෙර දැනුවත් කිරීමට වග බලා ගන්නෙමු. එසේ යම්කිසි game එකක් වෙනුවෙන් අප මෙම නීතිය වෙනස් කළේද නැද්ද යන වග, group එකෙහි announcements tab එකට පිවිසීමෙන් පහසුවෙන් දැනගත හැකිය.",
        ),
      ),
    },
  },
  {
    id: "rule-5",
    displayOrder: 5,
    title: { en: "In-Game Screenshots Must Be Unique", si: "තමාට අනන්‍ය වූ In-Game Screenshots" },
    body: {
      en: prose(
        p(
          "Try as far as possible to capture screenshots that are your own. In games with a photo mode or a hideable HUD, screenshots taken during cutscenes should not be posted without reason - exceptions apply for special cases such as easter eggs or important story details. This exists to encourage your creativity and to avoid several people posting the same screenshot.",
        ),
      ),
      si: prose(
        p(
          "හැකි තරම් තමන්ටම අනන්‍ය වූ screenshots ලබා ගැනීමට උත්සාහ කරන්න. Photo mode එකක් හෝ HUD එක ඉවත් කළ හැකි games වල, විශේෂ අවස්ථාවකට (easter eggs, important story related details... etc) හැර, cutscenes අතරතුරදී ලබා ගත් screenshots *නිකරුනේ* පළ කිරීම නොකළ යුතුය. මෙය ඔබගේ නිර්මාණශීලිත්වය වර්ධනය කිරීමට සහ එකම screenshot එක කිහිප දෙනෙක් පළ කිරීම වැලැක්වීම් සඳහා පනවා ඇත.",
        ),
      ),
    },
  },
  {
    id: "rule-6",
    displayOrder: 6,
    title: { en: "No Repetitive Content - Memes, News, Posts", si: "එකම දෑ වරින් වර පළ කිරීමෙන් වළකින්න." },
    body: {
      en: prose(
        p(
          "When you post third-party content, a meme or a news item that someone else has already posted, please understand that your post may be declined or removed.",
        ),
      ),
      si: prose(
        p(
          "ඔබ යම්කිසි 3rd Party Content එකක්/meme එකක්/news එකක් පළ කිරීමේදී, එය, ඊට පෙර වෙන කෙනෙකු විසින් පල කර ඇත්නම්, ඔබේ post එක ප්‍රතික්ෂේප කිරීමට හෝ ඉවත් කිරීමට සිදු වන බව කරුණාවෙන් සලකන්න.",
        ),
      ),
    },
  },
  {
    id: "rule-7",
    displayOrder: 7,
    title: { en: "The Following Topics & Actions Are Prohibited", si: "පහත සඳහන් දේවල් මෙම Group එක තුළ තහනම් වේ." },
    body: {
      en: prose(
        ul([
          "Posting or discussing matters that damage members' privacy or break the unity of the community.",
          "Spamming.",
          "Repeatedly asking members to support or promote your own content (begging).",
          "Personal attacks.",
          "Advertising that goes around rule 2 above.",
        ]),
      ),
      si: prose(
        ul([
          "සාමාජිකයන්ගේ පෞද්ගලිකත්වය හානිවන හා සමූහයේ එකමුතු කම බිඳී යන ආකාරයේ කරුණු පළ කිරීම හා සාකච්ඡා කිරීම.",
          "Spam කිරීම",
          "තමන්ගේ content promote කර ගැනීමට සහය දක්වන්න යැයි නොනවත්වා ඉල්ලා සිටීම (Begging)",
          "පුද්ගලික මඩ ගැසීම් (Personal attacks)",
          "ඉහත සඳහන් 2 වෙනි නීතිය පිටින් සිදු කරන වෙළඳ දැන්වීම් (Advertising)",
        ]),
      ),
    },
  },
  {
    id: "rule-8",
    displayOrder: 8,
    title: {
      en: "Any Other Action That Causes Problems Will Be Dealt With As Necessary",
      si: "මීට අමතරව ගැටුම් ඇති කරන අනෙකුත් දෑ සඳහා සුදුසු ක්‍රියාමාර්ග ගනු ලැබේ.",
    },
    body: {
      en: prose(
        p(
          "Something is not permitted merely because it is not listed here. Keep contentious posts to a minimum. Where such situations do arise, admins judge each case individually and take the decisions the nature of the breach requires.",
        ),
      ),
      si: prose(
        p(
          "මෙහි සඳහන් කර නොඇතිබූ පමණින් ඔබට සිතෙන ඕනෑම දෙයක් කිරීමට අවසර නැත. ගැටුම් ඇති වන කරුණු පළ කිරීම හැකිතාක් අවම කරන්න. ඉහත සඳහන් කළ ආකාරයේ අවස්ථාවන් ඇති වුවහොත්, එම සෑම අවස්ථාවක්ම ඇඩ්මින් විසින් එකින් එක විමසා බලා (Judge), වරදේ ස්වභාවය අනුව අවශ්‍ය සුදුසු තීරණ ගනු ලැබේ.",
        ),
      ),
    },
  },
  {
    id: "rule-9",
    displayOrder: 9,
    title: { en: "Is Your Post Public & Visible?", si: "ඔබගේ Post එක Publicද?" },
    body: {
      en: prose(
        p(
          'When you share a post into the group using Facebook’s share option, that post’s privacy setting must be set to "Public". Otherwise we cannot see your post and it has to be declined.',
        ),
      ),
      si: prose(
        p(
          'ඔබ විසින් යම්කිසි post එකක් group එකට share කිරීමේදී (Facebook share option එක මගින්), එම අදාල post එකේ privacy settings "Public" ලෙස සකස් කළ යුතුය. නැත්නම් ඔබේ post එක අප හට නොපෙන්වන නිසා, එය decline කිරීමට සිදු වේ.',
        ),
      ),
    },
  },
  {
    id: "rule-10",
    displayOrder: 10,
    title: { en: "Reporting Posts", si: "පැමිණිලි කිරීම." },
    body: {
      en: prose(
        p(
          'If you have an issue with a post in the group, please use the "Report post to group admins" option. Alternatively, tag an admin on the post itself or reach one through Messenger.',
        ),
      ),
      si: prose(
        p(
          'Group එකේ පලවන posts පිළිබඳව ඔබට ගැටලුවක් පවතී නම් "Report post to group admins" යන option එක භාවිතා කරන මෙන් කාරුණිකව ඉල්ලා සිටිමු. නැතහොත් අදාල ස්ථානයේ admin කෙනෙකු tag කිරීමට හෝ Messenger හරහා සම්බන්ධ කර ගැනීමට වග බලාගන්න.',
        ),
      ),
    },
  },
];

/**
 * `coverImage: null` for every entry: the prototype never provided a real
 * cover asset (its `hasImage`/`img` fields are layout placeholders, e.g.
 * "COVER IMAGE\n16:9 · OPTIONAL"), and `ImageRef` requires a `src`, so
 * fabricating one would misrepresent unpublished art as real content.
 */
const announcements: readonly Announcement[] = [
  {
    id: "announcement-slga-discord-is-now-open",
    slug: "slga-discord-is-now-open",
    kind: "ANNOUNCEMENT",
    title: "SLGA Discord is now open",
    excerpt:
      "The community now has a permanent home for voice chat, looking-for-group posts and weekend sessions. Here is what is inside and how moderation carries over from the Facebook group.",
    body: prose(
      p(
        "For years the Facebook group has been where SLGA happens: posts, screenshots, arguments about frame rates. It does one thing badly, though - it cannot get people into the same voice channel on a Friday night. The Discord server fixes that.",
      ),
      h2("What the server is for"),
      p(
        "The server is built around playing together rather than posting. Channels are organised by platform and by game, with voice rooms that stay open and a looking-for-group channel where you can post what you are playing and when.",
      ),
      ul([
        "Platform channels for PC, PlayStation, Xbox and Switch.",
        "Voice rooms open to all members, no scheduling needed.",
        "A looking-for-group channel for co-op and multiplayer sessions.",
        "A screenshots channel that follows the same originality rule as the group.",
      ]),
      h2("Moderation is the same"),
      p(
        "The community rules apply on Discord exactly as they do on Facebook. The same admin team moderates both, and breaking a rule in one place is treated as breaking it in the community.",
      ),
      quote("Read the rules once. They are short, they are in English and Sinhala, and they are the whole agreement."),
      h2("Joining"),
      p(
        "The invite is permanent and open to existing Facebook members and to new members alike. You do not need to leave the Facebook group to join the server - most people will use both.",
      ),
    ),
    coverImage: null,
    publishedAt: "2026-09-08T00:00:00.000Z",
  },
  {
    id: "announcement-community-rules-refresh-2026",
    slug: "community-rules-refresh-2026",
    kind: "RULES UPDATE",
    title: "Community rules refreshed for 2026",
    excerpt:
      "The ten rules have been reviewed, reworded for clarity and published in English and Sinhala side by side. No new restrictions were added.",
    // MOCK CONTENT inherited from the prototype - replace before launch (TECH-SPEC.md §21).
    body: prose(p("MOCK CONTENT - replace before launch. This announcement exists so the layout can be evaluated without a cover image.")),
    coverImage: null,
    publishedAt: "2026-08-21T00:00:00.000Z",
  },
  {
    id: "announcement-weekend-game-nights",
    slug: "weekend-game-nights",
    kind: "COMMUNITY",
    title: "Weekend game nights: how to join",
    excerpt:
      "Every Friday and Saturday the voice rooms fill up. No sign-up sheet, no team rosters - turn up, say what you are playing and someone will be playing it too.",
    // MOCK CONTENT inherited from the prototype - replace before launch (TECH-SPEC.md §21).
    body: prose(p("MOCK CONTENT - replace before launch.")),
    coverImage: null,
    publishedAt: "2026-08-02T00:00:00.000Z",
  },
  {
    id: "announcement-five-years-of-slga",
    slug: "five-years-of-slga",
    kind: "ANNOUNCEMENT",
    title: "Five years of SLGA",
    excerpt:
      "From a small Facebook group to 66,000 members. A short note from the admin team on what changed, what did not, and what comes next.",
    // MOCK CONTENT inherited from the prototype - replace before launch (TECH-SPEC.md §21).
    body: prose(p("MOCK CONTENT - replace before launch.")),
    coverImage: null,
    publishedAt: "2026-06-30T00:00:00.000Z",
  },
];

/**
 * No real card image exists yet for any Facebook feature (the prototype's
 * `img` field is a layout label: "FEATURE IMAGE\nMOCK · 16:10"). `src: ""`
 * plus `placeholder` tells renderers to draw the design's hatched
 * placeholder rather than request a broken image URL.
 */
const facebookFeatures: readonly FacebookFeature[] = [
  {
    id: "f1",
    title: "Screenshot night: our September picks",
    excerpt: "Six member captures chosen by admins, from Ghost of Yotei photo mode to a very patient Elden Ring sunrise.",
    postUrl: "https://facebook.com/groups/slga/posts/1",
    image: { src: "", alt: "", placeholder: "FEATURE IMAGE - MOCK · 16:10" },
    displayOrder: 1,
  },
  {
    id: "f2",
    title: "Where Sri Lankan gamers actually buy PC parts",
    excerpt: "A long comment thread turned into the most useful hardware guide in the group this year.",
    postUrl: "https://facebook.com/groups/slga/posts/2",
    image: { src: "", alt: "", placeholder: "FEATURE IMAGE - MOCK · 16:10" },
    displayOrder: 2,
  },
  {
    id: "f3",
    title: "Co-op request thread that turned into a clan",
    excerpt: "One member asked for two players for a Helldivers run. Forty replies later, the Friday squad exists.",
    postUrl: "https://facebook.com/groups/slga/posts/3",
    image: { src: "", alt: "", placeholder: "FEATURE IMAGE - MOCK · 16:10" },
    displayOrder: 3,
  },
];

const privacyNotice: PrivacyNotice = {
  lastReviewed: "2026-09-13",
  intro:
    "This site is a public information page for the Sri Lankan Gaming Alliance community. It has no accounts, no sign-in and no member database.",
  sections: [
    {
      heading: "Analytics",
      paragraphs: [
        "We use Vercel Web Analytics to count page views and to see which links people use - for example how many visitors open Discord or Facebook from this site. Vercel describes the service as cookie-free and based on a daily-reset visitor hash.",
        "We do not collect names, email addresses, Discord identities or any free-text information, and we do not use advertising trackers.",
      ],
    },
    {
      heading: "No accounts in Phase 1",
      paragraphs: [
        "This website has no registration, no sign-in and no member profiles. There is no member database, so there is nothing here to store about you.",
        "Community membership lives on Facebook and Discord, not on this site.",
      ],
    },
    {
      heading: "External links",
      paragraphs: [
        "Links to Facebook, Discord, Steam, Reddit and similar platforms take you off this website. Those platforms collect their own data and have their own privacy policies, which apply once you arrive there.",
        "We have no control over, and take no responsibility for, how those platforms handle your information.",
      ],
    },
    {
      heading: "Content and images",
      paragraphs: [
        "Announcements, rules and featured cards are published by the SLGA admin team. Featured cards are hand-selected links to public Facebook posts; this site does not embed Facebook content or load Facebook scripts.",
        "If you believe something published here should be corrected or removed, contact an admin through the Facebook group or the Discord server.",
      ],
    },
    {
      heading: "Changes to this notice",
      paragraphs: [
        "If our analytics or data handling changes, this page is updated before the change goes live, and the review date above is changed with it.",
      ],
    },
  ],
};

export const seedAdapter: ContentAdapter = {
  name: "seed",
  provisional: false,

  async getSiteSettings() {
    return siteSettings;
  },

  async getRules() {
    return [...rules];
  },

  async getAnnouncements() {
    return [...announcements];
  },

  async getFeaturedAnnouncement() {
    return announcements[0] ?? null;
  },

  async getAnnouncementBySlug(slug: string) {
    return announcements.find((announcement) => announcement.slug === slug) ?? null;
  },

  async getFacebookFeatures() {
    return [...facebookFeatures];
  },

  async getPrivacyNotice() {
    return privacyNotice;
  },
};
