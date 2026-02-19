<overview>
Extensive aesthetic directions with implementation patterns. Each style includes visual characteristics, CSS patterns, color palettes, and when to use. Choose based on project context and commit fully to the chosen direction.
</overview>

<critical_rule>
**NEVER MIX AESTHETICS RANDOMLY.** Choose ONE direction and execute it with precision. Coherence > variety.
</critical_rule>

<oled_optimized>
<style name="Dark Mode (OLED)">
**Visual**: Deep black (#000000), vibrant neon accents, minimal glow, high contrast text. Optimized for OLED power saving and eye comfort.

**Keywords**: dark, night mode, OLED, power efficient, eye-friendly, neon accents

**Primary Colors**:
- Deep Black: #000000 or #121212
- Midnight Blue: #0A0E27

**Accent Colors** (vibrant neons that pop on black):
- Neon Green: #39FF14
- Electric Blue: #0080FF
- Gold: #FFD700
- Plasma Purple: #BF00FF

**CSS Variables**:
```css
:root {
  --bg-black: #000000;
  --bg-dark-grey: #121212;
  --text-primary: #FFFFFF;
  --text-secondary: #E0E0E0;
  --accent-neon: #0080FF;
  --glow-effect: 0 0 10px var(--accent-neon);
}
```

**Implementation Checklist**:
- [ ] Deep black #000000 or #121212 background
- [ ] Vibrant neon accents (not muted)
- [ ] Text contrast 7:1+ minimum
- [ ] Minimal glow effects (sparingly on focus states)
- [ ] No white (#FFFFFF) backgrounds anywhere
- [ ] color-scheme: dark in CSS

**CSS Patterns**:
```css
body {
  background: #000000;
  color: #FFFFFF;
  color-scheme: dark;
}

.accent-glow {
  text-shadow: 0 0 10px var(--accent-neon);
}

.card {
  background: #121212;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Best For**: Night-mode apps, coding platforms, entertainment, OLED devices, streaming apps
**Avoid For**: Print-first content, outdoor/high-brightness use, color-accuracy-critical
</style>

<style name="Cyberpunk UI">
**Visual**: Neon on black, terminal aesthetics, glitch effects, CRT scanlines, dystopian future.

**Keywords**: cyberpunk, neon, glitch, terminal, sci-fi, matrix, synthwave

**Primary Colors**:
- Matrix Green: #00FF00
- Hot Pink/Magenta: #FF00FF
- Cyan: #00FFFF
- Deep Black: #0D0D0D

**CSS Variables**:
```css
:root {
  --cyber-bg: #0D0D0D;
  --cyber-green: #00FF41;
  --cyber-pink: #FF00FF;
  --cyber-cyan: #00FFFF;
  --scanline-opacity: 0.03;
}
```

**Effects**:
```css
/* CRT Scanlines */
.crt::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.3) 2px,
    rgba(0, 0, 0, 0.3) 4px
  );
  pointer-events: none;
}

/* Glitch Effect */
@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
  60% { transform: translate(-1px, 1px); }
  80% { transform: translate(1px, -1px); }
}

/* Neon Glow */
.neon-text {
  text-shadow:
    0 0 5px currentColor,
    0 0 10px currentColor,
    0 0 20px currentColor;
}
```

**Best For**: Gaming, crypto/web3, tech products, entertainment, developer portfolios
**Avoid For**: Corporate, healthcare, family apps, conservative brands, elderly users
</style>

<style name="HUD / Sci-Fi FUI">
**Visual**: Thin lines (1px), neon cyan/blue on black, technical markers, decorative brackets, monospaced fonts, holographic feel.

**Primary Colors**:
- HUD Cyan: #00FFFF
- Holographic Blue: #0080FF
- Alert Red: #FF0000
- Background: rgba(0, 10, 20, 0.9)

**CSS Patterns**:
```css
.hud-panel {
  border: 1px solid rgba(0, 255, 255, 0.5);
  background: rgba(0, 10, 20, 0.8);
  font-family: 'Share Tech Mono', monospace;
}

.hud-text {
  color: #00FFFF;
  text-shadow: 0 0 5px cyan;
  letter-spacing: 0.1em;
}

/* Corner brackets decoration */
.hud-corners::before,
.hud-corners::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 1px solid #00FFFF;
}
```

**Best For**: Sci-fi games, space tech, cybersecurity, immersive dashboards
**Avoid For**: Standard corporate, reading-heavy content, accessible public services
</style>
</oled_optimized>

<bold_modern>
<style name="Neubrutalism">
**Visual**: Bold borders (3px+), hard shadows (offset, no blur), high saturation colors, no gradients, sharp or slightly rounded corners, raw but functional.

**Keywords**: bold, ugly-cute, raw, high contrast, flat, hard shadows, Gen Z

**Primary Colors**:
- Pop Yellow: #FFEB3B or #FFDE59
- Bright Red: #FF5252 or #FF6B6B
- Electric Blue: #2196F3 or #4ECDC4
- Pure Black: #000000 (for borders)

**CSS Variables**:
```css
:root {
  --border-width: 3px;
  --shadow-offset: 4px;
  --shadow-color: #000000;
  --primary: #FFDE59;
  --secondary: #FF6B6B;
}
```

**CSS Patterns**:
```css
.neu-card {
  border: 3px solid #000;
  box-shadow: 5px 5px 0px #000;
  background: #FFDE59;
  border-radius: 0; /* or 4px max */
}

.neu-button:hover {
  transform: translate(2px, 2px);
  box-shadow: 3px 3px 0px #000;
}

.neu-button:active {
  transform: translate(4px, 4px);
  box-shadow: 1px 1px 0px #000;
}
```

**Implementation Checklist**:
- [ ] Hard borders 2-4px solid black
- [ ] Hard offset shadows (no blur)
- [ ] High saturation colors
- [ ] Bold typography (700+)
- [ ] No blurs, no gradients
- [ ] Distinctive 'ugly-cute' aesthetic

**Best For**: Gen Z brands, startups, creative agencies, design tools, Notion/Figma-style apps
**Avoid For**: Banking, legal, healthcare, conservative industries, elderly users
</style>

<style name="Brutalism">
**Visual**: Raw, unpolished, stark, high contrast, plain text, visible borders, asymmetric, anti-design.

**Primary Colors**: Pure primaries only
- Red: #FF0000
- Blue: #0000FF
- Yellow: #FFFF00
- Black: #000000
- White: #FFFFFF

**CSS Patterns**:
```css
* {
  border-radius: 0 !important;
}

body {
  font-family: system-ui, monospace;
  font-weight: 700;
}

.brutal-border {
  border: 2-4px solid #000;
}

/* No transitions - instant */
* {
  transition: none !important;
}
```

**Best For**: Design portfolios, artistic projects, counter-culture brands, tech blogs
**Avoid For**: Corporate, critical accessibility, customer-facing professional sites
</style>

<style name="Vibrant Block-Based">
**Visual**: Bold block layouts, geometric shapes, high color contrast, large typography (32px+), animated patterns, energetic.

**Primary Colors** (neons):
- Neon Green: #39FF14
- Electric Purple: #BF00FF
- Vivid Pink: #FF1493
- Bright Cyan: #00FFFF
- Sunburst Orange: #FFAA00

**CSS Patterns**:
```css
.block-section {
  padding: 4rem;
  gap: 48px;
  font-size: clamp(2rem, 5vw, 4rem);
}

/* Animated background pattern */
@keyframes pattern-move {
  from { background-position: 0 0; }
  to { background-position: 100px 100px; }
}

.animated-pattern {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255,255,255,0.1) 10px,
    rgba(255,255,255,0.1) 20px
  );
  animation: pattern-move 3s linear infinite;
}
```

**Best For**: Startups, creative agencies, gaming, social media, youth-focused, entertainment
**Avoid For**: Financial institutions, healthcare, government, conservative, elderly
</style>
</bold_modern>

<elegant_refined>
<style name="Minimalism & Swiss Style">
**Visual**: White space, geometric layouts, sans-serif fonts, high contrast, grid-based structure, essential elements only.

**Primary Colors**:
- Black: #000000
- White: #FFFFFF
- Single accent only

**Secondary**: Neutral (Beige #F5F1E8, Grey #808080)

**CSS Patterns**:
```css
body {
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  font-family: 'Helvetica Neue', sans-serif;
}

/* No shadows unless necessary */
.card {
  border: 1px solid #E5E5E5;
  box-shadow: none;
}

/* Sharp shadows only if needed */
.elevated {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

**Implementation Checklist**:
- [ ] Grid-based layout (12-16 columns)
- [ ] Typography hierarchy clear
- [ ] No unnecessary decorations
- [ ] WCAG AAA contrast verified
- [ ] Fast loading

**Best For**: Enterprise apps, dashboards, documentation, SaaS, professional tools
</style>

<style name="Glassmorphism">
**Visual**: Frosted glass effect, translucent overlays (10-30% opacity), vibrant backgrounds, subtle borders, layered depth.

**CSS Patterns**:
```css
.glass-card {
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}

/* Requires vibrant background */
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

**Implementation Checklist**:
- [ ] Backdrop-filter blur 10-20px
- [ ] Translucent white 15-30% opacity
- [ ] Subtle border 1px light
- [ ] Vibrant background behind glass
- [ ] Text contrast 4.5:1 verified

**Best For**: Modern SaaS, financial dashboards, high-end corporate, modals, navigation
</style>

<style name="Luxury Minimalist">
**Visual**: Sophisticated restraint, serif headlines, monochrome with gold accents, generous white space, refined details.

**Primary Colors**:
- Black: #1C1917
- Stone: #44403C
- Gold Accent: #CA8A04 or #D4AF37
- Off-White: #FAFAF9

**CSS Patterns**:
```css
body {
  font-family: 'Cormorant', 'Bodoni Moda', serif;
  letter-spacing: 0.05em;
  color: #0C0A09;
  background: #FAFAF9;
}

.luxury-heading {
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.gold-accent {
  color: #D4AF37;
  border-bottom: 1px solid #D4AF37;
}
```

**Best For**: Fashion, jewelry, high-end services, architecture, premium brands
</style>
</elegant_refined>

<playful_creative>
<style name="Claymorphism">
**Visual**: Soft 3D, chunky elements, bubbly, thick borders (3-4px), double shadows (inner + outer), pastel colors.

**Primary Colors** (pastels):
- Soft Peach: #FDBCB4
- Baby Blue: #ADD8E6
- Mint: #98FF98
- Lilac: #E6E6FA

**CSS Patterns**:
```css
.clay-card {
  border-radius: 20px;
  border: 3px solid #333;
  box-shadow:
    inset -2px -2px 8px rgba(0,0,0,0.1),
    4px 4px 8px rgba(0,0,0,0.15);
  background: linear-gradient(145deg, #FDBCB4, #f5a89d);
}

.clay-button {
  animation: bounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**Best For**: Educational apps, children's apps, creative tools, fun-focused, onboarding
</style>

<style name="Memphis Design">
**Visual**: 80s, geometric, playful, postmodern, shapes, patterns, squiggles, triangles, neon, abstract.

**Primary Colors**:
- Hot Pink: #FF71CE
- Yellow: #FFCE5C
- Teal: #86CCCA
- Blue Purple: #6A7BB4

**CSS Patterns**:
```css
.memphis-bg {
  background-image:
    url("data:image/svg+xml,%3Csvg...triangle..."),
    url("data:image/svg+xml,%3Csvg...squiggle...");
  background-repeat: repeat;
}

.memphis-shape {
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  transform: rotate(15deg);
}
```

**Best For**: Creative agencies, music sites, youth brands, event promotion
</style>

<style name="Pixel Art">
**Visual**: 8-bit/16-bit aesthetic, pixelated fonts, sharp edges, limited palette, blocky UI, retro gaming feel.

**CSS Patterns**:
```css
* {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.pixel-text {
  font-family: 'Press Start 2P', cursive;
  font-size: 8px;
}

/* Pixel border using box-shadow */
.pixel-border {
  box-shadow:
    4px 0 0 #000,
    -4px 0 0 #000,
    0 4px 0 #000,
    0 -4px 0 #000;
}
```

**Best For**: Indie games, retro websites, creative portfolios, nostalgia marketing
</style>
</playful_creative>

<atmospheric>
<style name="Aurora UI">
**Visual**: Northern Lights effect, mesh gradients, smooth color blends, flowing animations (8-12s loops), iridescent effects.

**Color Pairs** (complementary):
- Blue-Orange
- Purple-Yellow
- Electric Blue #0080FF + Magenta #FF1493 + Cyan #00FFFF

**CSS Patterns**:
```css
.aurora-bg {
  background: conic-gradient(
    from 0deg at 50% 50%,
    #0080FF,
    #FF1493,
    #00FFFF,
    #8B00FF,
    #0080FF
  );
  background-size: 200% 200%;
  animation: aurora 8s ease-in-out infinite;
  filter: saturate(1.2) blur(40px);
}

@keyframes aurora {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

**Best For**: Modern SaaS, creative agencies, branding, music platforms, hero sections
</style>

<style name="Retro-Futurism / Synthwave">
**Visual**: 80s sci-fi, neon glow, CRT scanlines, glitch effects, deep black background.

**Primary Colors**:
- Neon Blue: #0080FF
- Hot Pink: #FF006E
- Cyan: #00FFFF
- Deep Black: #1A1A2E

**CSS Patterns**:
```css
.synthwave-text {
  color: #FF006E;
  text-shadow:
    0 0 5px #FF006E,
    0 0 10px #FF006E,
    0 0 20px #FF006E,
    0 0 40px #0080FF;
  font-family: 'Orbitron', monospace;
}

.grid-lines {
  background-image:
    linear-gradient(#FF006E33 1px, transparent 1px),
    linear-gradient(90deg, #FF006E33 1px, transparent 1px);
  background-size: 40px 40px;
  perspective: 500px;
  transform: rotateX(60deg);
}
```

**Best For**: Gaming, entertainment, music platforms, artistic projects, cyberpunk themes
</style>

<style name="Organic Biophilic">
**Visual**: Nature-inspired, cellular, fluid, breathing animations, generative, life-like.

**Primary Colors**:
- Forest Green: #228B22
- Earth Brown: #8B4513
- Sky Blue: #87CEEB
- Beige: #F5F5DC

**CSS Patterns**:
```css
.organic-shape {
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: morph 8s ease-in-out infinite;
}

@keyframes morph {
  0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
  50% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
}
```

**Best For**: Wellness apps, sustainability brands, health apps, meditation, organic products
</style>
</atmospheric>

<technical>
<style name="Bento Grid">
**Visual**: Apple-style modular cards, varied sizes (1x1, 2x1, 2x2), rounded corners (16-24px), soft backgrounds, clean hierarchy.

**Primary Colors**:
- Off-White: #F5F5F7
- Clean White: #FFFFFF
- Text: #1D1D1F

**CSS Patterns**:
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.bento-card {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.bento-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.span-2 { grid-column: span 2; }
.span-2-row { grid-row: span 2; }
```

**Best For**: Product features, dashboards, personal sites, marketing summaries
</style>

<style name="AI-Native UI">
**Visual**: Chatbot-centric, conversational, minimal chrome, streaming text, ambient interactions.

**Primary Colors**:
- Neutral: #F5F5F5
- AI Purple: #6366F1
- Success: #10B981

**CSS Patterns**:
```css
.ai-message {
  background: #F3F4F6;
  border-radius: 18px 18px 18px 4px;
  padding: 12px 16px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #6366F1;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
```

**Best For**: AI products, chatbots, voice assistants, copilots, conversational interfaces
</style>
</technical>

<product_specific_palettes>
**Quick Reference - Colors by Product Type:**

| Product Type | Primary | Secondary | CTA | Background |
|--------------|---------|-----------|-----|------------|
| Gaming | #7C3AED | #A78BFA | #F43F5E | #0F0F23 |
| Fintech/Crypto | #F59E0B | #FBBF24 | #8B5CF6 | #0F172A |
| Healthcare | #0891B2 | #22D3EE | #059669 | #ECFEFF |
| Creative Agency | #EC4899 | #F472B6 | #06B6D4 | #FDF2F8 |
| Cybersecurity | #00FF41 | #0D0D0D | #00FF41 | #000000 |
| Developer Tool | #3B82F6 | #1E293B | #2563EB | #0F172A |
| Luxury Brand | #1C1917 | #44403C | #CA8A04 | #FAFAF9 |
| Sustainability | #2E8B57 | #87CEEB | #FFD700 | #F0FFF4 |
| Space Tech | #FFFFFF | #94A3B8 | #3B82F6 | #0B0B10 |
</product_specific_palettes>

<selection_guide>
**How to Choose an Aesthetic:**

1. **Identify Product Type** → Match to product-specific palette
2. **Identify Audience** → Youth (bold), Professional (minimal), Luxury (refined)
3. **Identify Mood** → Energetic, Calm, Technical, Playful, Premium
4. **Commit Fully** → Don't mix incompatible aesthetics

**Quick Decision Tree**:
- Dark + Neon → OLED Dark, Cyberpunk, or HUD
- Minimal + Clean → Swiss, Bento Grid
- Bold + Colorful → Neubrutalism, Vibrant Block
- Soft + Playful → Claymorphism, Memphis
- Luxury + Refined → Luxury Minimalist, Glassmorphism
- Nature + Organic → Biophilic, Aurora UI
</selection_guide>
