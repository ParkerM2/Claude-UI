<overview>
Comprehensive design system patterns covering color palettes, motion/animation, spatial composition, visual effects, and UX best practices. Reference during implementation.
</overview>

<color_palettes>
**Product-Specific Color Palettes:**

<palette name="Gaming">
| Role | Color |
|------|-------|
| Primary | #7C3AED (Purple) |
| Secondary | #A78BFA |
| CTA | #F43F5E (Rose) |
| Background | #0F0F23 (Deep Dark) |
| Text | #E2E8F0 |

**Notes**: Vibrant + neon + immersive. OLED-friendly dark background.
</palette>

<palette name="Fintech/Crypto">
| Role | Color |
|------|-------|
| Primary | #F59E0B (Amber) |
| Secondary | #FBBF24 |
| CTA | #8B5CF6 (Violet) |
| Background | #0F172A (Slate 900) |
| Text | #F8FAFC |

**Notes**: Dark tech + trust + vibrant accents. Gold for premium feel.
</palette>

<palette name="Cybersecurity">
| Role | Color |
|------|-------|
| Primary | #00FF41 (Matrix Green) |
| Secondary | #0D0D0D |
| CTA | #00FF41 |
| Background | #000000 (True Black) |
| Text | #E0E0E0 |

**Notes**: Terminal feel. Matrix-inspired. Pure black for OLED.
</palette>

<palette name="Healthcare">
| Role | Color |
|------|-------|
| Primary | #0891B2 (Cyan 600) |
| Secondary | #22D3EE |
| CTA | #059669 (Emerald) |
| Background | #ECFEFF (Cyan 50) |
| Text | #164E63 |

**Notes**: Calm blue + health green + trust. Accessible contrast.
</palette>

<palette name="Creative Agency">
| Role | Color |
|------|-------|
| Primary | #EC4899 (Pink 500) |
| Secondary | #F472B6 |
| CTA | #06B6D4 (Cyan) |
| Background | #FDF2F8 (Pink 50) |
| Text | #831843 |

**Notes**: Bold primaries + artistic freedom. High energy.
</palette>

<palette name="Luxury Brand">
| Role | Color |
|------|-------|
| Primary | #1C1917 (Stone 900) |
| Secondary | #44403C |
| CTA | #CA8A04 (Gold) |
| Background | #FAFAF9 (Stone 50) |
| Text | #0C0A09 |

**Notes**: Black + Gold + White. Premium, minimal accents.
</palette>

<palette name="Developer Tool">
| Role | Color |
|------|-------|
| Primary | #3B82F6 (Blue 500) |
| Secondary | #1E293B (Slate 800) |
| CTA | #2563EB (Blue 600) |
| Background | #0F172A (Slate 900) |
| Text | #F1F5F9 |

**Notes**: Dark syntax theme. Blue focus states.
</palette>

<palette name="Space Tech">
| Role | Color |
|------|-------|
| Primary | #FFFFFF (Star White) |
| Secondary | #94A3B8 (Slate 400) |
| CTA | #3B82F6 (Blue) |
| Background | #0B0B10 (Deep Space) |
| Text | #F8FAFC |

**Notes**: Deep space black + metallic + star white.
</palette>

<palette name="Sustainability/Climate">
| Role | Color |
|------|-------|
| Primary | #2E8B57 (Sea Green) |
| Secondary | #87CEEB (Sky Blue) |
| CTA | #FFD700 (Solar Gold) |
| Background | #F0FFF4 (Green 50) |
| Text | #1A3320 |

**Notes**: Nature green + solar yellow + air blue.
</palette>

<palette name="AI/Chatbot">
| Role | Color |
|------|-------|
| Primary | #7C3AED (Violet 600) |
| Secondary | #A78BFA |
| CTA | #06B6D4 (Cyan) |
| Background | #FAF5FF (Violet 50) |
| Text | #1E1B4B |

**Notes**: AI Purple (#6366F1) as signature. Neutral backgrounds.
</palette>
</color_palettes>

<motion_animation>
**Animation Timing Guidelines:**

| Interaction Type | Duration | Easing |
|------------------|----------|--------|
| Micro-interactions | 50-100ms | ease-out |
| Button hover/press | 150-200ms | ease-out |
| UI transitions | 200-300ms | ease-in-out |
| Page transitions | 300-400ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Complex animations | 400-600ms | custom bezier |
| Ambient/decorative | 8-12s loops | ease-in-out |

**Staggered Reveals (High Impact):**
```css
.stagger-item {
  opacity: 0;
  transform: translateY(20px);
  animation: reveal 0.5s ease-out forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 100ms; }
.stagger-item:nth-child(3) { animation-delay: 200ms; }
.stagger-item:nth-child(4) { animation-delay: 300ms; }

@keyframes reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Scroll-Triggered Animations:**
```js
// Use Intersection Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, { threshold: 0.1 });
```

**Hover States That Surprise:**
```css
/* Lift effect */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

/* Color shift */
.button:hover {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
}

/* Scale with border */
.icon:hover {
  transform: scale(1.1);
  border-color: var(--accent);
}
```

**Reduced Motion Support (CRITICAL):**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
</motion_animation>

<spatial_composition>
**Layout Patterns:**

**Asymmetric Grids:**
```css
.asymmetric-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

/* Overlap effect */
.overlap-card {
  margin-top: -4rem;
  position: relative;
  z-index: 10;
}
```

**Bento Grid (Apple-style):**
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: 1rem;
}

.bento-large {
  grid-column: span 2;
  grid-row: span 2;
}

.bento-wide {
  grid-column: span 2;
}

.bento-tall {
  grid-row: span 2;
}
```

**Diagonal Flow:**
```css
.diagonal-section {
  clip-path: polygon(0 5%, 100% 0, 100% 95%, 0 100%);
  padding: 8rem 0;
}
```

**Generous Negative Space:**
```css
/* Minimum spacing scale */
--space-section: clamp(4rem, 10vw, 8rem);
--space-component: clamp(2rem, 5vw, 4rem);
--space-element: clamp(1rem, 2vw, 2rem);
```
</spatial_composition>

<visual_effects>
**Background Textures:**

**Noise/Grain Overlay:**
```css
.grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.05;
  pointer-events: none;
}
```

**Gradient Mesh:**
```css
.gradient-mesh {
  background:
    radial-gradient(at 40% 20%, #7C3AED 0px, transparent 50%),
    radial-gradient(at 80% 0%, #EC4899 0px, transparent 50%),
    radial-gradient(at 0% 50%, #06B6D4 0px, transparent 50%),
    radial-gradient(at 80% 50%, #F59E0B 0px, transparent 50%),
    radial-gradient(at 0% 100%, #10B981 0px, transparent 50%);
  background-color: #0F172A;
}
```

**Glassmorphism:**
```css
.glass {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}
```

**Glow Effects (OLED-friendly):**
```css
.neon-glow {
  box-shadow:
    0 0 5px var(--accent),
    0 0 10px var(--accent),
    0 0 20px var(--accent);
}

.text-glow {
  text-shadow:
    0 0 5px currentColor,
    0 0 10px currentColor;
}
```

**Hard Shadows (Neubrutalism):**
```css
.hard-shadow {
  box-shadow: 4px 4px 0 #000;
}

.hard-shadow:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #000;
}
```
</visual_effects>

<ux_critical_rules>
**Navigation:**
- Use `scroll-behavior: smooth` on html
- Add `padding-top` to body equal to fixed nav height
- Highlight active nav item with color/underline
- Preserve browser back button behavior

**Animation UX:**
- Limit to 1-2 key animations per view
- Use 150-300ms for micro-interactions (NEVER 1000ms+)
- Always check `prefers-reduced-motion`
- Show loading feedback for operations >300ms

**Touch Targets:**
- Minimum 44x44px on mobile
- Minimum 8px gap between targets
- Use `touch-action: manipulation` for responsive taps

**Focus States:**
- Always show visible focus rings (3-4px)
- Use `focus-visible:ring-2` not `focus:ring-2`
- Never `outline: none` without replacement

**Forms:**
- Always show labels (never placeholder-only)
- Show errors below related input
- Validate on blur, not just submit
- Use appropriate `inputmode` for mobile keyboards

**Performance:**
- Use `loading="lazy"` on below-fold images
- Set explicit `width` and `height` on images
- Use CSS `aspect-ratio` for containers
- Animate only `transform` and `opacity` (GPU-accelerated)
</ux_critical_rules>

<accessibility_checklist>
**WCAG Compliance:**

- [ ] Color contrast 4.5:1 minimum (7:1 for AAA)
- [ ] Don't convey info by color alone (add icons/text)
- [ ] All images have descriptive `alt` text
- [ ] Heading hierarchy h1→h2→h3 (no skipping)
- [ ] All icon buttons have `aria-label`
- [ ] Tab order matches visual order
- [ ] Use semantic HTML (nav, main, article)
- [ ] Form inputs have associated labels
- [ ] Error messages use `role="alert"` or `aria-live`
- [ ] Skip-to-content link for keyboard users
- [ ] Respect `prefers-reduced-motion`
- [ ] Minimum 16px font size on mobile
</accessibility_checklist>

<charts_data_viz>
**Chart Color Guidance:**

| Chart Type | Color Pattern |
|------------|---------------|
| Line (Trend) | Primary #0080FF, multiple series distinct colors |
| Bar (Compare) | Each bar distinct color, descending sort |
| Pie/Donut | 5-6 max, contrasting palette, large slices first |
| Heat Map | Cool (blue) → Hot (red) gradient |
| Success/Error | #22C55E (green) / #EF4444 (red) |
| Candlestick | Bullish #26A69A, Bearish #EF5350 |

**Accessibility for Charts:**
- Add pattern overlays for colorblind users
- Provide data table alternative
- Use 4.5:1+ contrast for labels
</charts_data_viz>

<z_index_scale>
**Stacking Context Management:**

```css
:root {
  --z-base: 0;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-fixed: 30;
  --z-modal-backdrop: 40;
  --z-modal: 50;
  --z-popover: 60;
  --z-tooltip: 70;
}
```

**Never use arbitrary values like `z-index: 9999`**
</z_index_scale>

<responsive_breakpoints>
**Standard Breakpoints:**

| Name | Width | Usage |
|------|-------|-------|
| xs | 320px | Small phones |
| sm | 375px | Standard phones |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

**Mobile-First Approach:**
```css
/* Default: mobile styles */
.element { padding: 1rem; }

/* Tablet and up */
@media (min-width: 768px) {
  .element { padding: 1.5rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element { padding: 2rem; }
}
```

**Content Width:**
```css
.prose { max-width: 65ch; } /* Optimal reading */
.container { max-width: 1280px; margin: 0 auto; }
```
</responsive_breakpoints>
