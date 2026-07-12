# Roots & Affixes — A Word-Builder Notebook

A personal study tool for recording and reviewing word roots and affixes from *Merriam-Webster's Vocabulary Builder* (Second Edition).

**Live Site**: https://andrewyy5178.github.io/word-roots/

## Features

- **Word Root Cards** — Browse 8 root cards (Unit 1: BENE, AM, BELL, PAC, CRIM, PROB, GRAV, LEV) displayed as liquid glass cards with vocabulary words, definitions, IPA pronunciations, and usage notes
- **Interactive Quizzes** — 120 quizzes covering all 30 units with 5 question types: Synonym, Analogy, Indicate (Same/Different), Match, and Fill-in-the-blank
- **Review Quizzes** — 28 comprehensive unit reviews
- **Flashcards** — Daily word review with EN↔中 modes, tap-to-reveal, shuffle, and per-unit filtering
- **Annotations** — Select any word to add a Chinese note (gold) or a plain highlight (mint); syncs across devices via a Cloudflare Worker
- **Search** — Find roots by name, meaning, or any vocabulary word from the book
- **A–Z / Unit Filter** — Browse roots alphabetically or by unit
- **Word Details** — Click any vocabulary word for US/UK IPA pronunciation, definition, example sentence, and etymology
- **Cross-links** — Jump from a card to its quizzes, and from a quiz back to its root cards
- **Liquid Glass Design** — Glassmorphism UI with deep teal and warm white color scheme

## Tech Stack

- Single-file HTML with inline CSS and JavaScript
- Zero dependencies, zero build steps
- Google Fonts: Playfair Display, Inter
- GitHub Pages deployment

## Data

- **Word roots**: 8 entries (Unit 1 complete) with full word details, plus concise Chinese glosses for 36 words (`WORD_CN`)
- **Quizzes**: 120 quizzes (Unit 1–30, four per unit) with complete answer keys — every question is answerable
- **Review quizzes**: 28 unit reviews
- **CN translations**: Chinese for all options, fill word banks, and indicate pairs
- **Data source**: quiz questions, answer keys and word banks re-extracted directly from the EPUB

All quiz data is extracted from the EPUB source and stored in `quiz-data.js`.

## Design

Part of the **AndDream** brand. Colors: deep teal (`#00859F`) with warm white (`#F8F4E9`). Typography: Cochin (title), Snell Roundhand (subtitle), Big Caslon (root display), Inter (UI).

## Usage

This is a personal educational tool. See the **How to Use** section on the site for full instructions. See **Terms** for usage and attribution.

## License

All book content (questions, definitions, examples) is sourced from *Merriam-Webster's Vocabulary Builder* by Mary Wood Cornog, © Merriam-Webster, Incorporated. This site is for personal, non-commercial educational use only.
