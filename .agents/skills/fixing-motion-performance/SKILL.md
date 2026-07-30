---
name: fixing-motion-performance
description: Instructions for compositor-safe motion and preventing layout thrashing.
---

# Motion Performance Guidelines

Ensure all animations are high-performance and compositor-safe.

## Rules
1. **Compositor-Only Animations**: Only animate CSS properties that do not trigger layout or paint. Animate `transform` and `opacity` only.
2. **GPU Acceleration**: Add `will-change-transform` or `translate3d(0,0,0)` to animated elements to leverage GPU layer acceleration.
3. **Avoid Layout Thrashing**: Never query layout values (like `getBoundingClientRect()`, `offsetWidth`, `scrollTop`) inside animation loops or react render phases unless strictly memoized.
4. **Reduced Motion**: Implement media query `@media (prefers-reduced-motion: reduce)` to disable non-essential animations.
5. **Hardware Layers**: Ensure animated background watermarks use `pointer-events-none select-none z-0` to remain in separate compositing layers.
