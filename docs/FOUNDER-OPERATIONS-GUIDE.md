# SLGA founder operations guide

## Edit and publish content

1. Sign in at `https://slgaofficial.sanity.studio` with an approved founder account.
2. Open the relevant document, make the smallest required change, and resolve every validation error.
3. Preview titles, links, dates, and image alt text before selecting **Publish**.
4. Check the public page after approximately 60 seconds in a private browser window.

Announcements need a stable slug, excerpt, publication date, and body. Add a cover image only when SLGA has usage rights, and describe its meaningful content in the alt field. Do not change a published slug merely to improve wording; existing links depend on it. If a slug must change, arrange a permanent redirect in code before publishing the change.

Only publish genuine announcements and up to three genuine featured Facebook cards. Keep drafts, internal notes, personal information, moderation records, and credentials out of the public dataset.

## Correct or unpublish content

- For a small correction, edit the document and publish the new revision.
- To remove an item immediately, use **Unpublish**; confirm it disappears from the site after the cache window.
- To restore older content, open the document history, inspect the desired revision, restore it, and publish it. Never delete history as a rollback technique.
- After any recovery, verify the page, sitemap behavior where relevant, and external links while logged out.

## Code rollback

1. In Vercel, identify the last known-good production deployment.
2. Promote or redeploy that exact deployment using Vercel's rollback controls.
3. Confirm the homepage, rules, announcements, security headers, and community links.
4. Keep the failed commit and deployment available for diagnosis; do not rewrite Git history.

Public deployment and rollback must be performed by the release owner. GitHub Pages must remain enabled until the replacement deployment is verified, and disabling it requires explicit founder approval.

## Studio and access recovery

- Schema or Studio-code regression: redeploy the last known-good Studio commit; this does not roll back content.
- Content regression: restore through Sanity document history as described above.
- Remove a former maintainer immediately from Sanity, GitHub, and Vercel, then review active sessions and connected applications.
- Require multi-factor authentication for founder accounts where supported and review access at least every three months.

## Release checklist

- Confirm the exact release commit and production origin.
- Run `make verify`; ensure Chromium, Firefox, and WebKit checks pass on the release candidate.
- Check keyboard navigation, 320 px layout, 200% zoom, Sinhala glyphs, social previews, Lighthouse targets, and logged-out Facebook/Discord destinations.
- Confirm analytics reports only the documented event names and properties and that the privacy notice matches the active configuration.
- Verify the replacement site before disabling the legacy GitHub Pages site.

