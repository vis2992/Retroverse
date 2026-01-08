# Retrospeck Character Design Brief 🦉👓

## Character Overview
**Retrospeck** is the friendly, wise owl mascot for an agile retrospective application. They're a thoughtful companion who helps teams reflect on their sprints and discover insights.

---

## Visual Design Specifications

### Core Appearance
- **Species**: Owl (preferably Great Horned Owl or Barn Owl style)
- **Build**: Round, approachable body with a slightly scholarly appearance
- **Size**: Medium owl, neither too imposing nor too small
- **Pose**: Usually perched, looking thoughtful or curious

### Distinctive Features

#### Glasses (Signature Element) 👓
- **Style**: Large, round spectacles (similar to Harry Potter style but more modern)
- **Frame Color**: Amber/Gold (#F59E0B)
- **Lenses**: Clear or slightly reflective, sometimes showing tiny reflections of sticky notes or cards
- **Purpose**: Symbolizes clarity, focus, and insight

#### Feather Colors
- **Primary Body**: Deep purple/indigo (#8B5CF6 to #6366F1)
- **Chest/Face**: Lighter lavender/white mix for contrast
- **Wing Tips**: Gradient to darker indigo (#4F46E5)
- **Accent Feathers**: Amber/gold highlights (#F59E0B) around face and wing edges
- **Eyes**: Large, wise amber eyes behind the glasses

#### Accessories
- **Notebook**: Small notepad or sticky notes often nearby or tucked under wing
- **Pencil**: Sometimes holding a pencil in wing or beak
- **Optional**: Small backpack with retrospective tools (metaphorical)

### Expressions & Emotions

#### Default/Neutral
- Calm, wise expression
- Slight head tilt (classic owl curiosity)
- Eyes looking through glasses attentively

#### Happy/Excited (Discovering Insights)
- Wide eyes, glasses slightly raised
- Small smile
- Wings slightly raised in excitement
- Feathers slightly ruffled in joy

#### Thinking/Curious
- One eye narrowed, other wide (asymmetrical)
- Talon raised to chin/beak
- Head tilted at angle
- Focused gaze

#### Encouraging
- Warm smile
- Gentle nod
- Wings in welcoming gesture
- Soft, friendly eyes

#### Surprised (Finding Patterns)
- Eyes very wide behind glasses
- Glasses slightly askew
- Small "!" or lightbulb nearby
- Feathers standing up slightly

---

## AI Art Generation Prompts

### For Character Sheet / Main Design
```
A friendly cartoon owl mascot named Retrospeck, round body shape, wearing large round amber-gold spectacles, deep purple and indigo gradient feathers with amber accents, scholarly and wise appearance, holding a small notepad, modern flat design style, clean lines, approachable and professional, white background, character sheet with multiple angles
```

### For App Icon
```
Cute owl face icon, large round amber glasses, purple and indigo feathers, simple minimalist design, circular app icon, friendly wise expression, modern tech aesthetic, violet and gold color scheme, vector style
```

### For Landing Page Hero
```
Friendly purple owl wearing round gold spectacles, thoughtful pose perched on branch, looking at floating sticky notes and cards, magical sparkles around, modern digital illustration, clean professional style, violet and amber color palette, inspiring and welcoming atmosphere
```

### For Empty States
```
Cute purple owl with glasses sitting with blank notepad, encouraging friendly expression, "Let's get started!" mood, simple illustration, amber and violet colors, minimalist modern style
```

### For Success/Celebration
```
Happy owl with glasses, wings raised in celebration, surrounded by colorful sticky notes, excited expression, confetti or sparkles, achievement mood, violet and amber colors, cheerful illustration
```

---

## Design Specifications for Designers

### Color Palette
```css
/* Primary - Retrospeck's Feathers */
--retrospeck-purple: #8B5CF6;
--retrospeck-indigo: #6366F1;
--retrospeck-deep-purple: #7C3AED;

/* Accent - Glasses & Highlights */
--retrospeck-amber: #F59E0B;
--retrospeck-gold: #FBBF24;

/* Neutrals */
--retrospeck-white: #FAFAFA;
--retrospeck-night: #0A0A0B;

/* Supporting */
--retrospeck-green: #22C55E;  /* Success/insights */
--retrospeck-pink: #EC4899;   /* Hearts/votes */
```

### Typography Pairing
- **Headlines**: DM Sans Bold
- **Body**: DM Sans Regular
- **Code/Technical**: JetBrains Mono

### Logo Variations Needed

1. **Full Logo**: Retrospeck character + wordmark
2. **Icon Only**: Just the owl face with glasses (square format)
3. **Horizontal**: Character beside wordmark
4. **Vertical**: Character above wordmark
5. **Favicon**: 16x16, 32x32, 48x48 simplified owl with glasses

---

## Character Personality Traits
(Guide the character's expressions and poses)

- **Wise but not stuffy**: Knowledgeable but approachable
- **Curious**: Always interested in learning
- **Encouraging**: Supportive cheerleader, never judgmental
- **Pattern-finder**: Gets excited about discovering trends
- **Helpful guide**: Like a friendly facilitator
- **Night owl**: Active, energetic (despite being nocturnal)
- **Organized**: Loves notes, lists, and structure
- **Collaborative**: Team-focused, brings people together

---

## Use Cases in App

### Navigation & Branding
- App icon/favicon
- Login page header
- Dashboard header
- Loading screens

### Empty States
- "No boards yet" with Retrospeck encouraging
- "No cards in this list" with Retrospeck suggesting adding one
- "Loading..." with Retrospeck adjusting glasses

### Celebrations & Milestones
- First board created
- 10 retrospectives completed
- 100 cards created
- High engagement retro

### Error States
- 404 page: "Even Retrospeck can't find that page!"
- Connection lost: "Retrospeck is trying to reconnect..."
- Error: "Oops! Retrospeck spotted an issue"

### Onboarding
- Welcome tour guide
- Feature explanations
- First retro walkthrough

---

## Animation Possibilities

### Micro-interactions
- Glasses sliding up when thinking
- Wings flapping when excited
- Head turning to look at cursor
- Eyes following mouse movement
- Feathers ruffling on hover

### Transitions
- Flying in from side (page load)
- Perching down from top (modal appear)
- Taking notes while user types
- Discovering something (insight notification)

---

## Reference Inspirations

### Character Style References
- **Duolingo Owl (Duo)**: Friendly, consistent mascot integration
- **Headspace Characters**: Calm, approachable, modern
- **Slack Slackbot**: Helpful, non-intrusive assistant
- **Notion Icons**: Clean, simple, professional yet friendly

### Visual Style References
- Modern flat design with subtle gradients
- Soft shadows for depth
- Clean, vector-based artwork
- Scalable from 16px to large formats
- Works in light and dark modes

---

## File Deliverables Needed

### Static Assets
- [ ] Character sheet (front, side, back, ¾ views)
- [ ] Expression sheet (8-10 emotions)
- [ ] App icon set (16px, 32px, 64px, 128px, 256px, 512px)
- [ ] Logo variations (full, icon, horizontal, vertical)
- [ ] Social media headers (Twitter, LinkedIn)
- [ ] Open Graph images (1200x630px)

### Animated Assets (Optional, Future)
- [ ] Simple CSS animations (bounce, think, celebrate)
- [ ] Lottie files for key interactions
- [ ] GIF reactions for notifications

### Format Requirements
- Vector: SVG, AI, or Figma
- Raster: PNG with transparency (various sizes)
- All assets: Light and dark mode versions

---

## Brand Voice Examples
(How Retrospeck "speaks" in the app)

### Encouraging
- "Great insight! 🦉"
- "Retrospeck sees a pattern here..."
- "Your team is making progress!"

### Helpful
- "Need help getting started?"
- "Retrospeck suggests adding a template"
- "Try the Mad/Sad/Glad format"

### Celebratory
- "Hoot hoot! 10 retros completed! 🎉"
- "Your team's on fire! 🔥"
- "Another sprint, another learning!"

### Gentle Nudges
- "Retrospeck noticed you haven't voted yet"
- "Quiet retro today?"
- "Don't forget to share action items"

---

## Do's and Don'ts

### ✅ DO
- Keep it friendly and approachable
- Make glasses prominent (signature feature)
- Use warm, inviting colors
- Show various helpful expressions
- Maintain consistent style across all uses
- Make it scalable (works at any size)

### ❌ DON'T
- Make it scary or intimidating
- Overly complex details (keep it simple)
- Clash with purple/amber color scheme
- Make it look childish or unprofessional
- Hide behind too much detail
- Use competing colors

---

## Success Criteria

The Retrospeck character design is successful if:
1. ✅ Instantly recognizable (glasses + owl)
2. ✅ Professional enough for enterprise teams
3. ✅ Friendly enough to feel approachable
4. ✅ Unique compared to other SaaS mascots
5. ✅ Scalable from favicon to billboard
6. ✅ Conveys wisdom, learning, and reflection
7. ✅ Makes users smile
8. ✅ Reinforces the "hindsight/seeing clearly" metaphor

---

**Created for:** Retrospeck - Agile Retrospective Application  
**Brand Colors:** Violet (#8B5CF6) + Amber (#F59E0B)  
**Tagline:** "See your sprints more clearly"  
**Version:** 1.0 | January 2026

