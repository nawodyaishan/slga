import { track as vercelTrack } from "@vercel/analytics";

/**
 * The complete, closed set of custom analytics events (TECH-SPEC.md §15).
 *
 * Each event's property shape is part of the type, so sending an unapproved
 * event name or a malformed property object fails `tsc`, not a runtime check.
 * Never widen a property to `string` without a literal union - that is how
 * PII, free text, or full URLs would sneak into an event payload.
 */
type AnalyticsEvent =
  | {
      readonly name: "community_cta_click";
      readonly properties: {
        readonly destination: "facebook" | "discord";
        readonly placement: "header" | "hero" | "footer";
      };
    }
  | {
      readonly name: "facebook_feature_click";
      readonly properties: {
        readonly feature_id: string;
        readonly placement: "homepage";
      };
    }
  | {
      readonly name: "announcement_open";
      readonly properties: {
        readonly slug: string;
        readonly placement: "homepage" | "index";
      };
    }
  | {
      readonly name: "artwork_open";
      readonly properties: {
        readonly artwork_id: string;
        readonly placement: "showcase";
      };
    }
  | {
      readonly name: "artwork_source_click";
      readonly properties: {
        readonly artwork_id: string;
      };
    };

type EventName = AnalyticsEvent["name"];
type PropertiesFor<Name extends EventName> = Extract<
  AnalyticsEvent,
  { name: Name }
>["properties"];

/** Records one of the three approved analytics events. */
export function track<Name extends EventName>(
  name: Name,
  properties: PropertiesFor<Name>,
): void {
  vercelTrack(name, properties);
}
