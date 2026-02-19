# shadcn/ui Examples

Complete working implementations demonstrating shadcn/ui patterns in Atlas.

## Example 1: Complete Form with Validation

Full CRUD form with react-hook-form, Zod validation, and tRPC mutation.

```tsx
// src/components/features/stacks/CreateStackFormClient.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  location: z.string().min(1, "Location is required"),
  supplierId: z.string().uuid("Invalid supplier"),
  timberClassificationId: z.string().uuid("Invalid classification"),
  estimatedVolume: z.number().positive("Must be positive").optional(),
  notes: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateStackFormClient() {
  const t = useTranslations("Stacks");
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      supplierId: "",
      timberClassificationId: "",
      estimatedVolume: undefined,
      notes: "",
    },
  });

  // Fetch suppliers for dropdown
  const { data: suppliers } = api.suppliers.list.useQuery({
    page: 1,
    pageSize: 100,
  });

  // Fetch classifications for dropdown
  const { data: classifications } = api.timberClassifications.list.useQuery({
    page: 1,
    pageSize: 100,
  });

  const utils = api.useUtils();
  const createMutation = api.stacks.create.useMutation({
    onSuccess: () => {
      toast.success(t("createSuccess"));
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("createNew")}</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createTitle")}</DialogTitle>
          <DialogDescription>{t("createDescription")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("namePlaceholder")} {...field} />
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
                  <FormLabel>{t("locationLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("locationPlaceholder")} {...field} />
                  </FormControl>
                  <FormDescription>{t("locationHint")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("supplierLabel")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectSupplier")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers?.items.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timberClassificationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("classificationLabel")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectClassification")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classifications?.items.map((classification) => (
                        <SelectItem
                          key={classification.id}
                          value={classification.id}
                        >
                          {classification.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedVolume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("volumeLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription>{t("volumeUnit")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("notesLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("notesPlaceholder")}
                      maxLength={1000}
                      {...field}
                    />
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
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

## Example 2: Data Table with Sorting/Filtering

Complete data table implementation with TanStack Table.

```tsx
// src/components/features/stacks/StackTable.tsx
"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { RouterOutputs } from "@/lib/api/react";

type Stack = RouterOutputs["stacks"]["list"]["items"][number];

const columns: ColumnDef<Stack>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "open" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "volume",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Volume (m³)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const volume = row.getValue("volume") as number | null;
      return volume ? volume.toFixed(2) : "-";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const stack = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleEdit(stack.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(stack.id)}
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type StackTableProps = {
  data: Stack[];
  isLoading?: boolean;
};

export function StackTable({ data, isLoading = false }: StackTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No stacks found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function handleEdit(id: string) {
  // Navigate to edit page or open edit dialog
}

function handleDelete(id: string) {
  // Open confirmation dialog
}
```

## Example 3: Multi-Step Wizard

Multi-step form with progress indicator and validation.

```tsx
// src/components/features/onboarding/OnboardingWizard.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const stepSchemas = [
  z.object({
    companyName: z.string().min(1, "Company name is required"),
    companyEmail: z.string().email(),
  }),
  z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    position: z.string().min(1, "Position is required"),
  }),
  z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
];

const fullSchema = z.object({
  ...stepSchemas[0].shape,
  ...stepSchemas[1].shape,
  ...stepSchemas[2].shape,
});

type FormValues = z.infer<typeof fullSchema>;

const steps = [
  { title: "Company", description: "Basic company information" },
  { title: "Contact", description: "Your contact details" },
  { title: "Address", description: "Company address" },
];

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(stepSchemas[currentStep]),
    mode: "onChange",
    defaultValues: {
      companyName: "",
      companyEmail: "",
      firstName: "",
      lastName: "",
      position: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  const onNext = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
        form.clearErrors();
      } else {
        // Submit form
        const data = form.getValues();
        console.log("Submit:", data);
      }
    }
  };

  const onBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2",
                    index < currentStep &&
                      "border-primary bg-primary text-primary-foreground",
                    index === currentStep && "border-primary",
                    index > currentStep && "border-gray-300",
                  )}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <Separator
                  className={cn(
                    "flex-1 mx-4",
                    index < currentStep && "bg-primary",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              {currentStep === 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="info@acme.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input placeholder="CEO" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="United States" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="button" onClick={onNext}>
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
            {currentStep < steps.length - 1 && (
              <ChevronRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

## Related

- `patterns.md` - Detailed patterns
- `recipes.md` - Step-by-step guides
- `@/framework/examples/` - Atlas complete examples
