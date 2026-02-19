# shadcn/ui Patterns

Detailed implementation patterns for shadcn/ui components in Atlas.

## Component Installation and Setup

### Initial Setup

```bash
# Initialize shadcn in a new project
pnpm dlx shadcn@latest init

# Follow prompts:
# - Style: new-york
# - Base color: neutral
# - CSS variables: yes
# - RSC: yes
# - Path aliases: @/* (default)
```

### Adding Components

```bash
# Add individual components
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add form

# Add multiple components at once
pnpm dlx shadcn@latest add button input form dialog table select

# List available components
pnpm dlx shadcn@latest add
```

### Configuration

Atlas uses this `components.json` configuration:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/global.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## Customization via className

### Basic Customization

```tsx
// Add spacing
<Button className="mt-4 mb-2">
  Submit
</Button>

// Responsive width
<Button className="w-full sm:w-auto">
  Submit
</Button>

// Color override
<Button className="bg-blue-600 hover:bg-blue-700">
  Custom Color
</Button>

// Multiple utilities
<Button className="shadow-lg rounded-full px-6">
  Custom Style
</Button>
```

### Using cn() Helper

The `cn()` utility combines class names and handles conditionals:

```tsx
import { cn } from '@/lib/utils'

<Button
  className={cn(
    "base-class",
    isActive && "bg-blue-600",
    isDisabled && "opacity-50",
    size === "large" && "px-8 py-4"
  )}
>
  Click me
</Button>

// With dynamic variants
<Card className={cn(
  "p-4",
  variant === "highlighted" && "border-blue-500 shadow-lg",
  variant === "muted" && "bg-gray-50",
  isLoading && "opacity-60 pointer-events-none"
)}>
  {content}
</Card>
```

### Component Variant Customization

Modify `buttonVariants` directly in `src/components/ui/button.tsx`:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        // Add custom variant
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700",
      },
      size: {
        default: "h-11 sm:h-9 px-4 py-2",
        // Add custom size
        xs: "h-8 px-2 text-xs",
      }
    }
  }
)

// Usage:
<Button variant="success" size="xs">Save</Button>
```

## Composition Patterns

### Building Composite Components

Create feature-specific components by composing shadcn primitives:

```tsx
// ConfirmationDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmationDialogProps = {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  trigger: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
};

export function ConfirmationDialog({
  title,
  description,
  onConfirm,
  onCancel,
  trigger,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === "destructive" ? "bg-destructive" : undefined}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Usage:
<ConfirmationDialog
  title="Delete Stack"
  description="Are you sure you want to delete this stack? This action cannot be undone."
  onConfirm={handleDelete}
  trigger={<Button variant="destructive">Delete</Button>}
  confirmText="Delete"
  variant="destructive"
/>;
```

### Card Composition

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function StackCard({ stack }: { stack: Stack }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{stack.name}</CardTitle>
        <CardDescription>Created {formatDate(stack.createdAt)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Volume:</span>
            <span className="font-medium">{stack.volume} m³</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weight:</span>
            <span className="font-medium">{stack.weight} kg</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          View
        </Button>
        <Button variant="default" className="flex-1">
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
```

## Form Field Integration

### Custom Form Field Wrapper

Create reusable field wrappers for common patterns:

```tsx
// FormFieldWrapper.tsx
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

type FormFieldWrapperProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

export function FormFieldWrapper<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  type = "text",
  required = false,
}: FormFieldWrapperProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Usage:
<FormFieldWrapper
  control={form.control}
  name="email"
  label="Email Address"
  description="We'll never share your email"
  placeholder="you@example.com"
  type="email"
  required
/>;
```

### Multi-field Group

```tsx
// AddressFields.tsx
import { FormFieldWrapper } from "./FormFieldWrapper";

type AddressFieldsProps<T extends FieldValues> = {
  control: Control<T>;
  namePrefix: string;
};

export function AddressFields<T extends FieldValues>({
  control,
  namePrefix,
}: AddressFieldsProps<T>) {
  return (
    <div className="space-y-4">
      <FormFieldWrapper
        control={control}
        name={`${namePrefix}.street` as FieldPath<T>}
        label="Street Address"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <FormFieldWrapper
          control={control}
          name={`${namePrefix}.city` as FieldPath<T>}
          label="City"
          required
        />
        <FormFieldWrapper
          control={control}
          name={`${namePrefix}.postalCode` as FieldPath<T>}
          label="Postal Code"
          required
        />
      </div>
      <FormFieldWrapper
        control={control}
        name={`${namePrefix}.country` as FieldPath<T>}
        label="Country"
        required
      />
    </div>
  );
}
```

## Responsive Patterns

### Responsive Layout

```tsx
// Mobile-first responsive grid
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>

// Responsive button sizing
<Button size="default" className="w-full sm:w-auto">
  {/* 44px height on mobile (touch-friendly), 36px on desktop */}
  Submit
</Button>

// Responsive dialog/sheet
import { useMediaQuery } from '@/hooks/use-media-query'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Sheet, SheetContent } from '@/components/ui/sheet'

export function ResponsiveModal({ open, onOpenChange, children }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">{children}</SheetContent>
    </Sheet>
  )
}
```

### Mobile Touch Targets

All interactive elements should meet WCAG 2.1 SC 2.5.5 (AAA) minimum of 44x44px on mobile:

```tsx
// Button with icon - always 44x44px minimum
<Button size="icon" aria-label="Delete">
  <TrashIcon />
</Button>

// Mobile-responsive button heights
<Button size="sm">Small</Button>      {/* 40px mobile, 32px desktop */}
<Button size="default">Default</Button> {/* 44px mobile, 36px desktop */}
<Button size="lg">Large</Button>      {/* 48px mobile, 40px desktop */}

// Custom touch target adjustment
<button className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px]">
  Custom Button
</button>
```

## Accessibility Patterns

### Icon Button Labels

```tsx
// ❌ Bad - no label
<Button size="icon">
  <TrashIcon />
</Button>

// ✅ Good - aria-label
<Button size="icon" aria-label="Delete item">
  <TrashIcon />
</Button>

// ✅ Good - screen reader only text
<Button size="icon">
  <TrashIcon />
  <span className="sr-only">Delete item</span>
</Button>
```

### Form Accessibility

```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="email">Email Address</FormLabel>
      <FormControl>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-describedby="email-description email-error"
          {...field}
        />
      </FormControl>
      <FormDescription id="email-description">
        We'll never share your email with anyone.
      </FormDescription>
      <FormMessage id="email-error" />
    </FormItem>
  )}
/>
```

### Keyboard Navigation

```tsx
// Dropdown menu with keyboard shortcuts
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={handleEdit}>
      Edit
      <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={handleDelete}>
      Delete
      <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

## Animation Patterns

### Framer Motion Integration

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card>{children}</Card>
    </motion.div>
  );
}

// Staggered list animation
export function AnimatedList({ items }: { items: Item[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <Card>{item.name}</Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Built-in Animations

shadcn components use Radix UI's data attributes for animations:

```tsx
// Dialog animations (already included)
<DialogContent
  className="
    data-[state=open]:animate-in
    data-[state=closed]:animate-out
    data-[state=closed]:fade-out-0
    data-[state=open]:fade-in-0
    data-[state=closed]:zoom-out-95
    data-[state=open]:zoom-in-95
  "
>
  {content}
</DialogContent>

// Custom animation on component
<Card
  data-state={isHighlighted ? 'highlighted' : 'default'}
  className="
    data-[state=highlighted]:scale-105
    data-[state=highlighted]:shadow-lg
    transition-all
    duration-200
  "
>
  {content}
</Card>
```

## Dark Mode Patterns

### Using Theme Variables

```tsx
// Automatically adapts to theme
<div className="bg-background text-foreground border border-border">
  <h1 className="text-primary">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>

// Custom colors with dark mode support
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  Content
</div>
```

### Theme-aware Components

```tsx
"use client";

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

## Related

- `recipes.md` - Step-by-step implementation guides
- `examples.md` - Complete working examples
- `@/framework/patterns/shadcn.md` - Atlas shadcn pattern
- `@/framework/patterns/styling.md` - Tailwind CSS v4 patterns
