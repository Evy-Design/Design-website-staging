// Builds the client hub into dist-hub/, ready to upload to the folder
// that hub.evydiepenbroek.nl points to on Strato.
//
// The hub's own files live in hub/. It also reuses the website's
// shared files (styles, fonts, menu, footer); those stay in one place
// in this folder and are only copied in here at build time, so there
// is never a second copy to keep up to date. The website pages are
// not copied; client-hub-links.js sends menu and footer links to the
// main site instead.
//
//   npm run build-hub   build dist-hub/
//   npm run hub         build + preview on http://localhost:3001
import {cpSync, mkdirSync, rmSync, writeFileSync, readFileSync, existsSync, readdirSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "dist-hub");

const HUB = join(ROOT, "hub");
// Shared website files the hub pages load.
const SHARED = [
  "shared.css",
  "test-navigation.css",
  "style.css",
  "cart.css",
  "chrome.js",
  "test-navigation.js",
  "sanity-client.js",
  "content.js",
  "content.json",
  "script.js",
  "cart.js",
];
const DIRS = ["fonts"];

rmSync(OUT, {recursive: true, force: true});
mkdirSync(OUT, {recursive: true});

for (const f of readdirSync(HUB)) {
  if (!f.startsWith(".")) cpSync(join(HUB, f), join(OUT, f), {recursive: true});
}
for (const f of SHARED) {
  if (!existsSync(join(ROOT, f))) throw new Error(`Missing ${f}`);
  cpSync(join(ROOT, f), join(OUT, f));
}
for (const d of DIRS) cpSync(join(ROOT, d), join(OUT, d), {recursive: true});

// The login page is the front door: hub.evydiepenbroek.nl/
cpSync(join(OUT, "client-portal.html"), join(OUT, "index.html"));

// Apache (Strato): open the login page at the root, never let search
// engines index the hub.
writeFileSync(
  join(OUT, ".htaccess"),
  [
    "DirectoryIndex index.html",
    '<IfModule mod_headers.c>',
    '  Header set X-Robots-Tag "noindex, nofollow"',
    "</IfModule>",
    "",
  ].join("\n"),
);
writeFileSync(join(OUT, "robots.txt"), "User-agent: *\nDisallow: /\n");

// Sanity check: every page must load client-hub-links.js.
for (const page of ["client-portal.html", "client-hub.html"]) {
  if (!readFileSync(join(OUT, page), "utf8").includes("client-hub-links.js")) {
    throw new Error(`${page} doesn't load client-hub-links.js`);
  }
}

console.log(`Built the client hub into ${OUT}`);
