"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload, X } from "lucide-react";
import Header from "@/app/components/layout/header";
import Footer from "@/app/components/layout/footer";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

// Form schema with validation - removed agreeToTerms requirement
const sellFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(500),
  type: z.enum(["item", "service"], {
    required_error: "Please select what you're selling",
  }),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  condition: z.enum(["NEW", "LIKE NEW", "GOOD", "FAIR"], {
    required_error: "Please select a condition",
  }).optional(),
  category: z.enum(["TEXTBOOK", "ELECTRONICS", "FURNITURE", "TUTORING", "OTHERS"], {
    required_error: "Please select a category",
  }),
  visibility: z.enum(["university", "global"], {
    required_error: "Please select visibility",
  }),
  biddingEnabled: z.boolean(),
});

type SellFormValues = z.infer<typeof sellFormSchema>;

export default function SellPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialize the form - removed agreeToTerms field
  const form = useForm<SellFormValues>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "item",
      price: "",
      category: undefined,
      visibility: "university",
      biddingEnabled: false,
    }
  });
  
  // Watch form values to conditionally show fields
  const type = form.watch("type");

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    
    // Convert FileList to array and process each file
    const newFiles = Array.from(e.target.files).slice(0, 5 - uploadedImages.length);
    
    // Convert files to local URLs (in a real app, you'd upload to server)
    const newImageURLs = newFiles.map(file => URL.createObjectURL(file));
    
    setUploadedImages(prev => [...prev, ...newImageURLs]);
    setUploading(false);
  };
  
  // Remove an uploaded image
  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission handler
  const onSubmit = async (data: SellFormValues) => {
    setSubmitting(true);
    
    // Create the final data including images
    const finalData = {
      ...data,
      price: Number(data.price),
      images: uploadedImages,
    };
    
    try {
      // Here you would send the data to your backend API
      console.log("Submitting data:", finalData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message and reset form
      alert("Listing created successfully!");
      form.reset();
      setUploadedImages([]);
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-gray-950 py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold">Sell on Campus</h1>
            <p className="text-muted-foreground">
              List your items or services for fellow students to discover
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Basic Information</h2>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Calculus Textbook (8th Edition)"
                              {...field}
                              maxLength={100}
                            />
                          </FormControl>
                          <FormDescription>
                            Be specific about what you're selling
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your item or service in detail"
                              className="min-h-32"
                              {...field}
                              maxLength={500}
                            />
                          </FormControl>
                          <FormDescription>
                            Include condition, features, and other relevant details
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Type and Category */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Type and Category</h2>
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>What are you selling?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-6"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="item" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Physical Item
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="service" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Service
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="TEXTBOOK">Textbooks</SelectItem>
                                <SelectItem value="ELECTRONICS">Electronics</SelectItem>
                                <SelectItem value="FURNITURE">Furniture</SelectItem>
                                <SelectItem value="TUTORING">Tutoring</SelectItem>
                                <SelectItem value="OTHERS">Others</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {type === "item" && (
                        <FormField
                          control={form.control}
                          name="condition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Condition</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="NEW">New</SelectItem>
                                  <SelectItem value="LIKE NEW">Like New</SelectItem>
                                  <SelectItem value="GOOD">Good</SelectItem>
                                  <SelectItem value="FAIR">Fair</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Price and Options */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Price and Options</h2>
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {type === "item" ? "Price ($)" : "Rate ($)"}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                              <Input 
                                type="text" 
                                inputMode="decimal" 
                                placeholder="0.00" 
                                className="pl-8"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            {type === "service" && "You can specify per hour, per session, etc. in the description"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="visibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Visibility</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Who can see your listing" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="university">My University Only</SelectItem>
                                <SelectItem value="global">All Universities (Global)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Who can see and buy your listing
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="biddingEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Allow Bidding</FormLabel>
                              <FormDescription>
                                Let buyers negotiate the price
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Image Upload */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Images</h2>
                    
                    <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                      {uploadedImages.length < 5 && (
                        <label className="w-full cursor-pointer">
                          <div className="flex flex-col items-center justify-center py-4">
                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="font-medium text-muted-foreground">
                              Upload Images
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Add up to {5 - uploadedImages.length} more images
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            disabled={uploading || uploadedImages.length >= 5}
                          />
                        </label>
                      )}
                      
                      {uploading && (
                        <div className="flex items-center mt-4">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <p className="text-sm">Uploading...</p>
                        </div>
                      )}
                      
                      {uploadedImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3 w-full">
                          {uploadedImages.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                              <Image
                                src={img}
                                alt={`Uploaded image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              {index === 0 && (
                                <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center">
                                  Cover
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allowed formats: JPG, PNG, GIF. Max 5MB each. First image will be the cover.
                    </p>
                  </div>

                  <Separator />

                  {/* Submit button - removed Terms section */}
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Listing...
                      </>
                    ) : (
                      "Create Listing"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}