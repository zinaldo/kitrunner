# Design System Strategy: The Dynamic Editorial

## 1. Overview & Creative North Star

### Creative North Star: "The Kinetic Architect"
This design system moves beyond the static nature of traditional sports monitoring. It is built on the principle of **The Kinetic Architect**: a philosophy where data and action are structured with editorial precision, yet feel constantly in motion. We move away from the "generic dashboard" look by utilizing bold, high-contrast typography and intentional asymmetry. 

Instead of rigid, boxed-in modules, layouts should feel like a premium sports magazine—utilizing expansive breathing room, layered depth, and vibrant color transitions that guide the user’s eye toward performance-critical data. We prioritize a "functional-first" hierarchy that conveys deep trust through sophisticated visual weight and deliberate negative space.

---

## 2. Colors

The palette is anchored by a high-energy `primary` blue and a deep, authoritative `secondary` indigo. This system relies on tonal sophistication rather than graphic clutter.

*   **Primary (`#00658c`) & Primary Container (`#00b0f0`):** These represent the "pulse" of the platform. Use the vibrant `primary_container` for high-action triggers and the deeper `primary` for structural elements to ensure accessibility.
*   **The "No-Line" Rule:** To maintain an elite, custom feel, **do not use 1px solid borders to define sections.** Boundaries must be established through color blocking. Use a `surface-container-low` background to host a `surface-container-lowest` card. The change in hex value is the boundary.
*   **Surface Hierarchy & Nesting:** Treat the interface as layers of physical material.
    *   *Base:* `surface` (`#fdf8ff`)
    *   *Mid-Level:* `surface_container` (`#f1ebff`)
    *   *Action-Level:* `surface_container_highest` (`#e5deff`)
*   **The "Glass & Gradient" Rule:** For floating headers or critical stat overlays, use Glassmorphism. Apply `surface_container_lowest` at 70% opacity with a 24px backdrop-blur. 
*   **Signature Textures:** Main CTAs should not be flat. Use a subtle linear gradient (45°) from `primary` to `primary_container` to provide a "lit from within" energy that reflects the dynamism of live sports.

---

## 3. Typography

The typographic system uses a "High-Contrast Pairing" to balance technical accuracy with athletic energy.

*   **Display & Headlines (Lexend):** We use Lexend for all headers. Its geometric clarity and wide stance provide an authoritative, modern voice. `display-lg` should be used sparingly for hero stats or high-impact editorial moments, utilizing tight letter-spacing (-2%) for a "compact power" look.
*   **Body & Titles (Plus Jakarta Sans):** All functional data, labels, and long-form text utilize Plus Jakarta Sans. Its high x-height ensures readability during fast-paced monitoring.
*   **Hierarchy as Identity:** Use `headline-lg` in `secondary` (`#5f588d`) to ground the page, while using `label-md` in `primary` (`#00658c`) for uppercase category tags. This contrast between the deep indigo and the vibrant blue creates a professional, multi-dimensional information architecture.

---

## 4. Elevation & Depth

We reject traditional drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking" container tokens. A `surface_container_lowest` element sitting on a `surface_container` creates a natural lift. This mimics fine paper and feels significantly more "premium" than digital shadows.
*   **Ambient Shadows:** If an element must float (e.g., a modal or a primary action fab), use an extra-diffused shadow: `box-shadow: 0 12px 40px rgba(27, 19, 69, 0.06)`. Note the use of `on_surface` (`#1b1345`) as the shadow tint rather than pure black.
*   **The "Ghost Border" Fallback:** If a border is required for clarity in complex data grids, use the `outline_variant` token at **15% opacity**. It should be felt, not seen.
*   **Interactive Depth:** On hover, instead of a shadow getting darker, shift the background color from `surface_container_low` to `surface_container_high`. This "tactile lift" feels more responsive and modern.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `full` roundedness, white text. Bold and high-contrast.
*   **Secondary:** `surface_container_high` background with `primary` text. No border.
*   **Tertiary:** Transparent background, `primary` text, with a subtle `primary` underline on hover only.

### Cards & Event Lists
*   **Prohibition:** No divider lines between list items. Use 16px of vertical spacing and a alternating subtle background shift (`surface` to `surface_container_low`) to separate events.
*   **Structure:** Use `xl` (0.75rem) corner radius for cards. Content should be padded heavily (24px - 32px) to allow the editorial typography to breathe.

### Input Fields
*   **Style:** Minimalist. Use `surface_container_lowest` as the fill. On focus, transition the background to `white` and add a 2px "Ghost Border" using the `primary` color at 40% opacity.

### Sports-Specific Components
*   **The "Live Pulse" Chip:** A small, `primary_container` filled chip with a white dot. Used for active monitoring.
*   **Progress Indicators:** Use the `tertiary_container` (`#00b8ac`) for success metrics and finish lines, providing a fresh "victory" color that contrasts with the brand blue.

---

## 6. Do's and Don'ts

### Do
*   **Do** use extreme vertical whitespace to separate major content blocks.
*   **Do** use asymmetrical layouts (e.g., a large headline on the left with a small, high-density data table on the right).
*   **Do** apply `backdrop-blur` to sticky navigation bars to let the vibrant sports imagery bleed through subtly.
*   **Do** use `secondary_container` for "Active" states in navigation to provide a sophisticated color shift.

### Don'ts
*   **Don't** use 100% opaque black for text. Always use `on_surface` (`#1b1345`) for a softer, premium feel.
*   **Don't** use "Default" shadows. If you can clearly see the shadow's edge, it is too heavy.
*   **Don't** use borders to separate rows in a table. Let the alignment and white space define the structure.
*   **Don't** crowd the logo. The logo represents the brand's authority; give it a "buffer zone" of at least 64px from other elements.