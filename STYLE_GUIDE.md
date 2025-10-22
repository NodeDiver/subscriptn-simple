# SubscriptN Style Guide v0.2.0

**Last Updated**: October 21, 2025
**Design System**: Unified Orange/Amber Branding

---

## 🎨 Color Palette

### Primary Colors
```css
/* Orange/Amber Gradient (Primary Brand) */
--primary-from: #ea580c    /* orange-600 */
--primary-to: #d97706      /* amber-600 */
--primary-hover-from: #c2410c  /* orange-700 */
--primary-hover-to: #b45309    /* amber-700 */

/* Orange Accent Variations */
--orange-500: #f97316
--orange-600: #ea580c
--orange-700: #c2410c
--orange-800: #9a3412
--orange-900: #7c2d12

/* Amber Accent Variations */
--amber-100: #fef3c7
--amber-500: #f59e0b
--amber-600: #d97706
--amber-700: #b45309
--amber-900: #78350f

/* Red Accent */
--red-100: #fee2e2
--red-500: #ef4444
--red-600: #dc2626
--red-900: #7f1d1d
```

### Neutral Colors
```css
/* Light Mode */
--neutral-50: #fafafa
--neutral-100: #f5f5f5
--neutral-200: #e5e5e5
--neutral-300: #d4d4d4
--neutral-400: #a3a3a3
--neutral-600: #525252
--neutral-700: #404040
--neutral-800: #262626
--neutral-900: #171717   /* Dark text */

/* Dark Mode */
--bg-dark: #111827       /* neutral-900 */
--bg-dark-secondary: #1f2937
--text-dark: #ffffff
--text-dark-secondary: #d4d4d4
```

### Semantic Colors
```css
/* Backgrounds */
--bg-light: #ffffff
--bg-light-alt: from-neutral-50 to-white
--bg-dark: #111827
--bg-dark-alt: from-neutral-900 to-neutral-800

/* Text */
--text-primary-light: #171717        /* neutral-900 */
--text-secondary-light: #525252      /* neutral-600 */
--text-primary-dark: #ffffff
--text-secondary-dark: #d4d4d4       /* neutral-300 */

/* Borders */
--border-light: #e5e5e5              /* neutral-200 */
--border-dark: #404040               /* neutral-700 */
```

---

## 🔤 Typography

### Font Family
```css
/* Primary Font */
font-family: var(--font-manrope), system-ui, sans-serif;

/* Monospace (for code/technical) */
font-family: 'Roboto Mono', monospace;
```

### Heading Styles
```tsx
/* Hero Heading (H1) */
className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight"

/* Section Heading (H2) */
className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6"

/* Subsection Heading (H3) */
className="text-xl font-bold text-neutral-900 dark:text-white mb-2"

/* Card/Feature Heading */
className="text-lg font-semibold text-neutral-900 dark:text-white mb-2"
```

### Body Text Styles
```tsx
/* Large Body Text */
className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300"

/* Regular Body Text */
className="text-neutral-600 dark:text-neutral-400"

/* Small Text / Labels */
className="text-sm text-neutral-600 dark:text-neutral-400"

/* Extra Small / Helper Text */
className="text-xs text-neutral-500 dark:text-neutral-400"
```

### Special Text Effects
```tsx
/* Gradient Text (Orange) */
className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent"
```

---

## 🔲 Layout & Spacing

### Container Widths
```tsx
/* Standard Container */
className="max-w-7xl mx-auto"

/* Narrow Container (for text) */
className="max-w-3xl mx-auto"

/* Medium Container */
className="max-w-5xl mx-auto"
```

### Section Padding
```tsx
/* Standard Section */
className="py-16 px-4 sm:px-6 lg:px-8"

/* Hero Section */
className="pt-20 pb-16 px-4 sm:px-6 lg:px-8"

/* Tight Section */
className="py-12 px-4 sm:px-6 lg:px-8"
```

### Section Backgrounds
```tsx
/* Alternating Backgrounds */
/* Section 1 */ className="bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800"
/* Section 2 */ className="bg-white dark:bg-neutral-800"
/* Section 3 */ className="bg-neutral-50 dark:bg-neutral-900"
/* Section 4 */ className="bg-white dark:bg-neutral-800"
```

### Grids
```tsx
/* 3-Column Feature Grid */
className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"

/* 2-Column Grid */
className="grid md:grid-cols-2 gap-8"

/* 3-Column Equal */
className="grid md:grid-cols-3 gap-8"
```

---

## 🔘 Button Styles

### Primary Button (Orange Gradient)
```tsx
className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
```

### Secondary Button (Outlined)
```tsx
className="bg-white dark:bg-neutral-900 text-orange-600 dark:text-orange-500 px-8 py-4 rounded-xl font-bold text-lg border-2 border-orange-600 dark:border-orange-500 hover:bg-orange-50 dark:hover:bg-neutral-800 transition-all duration-200 shadow-lg hover:shadow-xl"
```

### Small Button
```tsx
className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
```

### Button with Effects
```tsx
/* Magnetic Pull + Glow */
className="... magnetic-pull glow-effect"
```

---

## 📦 Card Styles

### Feature Card
```tsx
className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl"
```

### Feature Card Icon Container
```tsx
/* Orange Icon */
className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-4"

/* Amber Icon */
className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center mb-4"

/* Red Icon */
className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center mb-4"
```

### Icon Colors
```tsx
/* Orange Icon */
className="w-6 h-6 text-orange-600"

/* Amber Icon */
className="w-6 h-6 text-amber-600 dark:text-amber-500"

/* Red Icon */
className="w-6 h-6 text-red-600 dark:text-red-500"
```

### Content Card
```tsx
className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-gray-700"
```

---

## 🔢 Badge & Label Styles

### Number Badge (Stats)
```tsx
className="text-4xl font-bold text-orange-600 dark:text-orange-400"
```

### Step Badge
```tsx
className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-orange-600 dark:text-orange-600"
```

---

## 🎭 Interactive Effects

### CSS Classes (from globals.css)
```css
/* Magnetic Pull Effect */
.magnetic-pull {
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.magnetic-pull:hover {
  transform: translateY(-2px) scale(1.02);
}

/* Glow Effect */
.glow-effect {
  position: relative;
  overflow: hidden;
}
.glow-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}
.glow-effect:hover::before {
  left: 100%;
}

/* Icon Rotate */
.icon-rotate {
  transition: transform 0.3s ease;
}
.icon-rotate:hover {
  transform: rotate(5deg);
}
```

### Transition Standards
```tsx
/* Standard Transition */
transition-all duration-200

/* Longer Transition */
transition-all duration-300

/* Shadow Transition */
shadow-lg hover:shadow-xl

/* Border Transition */
border-neutral-200 hover:border-orange-400
```

---

## 📐 Form Elements

### Input Fields
```tsx
className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors duration-200"
```

### Labels
```tsx
className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
```

### Error Messages
```tsx
className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md"
```

---

## 🎯 Component Patterns

### Hero Section Pattern
```tsx
<section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto text-center">
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
      Main Heading
      <br />
      <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
        Highlighted Text
      </span>
    </h1>
    <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-12 max-w-3xl mx-auto">
      Subtitle description
    </p>
  </div>
</section>
```

### CTA Button Group Pattern
```tsx
<div className="flex flex-wrap justify-center gap-4 mb-16">
  <Link
    href="/primary-action"
    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
  >
    Primary Action
  </Link>
  <Link
    href="/secondary-action"
    className="bg-white dark:bg-neutral-900 text-orange-600 dark:text-orange-500 px-8 py-4 rounded-xl font-bold text-lg border-2 border-orange-600 dark:border-orange-500 hover:bg-orange-50 dark:hover:bg-neutral-800 transition-all duration-200 shadow-lg hover:shadow-xl"
  >
    Secondary Action
  </Link>
</div>
```

### Feature Grid Pattern
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl">
    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-4">
      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {/* SVG path */}
      </svg>
    </div>
    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
      Feature Title
    </h3>
    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
      Feature description
    </p>
  </div>
</div>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* @media (min-width: 640px) */
md: 768px   /* @media (min-width: 768px) */
lg: 1024px  /* @media (min-width: 1024px) */
xl: 1280px  /* @media (min-width: 1280px) */
2xl: 1536px /* @media (min-width: 1536px) */
```

### Common Responsive Patterns
```tsx
/* Text Sizing */
text-sm md:text-base lg:text-lg
text-xl md:text-2xl lg:text-3xl
text-3xl md:text-4xl lg:text-5xl

/* Padding */
px-4 sm:px-6 lg:px-8
py-12 md:py-16 lg:py-20

/* Grid Columns */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## 🌓 Dark Mode Guidelines

### Always Include Dark Mode Classes
- Every text element: `text-neutral-900 dark:text-white`
- Every background: `bg-white dark:bg-neutral-800`
- Every border: `border-neutral-200 dark:border-neutral-700`
- Every icon: `text-orange-600 dark:text-orange-400`

### Dark Mode Color Adjustments
- Light backgrounds become: `dark:bg-neutral-800` or `dark:bg-neutral-900`
- Dark text becomes: `dark:text-white` or `dark:text-neutral-300`
- Borders become darker: `dark:border-neutral-700`
- Icons stay vibrant: Use same color or slightly lighter variant

---

## ✨ Animation Standards

### Hover Animations
- Buttons: Scale up slightly + shadow increase
- Cards: Border color change + shadow increase
- Icons: Rotate or scale

### Transition Timing
- Quick interactions: `duration-200` (200ms)
- Standard interactions: `duration-300` (300ms)
- Smooth fades: `duration-500` (500ms)

### Easing Functions
- Standard: `ease` or `ease-in-out`
- Button pull: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

---

## 🎯 Accessibility

### ARIA Labels
- Always add `aria-label` to links and buttons with context
- Mark decorative icons with `aria-hidden="true"`
- Use semantic HTML elements

### Contrast Requirements
- Text on light backgrounds: WCAG AAA (7:1 minimum)
- Text on dark backgrounds: WCAG AAA (7:1 minimum)
- Accent colors for icons only (not body text)

### Focus States
- All interactive elements must have visible focus states
- Use `focus:ring-2 focus:ring-orange-500` for form inputs
- Ensure keyboard navigation works

---

## 📋 Usage Checklist

When creating a new page or component, ensure:

- [ ] Uses warm orange/amber branding (no blue, green, or role-specific colors)
- [ ] Includes full dark mode support on all elements
- [ ] Uses Manrope font (already applied globally)
- [ ] Follows section background alternation pattern
- [ ] Buttons use orange gradient for primary actions
- [ ] Cards have hover states (border + shadow)
- [ ] Text sizing is responsive (sm/md/lg breakpoints)
- [ ] All transitions are smooth (duration-200 or duration-300)
- [ ] ARIA labels included for accessibility
- [ ] Icons use approved color variants (orange/amber/red)

---

**Note**: This style guide reflects the unified platform design implemented in October 2025. All new pages and components should follow these patterns for consistency.
