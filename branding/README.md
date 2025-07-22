# 🎨 SubscriptN Branding & Design System

This folder contains the official branding assets and design system for SubscriptN.

## 📁 Contents

- `colors.json` - Complete color palette with light/dark mode variants
- `README.md` - This file (usage guidelines)

## 🎯 Color Palette Overview

Our color palette is inspired by the visual heritage of BTCPay Server (green) and Bitcoin Connect (blue), creating a unique and statistically rare combination that's comfortable for the eyes and fully dark mode compatible.

### Primary Colors
- **Forest Green** (`#2D5A3D`) - BTCPay Server inspiration
- **Navy Blue** (`#1E3A8A`) - Bitcoin Connect inspiration  
- **Teal** (`#0F766E`) - Unique accent color

### Key Features
- ✅ **Statistically Rare** - Uncommon color combination
- ✅ **Eye Comfort** - High contrast ratios
- ✅ **Dark Mode Ready** - Complete dark mode variants
- ✅ **Accessibility** - WCAG compliant contrast ratios
- ✅ **Brand Fusion** - Honors both BTCPay Server and Bitcoin Connect

## 🚀 Usage Guidelines

### In CSS/Tailwind
```css
/* Light mode */
--primary-green: #2D5A3D;
--primary-blue: #1E3A8A;
--primary-teal: #0F766E;

/* Dark mode */
--primary-green: #10B981;
--primary-blue: #3B82F6;
--primary-teal: #14B8A6;
```

### In Components
```jsx
// Primary button
<button className="bg-[#2D5A3D] hover:bg-[#1E3A8A]">
  Primary Action
</button>

// Secondary button  
<button className="bg-[#1E3A8A] hover:bg-[#0F766E]">
  Secondary Action
</button>
```

### Gradients
```css
/* Primary gradient */
background: linear-gradient(135deg, #2D5A3D 0%, #1E3A8A 100%);

/* Logo gradient */
background: linear-gradient(135deg, #2D5A3D 0%, #0F766E 50%, #1E3A8A 100%);
```

## 📋 Color Usage Rules

### Buttons
- **Primary**: Use forest green (`#2D5A3D`)
- **Secondary**: Use navy blue (`#1E3A8A`)
- **Accent**: Use teal (`#0F766E`)

### Navigation
- **Active**: Forest green
- **Hover**: Navy blue
- **Background**: Surface color

### Text
- **Headings**: Primary text color
- **Body**: Primary text color
- **Captions**: Secondary text color

### Cards & Surfaces
- **Background**: Surface color
- **Borders**: Border color

## 🌙 Dark Mode Implementation

All colors have carefully chosen dark mode counterparts that maintain the same visual hierarchy while being easier on the eyes in low-light conditions.

## 📐 Accessibility

All color combinations meet WCAG AA standards for contrast ratios, ensuring the application is accessible to users with visual impairments.

## 🔄 Version History

- **v1.0.0** (2025-07-15) - Initial color palette creation

---

*This design system ensures consistent branding across all SubscriptN interfaces while honoring the Bitcoin ecosystem's visual heritage.* 