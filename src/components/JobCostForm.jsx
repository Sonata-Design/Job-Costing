"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { PRESET_COST_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitJobCostData } from "@/app/actions"; // Import the server action

const formSchema = z.object({
  address: z.string().min(1, "Address is required"),
  jobNumber: z.string().min(1, "Job number is required"),
  maximizerId: z.string().min(1, "Maximizer ID is required"),
  costItems: z
    .array(
      z.object({
        id: z.string(),
        item: z.string().min(1, "Please select a cost item"),
        vendor: z.string().min(1, "Vendor is required"),
        value: z.string().min(1, "Value is required")
                   .pipe(z.coerce.number({invalid_type_error: "Value must be a valid number."})
                   .min(0, "Value must be zero or positive")),
      })
    )
    .min(1, "At least one cost item is required"),
});

const defaultCostItem = { item: "", vendor: "", value: "0" }; // Value as string "0" to pass initial string validation

export default function JobCostForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      jobNumber: "",
      maximizerId: "",
      costItems: [{ id: crypto.randomUUID(), ...defaultCostItem }],
    },
    mode: "onChange", 
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "costItems",
  });

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text/plain");
    const rows = pastedText
      .split("\n")
      .map((row) => row.trim())
      .filter((row) => row !== "");

    const newItems = [];
    let parseError = false;
    let nonPresetItemsFound = false;

    rows.forEach((row) => {
      const parts = row.split("\t");
      // Expecting "Item Name <Tab> Vendor <Tab> Value" or "Item Name <Tab> Value"
      if (parts.length === 2 || parts.length === 3) {
        const itemText = parts[0]?.trim();
        const vendorText = parts.length === 3 ? parts[1]?.trim() : "";
        const valueStr = parts.length === 3 ? parts[2]?.trim() : parts[1]?.trim();
        
        // Attempt to parse value to ensure it's numeric-like before assigning
        const tempValue = parseFloat(valueStr);

        if (itemText && !isNaN(tempValue) && tempValue >= 0) {
          const isPreset = PRESET_COST_ITEMS.includes(itemText);
          if (!isPreset) {
            nonPresetItemsFound = true;
          }
          newItems.push({
            id: crypto.randomUUID(),
            item: isPreset ? itemText : "",
            vendor: vendorText, 
            value: valueStr, // Keep as string for the form field
          });
        } else {
          parseError = true;
        }
      } else {
         parseError = true;
      }
    });

    if (newItems.length > 0) {
      replace(newItems);
      toast({
        title: "Data Pasted",
        description: `${newItems.length} cost items imported. Please review vendor details and any non-preset items.`,
      });
      if (nonPresetItemsFound) {
        toast({
          title: "Review Required",
          description: "Some pasted items were not found in the preset list. Please select them manually.",
          variant: "default",
        });
      }
       if (parseError) {
         toast({
          title: "Parsing Issue",
          description: "Some rows had incorrect format or invalid values. Expected 'Item <Tab> [Vendor <Tab>] Value'. Please check your data.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Paste Error",
        description: "No valid data found or format incorrect. Expected: Item Name <Tab> [Vendor <Tab>] Value",
        variant: "destructive",
      });
    }
    event.currentTarget.value = "";
    form.trigger("costItems");
  };

 async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      // The schema ensures `value` is a number in the `data` object after validation
      const result = await submitJobCostData(data);

      if (result.success) {
        toast({
          title: "Submission Successful!",
          description: result.message,
        });
        form.reset({
          address: "",
          jobNumber: "",
          maximizerId: "",
          costItems: [{ id: crypto.randomUUID(), ...defaultCostItem }],
        });
      } else {
        toast({
          title: "Submission Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error calling server action:", error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">JobCost Pro</CardTitle>
        <CardDescription>Enter job details and cost items. Data will be saved to MongoDB.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">Job Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 123 Main St, Anytown, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., JN2024-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="maximizerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximizer ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., MAX-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <Separator />

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">Job Cost Items</h2>
              <FormItem>
                <FormLabel>Paste from Excel/Sheets</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste data here. Each row: Item <Tab> [Vendor <Tab>] Value. Example:&#10;311 Soft Goods	ABC Supplies	1500&#10;322 Hard Goods		2300"
                    onPaste={handlePaste}
                    className="min-h-[100px]"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Paste tab-separated values. Vendor is optional in paste, but required for submission.
                </FormDescription>
              </FormItem>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_auto] items-end gap-4 p-4 border rounded-md shadow-sm bg-card hover:shadow-md transition-shadow">
                  <FormField
                    control={form.control}
                    name={`costItems.${index}.item`}
                    render={({ field: itemField }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Item</FormLabel>
                         <Select
                          onValueChange={itemField.onChange}
                          value={itemField.value}
                          defaultValue={itemField.value}
                          disabled={isSubmitting}
                         >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select cost item" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PRESET_COST_ITEMS.map((presetItem) => (
                              <SelectItem key={presetItem} value={presetItem}>
                                {presetItem}
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
                    name={`costItems.${index}.vendor`}
                    render={({ field: vendorField }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Vendor</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., ABC Supplies" {...vendorField} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`costItems.${index}.value`}
                    render={({ field: valueField }) => (
                      <FormItem className="w-full md:w-32">
                        <FormLabel>Value ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number" // Keep type="number" for browser behavior
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            {...valueField}
                            onChange={(e) => valueField.onChange(e.target.value)} // Ensure string value is passed for z.string() schema part
                            disabled={isSubmitting}
                           />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    aria-label="Remove cost item"
                    className="text-destructive hover:bg-destructive/10 self-end" 
                    disabled={isSubmitting || fields.length <= 1}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
               <FormField
                control={form.control}
                name="costItems"
                render={() => (
                   <FormMessage className="text-center" />
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ id: crypto.randomUUID(), ...defaultCostItem })}
                className="mt-2 text-primary border-primary hover:bg-primary/10 hover:text-primary"
                disabled={isSubmitting}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Cost Item
              </Button>
            </section>
            <CardFooter className="p-0 pt-8">
              <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting || !form.formState.isValid}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Job Costs"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
