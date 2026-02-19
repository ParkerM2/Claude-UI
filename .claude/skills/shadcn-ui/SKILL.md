---
name: shadcn-ui
description: shadcn/ui component patterns for Next.js 16 applications. This skill should be used when adding UI components, customizing component styles, composing primitives, or integrating forms with react-hook-form. Covers installation, customization, composition patterns, and Atlas-specific conventions using Tailwind CSS v4.
---

# shadcn/ui Component Usage

## Purpose

Provide comprehensive patterns for implementing shadcn/ui components in Next.js 16 applications with Atlas-specific conventions. Focus on composition over props, accessibility-first design, and type-safe integration with tRPC and react-hook-form.

## When To Use This Skill

**Component Implementation:**
- Adding new shadcn/ui components to the project
- Customizing component variants and styles
- Building composite components from primitives (Dialog, Form, Table)
- Implementing responsive mobile/desktop patterns

**Form Integration:**
- Integrating react-hook-form with shadcn Form components
- Validating forms with Zod schemas
- Connecting forms to tRPC mutations
- Handling form state and errors

**Data Display:**
- Creating data tables with sorting and filtering
- Building card layouts and list views
- Implementing skeleton loading states

**Interactive Patterns:**
- Building modal dialogs and drawers (sheets)
- Implementing toast notifications
- Creating dropdown menus and popovers
- Adding tooltips and hover states

**Accessibility:**
- Ensuring keyboard navigation works correctly
- Adding proper ARIA labels (especially icon buttons)
- Implementing focus management
- Meeting WCAG 2.1 AAA standards (44px minimum touch targets)

## Core Principles

### 1. Copy-Not-Import Philosophy

shadcn/ui components are copied into the project, not imported as dependencies. Customize directly in `src/components/ui/`.

```tsx
// ✅ Customize directly
// src/components/ui/button.tsx
const buttonVariants = cva("...", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      // Add your custom variant
      atlas: "bg-blue-600 text-white hover:bg-blue-700",
    },
  },
});
```

### 2. Composition Over Props

Build complex components by composing primitives rather than adding props:

```tsx
// ❌ Avoid: Too many props
<Dialog
  title="Delete Item"
  description="Are you sure?"
  showCloseButton={true}
  size="lg"
/>

// ✅ Prefer: Composition
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete Item</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### 3. className Customization

Extend styles via `className` prop using Tailwind utilities:

```tsx
<Button variant="default" className="w-full sm:w-auto shadow-lg">
  Submit
</Button>
```

### 4. Accessibility First

All components are accessible by default (built on Radix UI):

- Keyboard navigation
- Screen reader support
- ARIA attributes
- Focus management

**Icon buttons require labels for accessibility**:

```tsx
// ❌ Inaccessible
<Button size="icon">
  <TrashIcon />
</Button>

// ✅ Accessible
<Button size="icon" aria-label="Delete item">
  <TrashIcon />
</Button>
```

## Quick Reference

### Common Components

| Component       | Use Case           | Key Features                   |
| --------------- | ------------------ | ------------------------------ |
| `Button`        | Actions, triggers  | Variants, sizes, loading state |
| `Input`         | Text entry         | Types, validation states       |
| `Form`          | Form validation    | react-hook-form integration    |
| `Dialog`        | Modals             | Portal, overlay, animations    |
| `Sheet`         | Side panels        | Mobile-friendly drawers        |
| `Table`         | Data display       | Semantic HTML, responsive      |
| `Select`        | Dropdowns          | Searchable, keyboard nav       |
| `Checkbox`      | Boolean input      | Indeterminate state            |
| `Label`         | Form labels        | Auto-linked to inputs          |
| `Textarea`      | Multi-line input   | Auto-resize support            |
| `Tabs`          | Navigation         | Keyboard accessible            |
| `Card`          | Content containers | Header, content, footer        |
| `Badge`         | Status labels      | Variants for states            |
| `Skeleton`      | Loading states     | Placeholder UI                 |
| `Separator`     | Visual dividers    | Horizontal/vertical            |
| `Dropdown Menu` | Actions menu       | Nested menus, shortcuts        |
| `Alert`         | Notifications      | Info, warning, error           |
| `Progress`      | Loading indicators | Determinate/indeterminate      |
| `Tooltip`       | Hover hints        | Delay, positioning             |

### Button Variants & Sizes

```tsx
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outlined</Button>
<Button variant="ghost">Subtle</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link Style</Button>

<Button size="sm">Small</Button>      {/* 32px mobile, 40px desktop */}
<Button size="default">Default</Button> {/* 44px mobile, 36px desktop */}
<Button size="lg">Large</Button>      {/* 48px mobile, 40px desktop */}
<Button size="icon" aria-label="Add"> {/* 44x44px - WCAG 2.1 AAA */}
  <PlusIcon />
</Button>
```

### Loading States

```tsx
<Button loading={isPending} loadingText="Saving...">
  Save Changes
</Button>

// Or manually:
<Button disabled={isPending}>
  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Save Changes
</Button>
```

## Form Integration

### Basic Form Pattern

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

type FormValues = z.infer<typeof schema>;

export function MyFormClient() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", name: "" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    // Handle submission
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" loading={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
```

### Form with tRPC Mutation

```tsx
"use client";

import { api } from "@/lib/api/react";
import { toast } from "sonner";

export function CreateStackFormClient() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      /* ... */
    },
  });

  const utils = api.useUtils();
  const createMutation = api.stacks.create.useMutation({
    onSuccess: () => {
      toast.success("Stack created successfully");
      utils.stacks.list.invalidate(); // Refetch list
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    createMutation.mutate(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Form fields */}
        <Button
          type="submit"
          loading={createMutation.isPending}
          disabled={createMutation.isPending}
        >
          Create Stack
        </Button>
      </form>
    </Form>
  );
}
```

### Common Form Field Patterns

**Number Input**:

```tsx
<FormField
  control={form.control}
  name="quantity"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Quantity</FormLabel>
      <FormControl>
        <Input
          type="number"
          inputMode="numeric"
          placeholder="100"
          {...field}
          onChange={(e) => field.onChange(e.target.valueAsNumber)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Date Input**:

```tsx
<FormField
  control={form.control}
  name="scheduledFor"
  render={({ field: { value, onChange, ...field } }) => (
    <FormItem>
      <FormLabel>Scheduled Date</FormLabel>
      <FormControl>
        <Input
          type="date"
          {...field}
          value={value instanceof Date ? value.toISOString().split("T")[0] : ""}
          onChange={(e) => {
            const dateStr = e.target.value;
            if (dateStr) onChange(new Date(dateStr));
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Select/Dropdown**:

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<FormField
  control={form.control}
  name="status"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Status</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>;
```

**Textarea**:

```tsx
import { Textarea } from "@/components/ui/textarea";

<FormField
  control={form.control}
  name="notes"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Notes</FormLabel>
      <FormControl>
        <Textarea placeholder="Optional notes..." maxLength={1000} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>;
```

**Checkbox**:

```tsx
import { Checkbox } from "@/components/ui/checkbox";

<FormField
  control={form.control}
  name="acceptTerms"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start gap-3 space-y-0">
      <FormControl>
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Accept terms and conditions</FormLabel>
        <FormDescription>You agree to our Terms of Service.</FormDescription>
      </div>
    </FormItem>
  )}
/>;
```

## Dialog Patterns

### Basic Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

### Controlled Dialog with Form

```tsx
"use client";

import { useState } from "react";

export function CreateDialogClient() {
  const [open, setOpen] = useState(false);
  const form = useForm({
    /* ... */
  });

  const createMutation = api.stacks.create.useMutation({
    onSuccess: () => {
      toast.success("Created successfully");
      form.reset();
      setOpen(false); // Close dialog
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    createMutation.mutate(data);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Stack</DialogTitle>
          <DialogDescription>Add a new stack to the system.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Form fields */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" loading={createMutation.isPending}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### Responsive Dialog/Sheet

Atlas has a custom `ResponsiveDialogSheet` that shows Dialog on desktop, Sheet on mobile:

```tsx
import { ResponsiveDialogSheet } from "@/components/features/common";

<ResponsiveDialogSheet
  open={open}
  onOpenChange={setOpen}
  title="Create Stack"
  description="Add a new stack to the system"
  trigger={<Button>Open</Button>}
>
  {/* Content - works on both desktop and mobile */}
  <Form {...form}>
    <form onSubmit={onSubmit}>{/* Fields */}</form>
  </Form>
</ResponsiveDialogSheet>;
```

## Data Table Patterns

### Basic Table

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((invoice) => (
      <TableRow key={invoice.id}>
        <TableCell>{invoice.invoice}</TableCell>
        <TableCell>{invoice.status}</TableCell>
        <TableCell className="text-right">{invoice.amount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>;
```

### Loading Skeleton

```tsx
import { Skeleton } from "@/components/ui/skeleton";

if (isLoading) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
```

## Toast Notifications

Atlas uses Sonner for toast notifications:

```tsx
import { toast } from "sonner";

// Success
toast.success("Stack created successfully");

// Error
toast.error("Failed to create stack");

// Info
toast.info("Processing your request...");

// Warning
toast.warning("This action is irreversible");

// With action
toast.success("Stack deleted", {
  action: {
    label: "Undo",
    onClick: () => {
      /* Undo logic */
    },
  },
});

// Promise toast (auto-updates based on promise state)
toast.promise(createMutation.mutateAsync(data), {
  loading: "Creating stack...",
  success: "Stack created successfully",
  error: "Failed to create stack",
});
```

## Styling Patterns

### Responsive Design

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>

<Button className="w-full sm:w-auto">
  {/* Full width on mobile, auto on desktop */}
</Button>
```

### Conditional Styles with cn()

```tsx
import { cn } from "@/lib/utils";

<Button
  className={cn(
    "base-classes",
    isActive && "bg-blue-600",
    isDisabled && "opacity-50 cursor-not-allowed",
    variant === "large" && "text-lg px-6",
  )}
>
  Click me
</Button>;
```

### Dark Mode Support

All shadcn components support dark mode automatically via CSS variables:

```tsx
<div className="bg-background text-foreground">
  {/* Automatically adapts to light/dark mode */}
</div>
```

## Common Mistakes

### ❌ Missing aria-label on icon buttons

```tsx
// Bad
<Button size="icon"><TrashIcon /></Button>

// Good
<Button size="icon" aria-label="Delete item"><TrashIcon /></Button>
```

### ❌ Not using FormControl

```tsx
// Bad - missing ARIA attributes
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <Input {...field} />  {/* Missing FormControl */}
      <FormMessage />
    </FormItem>
  )}
/>

// Good - proper ARIA linkage
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### ❌ Forgetting DialogTrigger asChild

```tsx
// Bad - creates nested button
<DialogTrigger><Button>Open</Button></DialogTrigger>

// Good - merges props into Button
<DialogTrigger asChild><Button>Open</Button></DialogTrigger>
```

## Installation

```bash
# Install shadcn CLI
pnpm dlx shadcn@latest init

# Add components
pnpm dlx shadcn@latest add button input form dialog table select checkbox textarea label
```

## Resources

- **Official docs**: https://ui.shadcn.com
- **Examples**: See `references/examples.md`
- **Recipes**: See `references/recipes.md`
- **Patterns**: See `references/patterns.md`
- **Atlas patterns**: `@/framework/patterns/shadcn.md`

## Summary

Key practices:

1. **Copy, don't import** - customize in `src/components/ui/`
2. **Compose, don't prop** - build from primitives
3. **className over props** - extend with Tailwind
4. **Accessibility first** - labels on icon buttons
5. **Forms with react-hook-form** - use Form components
6. **Mobile-first** - 44px minimum touch targets
7. **Type-safe** - derive types from tRPC RouterOutputs
