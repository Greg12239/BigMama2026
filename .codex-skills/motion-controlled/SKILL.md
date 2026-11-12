# Motion Controlled Skill

## When to use
Only when user asks for animation/motion.

## Default implementation
Use CSS and vanilla JS first.

## Allowed patterns
- subtle neon pulse,
- loader polish,
- menu-card hover/tap,
- sticky CTA entrance,
- simple scroll reveal.

## Forbidden by default
- GSAP,
- Anime.js,
- Lottie runtime,
- Three.js,
- Framer Motion,
- scroll hijacking,
- heavy WebGL.

## Required approval before coding
State:
- exact animated element,
- exact CSS/JS files,
- whether reduced-motion is supported,
- whether any library is needed,
- performance risk.

## Reduced motion
Always respect:
`@media (prefers-reduced-motion: reduce)`
