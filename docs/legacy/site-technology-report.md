# Current Site Technology and Format Report

## Scope

This report describes the implementation currently present in the repository. It is based on the checked-in files and does not assume a build or hosting configuration that is not present here.

## Executive summary

The site is a single-page, static HTML website for the Sri Lankan Gaming Alliance. It has no application framework, package manager, server-side code, or visible build pipeline. The page is suitable for static hosting, and the repository URL/README indicate GitHub Pages as the intended deployment destination.

## Technology stack

| Area | Current implementation |
| --- | --- |
| Markup | One hand-authored `index.html` document, HTML5 doctype, English document language, responsive viewport metadata |
| Styling | Hand-authored SCSS source in `assets/scss/styles.scss` and a checked-in compiled stylesheet at `assets/css/styles.css` |
| JavaScript | Vanilla browser JavaScript in `assets/js/main.js` |
| UI libraries | Swiper, loaded from the local `assets/js/swiper-bundle.min.js` and `assets/css/swiper-bundle.min.css` files; ScrollReveal, loaded locally from `assets/js/scrollreveal.min.js` |
| Icons | Remix Icon 2.5.0 loaded from jsDelivr |
| Fonts | Open Sans and Raleway loaded from Google Fonts in the SCSS/CSS import |
| Media | Local PNG/JPEG images under `assets/img/`; no active local video asset is present |
| Backend/data | None; content and links are embedded directly in the HTML |
| Build/dependency metadata | No `package.json`, lockfile, bundler configuration, static-site generator configuration, or server code is present |
| Hosting format | Static files; the repository README points to `https://slgaofficial.github.io` |

## Page format and information architecture

`index.html` is a long-form landing page with hash-anchor navigation:

1. Fixed header and responsive navigation (`#home`, `#experience`, `#about`).
2. Hero/home section with a background image, community headline, and links to Facebook, Reddit, and Steam.
3. Overview/experience section with community metrics and two images.
4. Rules/about section containing the community introduction, bilingual rules, a Swiper image carousel, and a Google Docs rules link labelled “Download Rules PDF”.
5. Footer containing community links, partner/social links, copyright text, and designer attribution.
6. Scroll-to-top control.

The visible content is primarily bilingual Sinhala and English. The rules are represented as repeated content blocks rather than data-driven records or separate Markdown/content files.

## Styling and responsive format

The styling uses a component-like BEM naming convention such as `.nav__menu`, `.about__data`, and `.footer__content`. SCSS provides variables, nested selectors, responsive media queries, CSS Grid/Flexbox layouts, smooth scrolling, fixed navigation, image overlays, hover states, and mobile/desktop breakpoints. `styles.css` is the browser-served output; changes to SCSS should be reflected in the compiled CSS.

The theme variables include a dark-theme implementation, but the corresponding navigation control is commented out in the HTML, so dark-mode switching is not currently exposed in the page UI.

## Client-side behavior

`assets/js/main.js` currently implements:

- Mobile menu open/close behavior.
- Header background state after scrolling 100px.
- Coverflow-style, looping Swiper carousel for the rules imagery.
- Scroll-to-top visibility after scrolling 200px.
- Active navigation link tracking for page sections.
- ScrollReveal entrance animations.
- A persisted light/dark theme mechanism intended for the commented-out theme button.

## Current implementation notes

- The video section is inside an HTML comment, and there is no `assets/video/video.mp4` in the repository. However, `main.js` still calls `addEventListener` on `videoButton` and `videoFile` without null checks. On a normal page load this can stop later script execution with a null-reference error.
- The theme button is also commented out, but `main.js` unconditionally uses `themeButton`, causing the same type of null-reference failure.
- Several style and animation rules remain for inactive template sections (`video`, `place`, `subscribe`, and `sponsor`), suggesting the site originated from a broader landing-page template and has been pared down without removing all unused assets/rules.
- External Google Fonts and Remix Icon resources make typography and icons dependent on third-party network availability. Swiper and ScrollReveal themselves are vendored locally.
- The page uses many empty image `alt` attributes, so the imagery is treated as decorative by assistive technology. This is appropriate only where the images do not convey information.
- The footer copyright still says 2021, and the “Download Rules PDF” control links to an editable Google Docs URL rather than a repository-hosted PDF.
- There is no automated test suite or lint/build command documented in the repository.

## Overall format classification

**Static, single-document, client-enhanced landing page.** The site is deployable as a directory of HTML, CSS, JavaScript, and image files. Updates currently require editing the HTML directly; there is no CMS, content model, API, or build step to transform source content into pages.

