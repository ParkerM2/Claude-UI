<overview>
Curated font pairings with mood keywords, use cases, and ready-to-use CSS imports. Choose based on product type and aesthetic direction. NEVER use the anti-pattern fonts listed below.
</overview>

<anti_patterns>
**NEVER use these fonts for distinctive designs:**

| Font | Why It Fails |
|------|--------------|
| Inter | Ubiquitous, zero character, "AI slop" default |
| Roboto | Android system font, feels generic |
| Arial | Windows default, dated, no personality |
| Helvetica | Overused to meaninglessness |
| system-ui | Lazy fallback, no intentionality |
| sans-serif | Not a choice, just a cop-out |
| Open Sans | Safe to the point of invisible |

**Exception**: Only use these if client explicitly requires brand consistency with existing materials.
</anti_patterns>

<quick_selection>
**By Product Type:**

| Product | Recommended Pairing |
|---------|---------------------|
| Tech Startup | Space Grotesk + DM Sans |
| Luxury Brand | Cormorant + Montserrat |
| SaaS Dashboard | Plus Jakarta Sans |
| Creative Agency | Syne + Manrope |
| Gaming/Entertainment | Russo One + Chakra Petch |
| Developer Tool | JetBrains Mono + IBM Plex Sans |
| Healthcare | Figtree + Noto Sans |
| E-commerce | Rubik + Nunito Sans |
| Editorial/Magazine | Libre Bodoni + Public Sans |
| Kids/Education | Baloo 2 + Comic Neue |

**By Mood:**

| Mood | Recommended Pairing |
|------|---------------------|
| Elegant/Luxury | Playfair Display + Lato |
| Bold/Impactful | Bebas Neue + Source Sans 3 |
| Playful/Friendly | Fredoka + Nunito |
| Technical/Precise | Fira Code + Fira Sans |
| Calm/Wellness | Lora + Raleway |
| Retro/Vintage | Abril Fatface + Merriweather |
| Futuristic | Orbitron + Exo 2 |
| Brutalist/Raw | Space Mono |
</quick_selection>

<pairings>
<pairing name="Tech Startup" category="Sans + Sans">
**Heading**: Space Grotesk | **Body**: DM Sans

**Keywords**: tech, startup, modern, innovative, bold, futuristic

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
```

**Tailwind Config**:
```js
fontFamily: {
  heading: ['Space Grotesk', 'sans-serif'],
  body: ['DM Sans', 'sans-serif']
}
```

**Best For**: Tech companies, startups, SaaS, developer tools, AI products
</pairing>

<pairing name="Classic Elegant" category="Serif + Sans">
**Heading**: Playfair Display | **Body**: Lato

**Keywords**: elegant, luxury, sophisticated, timeless, premium, editorial

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
```

**Best For**: Luxury brands, fashion, spa, beauty, editorial, magazines
</pairing>

<pairing name="Bold Statement" category="Display + Sans">
**Heading**: Bebas Neue | **Body**: Source Sans 3

**Keywords**: bold, impactful, strong, dramatic, modern, headlines

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');
```

**Note**: Bebas Neue is ALL-CAPS display font. Use for large headlines only.

**Best For**: Marketing sites, portfolios, agencies, events, sports
</pairing>

<pairing name="Developer Mono" category="Mono + Sans">
**Heading**: JetBrains Mono | **Body**: IBM Plex Sans

**Keywords**: code, developer, technical, precise, functional, hacker

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
```

**Best For**: Developer tools, documentation, code editors, tech blogs, CLI apps
</pairing>

<pairing name="Fashion Forward" category="Sans + Sans">
**Heading**: Syne | **Body**: Manrope

**Keywords**: fashion, avant-garde, creative, bold, artistic, edgy

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700&display=swap');
```

**Best For**: Fashion brands, creative agencies, art galleries, design studios
</pairing>

<pairing name="Gaming Bold" category="Display + Sans">
**Heading**: Russo One | **Body**: Chakra Petch

**Keywords**: gaming, bold, action, esports, competitive, energetic

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=Russo+One&display=swap');
```

**Best For**: Gaming, esports, action games, competitive sports, entertainment
</pairing>

<pairing name="Playful Creative" category="Display + Sans">
**Heading**: Fredoka | **Body**: Nunito

**Keywords**: playful, friendly, fun, creative, warm, approachable

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');
```

**Best For**: Children's apps, educational, gaming, creative tools, entertainment
</pairing>

<pairing name="Wellness Calm" category="Serif + Sans">
**Heading**: Lora | **Body**: Raleway

**Keywords**: calm, wellness, health, relaxing, natural, organic

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap');
```

**Best For**: Health apps, wellness, spa, meditation, yoga, organic brands
</pairing>

<pairing name="Luxury Serif" category="Serif + Sans">
**Heading**: Cormorant | **Body**: Montserrat

**Keywords**: luxury, high-end, fashion, elegant, refined, premium

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
```

**Best For**: Fashion brands, luxury e-commerce, jewelry, high-end services
</pairing>

<pairing name="Friendly SaaS" category="Sans + Sans">
**Heading/Body**: Plus Jakarta Sans

**Keywords**: friendly, modern, SaaS, clean, approachable, professional

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
```

**Note**: Single versatile font. Modern alternative to Inter with more character.

**Best For**: SaaS products, web apps, dashboards, B2B, productivity tools
</pairing>

<pairing name="Retro Vintage" category="Display + Serif">
**Heading**: Abril Fatface | **Body**: Merriweather

**Keywords**: retro, vintage, nostalgic, dramatic, decorative, bold

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Merriweather:wght@300;400;700&display=swap');
```

**Note**: Abril Fatface for hero headlines only. High-impact vintage feel.

**Best For**: Vintage brands, breweries, restaurants, creative portfolios
</pairing>

<pairing name="Crypto/Web3" category="Sans + Sans">
**Heading**: Orbitron | **Body**: Exo 2

**Keywords**: crypto, web3, futuristic, tech, blockchain, digital

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap');
```

**Best For**: Crypto platforms, NFT, blockchain, web3, futuristic tech
</pairing>

<pairing name="Brutalist Raw" category="Mono">
**Heading/Body**: Space Mono

**Keywords**: brutalist, raw, technical, monospace, minimal, stark

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
```

**Note**: All-mono for raw brutalist aesthetic. Limited weights.

**Best For**: Brutalist designs, developer portfolios, experimental, tech art
</pairing>

<pairing name="Editorial Magazine" category="Serif + Sans">
**Heading**: Libre Bodoni | **Body**: Public Sans

**Keywords**: magazine, editorial, publishing, refined, journalism, print

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;500;600;700&family=Public+Sans:wght@300;400;500;600;700&display=swap');
```

**Best For**: Magazines, online publications, editorial content, journalism
</pairing>

<pairing name="Medical Clean" category="Sans + Sans">
**Heading**: Figtree | **Body**: Noto Sans

**Keywords**: medical, clean, accessible, professional, healthcare, trustworthy

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=Noto+Sans:wght@300;400;500;700&display=swap');
```

**Best For**: Healthcare, medical clinics, pharma, health apps, accessibility
</pairing>

<pairing name="E-commerce Clean" category="Sans + Sans">
**Heading**: Rubik | **Body**: Nunito Sans

**Keywords**: ecommerce, clean, shopping, product, retail, conversion

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;500;600;700&family=Rubik:wght@300;400;500;600;700&display=swap');
```

**Best For**: E-commerce, online stores, product pages, retail
</pairing>

<pairing name="Kids Education" category="Display + Sans">
**Heading**: Baloo 2 | **Body**: Comic Neue

**Keywords**: kids, education, playful, friendly, colorful, learning

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Comic+Neue:wght@300;400;700&display=swap');
```

**Note**: Comic Neue is a readable comic-style font, NOT Comic Sans.

**Best For**: Children's apps, educational games, kid-friendly content
</pairing>

<pairing name="Financial Trust" category="Sans">
**Heading/Body**: IBM Plex Sans

**Keywords**: financial, trustworthy, professional, corporate, banking, serious

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
```

**Best For**: Banks, finance, insurance, investment, fintech, enterprise
</pairing>

<pairing name="HUD Sci-Fi" category="Mono + Mono">
**Heading**: Share Tech Mono | **Body**: Fira Code

**Keywords**: tech, futuristic, HUD, sci-fi, data, monospaced, precise

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
```

**Best For**: Sci-fi interfaces, developer tools, cybersecurity, dashboards
</pairing>

<pairing name="Pixel Retro" category="Display + Mono">
**Heading**: Press Start 2P | **Body**: VT323

**Keywords**: pixel, retro, gaming, 8-bit, nostalgic, arcade

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
```

**Note**: Press Start 2P is very wide. VT323 better for body text.

**Best For**: Pixel art games, retro websites, creative portfolios
</pairing>

<pairing name="Accessibility First" category="Sans">
**Heading/Body**: Atkinson Hyperlegible

**Keywords**: accessible, readable, inclusive, WCAG, dyslexia-friendly, clear

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap');
```

**Note**: Designed by Braille Institute for maximum legibility.

**Best For**: Accessibility-critical sites, government, healthcare, inclusive design
</pairing>

<pairing name="Gen Z Brutal" category="Display + Sans">
**Heading**: Anton | **Body**: Epilogue

**Keywords**: brutal, loud, shouty, meme, internet, bold

**CSS Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Epilogue:wght@400;500;600;700&display=swap');
```

**Best For**: Gen Z marketing, streetwear, viral campaigns
</pairing>
</pairings>

<international>
**Multilingual Font Support:**

| Language | Recommended |
|----------|-------------|
| Vietnamese | Be Vietnam Pro + Noto Sans |
| Japanese | Noto Serif JP + Noto Sans JP |
| Korean | Noto Sans KR |
| Chinese (Traditional) | Noto Serif TC + Noto Sans TC |
| Chinese (Simplified) | Noto Sans SC |
| Arabic (RTL) | Noto Naskh Arabic + Noto Sans Arabic |
| Thai | Noto Sans Thai |
| Hebrew (RTL) | Noto Sans Hebrew |
</international>

<css_best_practices>
**Font Loading Best Practices:**

```css
/* Prevent FOIT (Flash of Invisible Text) */
@font-face {
  font-family: 'Custom Font';
  font-display: swap; /* Show fallback immediately */
}

/* System font stack for fallback */
--font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
  'Segoe UI', sans-serif;

/* Optimal font-size for body */
body {
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  line-height: 1.6;
}

/* Heading scale */
h1 { font-size: clamp(2rem, 1.5rem + 2.5vw, 4rem); }
h2 { font-size: clamp(1.5rem, 1.25rem + 1.5vw, 2.5rem); }
h3 { font-size: clamp(1.25rem, 1rem + 1vw, 1.75rem); }
```
</css_best_practices>
