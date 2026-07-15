---
name: Gentala Core
colors:
  surface: "#f7f9fb"
  surface-dim: "#d8dadc"
  surface-bright: "#f7f9fb"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f2f4f6"
  surface-container: "#eceef0"
  surface-container-high: "#e6e8ea"
  surface-container-highest: "#e0e3e5"
  on-surface: "#191c1e"
  on-surface-variant: "#3f484a"
  inverse-surface: "#2d3133"
  inverse-on-surface: "#eff1f3"
  outline: "#6f797a"
  outline-variant: "#bfc8ca"
  surface-tint: "#206771"
  primary: "#00434b"
  on-primary: "#ffffff"
  primary-container: "#0d5c66"
  on-primary-container: "#91d2dd"
  inverse-primary: "#90d1dc"
  secondary: "#406658"
  on-secondary: "#ffffff"
  secondary-container: "#c2ecda"
  on-secondary-container: "#466c5e"
  tertiary: "#523700"
  on-tertiary: "#ffffff"
  tertiary-container: "#704d00"
  on-tertiary-container: "#fcbd4d"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#abedf9"
  primary-fixed-dim: "#90d1dc"
  on-primary-fixed: "#001f24"
  on-primary-fixed-variant: "#004f58"
  secondary-fixed: "#c2ecda"
  secondary-fixed-dim: "#a6cfbf"
  on-secondary-fixed: "#002117"
  on-secondary-fixed-variant: "#284e41"
  tertiary-fixed: "#ffdeac"
  tertiary-fixed-dim: "#fabc4c"
  on-tertiary-fixed: "#281900"
  on-tertiary-fixed-variant: "#604100"
  background: "#f7f9fb"
  on-background: "#191c1e"
  surface-variant: "#e0e3e5"
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: "700"
    lineHeight: "1.2"
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: "700"
    lineHeight: "1.3"
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: "700"
    lineHeight: "1.3"
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: "600"
    lineHeight: "1.4"
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "300"
    lineHeight: "1.6"
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "300"
    lineHeight: "1.6"
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "600"
    lineHeight: "1.2"
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "400"
    lineHeight: "1.2"
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 80px
---

## Brand & Style

The design system for the Gentala Child Development Center is anchored in the concept of "Nurturing Precision." It bridges the gap between professional healthcare expertise and a warm, inviting educational environment. The target audience includes parents seeking clarity and reassurance, as well as specialists who require a focused, high-utility interface.

The aesthetic is **Minimalist with Tactile Softness**. It utilizes generous whitespace to reduce cognitive load—essential for parents who may be in a state of stress—while incorporating organic, large-radius curvatures to evoke a sense of safety and friendliness. The design system rejects the "clinical" coldness of traditional medical apps in favor of a sophisticated, editorial approach that feels premium yet deeply human.

Key stylistic markers include:

- **Ultra-clean Layouts:** Intentional use of negative space to highlight key information.
- **Organic Curvature:** A consistent 24px corner radius creates a "pebble" or "cushion" feel.
- **Glassmorphic Overlays:** Subtle translucency in navigation and modal elements to maintain spatial awareness and a modern, airy feel.

## Colors

The palette is inspired by nature—water, forest, and sun—to create a grounding emotional response.

- **Primary (#0D5C66):** Deep Teal is used for all high-level hierarchy, including headings and primary action states. It provides the "authoritative" weight necessary for a development center.
- **Secondary (#88B0A0 & Mint):** Sage and Mint Green act as the calming agent. Used for success states, secondary buttons, and decorative background shapes.
- **Highlights (#E5A93B & #D4B996):** Sun Yellow and Sand Beige are used sparingly for calls-to-action (CTAs) that require warmth, or to highlight developmental milestones and milestones.
- **Background (#F8FAFC):** A soft, cool off-white that prevents screen glare and provides a premium canvas for glassmorphic effects.

## Typography

This design system uses a strategic pairing of **Montserrat** and **Inter**.

- **Headlines (Montserrat):** Set in Bold or Semi-Bold weights. Montserrat’s geometric nature complements the 24px rounded corners of the UI.
- **Body (Inter):** Set primarily in the Light (300) weight. Inter provides exceptional legibility for medical reports or developmental descriptions. The light weight maintains the "airy" minimalist feel.
- **Scale:** On mobile devices, headline sizes are aggressively stepped down to ensure no more than 3 words per line, maintaining the "premium editorial" look.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid**. Content is contained within a 1280px max-width wrapper on desktop to ensure line lengths remain readable.

- **Rhythm:** An 8px base grid is used for all internal component spacing.
- **Whitespace:** We use significant vertical padding between sections (80px+) to allow the design to "breathe."
- **Grid:** A 12-column grid is used for desktop. On mobile, this collapses to a single column with a 20px safe margin.
- **The "Bento" Rule:** Cards and content blocks should be grouped in logical clusters with consistent 24px gutters, creating a "Bento box" layout that feels organized and professional.

## Elevation & Depth

Hierarchy is established through **Glassmorphism and Ambient Shadows** rather than heavy color fills.

- **Surface 0 (Background):** #F8FAFC.
- **Surface 1 (Cards):** Pure White (#FFFFFF) with a 24px corner radius. These feature a very soft, diffused shadow: `0px 10px 30px rgba(13, 92, 102, 0.05)`. Note the slight teal tint in the shadow to maintain color harmony.
- **Surface 2 (Glassmorphic):** Used for navigation bars and floating action menus. Background: `rgba(255, 255, 255, 0.7)` with a 20px backdrop-blur.
- **Interactive States:** When hovered, cards should subtly lift by increasing shadow blur and decreasing the teal opacity.

## Shapes

The design system adheres to a strict **24px (1.5rem)** radius for all primary containers and cards. This large radius is the signature visual element of the brand, conveying gentleness.

- **Primary Radius:** 24px (Cards, Modals, Section containers).
- **Secondary Radius:** 12px (Input fields, Buttons).
- **Tertiary Radius:** 8px (Small chips, tooltips).
- **Icons:** Must be 2px stroke-width line art with rounded caps and joins to match the UI's softness.

## Components

- **Navigation Bar:** Fixed top position. Glassmorphic background with a subtle 1px border at the bottom (`rgba(13, 92, 102, 0.1)`).
- **Buttons:**
  - _Primary:_ Deep Teal background, white text, 12px radius, no shadow.
  - _Secondary:_ Transparent background with a 1.5px Sage Green border.
- **Cards:** White background, 24px radius, soft ambient shadow. Content inside should have at least 32px of internal padding.
- **Input Fields:** Soft Sand Beige or White background with 12px radius. Focus state uses a 1.5px Deep Teal border.
- **Chips:** Used for "Developmental Milestones" or "Tags." Use the Mint Green background with Deep Teal text at a 50px (pill) radius.
- **Lists:** Clean, borderless list items separated by 16px of vertical space. Use Sage Green icons for bullet points.
- **Progress Indicators:** Soft, rounded tracks (Mint Green) with a Deep Teal filler to show a child's progress through a program.
