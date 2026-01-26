# @boxicons/react

React icon library built from Boxicons SVG files with full tree-shaking support.

## Installation

```bash
npm install @boxicons/react
# or
yarn add @boxicons/react
# or
pnpm add @boxicons/react
```

## Usage

### Basic Usage

```tsx
import { Alarm, Twitter, Home } from '@boxicons/react';

function App() {
  return (
    <div>
      <Alarm />
      <Twitter />
      <Home />
    </div>
  );
}
```

### Icon Packs

Each icon can have multiple variants. Use the `pack` prop to switch between them:

- **basic** - Outline/regular style icons (default for most icons)
- **filled** - Solid/filled style icons
- **brands** - Brand/logo icons (default for brand icons like Twitter, Facebook, etc.)

```tsx
import { Alarm } from '@boxicons/react';

function App() {
  return (
    <div>
      {/* Basic/outline style (default) */}
      <Alarm />
      
      {/* Filled style */}
      <Alarm pack="filled" />
    </div>
  );
}
```

### Sizing

#### Size Presets

Use the `size` prop for convenient preset sizes:

```tsx
<Alarm size="xs" />   {/* 16px */}
<Alarm size="sm" />   {/* 20px */}
<Alarm size="base" /> {/* 24px (default) */}
<Alarm size="md" />   {/* 36px */}
<Alarm size="lg" />   {/* 48px */}
<Alarm size="xl" />   {/* 64px */}
<Alarm size="2xl" />  {/* 96px */}
<Alarm size="3xl" />  {/* 128px */}
<Alarm size="4xl" />  {/* 256px */}
<Alarm size="5xl" />  {/* 512px */}
```

#### Custom Sizing

For custom sizes, use `width` and `height` props (overrides `size`):

```tsx
<Alarm width={32} height={32} />
<Alarm width="48" height="48" />
<Alarm width="2rem" height="2rem" />
```

### Colors

Use the `fill` prop to change the icon color (defaults to `currentColor`):

```tsx
<Alarm fill="#ff0000" />
<Alarm fill="rgb(0, 128, 255)" />
<Alarm fill="currentColor" /> {/* Inherits text color */}
```

### Opacity

Control transparency with the `opacity` prop:

```tsx
<Alarm opacity={0.5} />
<Alarm opacity="0.75" />
```

### Flip

Mirror icons horizontally or vertically:

```tsx
<Alarm flip="horizontal" /> {/* Mirrors left-to-right */}
<Alarm flip="vertical" />   {/* Mirrors top-to-bottom */}
```

### Rotate

Rotate icons by any degree:

```tsx
<Alarm rotate={45} />      {/* Rotates 45 degrees */}
<Alarm rotate="90" />      {/* Rotates 90 degrees */}
<Alarm rotate="180deg" />  {/* Also accepts "deg" suffix */}
```

### Remove Padding

Remove the default 2px padding around icons for a tighter fit:

```tsx
<Alarm removePadding />    {/* Crops padding, viewBox becomes "2 2 20 20" */}
```

### Combining Props

All props can be combined:

```tsx
<Alarm 
  pack="filled"
  fill="#ffffff"
  opacity={0.8}
  size="lg"
  flip="horizontal"
  rotate={45}
  className="my-icon"
  style={{ margin: '8px' }}
/>
```

### Standard SVG Props

All standard SVG props are supported and passed through to the underlying `<svg>` element:

```tsx
<Alarm 
  className="icon"
  id="my-alarm-icon"
  aria-label="Alarm"
  role="img"
  onClick={() => console.log('clicked')}
/>
```

### Ref Forwarding

Refs are forwarded to the SVG element:

```tsx
import { useRef } from 'react';
import { Alarm } from '@boxicons/react';

function App() {
  const iconRef = useRef<SVGSVGElement>(null);
  
  return <Alarm ref={iconRef} />;
}
```

## Tree Shaking

This library is fully tree-shakeable. Only the icons you import will be included in your final bundle.

```tsx
// ✅ Only Alarm is bundled
import { Alarm } from '@boxicons/react';

// ✅ Direct import also works
import { Alarm } from '@boxicons/react/icons/Alarm';
```

## Available Icons

The library includes all Boxicons:
- **1884** basic (outline) icons
- **1884** filled icons  
- **295** brand icons

### Naming Convention

Icon names are converted from kebab-case SVG filenames to PascalCase:

| SVG File | Component Name |
|----------|---------------|
| `bx-alarm.svg` | `<Alarm />` |
| `bx-alarm-clock.svg` | `<AlarmClock />` |
| `bx-twitter.svg` | `<Twitter />` |
| `bx-8-ball.svg` | `<Icon8Ball />` |

**Note:** Icons starting with numbers are prefixed with "Icon" (e.g., `Icon8Ball`, `Icon500px`).

**Note:** Some icons have the "Icon" suffix to avoid conflicts with reserved words (e.g., `ReactIcon` for the React logo).

## TypeScript

Full TypeScript support with exported types:

```tsx
import type { BoxIconProps, IconPack, IconSize, FlipDirection } from '@boxicons/react';
```

### BoxIconProps

```tsx
interface BoxIconProps extends SVGProps<SVGSVGElement> {
  pack?: 'basic' | 'filled' | 'brands';
  fill?: string;
  opacity?: number | string;
  width?: number | string;
  height?: number | string;
  size?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  flip?: 'horizontal' | 'vertical';
  rotate?: number | string;
  removePadding?: boolean;
}
```


# @boxicons/react
