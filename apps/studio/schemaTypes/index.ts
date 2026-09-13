import { announcement } from "./announcement";
import { facebookFeature } from "./facebookFeature";
import { announcementBlockContent } from "./objects/announcementBlockContent";
import { imageWithAlt } from "./objects/imageWithAlt";
import { localizedString } from "./objects/localizedString";
import { localizedText } from "./objects/localizedText";
import { rulesBlockContent } from "./objects/rulesBlockContent";
import { privacyNotice } from "./privacyNotice";
import { rule } from "./rule";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [
  localizedString,
  localizedText,
  imageWithAlt,
  rulesBlockContent,
  announcementBlockContent,
  siteSettings,
  rule,
  announcement,
  facebookFeature,
  privacyNotice,
];

