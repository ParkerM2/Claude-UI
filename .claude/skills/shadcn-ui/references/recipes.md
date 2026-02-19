# shadcn/ui Recipes

Step-by-step guides for common shadcn/ui implementation tasks in Atlas.

## Recipe 1: Adding a New Component

**Goal**: Install and use a new shadcn component

**Steps**:

1. **Install the component**:

```bash
pnpm dlx shadcn@latest add <component-name>

# Examples:
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add select
```

2. **Verify installation**:

```bash
# Component should appear in src/components/ui/
ls src/components/ui/<component-name>.tsx
```

3. **Import and use**:

```tsx
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return <Button>Click me</Button>;
}
```

4. **Customize if needed** (edit `src/components/ui/<component-name>.tsx` directly)

## Recipe 2: Customizing Component Styles

**Goal**: Add custom variant to an existing component

**Steps**:

1. **Open the component file**:

```bash
# Example: customizing button
code src/components/ui/button.tsx
```

2. **Locate the `cva()` variants**:

```tsx
const buttonVariants = cva("inline-flex items-center...", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      // Add your variant below
    },
  },
});
```

3. **Add your custom variant**:

```tsx
const buttonVariants = cva("inline-flex items-center...", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      success: "bg-green-600 text-white hover:bg-green-700",
      atlas: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg",
    },
  },
});
```

4. **Update TypeScript types if needed**:

```tsx
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // Types are automatically inferred from buttonVariants
}
```

5. **Use your custom variant**:

```tsx
<Button variant="success">Save</Button>
<Button variant="atlas">Atlas Action</Button>
```

## Recipe 3: Building Composite Components

**Goal**: Create a reusable component from shadcn primitives

**Steps**:

1. **Create component file**:

```bash
touch src/components/features/common/ConfirmDialog.tsx
```

2. **Import shadcn primitives**:

```tsx
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
```

3. **Define props interface**:

```tsx
type ConfirmDialogProps = {
  title: string;
  description: string;
  onConfirm: () => void;
  trigger: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
};
```

4. **Compose the component**:

```tsx
export function ConfirmDialog({
  title,
  description,
  onConfirm,
  trigger,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

5. **Use the composite component**:

```tsx
<ConfirmDialog
  title="Delete Item"
  description="Are you sure? This action cannot be undone."
  onConfirm={handleDelete}
  trigger={<Button variant="destructive">Delete</Button>}
/>
```

## Recipe 4: Form Field Wrappers

**Goal**: Create reusable form field wrapper with react-hook-form

**Steps**:

1. **Create wrapper component**:

```bash
touch src/components/features/common/FormInput.tsx
```

2. **Import dependencies**:

```tsx
"use client";

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
```

3. **Define props**:

```tsx
type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  required?: boolean;
  disabled?: boolean;
};
```

4. **Implement wrapper**:

```tsx
export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
}: FormInputProps<T>) {
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
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              onChange={(e) => {
                const value =
                  type === "number" ? e.target.valueAsNumber : e.target.value;
                field.onChange(value);
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

5. **Use in forms**:

```tsx
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/features/common/FormInput";

export function MyForm() {
  const form = useForm();

  return (
    <Form {...form}>
      <form>
        <FormInput
          control={form.control}
          name="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          required
        />

        <FormInput
          control={form.control}
          name="age"
          label="Age"
          type="number"
          description="Must be 18 or older"
        />
      </form>
    </Form>
  );
}
```

## Recipe 5: Data Table Setup

**Goal**: Create a data table with TanStack Table and shadcn components

**Steps**:

1. **Install dependencies**:

```bash
pnpm add @tanstack/react-table
pnpm dlx shadcn@latest add table
```

2. **Create table component file**:

```bash
touch src/components/features/users/UserTable.tsx
```

3. **Define column definitions**:

```tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/types";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" onClick={() => handleEdit(row.original)}>
        Edit
      </Button>
    ),
  },
];
```

4. **Implement table**:

```tsx
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function UserTable({ data }: { data: User[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

5. **Add sorting** (optional):

```tsx
import { getSortedRowModel, type SortingState } from "@tanstack/react-table";
import { useState } from "react";

export function UserTable({ data }: { data: User[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  // Rest of implementation...
}
```

## Recipe 6: Dialog/Modal Patterns

**Goal**: Create a controlled dialog with form

**Steps**:

1. **Install components**:

```bash
pnpm dlx shadcn@latest add dialog form button input
```

2. **Create dialog component**:

```bash
touch src/components/features/stacks/CreateStackDialog.tsx
```

3. **Set up state and form**:

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export function CreateStackDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  // Continue...
}
```

4. **Add mutation handler**:

```tsx
import { api } from "@/lib/api/react";
import { toast } from "sonner";

export function CreateStackDialog() {
  // ... state and form setup

  const utils = api.useUtils();
  const createMutation = api.stacks.create.useMutation({
    onSuccess: () => {
      toast.success("Stack created successfully");
      utils.stacks.list.invalidate();
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    createMutation.mutate(data);
  });

  // Continue...
}
```

5. **Render dialog**:

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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateStackDialog() {
  // ... setup code

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Stack</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Stack</DialogTitle>
          <DialogDescription>Add a new stack to the system</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stack Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter stack name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

## Recipe 7: Toast Notifications

**Goal**: Add toast notifications to your app

**Steps**:

1. **Install Sonner** (already installed in Atlas):

```bash
pnpm add sonner
pnpm dlx shadcn@latest add sonner
```

2. **Add Toaster to layout**:

```tsx
// app/layout.tsx or app/[locale]/layout.tsx
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

3. **Use toast in components**:

```tsx
import { toast } from "sonner";

// Success
toast.success("Operation completed successfully");

// Error
toast.error("Something went wrong");

// Info
toast.info("Processing your request...");

// Warning
toast.warning("This action is irreversible");
```

4. **With action button**:

```tsx
toast.success("Item deleted", {
  action: {
    label: "Undo",
    onClick: () => {
      // Undo logic
      undoDelete();
    },
  },
});
```

5. **Promise toast** (auto-updates):

```tsx
toast.promise(createMutation.mutateAsync(data), {
  loading: "Creating stack...",
  success: "Stack created successfully",
  error: (err) => `Failed: ${err.message}`,
});
```

## Recipe 8: Responsive Dialog/Sheet

**Goal**: Show Dialog on desktop, Sheet on mobile

**Steps**:

1. **Install components**:

```bash
pnpm dlx shadcn@latest add dialog sheet
```

2. **Create media query hook** (or use Atlas's existing one):

```tsx
// hooks/use-media-query.ts
"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
```

3. **Create responsive wrapper**:

```tsx
// components/features/common/ResponsiveDialogSheet.tsx
"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type ResponsiveDialogSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  trigger?: React.ReactNode;
  children: React.ReactNode;
};

export function ResponsiveDialogSheet({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  children,
}: ResponsiveDialogSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger}
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
```

4. **Use the responsive component**:

```tsx
import { ResponsiveDialogSheet } from "@/components/features/common/ResponsiveDialogSheet";

export function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialogSheet
      open={open}
      onOpenChange={setOpen}
      title="Edit Item"
      description="Make changes to your item"
      trigger={<Button>Open</Button>}
    >
      {/* Content - works on both mobile and desktop */}
      <Form>...</Form>
    </ResponsiveDialogSheet>
  );
}
```

## Related

- `patterns.md` - Detailed implementation patterns
- `examples.md` - Complete working examples
- `@/framework/recipes/` - Atlas implementation recipes
