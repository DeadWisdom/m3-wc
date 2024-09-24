# m3-wc

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.12. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Approaches

- HTML-first
- JS-first
- Page-like
- App-like

## Progressive Enhancement

- HTML
- HTML + CSS
- HTML + CSS + CUSTOM ELEMENTS
- HTML + CSS + CUSTOM ELEMENTS + Polyfills
- HTML + CSS + CUSTOM ELEMENTS + Polyfills + JS

### Single Page App (SPA)

- JS + Bundler + CSR
- JS + Bundler + CSR + SSR
- TypeScript + Compiler + Bundler + JSX + CSR + SSR

## Progressive Web App (PGA)

- CUSTOM ELEMENTS + HTML + CSS
- CUSTOM ELEMENTS + HTML + CSS + Platform Features

## NOSCRIPT

- HTML + CSS (Strict)
- HTML + Fallback CSS (Afterthought)

## A11y

- SIMPLE + HTML + CSS
- HTML + CSS + CUSTOM ELEMENTS (Thoughtfully Made)

## Composition

- HTML
- JSON

HTML allows much more rich composition and reflects the DOM, so when developing components, we
should be starting here.

JSON is best for integrating with service and can be very easy to hold in your head. Most developers
feel very safe with JSON, whereas HTML takes much more experience to get comfortable with. However
there is a tremendous amount of work transforming and consuming it for components, which need to be
compatible. This adds to an incredible amount of coupling. Whereas HTML rarely demands this, and is
generally hyper-modular. By focusing on JSON, one invariably re-invents patterns already well
defined in the platform.

## M3-WC Approach

- Progressive Web App
- A11y
- Support NOSCRIPT Fallback

### Meaning

- Compose with HTML first
- Support JSON configuration where useful
- We assume CUSTOM ELEMENTS are available and therefore JS is available
- However it's HTML-first because the source is always HTML, we use HTML as the center of our composition
- CUSTOM ELEMENTS may dominate the DOM tree, but could sparsely populate it, or in fact be absent
- For App-Like, NOSCRIPT really doesn't make sense, so ignored
- For Page-Like, consumers are free to start with a NOSCRIPT Fallback CSS
- We are not into making complicated components like select 'n stuff, let's just style that

## Connected Topics

- Accessibility
- Platform Features
- Server Side Rendering
- Client Side Rendering
- DOM Update Strategies
  - Imperative Updates
  - Functional Updates
  - Reactive Updates
- Compilation