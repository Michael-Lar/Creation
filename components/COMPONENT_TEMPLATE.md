# Component Structure Template

This document defines the standard structure for React components in this codebase.

## Standard Component Structure

```typescript
'use client'; // Only if component uses client-side features

// 1. Imports (grouped by type)
// React imports
import { useState, useEffect, useRef, useCallback, memo } from 'react';
// Next.js imports
import Link from 'next/link';
import Image from 'next/image';
// Third-party imports
import { gsap } from '@/utils/gsap';
// Internal imports (hooks, utils, constants, types)
import { useScrollListener } from '@/hooks/useScrollPosition';
import { SCROLL, TIMING } from '@/constants/ui';
import { TeamMember } from '@/types/models';

// 2. Constants/Data (if shared or large, otherwise inside component)
const CONSTANT_VALUE = 'value';

// 3. Type Definitions
interface ComponentProps {
  requiredProp: string;
  optionalProp?: number;
  callbackProp?: () => void;
}

// 4. Component Function
function ComponentName({ 
  requiredProp, 
  optionalProp = defaultValue, 
  callbackProp 
}: ComponentProps) {
  // 4.1 Hooks (in order: state, refs, custom hooks, effects, callbacks)
  
  // State hooks
  const [state, setState] = useState<Type>(initialValue);
  
  // Refs
  const elementRef = useRef<HTMLElement>(null);
  
  // Custom hooks
  const customHookValue = useCustomHook();
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Callbacks (memoized if needed)
  const handleClick = useCallback(() => {
    // Callback logic
  }, [dependencies]);
  
  // 4.2 Derived values (useMemo if expensive)
  const derivedValue = useMemo(() => {
    return computeValue();
  }, [dependencies]);
  
  // 4.3 Event handlers (if not memoized)
  const handleEvent = () => {
    // Handler logic
  };
  
  // 4.4 Local constants (component-specific)
  const localConstant = 'value';
  
  // 5. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}

// 6. Export (with memo if component is expensive and props are stable)
export default memo(ComponentName);
// OR for simple components:
// export default ComponentName;
```

## Rules

### 1. Prop Destructuring
- Always destructure props in function parameters
- Use inline defaults for optional props: `{ prop = defaultValue }`
- Type props with interface: `{ prop }: ComponentProps`

### 2. Export Pattern
- Use `export default function` for simple components
- Use `function ComponentName` + `export default memo(ComponentName)` for memoized components
- Only use `memo()` for expensive components with stable props

### 3. Interface Placement
- Always place interfaces/types before the component function
- Name interfaces: `ComponentNameProps`

### 4. Hook Ordering
1. State hooks (`useState`)
2. Refs (`useRef`)
3. Custom hooks
4. Effects (`useEffect`)
5. Callbacks (`useCallback`, `useMemo`)

### 5. Constants/Data
- Place large/shared constants before component
- Place component-specific constants inside component (before return)

### 6. Comments
- Use comments to separate logical sections
- Document complex logic or non-obvious behavior

## Examples

### Simple Component (no props)
```typescript
'use client';

import { useRef } from 'react';

export default function SimpleComponent() {
  const ref = useRef<HTMLElement>(null);
  
  return <div ref={ref}>Content</div>;
}
```

### Component with Props
```typescript
'use client';

import { useState, useRef } from 'react';

interface ComponentProps {
  title: string;
  count?: number;
  onAction?: () => void;
}

export default function ComponentWithProps({ 
  title, 
  count = 0, 
  onAction 
}: ComponentProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  
  return <div ref={ref}>{title}</div>;
}
```

### Memoized Component
```typescript
'use client';

import { memo, useState } from 'react';

interface ExpensiveComponentProps {
  data: DataType[];
}

function ExpensiveComponent({ data }: ExpensiveComponentProps) {
  const [filter, setFilter] = useState('');
  
  // Expensive computation
  const filtered = data.filter(/* ... */);
  
  return <div>{/* ... */}</div>;
}

export default memo(ExpensiveComponent);
```
