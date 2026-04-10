# Design System Document: High-End Blockchain Analytics

## 1. Overview & Creative North Star: "The Kinetic Monolith"
The creative North Star for this design system is **"The Kinetic Monolith."** 

Unlike traditional trading terminals that suffer from "Information Density Fatigue," this system treats data as a living, breathing entity. We are moving away from the "Excel-in-the-dark" aesthetic of Bloomberg and toward a sophisticated, editorial experience. The interface should feel like a high-end physical console—heavy, obsidian-glass surfaces layered with neon-etched data. We break the grid through **Intentional Asymmetry**: using large `display-lg` metrics to anchor the eye, while secondary data "orbits" in smaller, nested containers. The goal is to make the user feel like a digital curator of the Solana network, not just a spectator.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep, "Obsidian Navy" base, utilizing high-chroma accents to signify market movement and brand identity.

### Surface Hierarchy & The "No-Line" Rule
**Rule:** 1px solid, high-contrast borders are strictly prohibited for layout sectioning. 
Structure is defined by **Tonal Transitions**. Use the `surface-container` tiers to create hierarchy:
- **Base Layer:** `surface` (#121318) - The infinite void.
- **Sectioning:** Use `surface-container-low` (#1a1b21) for large background regions.
- **Content Blocks:** Use `surface-container` (#1e1f25) for primary cards.
- **Interaction/Pop-overs:** Use `surface-container-high` (#292a2f) to indicate focus or elevation.

### The "Glass & Gradient" Rule
To achieve the "Pulse" aesthetic, all primary cards must utilize **Glassmorphism**:
- **Background:** `surface-container-low` at 60% opacity.
- **Backdrop Blur:** 12px to 20px.
- **The Signature Edge:** Instead of a border, use a subtle top-down linear gradient on the background (from `outline-variant` at 15% opacity to 0%) to mimic light hitting the edge of a glass pane.

### Accent Strategy
- **Pulse Purple (`primary_container` - #9945ff):** Reserved for brand moments, active states, and high-level navigation.
- **Solana Green (`secondary_container` - #00ec91):** Strictly for "Growth" metrics, Buy orders, and positive deltas.
- **Alert Red (`tertiary_container` - #de3337):** Strictly for "Volatility," Sell orders, and system alerts.

---

## 3. Typography: Editorial Precision
We utilize a dual-font strategy to balance legibility with a "tech-forward" soul.

*   **Space Grotesk (The Data Anchor):** Used for all `display`, `headline`, and `label` roles. Its geometric quirks provide the "terminal" feel while remaining highly readable at small sizes for complex financial tickers.
*   **Inter (The Functional UI):** Used for `title` and `body` roles. Inter provides the neutral, professional grounding needed for dense analytical descriptions and settings.

**The Hierarchy of Meaning:**
- **`display-lg` (Space Grotesk):** For "Holy Grail" metrics (e.g., SOL Price, 24h Volume).
- **`label-sm` (Space Grotesk):** For data headers in tables. All-caps with 0.05em letter spacing.
- **`body-md` (Inter):** For transactional data and user-generated content.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to represent "height"; we use light.

*   **The Layering Principle:** Depth is achieved by "stacking" tones. A `surface-container-lowest` card nested inside a `surface-container` section creates an "etched-in" look. Placing a `surface-container-highest` element on a `surface` background creates a "raised" look.
*   **Ambient Shadows:** For floating modals only. Use a 32px blur, 0px offset, and `on-surface` color at 4% opacity. It should feel like a soft glow, not a drop shadow.
*   **The Ghost Border:** If a separator is required for accessibility, use `outline-variant` at 10% opacity. It should be felt, not seen.

---

## 5. Component Guidelines

### Buttons: High-Contrast Interaction
- **Primary (The Pulse):** Gradient background from `primary` to `primary_container`. No border. `label-md` typography in `on_primary_container`.
- **Secondary (The Glass):** `surface-container-high` background with 10% `outline-variant` ghost border. 
- **Tertiary:** Ghost button. `on_surface` text, shifting to `surface-container-low` on hover.

### Cards & Lists: The "No-Divider" Mandate
- **Strict Rule:** Never use line dividers between list items.
- **Solution:** Use vertical white space (8px or 12px) and subtle hover states using `surface-container-highest` at 30% opacity to highlight the active row.
- **Data Tables:** Align all `Space Grotesk` metrics to tabular figures (monospaced numbers) to ensure columns of data remain perfectly aligned for rapid scanning.

### Input Fields: Monolith Style
- **Resting State:** `surface-container-lowest` background. No border.
- **Focus State:** 1px "Ghost Border" of `primary` at 40% opacity. A subtle `primary` glow (4px blur) should emanate from the bottom of the field.

### Chips: The Ticker Aesthetic
- **Status Chips:** Small `label-sm` text. Use `secondary_container` (Green) for "Live" or "Success" with a 10% background tint of the same color. 

---

## 6. Do’s and Don’ts

### Do
*   **DO** use `surface-container` shifts to group related data.
*   **DO** lean into "Breathing Room." High-density data needs more margin, not less, to be processed.
*   **DO** use `secondary` (Green) and `tertiary` (Red) sparingly. If everything is colorful, nothing is important.

### Don't
*   **DON'T** use pure black (#000000). Always use the Obsidian base `surface`.
*   **DON'T** use 100% opaque borders. It breaks the "Glassmorphism" illusion.
*   **DON'T** mix typography roles. Never use Inter for large price metrics; it lacks the "authority" of Space Grotesk.
*   **DON'T** use standard Material shadows. Keep the interface "flat-but-layered."