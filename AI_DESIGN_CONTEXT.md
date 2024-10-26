# Minimal Design System - AI Meal Planner

## Design Philosophy

The AI Meal Planner embraces minimalism through:

- Clean typography
- Purposeful white space
- Subtle shadows and depth
- Restrained color palette
- Essential interactions only
- Using shadcn/ui

## Color System

### Primary Colors

```css
--primary: 221.2 83.2% 53.3%;
--primary-foreground: 210 40% 98%;

/* Accent colors - used sparingly */
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;
```

### Neutral Colors

```css
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--card: 0 0% 100%;
--card-foreground: 222.2 84% 4.9%;
--popover: 0 0% 100%;
--popover-foreground: 222.2 84% 4.9%;
--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;
--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;
```

### Semantic Colors

```css
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 210 40% 98%;
--success: 142.1 76.2% 36.3%;
--success-foreground: 355.7 100% 97.3%;
--warning: 38 92% 50%;
--warning-foreground: 48 96% 89%;
```

## Typography

### Font Family

```css
--font-sans: "Inter", system-ui, sans-serif;
```

### Font Sizes

```css
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
```

## Spacing System

```css
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
```

## Component Guidelines

### Cards

```css
border-radius: var(--radius);
background: hsl(var(--card));
color: hsl(var(--card-foreground));
```

### Buttons

```css
/* Primary Button */
background: hsl(var(--primary));
color: hsl(var(--primary-foreground));
border-radius: var(--radius);

/* Secondary Button */
background: hsl(var(--secondary));
color: hsl(var(--secondary-foreground));
border-radius: var(--radius);
```

### Form Elements

```css
/* Input fields */
background: hsl(var(--background));
border: 1px solid hsl(var(--input));
border-radius: var(--radius);

/* Focus states */
outline: 2px solid hsl(var(--ring));
outline-offset: 2px;
```

## Layout Principles

### Grid System

- Use 4px grid
- Maintain consistent spacing
- Max content width: 1200px
- Standard padding: 1rem (mobile), 2rem (desktop)

### Responsive Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

## Animation Guidelines

### Transitions

```css
/* Standard transition */
transition: all 0.2s ease;
```

### Motion Principles

- Keep animations subtle
- Use for feedback only
- Maximum duration: 300ms
- Ease-in-out timing function

## Component Examples

### Meal Card

```jsx
<Card className="p-6 space-y-4">
  <div className="space-y-2">
    <h3 className="text-lg font-semibold">Meal Title</h3>
    <p className="text-sm text-primary-light">Preparation time • Calories</p>
  </div>
  <div className="grid grid-cols-3 gap-4">{/* Nutrition info */}</div>
</Card>
```

### Action Button

```jsx
<button
  className="px-4 py-2 bg-accent text-white rounded-lg 
                   hover:bg-accent-light transition-colors"
>
  Action Text
</button>
```

### Input Field

```jsx
<div className="space-y-2">
  <label className="text-sm font-medium">Label</label>
  <input className="w-full px-3 py-2 border rounded-lg" />
</div>
```

## User Interface Best Practices

### Content Hierarchy

1. Use consistent heading levels
2. Maintain readable line lengths (60-80 characters)
3. Group related information
4. Use white space to create visual hierarchy

### Interaction Design

1. Provide immediate feedback
2. Use hover states for interactive elements
3. Maintain touch targets (minimum 44x44px)
4. Keep primary actions visible

### Accessibility

1. Maintain color contrast (WCAG AA)
2. Include focus states
3. Use semantic HTML
4. Support keyboard navigation

### Loading States

1. Use subtle skeleton loading
2. Maintain layout stability
3. Show progress for longer operations
4. Preserve context during loading

## Error Handling Guidelines

### Visual Feedback

1. Clear error messages
2. Contextual help
3. Recovery actions
4. Consistent positioning

### Form Validation

1. Inline validation
2. Real-time feedback
3. Clear error states
4. Helpful resolution hints

This design system provides a foundation for creating a minimal, user-friendly meal planning application. All components and patterns should align with these guidelines to maintain consistency and usability throughout the application.
