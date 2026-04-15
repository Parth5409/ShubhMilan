# Design System Specification: Editorial Connection

## 1. Overview & Creative North Star: "The Digital Sanctuary"
The Creative North Star for this design system is **"The Digital Sanctuary."** We are not building a high-frequency dating app; we are crafting a contemplative, premium environment for life’s most significant decision. 

To break the "template" look common in matrimonial platforms, this system rejects rigid, boxed-in layouts in favor of **intentional asymmetry and editorial pacing.** Think of a high-end fashion or architectural journal. We use overlapping elements (e.g., a serif title partially overlaying a soft-focus image) and dramatic shifts in typography scale to guide the eye. The interface should feel "curated," where whitespace is not just empty room, but a deliberate design element used to convey luxury and breathing room.

---

## 2. Colors: Tonal Depth & Warmth
Our palette balances the spiritual authority of deep indigo with the visceral warmth of coral and rose gold.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To define the transition between content blocks, you must use background color shifts. For example, a section using `surface-container-low` should sit directly against a `surface` background. The change in tone is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper. 
*   **Base:** `surface` (#faf9fc)
*   **Depth:** Use `surface-container-lowest` (#ffffff) for high-importance cards to create a "lifted" feel against `surface-container-low` (#f5f3f7) backgrounds. 
*   **Nesting:** When placing a container inside another, always move one step up or down the hierarchy. Never place two identical surface tokens adjacent to one another.

### The "Glass & Gradient" Rule
Standard flat colors feel static. To inject "soul," use the following:
*   **Signature Gradients:** For primary CTAs and hero headers, use a linear gradient from `primary` (#341e64) to `primary-container` (#4b367c) at a 135-degree angle.
*   **Glassmorphism:** For floating navigation bars or overlay modals, use `surface` at 80% opacity with a `backdrop-filter: blur(12px)`.

---

## 3. Typography: The Editorial Voice
We use a high-contrast pairing of a modern sans-serif and an elegant serif to balance "AI-powered" with "Human-centered."

*   **Headings (Manrope):** Clean, technical, and trustworthy. Use `display-lg` (3.5rem) for hero statements to create a bold, editorial impact.
*   **Body (Noto Serif):** Warm and literary. The serif typeface is used for all storytelling elements, bios, and long-form descriptions to convey heritage and sophistication.
*   **Tone:** Large headlines should be tight-tracked and bold, while body text should have generous leading (line height) to ensure readability and a "premium" feel.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too aggressive for a "Sanctuary." We achieve depth through light and tone.

*   **The Layering Principle:** Instead of shadows, place `surface-container-lowest` cards on a `surface-dim` background. This creates a natural, soft separation.
*   **Ambient Shadows:** If a shadow is required for a floating action button (FAB) or a high-level modal, use the `on-surface` color at 5% opacity with a blur radius of `32px`. It should feel like a soft glow, not a dark edge.
*   **The "Ghost Border" Fallback:** If a container requires definition for accessibility (e.g., input fields), use the `outline-variant` (#cbc4d1) at **15% opacity**. A 100% opaque border is a failure of the design language.

---

## 5. Components

### Buttons
*   **Primary:** Gradient of `primary` to `primary-container`. `full` roundedness. No border. Text in `on-primary`.
*   **Secondary:** `surface-container-lowest` with a "Ghost Border." Text in `primary`.
*   **Tertiary:** No background. Text in `secondary` (#a43b38) for a warm, rose-gold hint.

### Input Fields
*   **Style:** Minimalist. Use `surface-container-low` as the fill. On focus, transition the background to `surface-container-lowest` and add a 1px "Ghost Border" using `surface-tint`.
*   **Labels:** Always use `label-md` in `on-surface-variant`.

### Cards & Lists
*   **NO DIVIDERS:** Never use 1px lines to separate list items. Use 24px of vertical whitespace (`spacing-xl`) or alternating subtle backgrounds (`surface` to `surface-container-low`).
*   **Profile Cards:** Use `xl` (1.5rem) corner radius. Imagery should take up 60% of the card, with a subtle `primary` gradient overlay at the bottom for text legibility.

### The "Soul-Match" Chip
*   **Specialty Component:** A high-end chip for AI match percentages. Use a `tertiary-container` (#cca730) background with `on-tertiary-fixed` text. This "Gold/Rose Gold" accent signals premium value.

---

## 6. Do’s and Don'ts

### Do:
*   **Embrace Asymmetry:** Place a profile image off-center and let the typography wrap around it in a non-linear way.
*   **Use High-Quality Imagery:** Only use photography with natural lighting and soft focus. Avoid clinical "stock" looking photos.
*   **Use Generous Padding:** If you think there is enough padding, add 8px more. Luxury is space.

### Don’t:
*   **Don't use 100% Black:** Always use `on-surface` (#1b1b1e) for text. True black is too harsh for this "Warm" palette.
*   **Don't use Hard Corners:** Avoid `none` or `sm` roundedness unless it's for a very specific technical metadata label. Everything else should feel soft to the touch.
*   **Don't Overcrowd:** If a screen feels busy, move secondary information into a "More Details" progressive disclosure pattern. Focus on the human connection first.