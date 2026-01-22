# Etheral Shadow Component Demo

A beautiful animated shadow overlay component built with React, TypeScript, Tailwind CSS, and Framer Motion.

## Setup

```bash
# Navigate to the project
cd react-setup

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## Component Usage

```tsx
import { EtheralShadow } from "@/components/ui/etheral-shadow";

// Basic usage
<EtheralShadow
  color="rgba(128, 128, 128, 1)"
  animation={{ scale: 100, speed: 90 }}
  noise={{ opacity: 1, scale: 1.2 }}
  sizing="fill"
/>

// With custom content
<EtheralShadow
  color="rgba(139, 92, 246, 1)"
  animation={{ scale: 80, speed: 60 }}
  noise={{ opacity: 0.8, scale: 1 }}
  sizing="fill"
>
  <h1 className="text-7xl font-bold text-white">Your Title</h1>
</EtheralShadow>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `'rgba(128, 128, 128, 1)'` | Background color for the shadow effect |
| `animation` | `{ scale: number, speed: number }` | `undefined` | Animation configuration |
| `noise` | `{ opacity: number, scale: number }` | `undefined` | Noise overlay configuration |
| `sizing` | `'fill' \| 'stretch'` | `'fill'` | How the mask image is sized |
| `className` | `string` | `undefined` | Additional CSS classes |
| `style` | `CSSProperties` | `undefined` | Additional inline styles |
| `children` | `React.ReactNode` | `undefined` | Content to display in the center |

## Animation Config

- `scale`: Controls the intensity of the displacement effect (1-100)
- `speed`: Controls the animation speed (1-100, higher = faster)

## Noise Config

- `opacity`: Controls the noise overlay opacity (0-1)
- `scale`: Controls the size of the noise pattern
