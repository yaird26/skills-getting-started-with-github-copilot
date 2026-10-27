# YD Perfums Wizard: Feature Inventory, Feature Matrix, Architecture and Phased Plan

Status: planning document. No code yet.
Date: 2026-10-27
Goal: cover every documented function of PerfumersWorld's *The Perfumer's Wizard* (Free, Premium, Professional) with our own algorithms, our own data and our own interface, plus the YD-specific capabilities.

---

## 0. Research method, limits and evidence levels

### 0.1 How the reference was researched

| Channel | Result |
|---|---|
| Direct HTTP fetch of `software.php` and `wizardhelp.php` from the build container | **Blocked.** The container's network policy refused the connection (proxy 403) and the fetch tool could not resolve the host. I did not work around the policy. |
| REA (`rea-agents` 6.8.0) | **Not usable for this target.** REA's web tools (`inspect_web_page`, `capture_browser_scenario`, `export_web_scripts` and so on) need a browser in this container that can reach the site, and the network policy blocks that. The Wizard is a hosted web app with no downloadable binary, so REA's native and package tools don't apply. Analysing the Wizard's served JavaScript would also risk taking in proprietary algorithms, which requirement 9 rules out. If the site is allowed later, REA should be used **only** for passive UI and workflow inventory of public screens (DOM structure, screen list, form fields), never to extract algorithms, data or assets. |
| Search-engine extracts of the official pages (`software.php`, `wizardhelp.php`, the homepage, the API portal, kit pages, the ABC pages and PDFs, the catalogue PDF) plus third-party tutorials (bio-byte.com) | **Used.** This is the evidence base for this document. |

### 0.2 Evidence levels used in the matrix

| Label | Meaning |
|---|---|
| **Observed** | Seen directly in the running product. **No item reaches this level yet**, because the product could not be reached from the build environment. Phase 0 includes a manual observation pass (see §6). |
| **Officially Documented** | Stated on a perfumersworld.com page or PDF, as seen through indexed excerpts of that page. The source code (S1–S9) is listed for each item. |
| **Unverified** | Mentioned by only one indirect or third-party source, only by the sister desktop product (*The Perfumer's Workbook*), inferred, or missing from the sources but required by the brief (for example batch scaling). |

### 0.3 Sources

| Code | Source |
|---|---|
| S1 | perfumersworld.com/software.php: *The Perfumer's Workbook vs. Wizard* (tier lists) |
| S2 | perfumersworld.com/wizardhelp.php: *The Perfumer's Wizard Quick Guide & Tips* |
| S3 | Perfumer's Workbook help pages (perfumersworld.com/workbook/help/…) and bio-byte.com "Inside The Perfumer's Workbook" tutorials (sister desktop product) |
| S4 | perfumersworld.com/abcs-perfumery.php, material-by-abc.php, "Training the ABCs of Perfumery" PDF |
| S5 | perfumersworld.com/api-portal/ and pwoil.com/tpw-api.php (TPW API platform) |
| S6 | perfumersworld.com homepage (Pro Account banner) |
| S7 | PerfumersWorld catalogue 2017–18 PDF (may be outdated) |
| S8 | Kit pages: perfumery-training-kit(-ftec).php, custom-creation-perfume-kit(-F-TEC).php |
| S9 | YouTube: "Perfumers Wizard – Write A Formula" (PerfumersWorld) |

### 0.4 About the "previous request"

This session has no record of the earlier YD Perfums feature list. This document is built to cover the full reference product plus every YD capability listed in the current request, so nothing from the earlier list should be lost. Paste the earlier list if you want it reconciled line by line.

### 0.5 Clean-room rules (apply to every row)

1. Don't copy PerfumersWorld code, scripts, algorithms, formulas, descriptor "Formats", material database entries, prices, images, icons, layouts or wording.
2. Don't bypass logins, paywalls, licence checks or API credit limits. Premium and Pro items are designed **from public documentation only**.
3. The ABC system is PerfumersWorld's teaching taxonomy. YD uses its **own** odour-family taxonomy (the "YD Odour Map", §4.4). A user-side mapping may be offered only as data the user enters themselves.
4. Branded-perfume descriptor libraries: YD doesn't ship descriptions of trademarked perfumes taken from third parties. YD ships its own original archetype profiles, and users can write "inspired-by" profiles from public note lists they enter themselves.
5. IFRA data comes from IFRA's own published Standards, entered and versioned by YD with attribution. Redistribution terms need legal review (see §6).
6. Material odour data is authored by YD (from smelling and our own scoring) or entered by the user. It is never scraped.

---

## 1. Reference product summary (as documented)

| Aspect | Documented facts |
|---|---|
| Platform | Browser-based. Runs on notebooks, phones, tablets and any OS with a browser. No installation (S1). |
| Free tier | Generate formulas from the Training Kit, the Custom Creation Kit or all PerfumersWorld raw materials. Write and edit your own formulas. Order a sample or a larger quantity online. 50+ preformatted descriptions (S1, S2). |
| Premium tier | Sold as 1-week, 1-month or 1-year access. Adds Naturals Only and All Materials (No Bases), an online IFRA compliance checker, thousands of description formats, Custom formula size (5–50 materials), "more…" access to any material in the compendium, and an image mind map (S1, S2; mind map Unverified). |
| Professional tier | About 100,000 formatted descriptions, including most branded perfumes, described as "descriptors, not formulas". Promoted with the F-TEC Custom Creation Kit as a "business in a box" with "infinite variation". A 1-year Pro subscription appears in a promotional bundle (S2, promo pages). Pro Account: exclusive pricing, priority shipping, GCMS analysis, dedicated support, 1000 API credits (S5, S6). |
| Positioning | A generated formula is "about 90% there". Plan for 3–5 rounds of tweaks, done yourself or through a paid modification service (S2). |

---

## 2. Feature matrix: reference capabilities

Difficulty: **L** low · **M** medium · **H** high · **VH** very high.
Tier: **F** Free · **P** Premium · **Pro** Professional · **—** not tier-specific or unknown.
Status: **OD** Officially Documented · **UV** Unverified · **OB** Observed (none yet).

### 2.1 Platform, access and accounts

| ID | Reference feature | Tier | Status / evidence | Proposed YD implementation | Diff. | Dependencies | Acceptance criteria |
|---|---|---|---|---|---|---|---|
| R01 | Runs in the browser on any device, no install | F | OD, S1 | Installable PWA (iOS home-screen app) that is offline-first. The same codebase serves desktop browsers. | M | Service worker, IndexedDB, HTTPS hosting | Installs to the iPhone home screen. Opens and edits formulas with no network. Lighthouse PWA checks pass. |
| R02 | Free tier feature set | F | OD, S1 | YD is a personal tool, so all features are available to the owner. A `plan` field in the data model allows tiers later. | L | Auth/entitlement module (optional) | Every feature in this matrix can be reached in the owner's account. |
| R03 | Time-boxed Premium access (1 week / 1 month / 1 year) | P | OD, S1 | Entitlement service with `validUntil`. Not active at launch, ready if YD is ever offered to others. | M | Auth, payment provider (later) | An entitlement expires at its timestamp and gated features lock cleanly. |
| R04 | Professional subscription (1 year) | Pro | OD (promo), S2 promo | Same entitlement mechanism, `plan=pro`. | L | R03 | — (same as R03) |
| R05 | Pro Account services: exclusive pricing, priority shipping, GCMS analysis, dedicated support | Pro | OD, S6 | Commerce services aren't replicated. **YD equivalents:** a supplier price book per material (R60), a GC-MS report attachment and a manual constituent table per material (Y04), and a support/help centre (Y15). | M | File storage, inventory model | A user can attach a GC-MS PDF or CSV to a material and enter its constituent percentages, and those feed the IFRA aggregation (R71). |
| R06 | TPW API platform with "Formula" and "IFRA" capabilities and a credit balance | Pro | OD, S5 | YD internal API: `POST /generate`, `POST /ifra/check`, `POST /recalculate`. The engine runs on the device, and the API is the same engine on a server. Credits are not needed. | M | Engine package (§4.3), server runtime | The API returns the same results as on-device calls for the same seeded input (golden tests). |

### 2.2 Brief and input: descriptions, formats, images, odour graph

| ID | Reference feature | Tier | Status / evidence | Proposed YD implementation | Diff. | Dependencies | Acceptance criteria |
|---|---|---|---|---|---|---|---|
| R10 | Free-text odour description as generation input | F | OD, S2 | Hebrew and English free text goes to a **descriptor parser**: our own bilingual lexicon (word to YD Odour Map vector, with weights), negation and intensity handling ("לא מתוק", "very smoky"), and optional LLM-assisted parsing that is limited to our lexicon terms. | H | YD lexicon (Hebrew + English), odour map, optional LLM API | Twenty reference briefs (10 Hebrew, 10 English) parse to vectors that a perfumer reviewer accepts in at least 18 of 20 cases. Negation lowers the named family. |
| R11 | Dropdown of preformatted descriptions (50+ in Free) | F | OD, S2 | **YD Archetype Library**: at least 60 original archetype profiles at launch (for example "Gold Amber Oud", "Tel Aviv Morning Citrus"). Each is a named target vector plus a structure template. | M | Odour map, content authoring | At least 60 archetypes ship. Each one generates a valid formula within the material-count limit. |
| R12 | Thousands of formats | P | OD, S2 | Grow the archetype library past 1,000 with user-created profiles, profile mixing (blend two profiles at a set ratio), and parametric variants (each profile × slider presets). | M | R11, Y08 | The library can hold 1,000+ profiles and search them in under 100 ms on the device. |
| R13 | About 100,000 formats, including branded-perfume descriptors | Pro | OD, S2 | **Inspired-by profiles**: the user enters a public note pyramid or descriptors for any perfume, and YD turns it into a target vector. We ship no third-party or brand data. Scale target: 100k profiles in an indexed store. | H | R10 parser, a server-side store (optional), IP review | Entering a note list makes a profile in under 1 s. 100k synthetic profiles search in under 300 ms (server) or under 1 s (device). No brand data in the seed. |
| R14 | Generate a formula from an image (gallery or upload) | P? | OD for the feature, S2. Tier UV. | **Image to Scent**: on-device colour quantisation (k-means in CIELAB) gives a palette with area shares. Our own colour/texture/brightness to odour-map rules turn that into a vector. An optional vision model adds scene tags (sea, forest, leather, night), mapped through the lexicon. The result goes into the R40 generator. | H | Canvas/WebGL, k-means worker, optional vision LLM, R40 | The same image always gives the same vector. A night/black-gold image moves the vector toward the amber/resinous/dark families and a beach image toward aquatic/citrus (directional tests on a 30-image set). |
| R15 | Pick your own images from the device | P? | OD, S2 | iOS photo picker and camera capture (`<input type=file accept=image/* capture>`). | L | — | Works with the iPhone camera and photo library. HEIC images convert successfully. |
| R16 | Focus theme to guide image interpretation | P? | OD, S2 | "Focus" chips (for example season, mood, gender expression, occasion) bias the image vector by adding a weighted theme vector. | M | R14, odour map | Changing the focus changes the vector in the documented direction, and is reproducible. |
| R17 | Toggle colour swatches to exclude colours (for example a black background) | P? | OD, S2 | The palette shows as tappable swatch tiles. Turning a tile off removes its area share and re-normalises. Weights can also be adjusted per swatch. | L | R14 | Turning off a swatch recomputes the vector and formula in under 300 ms. |
| R18 | "Image Mind Map" | P | UV (one indexed mention) | **Scent Mind Map**: a radial graph of image → swatches/tags → odour families → candidate materials. Tapping a node pins it or excludes it from generation. | M | R14, graph view | Pinning or excluding a node changes the next generation as expected. |
| R19 | ABC Graph input: name the perfume, adjust family values up or down | F? | OD, S2. Tier UV. | **Odour Map Designer**: sliders or a radial editor over YD's own families (§4.4), with a name field. Values are the target vector. | M | Odour map | Each family can be edited from 0 to 100. Generation honours the edits (correlation between target and computed profile at least 0.8). |
| R20 | Guidance that strong groups (phenolic, tar/smoke) take over above about 1% | — | OD, S2 | A per-family **dominance warning** driven by each material's impact factor. A live badge appears when a high-impact family goes over its threshold for the current style. | L | Material impact data | A warning appears when a high-impact family's effective share passes its configured threshold. |

### 2.3 Material sets and library

| ID | Reference feature | Tier | Status / evidence | Proposed YD implementation | Diff. | Dependencies | Acceptance criteria |
|---|---|---|---|---|---|---|---|
| R30 | Training Kit material set (26 materials, two base systems) | F | OD, S2/S8 | **Material Sets**: named subsets of the library. YD ships "Starter 25", authored by YD. | L | Library | Generation can be limited to any set. |
| R31 | Custom Creation Kit set (164 materials) | F | OD, S2/S8 | YD "Studio 150" set from our own library. | L | Library | Same as R30. |
| R32 | All vendor raw materials (100+) | F | OD, S2 | "Full YD Library" plus **My Inventory** (Y04) as the default source. | L | Library, Y04 | Generation defaults to in-stock inventory, with an option for the full library. |
| R33 | Naturals Only | P | OD, S1/S2 (tier wording inconsistent) | A material `origin` flag (natural / nature-identical / synthetic / base) and a filter. | L | Material schema | A naturals-only generation contains only `origin=natural` materials. |
| R34 | All Materials (No Bases) | P | OD, S1 | Filter that excludes `type=base/accord`. | L | Material schema | No base or accord rows appear in the output. |
| R35 | "more…" pick any compendium material manually | P/Pro | OD, S2 | A material search sheet available everywhere in the editor: fuzzy search in Hebrew and English, CAS number, family and facet filters. | M | Search index (on device) | Finds any library material in under 100 ms. |
| R36 | 26-letter ABC odour classification (top/heart/base bands, plus Z for solvents) | — | OD, S4 | **Our own YD Odour Map** (§4.4): about 24 families, each with a volatility band, plus solvent/carrier classes. This is a different taxonomy from ABC. | M | Content authoring, perfumer review | Every library material has a family vector and a band. The taxonomy is documented and versioned. |
| R37 | Per-material IFRA reference values (for example a Category 4 value) | — | OD, S4 | Per-material, per-category IFRA limits table with standard/amendment version and source (R70). | M | IFRA dataset (§6) | Each restricted material shows its limit for every category with the amendment number. |
| R38 | Search and compare raw materials | — | OD (vendor site), product-search page | Side-by-side **Material Compare**: odour vectors overlaid, volatility, impact, cost/g, IFRA, stock. | M | Library, charts | Compares 2–4 materials on one screen at 440 pt width. |

### 2.4 Automatic formula generation and complexity

| ID | Reference feature | Tier | Status / evidence | Proposed YD implementation | Diff. | Dependencies | Acceptance criteria |
|---|---|---|---|---|---|---|---|
| R40 | Automatic formula generation from a description | F | OD, S2, S7 | **YD Composer** (original algorithm, §4.5): candidate selection with beam search over materials, then constrained least-squares or QP weight fitting against the target vector, with structure (band ratios), IFRA caps, cost, inventory and material-count constraints. Runs in a Web Worker. | VH | Engine, odour map, material data, QP/LP solver | Generates within the material limit in under 2 s on an iPhone. The result meets every hard constraint. Profile similarity to target is at least 0.8 on the benchmark set. |
| R41 | Output is original and never copies an existing formula | — | OD, S2 | The generator only uses target vectors. YD never stores third-party formulas. A seeded random component gives distinct results. | L | R40 | No seed data contains third-party formulas (audit). |
| R42 | Formula size / complexity, with Custom 5–50 materials in Premium | P (Custom) | OD, S2. Preset names UV. | A **Complexity control** with presets (Minimal 5–8 / Balanced 12–15 / Rich 20 / Opulent 30+) and a custom stepper from 5 to 50. **Default is 20** (Y12). Applied as a hard cardinality limit in R40. | M | R40 | The output never has more materials than N. N can be set from 5 to 50. The default is 20 and it persists. |
| R43 | Variation ("infinite variation") | Pro | OD (marketing), Pro promo | A **Variations** button: re-run with a new seed, perturbed candidates and diversity penalties against earlier variants. A "variation strength" slider. | M | R40, Y09 | Five variations of the same brief are pairwise distinct (Jaccard on materials at most 0.7) and all meet the constraints. |
| R44 | Expectation: about 90% there, then 3–5 refinement rounds | — | OD, S2 | **Refine loop**: after an evaluation the user records feedback ("too sweet", "needs lift"). The feedback maps to vector deltas and a re-optimisation that keeps the current materials where possible (minimal-change mode). | H | R40, Y11 | A feedback round changes no more than 30% of total weight by default and moves the profile the requested way. |

### 2.5 Manual editing and substitution

| ID | Reference feature | Tier | Status / evidence | Proposed YD implementation | Diff. | Dependencies | Acceptance criteria |
|---|---|---|---|---|---|---|---|
| R50 | Write your own formula | F | OD, S1, S9 | **Formula Editor**: rows of material, amount (g / drops / % / ‰), dilution and notes. Swipe actions, drag to reorder, and grouping by band or family. | M | Engine, Y04 | A 50-row formula can be entered on the iPhone without horizontal scroll. Totals update on every keystroke. |
| R51 | Edit generated or saved formulas | F | OD, S1 | The same editor. A generated formula opens as an editable version (Y09). | L | R50, Y09 | Editing a generated formula makes a new version and leaves the original unchanged. |
| R52 | Enter exact amounts and don't round | — | OD, S2 | Store amounts as decimal values (no float drift) to 0.001 g. Display precision is configurable. | L | Decimal library | Round-trip of 0.001 g entries is exact. Totals match to 0.001. |
| R53 | Recommended totals of about 100 or 1000 | — | OD, S2 | One-tap **Normalise to 100 / 1000 / custom**, keeping ratios and active amounts. | L | Engine | Normalising keeps every ratio within 1e-9. |
| R54 | Suggest a similar substitute for a material | — | UV (Workbook feature, S3) | **Smart Substitute**: rank candidates by odour-vector cosine, band match, impact-adjusted dose, IFRA headroom, cost and stock. Then re-dose to keep the formula's profile (local re-fit). | H | Odour map, R40 local fit | The top 5 substitutes appear in under 300 ms. Accepting one keeps profile similarity at least 0.9 to the pre-swap formula. |
| R55 | Replace expensive oils with cheaper same-family materials | — | OD, S2 | **Cost-down assistant**: an optimisation goal of "lower cost by X% with similarity ≥ Y". | H | R54, R60 | Meets the cost target with similarity at least Y, or reports that it is infeasible with the best result found. |
| R56 | Auto-modification by application, replacing unsuitable materials | — | UV (Workbook, S3) | **Application adapter**: choose the product type (fine fragrance, body mist, candle, soap, cream and so on). That sets the IFRA category, the solvent system and suitability flags, and swaps unsuitable materials. | H | R70, material suitability data | Switching the application re-checks IFRA and suggests replacements for every flagged material. |
| R57 | Remove a material | — | UV (Workbook "R", S3) | Swipe to delete, with undo and an optional "rebalance remaining". | L | R50 | Undo restores exactly. Rebalance keeps the total. |

### 2.6 Cost and quantities

| ID | Reference feature | Tier | Status / evidence | Proposed YD implementation | Diff. | Dependencies | Acceptance criteria |
|---|---|---|---|---|---|---|---|
| R60 | Price per gram, with costs that can climb because quantities are not capped | — | OD, S2 | **Cost engine**: price per g or per ml (ml converted with density) per inventory lot. Supports multiple currencies (₪ default, plus $ and €). Cost of concentrate, per ml of finished product and per bottle. Optional cost ceiling as a constraint or a warning. | M | Y04, FX table (manual) | Cost matches a hand calculation to ₪0.01 on test formulas. The ceiling warning appears when it is exceeded. |
| R61 | Real-time costing while creating | — | UV for Wizard (Workbook, S3/S7) | Recalculates live on every edit (Y06). | L | Engine | Cost updates in under 50 ms per edit. |
| R62 | Cost and effort rise above about 20 materials | — | OD, S2 | A complexity indicator that shows the material count against the user default (20) and the weighing effort. | L | R42 | The indicator turns amber above the default count. |
| R63 | Batch scaling | — | **UV** (not found in Wizard sources; required by the brief) | **Batch Planner**: scale to a target concentrate mass, finished volume (ml × density), number of bottles × size, or EDT/EDP/Parfum strength. Outputs a weighing sheet per stock dilution, with minimum-weighable warnings (scale resolution). | M | Engine, Y05 | Scaling to any target keeps neat ratios exactly. A warning appears when any line is below the scale resolution. |
| R64 | Order a sample or larger quantity online; paid modification service | F | OD, S1, S2 | Commerce isn't replicated. **Equivalent:** a **Shopping list** of missing or low-stock materials with supplier and quantity, exportable. | L | Y04, R92 | Generates a shopping list from shortfalls for a planned batch. |

### 2.7 Compliance

| ID | Reference feature | Tier | Status / evidence | Proposed YD implementation | Diff. | Dependencies | Acceptance criteria |
|---|---|---|---|---|---|---|---|
| R70 | Online IFRA compliance checker | P | OD, S1 | **IFRA Check**: product category picker (IFRA categories 1–12 with sub-categories). Checks the finished-product concentration of each restricted material (prohibited / restricted / specification). Shows a red/amber/green state per row, the maximum allowed dose, and the "max % of concentrate in product" for the whole formula. | H | IFRA Standards dataset (versioned), Y05 maths | Matches hand calculations on 30 test cases, including dilutions. Shows the amendment version. Re-checks live. |
| R71 | IFRA via the API | Pro | OD, S5 | `POST /ifra/check` on the YD API (R06). Supports **constituent aggregation**: a restricted substance contributed by several naturals or bases (from Y04 compositions). | VH | R70, composition data | An aggregated constituent across 3 materials is summed and flagged correctly. |
| R72 | Allergen labelling (EU allergens) | — | UV (not in sources; natural extension) | An allergen declaration calculator for the finished product above the labelling threshold (dataset versioned). | M | Composition data | Lists the allergens that need declaring for a given product concentration. |

### 2.8 Visualisation

| ID | Reference feature | Tier | Status / evidence | Proposed YD implementation | Diff. | Dependencies | Acceptance criteria |
|---|---|---|---|---|---|---|---|
| R80 | ABC graph of the formula's odour profile | F? | OD, S2/S4 | **Odour Profile chart**: a radial or bar chart of the YD Odour Map families (impact-weighted), with a target-vs-actual overlay. Black-and-gold theme. Works in RTL. | M | Odour map, chart library | The chart updates live. The target overlay toggles. VoiceOver can read the values. |
| R81 | Evaporation display (how the profile changes over time) | — | UV for Wizard (Workbook "Graphic Odor Display", S3) | **Dry-down timeline**: an original evaporation model (per-material volatility half-life and impact) gives a stacked-area chart of family contributions over 0–24 h, scrubbable with a time slider. | H | Material volatility data, Y08 | The timeline renders in under 200 ms. Top-band families fall before base-band families. |
| R82 | Note pyramid view | — | UV (common expectation) | Top/heart/base pyramid from the band assignment, with materials listed per tier. | L | Odour map | Every material appears in exactly one tier. |

### 2.9 Save, print and export

| ID | Reference feature | Tier | Status / evidence | Proposed YD implementation | Diff. | Dependencies | Acceptance criteria |
|---|---|---|---|---|---|---|---|
| R90 | Save formulas | — | UV for Wizard (Workbook, S3) | Saves automatically as versions (Y09). Local-first with optional cloud sync. | M | Y09, sync | No data loss when the app is killed mid-edit (journalled writes). |
| R91 | Print formulas (avoid handwriting mistakes in the lab) | — | UV for Wizard (Workbook, S7) | **Lab sheet**: a printable Hebrew RTL PDF with a weighing order, a checkbox per line, scale resolution, lot numbers and a QR code for the version. | M | PDF generator with Hebrew font shaping | The PDF renders Hebrew correctly and prints on A4 and Letter. |
| R92 | Export to spreadsheet, document or text | — | UV for Wizard (Workbook, S7) | Export to CSV and XLSX, PDF, JSON (full fidelity) and plain text. Share via the iOS share sheet. | M | xlsx writer, PDF | Re-importing the JSON reproduces the formula exactly. The CSV opens in Excel and Numbers with Hebrew intact (UTF-8 BOM). |
| R93 | Import formulas | — | UV | Import from CSV or XLSX with column mapping and fuzzy material matching to the library and inventory. | M | R35 search | At least 95% auto-match on a 50-row test file. Unmatched rows go to a review screen. |

---

## 3. Feature matrix: YD-specific capabilities

| ID | Capability | Tier | Evidence | Proposed YD implementation | Diff. | Dependencies | Acceptance criteria |
|---|---|---|---|---|---|---|---|
| Y01 | Full Hebrew RTL interface | YD core | Owner requirement | Hebrew is the default locale, with `dir="rtl"`. CSS uses logical properties only. i18n uses ICU message format, with English as a second locale. Numbers and units stay LTR inside RTL text (bidi isolation). Charts mirror. Hebrew sort and search, including niqqud-insensitive matching. | M | i18n library, Hebrew fonts | No physical left/right CSS (lint rule). All strings are externalised. Screens pass an RTL visual review. Mixed "5.25 g ורד" renders correctly. |
| Y02 | Premium black-and-gold brand identity | YD core | Owner requirement | A design-token system: near-black surfaces (for example #0B0B0C / #151517), a gold scale (for example #C9A24A, #E6C878, #8C6B22), and ivory text. Display serif plus a Hebrew sans pairing. Gold used sparingly for primary actions and data highlights. Original logo and iconography. | M | Design system, font licensing | Text contrast is at least 4.5:1 (WCAG AA). Tokens only, with no hard-coded colours (lint). A brand guide is delivered. |
| Y03 | Mobile-first for iPhone 17 Pro Max | YD core | Owner requirement | Designed at a 440 pt viewport with safe-area insets (Dynamic Island, home indicator). Thumb-zone primary actions, bottom-sheet editing, haptics where available, ProMotion-smooth 120 Hz scrolling. Scales up to tablet and desktop. | M | PWA shell, device testing | No horizontal scroll at 440 pt. Primary actions sit in the bottom 40%. 60+ fps on an actual iPhone 17 Pro Max. The exact viewport is confirmed on the device. |
| Y04 | Personal material inventory with exact dilution and active % | YD core | Owner requirement | Each **stock** is a material plus lot, with dilution % and solvent (or an exact active % for bases and naturals), density, quantity on hand (g or ml), price, supplier, purchase date, expiry, optional GC-MS composition and photos. Multiple dilutions of the same material are separate stocks linked to one material. | M | Data model, R35 | Making a 10% dilution of a stock and using it in a formula gives the exact neat amount. Stock deducts after a batch is made. |
| Y05 | Solvent-aware formula maths | YD core | Owner requirement | The engine tracks **neat active** and **solvent per type** separately for every line (§4.6). It reports concentrate %, finished-product %, total solvent by type, added solvent needed to reach a target strength, and IFRA on actual finished-product concentration. | H | Engine | 40 golden test cases (mixed dilutions, several solvents) match hand calculations to 1e-6. |
| Y06 | Real-time recalculation | YD core | Owner requirement | A pure, incremental engine in a Web Worker. Recompute the diff on each edit and stream results to the UI. | M | Engine, worker | Under 50 ms per edit for 50 rows on the iPhone. The UI never blocks. |
| Y07 | Real-time optimisation | YD core | Owner requirement | An **Optimise** panel with goals (match target, lower cost, raise longevity, IFRA-safe, fewer materials) and locks (pin a material or amount). Runs as you go (debounced) with a progress stream and a preview diff before accepting. | VH | R40 solver, Y08 | Locked rows never change. The preview diff is shown before commit. Converges in under 3 s for 30 rows. |
| Y08 | Density, transparency, projection, longevity, softness, temperature, movement controls | YD core | Owner requirement | Seven **Character sliders** (0–100). Each has an original, documented mapping to target-vector modifiers and constraints (§4.7), and each has a computed **metric** so the slider and the result can be compared. | VH | Odour map, material attributes (impact, volatility, diffusion, warmth) | Moving each slider changes its computed metric monotonically on the benchmark set. The metric is shown next to the slider. |
| Y09 | Formula versioning | YD core | Owner requirement | Immutable versions in a DAG (parent pointers, branches). Every save and generation is a version. Versions can be named and tagged. | M | Data model | Any version can be restored. Branching from an old version keeps history. |
| Y10 | Formula comparison | YD core | Owner requirement | A **Compare** view for 2–3 versions or formulas: per-material diff (added/removed/changed, Δg, Δ%), profile overlay, cost delta, IFRA delta, dry-down overlay. | M | Y09, R80, R81 | Diff rows are correct on test pairs. Works on a 440 pt screen with a swipe between modes. |
| Y11 | Experiment history (lab notebook) | YD core | Owner requirement | Each **trial** is a version plus batch date, maceration time, evaluations over time (strip / skin / day 1, 7, 30), ratings for each slider dimension, free notes, photos, and voice notes with transcription. Timeline view. Feedback flows into R44. | M | Y09, media storage | A trial records evaluations at several time points, and the timeline filters by rating and date. |
| Y12 | Material count limit 5–50, default 20 | YD core | Owner requirement | A global setting (default 20) plus a per-brief override (R42), enforced as a hard limit in every generator and optimiser path. | L | R42 | Default 20 on a fresh install. No generation or optimisation ever goes over the limit. |
| Y13 | Scent description writer | YD (brief: "scent descriptions") | Owner requirement | Writes an original description of a formula in Hebrew and English from its computed profile and dry-down: template grammar plus optional LLM polishing, limited to the facts in the profile. | M | R80/R81, optional LLM | The description mentions the top 3 families and the dry-down stages and contains no claims outside the profile data. |
| Y14 | Units and conversions | YD | Implied | g, mg, ml (via density), drops (per-stock calibration), %, ‰. | L | Y04 | Conversions are correct, and drop calibration is stored per stock. |
| Y15 | Help centre and onboarding | YD | Implied | Hebrew guide, glossary of YD families, interactive first-run tutorial. | L | Content | First-run tutorial finishes in under 3 minutes. |
| Y16 | Backup and sync | YD | Implied | Encrypted cloud backup, multi-device sync (CRDT or last-write-wins per row with version history as a safety net), JSON export of everything. | H | Backend | A full restore on a new device reproduces all data. |

---

## 4. Application architecture

### 4.1 High-level shape

```
┌──────────────────────────── iPhone / browser (PWA) ────────────────────────────┐
│  UI layer (React + TypeScript, RTL-first, YD design tokens)                     │
│   ├─ Screens: Home · Brief · Composer · Editor · Inventory · Library ·          │
│   │           IFRA · Batch · Compare · Notebook · Settings                      │
│   └─ State: query/cache layer + local reactive store                            │
│                                │  typed messages (Comlink)                      │
│  Engine Worker (pure TS + WASM) ▼                                               │
│   ├─ formula-math   (solvent-aware maths, units, costing, normalise, scale)     │
│   ├─ odour-model    (YD Odour Map, impact weighting, dry-down simulation)       │
│   ├─ composer       (candidate search + constrained fitting, variations)        │
│   ├─ optimiser      (QP/LP via WASM solver, locks, multi-goal)                  │
│   ├─ ifra           (category checks, constituent aggregation)                  │
│   ├─ brief-parser   (HE/EN lexicon → vector; optional LLM assist)               │
│   └─ image-scent    (CIELAB k-means palette → vector; optional vision tags)     │
│  Local data: IndexedDB (Dexie) · journalled writes · media in OPFS              │
│  Service worker: offline shell, background sync                                 │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │ HTTPS (optional)
┌───────────────────────────────────────▼─────────────────────────────────────────┐
│  YD Cloud (optional, phase 7)                                                   │
│   ├─ Auth (passkeys / Sign in with Apple)                                       │
│   ├─ Sync API + Postgres (row-versioned), object storage for media              │
│   ├─ Engine API (same engine package on Node) — /generate /recalculate /ifra    │
│   ├─ LLM gateway (Claude) for brief parsing, image tags, descriptions —         │
│   │   schema-restricted outputs, no PII beyond what the user sends              │
│   └─ Reference data service: YD library, archetypes, IFRA dataset versions      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Key decisions**

- **Local-first PWA** rather than a native app first. It is one codebase, installs on the iPhone, works offline in a lab, and a native wrapper (Capacitor) can be added later for App Store distribution, haptics and file access.
- **One engine package** runs in a Web Worker on the device and on the server, so results are identical. It is deterministic given a seed, which allows golden tests.
- **The LLM is an assistant, not the engine.** Every number (amounts, IFRA, cost) comes from deterministic code. The LLM only maps language and images into the YD vocabulary, and its output is checked against a schema.

### 4.2 Proposed stack

| Concern | Choice | Notes |
|---|---|---|
| UI | React 19 + TypeScript, Vite, TanStack Router/Query | Mature RTL support, fast on mobile |
| Styling | CSS custom properties (tokens) + logical properties, a small component kit we build ourselves | No third-party visual assets |
| i18n | FormatJS (ICU) | Hebrew plurals and gender, number formatting |
| Charts | Visx or D3 with our own components | Radial profile, stacked dry-down, diff bars, RTL mirroring |
| Decimal maths | decimal.js | Exact gram arithmetic |
| Solver | HiGHS (WASM) for LP/QP, plus our own projected-gradient NNLS fallback | Runs in the worker |
| Storage | Dexie (IndexedDB), OPFS for media | Journalled writes |
| Worker RPC | Comlink | Typed messages |
| PDF | pdf-lib + embedded Hebrew font with bidi shaping (or HTML-to-PDF server side) | Phase 2 spike to validate Hebrew shaping |
| XLSX | SheetJS CE or exceljs | Export and import |
| Backend (optional) | Node/TypeScript, Postgres, S3-compatible storage | Phase 7 |
| LLM | Claude API via a server gateway | Schema-validated JSON outputs |
| Testing | Vitest (engine golden tests), Playwright (iPhone viewport, RTL screenshots), property-based tests (fast-check) | |

### 4.3 Data model (core entities)

```
Material        id, names{he,en}, cas?, origin(natural|nature-identical|synthetic|base),
                type(single|base|accord|solvent), odourVector[F], band(top|heart|base),
                impact(0..1), volatilityHalfLife(h), diffusion, warmth, softness, density,
                suitability{application→ok|caution|no}, ifraRefs[], composition[]?
Stock           id, materialId, lot, activePct (0..100], solventId?, density,
                qtyOnHand, unit, price{amount,currency,perUnit}, supplier, dates, gcmsFile?
Solvent         id, names, density, type(ethanol|DPG|IPM|TEC|water|…)
IfraStandard    id, amendment, substance, cas[], kind(prohibited|restricted|spec),
                limits{category→maxPct}, notes, sourceRef
Profile         id, name{he,en}, kind(archetype|user|inspired), targetVector, structure,
                sliders{density..movement}, sourceNotes (user-entered)
Brief           id, text?, imageRef?, profileId?, focus[], sliders, maxMaterials, setId,
                constraints{naturalsOnly, noBases, costCeiling, ifraCategory, application}
Formula         id, title, currentVersionId, tags
FormulaVersion  id, formulaId, parentIds[], createdAt, origin(manual|generated|optimised|
                refined|imported), seed?, briefId?, lines[], targetStrength, notes
FormulaLine     stockId | materialId, amount(decimal), unit, locked?, note
Trial           id, versionId, batchDate, batchSize, evaluations[{t, medium, ratings, notes,
                media}], verdict
Settings        locale(he), maxMaterialsDefault(20), currency(ILS), scaleResolution, theme
```

### 4.4 YD Odour Map (our own taxonomy)

About 24 families, each with a primary volatility band. Proposed (to be finalised with a perfumer in Phase 0): Citrus, Aldehydic, Aromatic-Herbal, Green, Aquatic-Ozonic, Fruity, Floral-Fresh, Floral-White, Floral-Rose, Powdery, Spicy-Fresh, Spicy-Warm, Gourmand, Balsamic-Amber, Resinous-Incense, Woody-Dry, Woody-Creamy, Mossy-Earthy, Animalic, Leather-Smoky, Musky-Clean, Musky-Skin, Oud-Dark, Mineral. Plus carrier classes (ethanol, glycols, esters, oils, water). Each material has a normalised vector over the families plus attributes (impact, volatility half-life, diffusion, warmth, softness). The **profile** of a formula is Σ(neat share × impact × vector), with time dependence given by the dry-down model.

### 4.5 YD Composer: generation algorithm outline (original design)

1. **Target**: vector T from the brief (text / image / archetype / map designer), with slider modifiers applied (§4.7). Band-ratio targets come from the structure and sliders.
2. **Candidate pool**: filter materials by set, inventory, naturals/bases flags, application suitability and IFRA category (prohibited items removed).
3. **Selection (cardinality ≤ N)**: beam search (width B, default 8). Score = similarity gain toward T + band coverage − cost penalty − redundancy penalty (cosine between selected materials). Seeded noise for variation.
4. **Weight fitting**: for the selected set, solve
   `min ‖A·w − T‖² + λ_cost·cᵀw + λ_smooth·‖w‖² + Σ band-ratio penalties`
   subject to `Σw = 1`, `0 ≤ w_i ≤ ifraCap_i(category, targetStrength)`, locks fixed, `w_i ≥ w_min` (weighable). Solved with HiGHS QP, with a projected-gradient fallback.
5. **Prune and refit**: drop lines below the threshold, refill from the beam if under N, and refit.
6. **Post-checks**: IFRA (finished product), dominance warnings, cost ceiling, minimum weighable mass at the planned batch size.
7. **Output**: neat proportions, then converted to stock amounts using each stock's active % (Y05).

Substitution (R54), cost-down (R55), refine (R44) and optimise (Y07) reuse steps 4–6 with different objectives or locks.

### 4.6 Solvent-aware maths (definitions)

For line *i*: stock amount `g_i`, active fraction `a_i`, solvent type `s_i`.

- Neat active: `n_i = g_i · a_i`. Solvent carried: `v_i = g_i · (1 − a_i)` attributed to `s_i`.
- Concentrate neat total: `N = Σ n_i`. % of concentrate: `p_i = n_i / N`.
- Finished product at strength σ (for example 0.20 for EdP): product mass `M = N / σ`. Added solvent = `M − Σ g_i`, computed per chosen solvent, with carried solvents already counted in each type's total.
- Finished-product concentration of a material: `n_i / M`. **This is the value IFRA checks.** For aggregated constituents: `Σ_j n_j · x_{j,c} / M`, where x is the constituent fraction from the composition data.
- Volume: `ml = mass / density`, per component, using the mixture approximation shown to the user.
- Cost: `Σ g_i · price_i` (with per-ml prices converted through density), plus solvent cost.
- Batch scaling multiplies every `g_i` by `k = target / current` (in whatever basis was chosen: neat, concentrate, product mass or volume) and re-checks scale resolution.

### 4.7 Character sliders: original mappings (initial design, to be calibrated)

| Slider | Target-vector / constraint effect | Computed metric shown |
|---|---|---|
| Density | Raises the base-band share and weights resinous/amber/oud/woody-creamy | Impact-weighted base-band share + mean molecular-heaviness attribute |
| Transparency | Favours low-density, diffusive musks, aquatic and aldehydic materials, and penalises opaque resinous/gourmand | Inverse of the "opacity" attribute, averaged |
| Projection | Favours high-diffusion and high-impact materials, especially in the heart and base | Σ share × diffusion × impact |
| Longevity | Raises the low-volatility share and fixatives | Simulated time until the profile intensity drops below 20% |
| Softness | Raises musky/powdery/creamy and penalises sharp, spicy-fresh and harsh green | Σ share × softness attribute |
| Temperature | Positive values give warm families (amber, spicy-warm, gourmand, animalic). Negative values give cool ones (citrus, aquatic, mint-herbal, green). | Warmth index from −1 to 1 |
| Movement | Spread of volatility (a dynamic opening-to-dry-down change) versus linear | Change in the profile vector across 0 h, 1 h, 6 h and 24 h (path length) |

---

## 5. Phased implementation plan

| Phase | Scope (matrix IDs) | Main deliverables | Exit criteria |
|---|---|---|---|
| **0. Verification and foundations** (about 2 weeks) | Close the Unverified rows. Legal and IP review. Taxonomy. Design. | (a) A manual **observation pass** of the public Free Wizard screens by the owner from a normal browser (screens, fields, workflows recorded as notes and screenshots for internal reference only, nothing copied into the product), which moves rows to **Observed**; (b) IFRA dataset licensing decision; (c) YD Odour Map v1 and attribute rubric; (d) YD brand guide and design tokens (Y02); (e) iPhone 17 Pro Max viewport confirmation (Y03); (f) the data model in §4.3 frozen. | Every UV row confirmed, dropped or kept on purpose. Brand and tokens approved. |
| **1. Core lab** (about 4–5 weeks) | Y01, Y02, Y03, Y04, Y05, Y06, Y09 (storage), Y12, Y14, R01, R50–R53, R57, R60–R63, R90 | PWA shell (RTL, offline), inventory with dilutions, formula editor, solvent-aware engine with golden tests, live costing, normalise, batch planner, automatic versioning | 40 maths golden tests pass. 50-row editing at under 50 ms per edit on the device. Works offline. |
| **2. Odour model and visualisation** (about 3–4 weeks) | R30–R38, R80–R82, R20, R91, R92, R93 | YD library seed (about 150 materials, authored by us), material sets and filters, search and compare, profile chart, dry-down timeline, pyramid, PDF lab sheet in Hebrew, CSV/XLSX/JSON import and export | Every seeded material is fully attributed. Charts update live. The Hebrew PDF is validated. |
| **3. Composer** (about 5–6 weeks) | R10, R11, R19, R40–R44, R54, R55, Y08, Y07, Y10 | Brief parser (lexicon), archetype library of 60+, Odour Map Designer, generator with complexity 5–50 (default 20), variations, refine loop, substitutions, cost-down, character sliders with metrics, optimiser with locks, compare view | Benchmark: similarity at least 0.8, every constraint met, under 2 s generation on an iPhone, monotonic slider metrics. |
| **4. Compliance** (about 3 weeks) | R70, R71, R72, R56 | IFRA check by category, constituent aggregation, allergen calculator, application adapter | 30 IFRA test cases match hand calculations. The amendment version is shown. |
| **5. Image and language** (about 3–4 weeks) | R14–R18, Y13 | Image to Scent (palette, swatch toggles, focus themes), Scent Mind Map, description writer in Hebrew and English | Directional image tests pass. Descriptions stay within the profile facts. |
| **6. Notebook and history** (about 2 weeks) | Y11, Y09 (branching UI), Y15 | Trials, time-series evaluations, media and voice notes, timeline, onboarding and help | A trial can be recorded and searched, and its feedback feeds the refine loop. |
| **7. Scale and cloud** (about 4 weeks) | R12, R13, R06, Y16, R02–R04 | Library of 1,000+ profiles and inspired-by profiles, server-side 100k index, sync and backup, engine API, entitlements framework (dormant) | A restore on a new device works. 100k-profile search meets the target. API results match the device. |
| **8. Hardening and release** (about 2 weeks) | All | Accessibility (VoiceOver in Hebrew), performance tuning, security review, optional Capacitor wrapper, documentation | Every acceptance criterion in §2–§3 is green. Tested on an actual iPhone 17 Pro Max. |

These are rough estimates for one full-time developer with perfumer review: about 28–35 weeks in total. Phases 4 and 5 can run in parallel after Phase 3.

---

## 6. Open items and verification backlog

1. **Network access to perfumersworld.com** is blocked by this environment's policy. To move items to **Observed**, either the owner does the manual pass in Phase 0, or the environment's allowed hosts are changed. Only a passive inventory of public Free screens is allowed. No sign-in bypass and no script or data extraction.
2. **Tier inconsistencies in the sources**: whether Naturals Only and No Bases are Free or Premium, the tier of image-to-formula and the ABC graph, and preset complexity names. These need confirming.
3. **Batch scaling, save, print, export and substitution** are documented only for the sister Workbook product, or not at all, for the Wizard. YD implements them anyway, as the brief requires.
4. **IFRA dataset**: confirm the terms for using IFRA Standards data inside the app (attribution, versioning, update cadence), and which amendment to ship.
5. **Fonts and brand**: license a Hebrew display face suitable for black and gold (to be chosen in Phase 0).
6. **Material attribute authoring**: the odour vectors and impact/volatility scores need a perfumer's evaluation. This is the biggest content dependency and the main driver of output quality.
7. **iPhone 17 Pro Max**: confirm the exact CSS viewport and safe areas on the device. The plan assumes a 440 pt width.
