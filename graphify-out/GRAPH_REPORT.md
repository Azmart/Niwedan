# Graph Report - .  (2026-07-31)

## Corpus Check
- Corpus is ~14,103 words - fits in a single context window. You may not need a graph.

## Summary
- 237 nodes · 285 edges · 29 communities (22 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Niwedan Petition UI
- Workspace Scripts
- Flower Field Dependencies
- Gallery Dependencies
- Niwedan Dependencies
- Niwedan Visual Shell
- Multi-App Architecture
- Notification API
- Flower Field UI
- CSS Build Tooling
- Vercel Deployment Config
- Consent Notification Model
- Gallery Content Flow
- Flower App Icon
- Private Archive Suite
- Niwedan Heart Icon
- Private Media Architecture
- Bilingual Content System
- Reduced Motion Support
- Production Deployment Plan
- Authenticated Media Delivery
- Deployment Operations
- Music Consent Gate

## God Nodes (most connected - your core abstractions)
1. `scripts` - 14 edges
2. `createNotifyHandler()` - 8 edges
3. `Reveal()` - 6 edges
4. `SectionLabel()` - 6 edges
5. `Flower Field App` - 6 edges
6. `Gallery App` - 5 edges
7. `scripts` - 4 edges
8. `scripts` - 4 edges
9. `scripts` - 4 edges
10. `ParticleField()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Niwedan` --semantically_similar_to--> `Niwedan`  [INFERRED] [semantically similar]
  CLAUDE.md → AGENTS.md
- `Discord Notification Endpoint` --semantically_similar_to--> `Optional Discord Notification`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `createNotifyHandler()` --indirect_call--> `request()`  [INFERRED]
  server/notify-choice.js → tests/notify-choice.test.js
- `Flower Field Main Entry` --implements--> `Flower Field App`  [INFERRED]
  apps/flower-field/index.html → info_files/wiki/architecture.md
- `Gallery Main Entry` --implements--> `Gallery App`  [INFERRED]
  apps/gallery/index.html → info_files/wiki/architecture.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Workspace Applications** — info_files_wiki_architecture_gallery, info_files_wiki_architecture_niwedan, info_files_wiki_architecture_flower_field [EXTRACTED 1.00]
- **Single-Origin Production Build Flow** — info_files_wiki_architecture_production_build, info_files_wiki_architecture_gallery, info_files_wiki_architecture_niwedan, info_files_wiki_architecture_flower_field [EXTRACTED 1.00]
- **Flower Icon Composition** — apps_flower_field_public_flower_blossom, apps_flower_field_public_flower_stem_leaf, apps_flower_field_public_flower_dark_background [EXTRACTED 1.00]

## Communities (29 total, 7 thin omitted)

### Community 0 - "Niwedan Petition UI"
Cohesion: 0.11
Nodes (22): ChoicePanel(), Evidence(), tones, FinalNote(), COLORS, HeartBurst(), Modal(), Parallax() (+14 more)

### Community 1 - "Workspace Scripts"
Cohesion: 0.07
Nodes (26): concurrently, description, devDependencies, concurrently, engines, node, name, private (+18 more)

### Community 2 - "Flower Field Dependencies"
Cohesion: 0.10
Nodes (20): dependencies, react, react-dom, devDependencies, vite, @vitejs/plugin-react, engines, node (+12 more)

### Community 3 - "Gallery Dependencies"
Cohesion: 0.10
Nodes (20): dependencies, react, react-dom, devDependencies, vite, @vitejs/plugin-react, engines, node (+12 more)

### Community 4 - "Niwedan Dependencies"
Cohesion: 0.11
Nodes (18): dependencies, framer-motion, react, react-dom, description, engines, node, react (+10 more)

### Community 5 - "Niwedan Visual Shell"
Cohesion: 0.15
Nodes (12): App(), CursorGlow(), Footer(), Hero(), MusicPlayer(), heartPath(), makeGlow(), ParticleField() (+4 more)

### Community 6 - "Multi-App Architecture"
Cohesion: 0.18
Nodes (13): Flower Field Main Entry, Gallery Main Entry, Niwedan Main Entry, Flower Field App, Gallery App, Niwedan App, Single-Origin Production Build, Niwedan Workspace (+5 more)

### Community 7 - "Notification API"
Cohesion: 0.30
Nodes (8): POST, config, createNotifyHandler(), isSameSiteRequest(), json(), MESSAGES, validWebhookUrl(), request()

### Community 8 - "Flower Field UI"
Cohesion: 0.22
Nodes (4): FlowerField(), spots, types, MusicPlayer()

### Community 9 - "CSS Build Tooling"
Cohesion: 0.18
Nodes (11): devDependencies, autoprefixer, postcss, tailwindcss, vite, @vitejs/plugin-react, vite, @vitejs/plugin-react (+3 more)

### Community 10 - "Vercel Deployment Config"
Cohesion: 0.29
Nodes (6): buildCommand, framework, headers, outputDirectory, rewrites, $schema

### Community 11 - "Consent Notification Model"
Cohesion: 0.40
Nodes (5): Consent-First Design, Optional Discord Notification, Niwedan, Niwedan, Discord Notification Endpoint

### Community 13 - "Flower App Icon"
Cohesion: 0.50
Nodes (4): Layered Pink Flower Blossom, Rounded Dark Navy Background, Flower Field App Icon, Green Stem and Leaf

### Community 14 - "Private Archive Suite"
Cohesion: 0.50
Nodes (4): Private Archive Indexing Policy, Flower Field, Our Little Archive, Niwedan

### Community 15 - "Niwedan Heart Icon"
Cohesion: 0.50
Nodes (4): Rounded Navy Background, Rose-to-Cyan Heart Gradient, Gradient Heart Emblem, Niwedan Favicon

### Community 16 - "Private Media Architecture"
Cohesion: 0.50
Nodes (4): Private Content Access Model, Asura Signed or Proxied Delivery, Site-Wide Authentication, Sanity Content Integration

## Knowledge Gaps
- **101 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+96 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `CSS Build Tooling` to `Niwedan Dependencies`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _101 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Niwedan Petition UI` be split into smaller, more focused modules?**
  _Cohesion score 0.10810810810810811 - nodes in this community are weakly interconnected._
- **Should `Workspace Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Flower Field Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Gallery Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Niwedan Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._