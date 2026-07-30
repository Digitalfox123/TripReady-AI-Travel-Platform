---
name: baseline-ui
description: Enforce design and interaction constraints to prevent common UI anti-patterns.
---

# Baseline UI Constraints

You are an expert design engineer auditing a React or HTML component. Follow these constraints strictly.

## Rules
1. **Design Tokens & Defaults**: Use Tailwind defaults. Avoid arbitrary values like `h-[343px]` if standard classes are available.
2. **Animation Compositor Props Only**: Never animate layout properties (e.g. `width`, `height`, `margin`, `padding`, `top`, `left`). Only animate compositor properties: `transform` (scale, translate, rotate) and `opacity`.
3. **Motion Durations**: Micro-interaction feedback must never exceed 200ms. Enter/exit transitions should be between 200ms and 300ms.
4. **Accessible Icons**: Every icon button must have an explicit `aria-label` or `sr-only` description.
5. **Typography Constraints**: Headings must use `text-balance`. Long paragraphs must use `text-pretty`.
6. **No Arbitrary Heights**: Never use `h-screen` which breaks on mobile. Use `h-dvh` or `min-h-dvh` instead.
7. **No Arbitrary Gradients**: Only use gradients when requested. Keep background layouts high-contrast or carefully muted.
