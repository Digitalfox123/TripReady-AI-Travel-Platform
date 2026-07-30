---
name: fixing-accessibility
description: Enforce accessibility rules, WCAG 2.1 compliance, and semantic HTML.
---

# Accessibility Guidelines

Ensure all components and layouts are fully accessible.

## Rules
1. **Semantic Elements**: Use proper HTML5 tags (`<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`).
2. **Keyboard Navigation**: All interactive elements must be focusable via `tabIndex` and support `Enter`/`Space` activation.
3. **Contrast Ratios**: Keep text contrast above WCAG AA limits (4.5:1 for normal text, 3:1 for large text).
4. **ARIA Attributes**: Use correct `aria-expanded`, `aria-controls`, `aria-hidden`, and `role` properties for drop-downs, accordions, and dialogs.
5. **Alt Attributes**: All `<img>` tags must have an informative `alt` attribute (or `alt=""` if strictly decorative).
