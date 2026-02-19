# Sprint 0.5: Design System Foundation

**Goal:** Build a complete, reusable UI primitive library so all Tailwind lives in base components, not in feature code. Establish the compositional patterns that Sprint 1-4 build on. Every view component becomes a consumer of the design system, not a creator of ad-hoc styles.

**Status:** NOT STARTED

---

## Why This Comes First

The audit revealed:
- **`src/renderer/shared/components/ui/` is completely empty** — zero UI primitives exist
- **81 raw `<input>` elements**, 16 raw `<select>`, 18 raw `<textarea>`, 74 raw `<label>` across feature code
- **71+ manually styled buttons** with duplicated Tailwind patterns
- **102 identical `<Loader2 className="h-4 w-4 animate-spin" />`** spinner copies across 46 files
- **18 Radix UI packages installed, only 1 actually imported** (react-dialog, in 3 files)
- **CVA (class-variance-authority) installed but never used**
- **`cn()` utility exists** and is used — the infrastructure is ready, just no components built

Doing Sprint 1/2 hardening without this means writing more ad-hoc Tailwind that we'd refactor in Sprint 3. Build the system first, consume it during hardening.

---

## Philosophy

> **Tailwind is written ONCE in base components. Feature code stays clean.**

```tsx
// BAD — Tailwind scattered across feature code
<button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm
  font-medium bg-primary text-primary-foreground hover:bg-primary/90
  disabled:pointer-events-none disabled:opacity-50 transition-colors">
  Save
</button>

// GOOD — Feature code is clean, semantic
<Button variant="primary" size="md">Save</Button>

// The Tailwind lives inside Button.tsx, written once
```

### Core Principles

1. **All Tailwind in primitives** — feature components compose with props, not className strings
2. **CVA for variants** — every component uses `cva()` for type-safe variant management
3. **Radix for behavior** — accessibility, keyboard nav, focus management come from Radix primitives
4. **`data-slot` for styling** — parent components can style children via slot selectors (shadcn v4 pattern)
5. **React 19 patterns** — no `forwardRef`, use `React.ComponentProps<"element">`, ref as regular prop
6. **Theme-aware via CSS vars** — components use `bg-primary`, `text-foreground` etc. (already in place)
7. **Compositional API** — compound components with dot notation: `<Grid.Row>`, `<Card.Header>`

---

## Tooling to Install

### MCP Servers

| Server | Purpose | Config |
|--------|---------|--------|
| **shadcn Official MCP** | Browse + install components from registry | `npx shadcn@latest mcp` |
| **Design Systems MCP** | Reference 188+ design system patterns | `https://design-systems-mcp.southleft.com/mcp` |

### Form Infrastructure

| Package | Purpose | Notes |
|---------|---------|-------|
| **@tanstack/react-form** | Form state management | Works with Zod v4 via Standard Schema (NO adapter needed) |

### Already Installed (Unused — Will Activate)

| Package | Current State | Sprint 0.5 Action |
|---------|--------------|-------------------|
| `class-variance-authority` | Installed, zero usage | Core of every component |
| `@radix-ui/react-dialog` | Used raw in 3 files | Wrap in `<Dialog>` primitive |
| `@radix-ui/react-alert-dialog` | Unused | Wrap in `<AlertDialog>` — replace hand-built `ConfirmDialog` |
| `@radix-ui/react-checkbox` | Unused | Wrap in `<Checkbox>` |
| `@radix-ui/react-collapsible` | Unused | Wrap in `<Collapsible>` |
| `@radix-ui/react-dropdown-menu` | Unused | Wrap in `<DropdownMenu>` |
| `@radix-ui/react-popover` | Unused | Wrap in `<Popover>` |
| `@radix-ui/react-progress` | Unused | Wrap in `<Progress>` — replace CSS-only `.progress-working` |
| `@radix-ui/react-scroll-area` | Unused | Wrap in `<ScrollArea>` — replace custom CSS scrollbar |
| `@radix-ui/react-select` | Unused | Wrap in `<Select>` — replace 16 raw `<select>` elements |
| `@radix-ui/react-separator` | Unused | Wrap in `<Separator>` — replace `.section-divider` CSS |
| `@radix-ui/react-slider` | Unused | Wrap in `<Slider>` |
| `@radix-ui/react-switch` | Unused | Wrap in `<Switch>` |
| `@radix-ui/react-tabs` | Unused | Wrap in `<Tabs>` |
| `@radix-ui/react-toast` | Unused | Wrap in `<Toast>` — replace hand-built toast system |
| `@radix-ui/react-tooltip` | Unused | Wrap in `<Tooltip>` — replace hand-built tooltips |
| `@radix-ui/react-slot` | Unused | Use in `<Button>` for `asChild` pattern |

---

## Component Inventory — What to Build

### Tier 1: Critical (most duplicated, block everything else)

| Component | Wraps | Variants | Evidence |
|-----------|-------|----------|----------|
| **Button** | `<button>` + Radix Slot | primary, secondary, destructive, ghost, outline, link / sm, md, lg, icon | 71+ manual instances, 5+ variant patterns |
| **Input** | `<input>` | default, error / sm, md, lg | 81 raw inputs across 42 files |
| **Textarea** | `<textarea>` | default, error / resize modes | 18 raw textareas |
| **Label** | `<label>` | default, required, error | 74 raw labels across 25 files |
| **Badge** | `<span>` | default, secondary, destructive, outline, status colors | 21+ pill patterns |
| **Card** | `<div>` | Card, Card.Header, Card.Content, Card.Footer, Card.Title, Card.Description | 121 `rounded-lg border` patterns |
| **Spinner** | Lucide `Loader2` | sm, md, lg | 102 identical copies across 46 files |

### Tier 2: High Priority (Radix wrappers)

| Component | Wraps | Notes |
|-----------|-------|-------|
| **Dialog** | Radix Dialog | Dialog, Dialog.Trigger, Dialog.Content, Dialog.Header, Dialog.Footer, Dialog.Title, Dialog.Description |
| **AlertDialog** | Radix AlertDialog | Replace hand-built `ConfirmDialog.tsx` |
| **Select** | Radix Select | Replace 16 raw `<select>` elements |
| **Tooltip** | Radix Tooltip | Replace hand-built tooltip in `HubConnectionIndicator` |
| **DropdownMenu** | Radix DropdownMenu | Menu, Menu.Trigger, Menu.Content, Menu.Item, Menu.Separator |
| **Tabs** | Radix Tabs | Tabs, Tabs.List, Tabs.Trigger, Tabs.Content |
| **Switch** | Radix Switch | For boolean settings |
| **Checkbox** | Radix Checkbox | For multi-select forms |
| **Toast** | Radix Toast | Replace hand-built `toast-store.ts` + `MutationErrorToast.tsx` |
| **ScrollArea** | Radix ScrollArea | Replace custom CSS scrollbar styling |

### Tier 3: Layout & Typography

| Component | Pattern | Variants |
|-----------|---------|----------|
| **Typography.H1-H4** | Semantic headings | `text-2xl font-bold` (22 files), `text-lg font-semibold` (34 files) |
| **Typography.Text** | Body text | `text-sm text-muted-foreground` (103 files), `text-sm font-medium` (184 files) |
| **Typography.Code** | Inline code | monospace styling |
| **Grid** | CSS Grid container | Grid, Grid.Row, Grid.Col, Grid.Item / cols-1 through cols-12, gap variants |
| **Stack** | Flex column | spacing variants, align, justify |
| **Flex** | Flex row | spacing variants, align, justify, wrap |
| **Separator** | Radix Separator | horizontal, vertical |
| **Container** | Max-width wrapper | sm, md, lg, xl, full |

### Tier 4: Form System (TanStack Form + Zod v4)

| Component | Purpose |
|-----------|---------|
| **Form** | TanStack Form wrapper with Zod Standard Schema validation |
| **FormField** | Field wrapper with label, error, description |
| **FormInput** | Input wired to TanStack Form field |
| **FormTextarea** | Textarea wired to TanStack Form field |
| **FormSelect** | Select wired to TanStack Form field |
| **FormCheckbox** | Checkbox wired to TanStack Form field |
| **FormSwitch** | Switch wired to TanStack Form field |

### Remaining Radix Wrappers

| Component | Wraps | Priority |
|-----------|-------|----------|
| **Progress** | Radix Progress | Medium — replace CSS `.progress-working` |
| **Slider** | Radix Slider | Medium — for settings (volume, scale) |
| **Popover** | Radix Popover | Medium — for inline popovers |
| **Collapsible** | Radix Collapsible | Low — for expandable sections |

---

## Component Pattern (MANDATORY)

Every component in `src/renderer/shared/components/ui/` follows this exact pattern:

```tsx
// src/renderer/shared/components/ui/button.tsx

import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@renderer/shared/lib/utils';

import type { VariantProps } from 'class-variance-authority';

// ─── Variants (ALL Tailwind lives here) ─────────────────

const buttonVariants = cva(
  // Base styles — shared by all variants
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-xs',
        md: 'h-9 px-4 py-2',
        lg: 'h-10 rounded-md px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

// ─── Component (React 19 — no forwardRef) ───────────────

interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
```

### Key Requirements

- **`cva()` for ALL variant logic** — never raw ternaries for styling
- **`data-slot` attribute** — enables parent styling via `[data-slot=button]`
- **`React.ComponentProps<"element">`** — React 19 pattern, no forwardRef
- **`cn()` for className merging** — allows consumer overrides
- **`asChild` via Radix Slot** — for polymorphic rendering
- **Named function export** — matches project ESLint rules
- **Type exports** — `ButtonProps` exported for consumers
- **`buttonVariants` exported** — for use in non-button contexts (links styled as buttons)

---

## Compound Component Pattern (Grid, Card, etc.)

```tsx
// src/renderer/shared/components/ui/card.tsx

import { cva } from 'class-variance-authority';

import { cn } from '@renderer/shared/lib/utils';

import type { VariantProps } from 'class-variance-authority';

const cardVariants = cva('rounded-lg border bg-card text-card-foreground', {
  variants: {
    variant: {
      default: 'shadow-sm',
      interactive: 'shadow-sm hover:shadow-md transition-shadow cursor-pointer',
      elevated: 'shadow-md',
    },
  },
  defaultVariants: { variant: 'default' },
});

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
  return (
    <div data-slot="card" className={cn(cardVariants({ variant, className }))} {...props} />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-header" className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="card-title"
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p data-slot="card-description" className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('p-6 pt-0', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-footer" className={cn('flex items-center p-6 pt-0', className)} {...props} />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
```

### Usage in Feature Code (Clean — No Tailwind)

```tsx
// Feature component — zero Tailwind needed
import { Card, CardHeader, CardTitle, CardContent } from '@ui/card';
import { Button } from '@ui/button';
import { Badge } from '@ui/badge';

function TaskCard({ task }: { task: Task }) {
  return (
    <Card variant="interactive">
      <CardHeader>
        <CardTitle>{task.name}</CardTitle>
        <Badge variant={task.status === 'running' ? 'info' : 'default'}>
          {task.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <Text variant="muted">{task.description}</Text>
      </CardContent>
    </Card>
  );
}
```

---

## Form System Pattern (TanStack Form + Zod v4)

```tsx
// Zod v4 implements Standard Schema — NO adapter package needed
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

function LoginForm() {
  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => (
          <FormField label="Email" error={field.state.meta.errors[0]?.message}>
            <Input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <FormField label="Password" error={field.state.meta.errors[0]?.message}>
            <Input
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </FormField>
        )}
      </form.Field>

      <Button type="submit" disabled={form.state.isSubmitting}>
        {form.state.isSubmitting ? <Spinner size="sm" /> : 'Sign In'}
      </Button>
    </form>
  );
}
```

---

## Implementation Waves

### Wave 1: Foundation (no blockers)

| Task | Files | Agent |
|------|-------|-------|
| Install `@tanstack/react-form`, add MCP servers (shadcn, design-systems) | `package.json`, MCP config | infra |
| Build Tier 1 primitives: Button, Input, Textarea, Label, Badge, Card, Spinner | `src/renderer/shared/components/ui/` (7 files) | component-engineer |
| Build Typography system: H1-H4, Text, Code | `src/renderer/shared/components/ui/typography.tsx` | component-engineer |
| Build Layout primitives: Grid, Stack, Flex, Container, Separator | `src/renderer/shared/components/ui/` (5 files) | component-engineer |

### Wave 2: Radix Wrappers (blocked by Wave 1 for pattern reference)

| Task | Files | Agent |
|------|-------|-------|
| Dialog, AlertDialog, DropdownMenu, Tooltip | `ui/` (4 files) | component-engineer |
| Select, Tabs, Switch, Checkbox | `ui/` (4 files) | component-engineer |
| Toast, ScrollArea, Popover, Progress, Slider, Collapsible | `ui/` (6 files) | component-engineer |

### Wave 3: Form System (blocked by Wave 1 for Input/Select/etc.)

| Task | Files | Agent |
|------|-------|-------|
| Form, FormField, FormInput, FormTextarea, FormSelect, FormCheckbox, FormSwitch | `ui/form.tsx` | component-engineer |
| Document form patterns with login + settings examples | `ai-docs/PATTERNS.md` | codebase-guardian |

### Wave 4: Migration Kickstart (blocked by Waves 1-3)

| Task | Files | Agent |
|------|-------|-------|
| Migrate sign-in/register page to new primitives | `src/renderer/features/auth/` | component-engineer |
| Migrate settings page to new primitives + Form system | `src/renderer/features/settings/` | component-engineer |
| Migrate task dashboard to new Card, Badge, Button | `src/renderer/features/tasks/` | component-engineer |
| Update barrel exports: `@ui/*` alias → all new components | `src/renderer/shared/components/ui/index.ts` | component-engineer |

---

## Barrel Export Structure

```typescript
// src/renderer/shared/components/ui/index.ts

// Primitives
export { Button, buttonVariants, type ButtonProps } from './button';
export { Input, type InputProps } from './input';
export { Textarea, type TextareaProps } from './textarea';
export { Label, type LabelProps } from './label';
export { Badge, badgeVariants, type BadgeProps } from './badge';
export { Spinner, type SpinnerProps } from './spinner';

// Layout
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
export { Grid, GridRow, GridCol, GridItem } from './grid';
export { Stack } from './stack';
export { Flex } from './flex';
export { Container } from './container';

// Typography
export { Heading, Text, Code } from './typography';

// Radix Wrappers
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from './dialog';
export { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogAction, AlertDialogCancel } from './alert-dialog';
export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './select';
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './dropdown-menu';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
export { Switch } from './switch';
export { Checkbox } from './checkbox';
export { Toast, ToastProvider, ToastViewport } from './toast';
export { ScrollArea } from './scroll-area';
export { Popover, PopoverTrigger, PopoverContent } from './popover';
export { Progress } from './progress';
export { Slider } from './slider';
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';
export { Separator } from './separator';

// Forms
export { Form, FormField, FormInput, FormTextarea, FormSelect, FormCheckbox, FormSwitch } from './form';
```

Usage from feature code:
```tsx
import { Button, Card, CardHeader, CardTitle, Badge, Input } from '@ui';
```

---

## Success Criteria

- [ ] Every Radix package in `package.json` has a corresponding wrapper in `ui/`
- [ ] CVA used in every component with variants
- [ ] `data-slot` on every component root element
- [ ] Zero raw `<input>`, `<select>`, `<textarea>`, `<button>` in migrated features
- [ ] Zero Loader2 spinner pattern — all use `<Spinner>`
- [ ] TanStack Form + Zod v4 working in at least 2 forms (login, settings)
- [ ] `@ui/*` barrel export covers all components
- [ ] lint + typecheck + test + build all pass
- [ ] 3 reference feature migrations complete (auth, settings, tasks)

---

## Documentation Deliverables

- [ ] Update `ai-docs/PATTERNS.md` — component patterns with code examples
- [ ] Update `ai-docs/FEATURES-INDEX.md` — UI primitive inventory
- [ ] Update `ai-docs/CODEBASE-GUARDIAN.md` — file placement rules for `ui/`
- [ ] Create `ai-docs/DESIGN-SYSTEM.md` — complete component catalog + usage guide

---

## Research Findings: Recommended Tooling

### MCP Servers to Add

| Server | Command | What It Provides |
|--------|---------|-----------------|
| shadcn Official | `npx shadcn@latest mcp` | Browse/install shadcn components from registry |
| Design Systems | URL: `https://design-systems-mcp.southleft.com/mcp` | 188+ design system patterns, W3C token specs, accessibility |

### Key Technical Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Form library | TanStack Form + Zod v4 Standard Schema | No adapter needed, Zod v4 is native |
| Variant system | CVA (class-variance-authority) | Already installed, type-safe, shadcn standard |
| Color system | Keep `color-mix()` + CSS vars | More flexible than OKLCH for multi-theme desktop app |
| Component style | shadcn v4 pattern (`data-slot`, no forwardRef) | React 19 native, best for compound components |
| Polymorphism | Radix Slot (`asChild` prop) | Already installed, standard pattern |
