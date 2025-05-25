"use client";

import { useState, useRef } from "react";
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
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

// Form schema with validation
const sellFormSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("item"),
        title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
        description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(500),
        price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Price must be a positive number",
        }),
        condition: z.enum(["new", "like_new", "good", "fair"]),
        category: z.enum(["textbooks", "electronics", "furniture", "tutoring", "other"]),
        visibility: z.enum(["university", "global"]),
        biddingEnabled: z.boolean(),
    }),
    z.object({
        type: z.literal("service"),
        title: z.string().min(5).max(100),
        description: z.string().min(20).max(500),
        hourlyRate: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Hourly rate must be a positive number",
        }),
        category: z.enum(["textbooks", "electronics", "furniture", "tutoring", "other"]),
        visibility: z.enum(["university", "global"]),
        biddingEnabled: z.boolean(),
    }),
]);

type SellFormValues = z.infer<typeof sellFormSchema>;

export default function SellPage() {
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  // Initialize the form
  const form = useForm<SellFormValues>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "item",
      price: "",
      category: "electronics",
      visibility: "university",
      biddingEnabled: false,
      condition: "new"
    }
  });
  
  // Watch form values to conditionally show fields
  const type = form.watch("type");

  // Handle image selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    
    // Convert FileList to array and limit to 5 images
    const newFiles = Array.from(e.target.files).slice(0, 5 - imageFiles.length);
    
    // Process files and create previews
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    
    // Update states
    setImageFiles(prev => [...prev, ...newFiles]);
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setUploading(false);
  };
  
  // Remove an image
  const removeImage = (index: number) => {
    // Clean up object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    // Remove file and preview
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission handler
  const onSubmit = async (data: SellFormValues) => {
    try {
      setSubmitting(true);
      setDebugInfo("");
      
      // Check if user is authenticated
      const userString = localStorage.getItem('user');
      if (!userString) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create a listing",
          variant: "destructive"
        });
        router.push('/login');
        return;
      }

      // Check if images are present
      if (imageFiles.length === 0) {
        toast({
          title: "Images Required",
          description: "Please add at least one image",
          variant: "destructive"
        });
        return;
      }

      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add form fields to FormData with proper field names
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("type", data.type);
      
      // Handle different fields based on item type
      if (data.type === "item") {
        formData.append("price", data.price);
        formData.append("condition", data.condition || "new");
      } else {
        // For services
        formData.append("hourlyRate", "100");
      }
      
      formData.append("category", data.category);
      formData.append("visibility", data.visibility);
      formData.append("biddingEnabled", String(data.biddingEnabled));
      
      // Add images to FormData
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
      
      // Log what's being sent for debugging
      let formDataContent = "Form data being sent:\n";
      for (let [key, value] of formData.entries()) {
        formDataContent += `${key}: ${value instanceof File ? value.name : value}\n`;
      }
      console.log(formDataContent);
      
      // Make the request - CORRECTED ENDPOINT
      const response = await axios.post(
        "http://localhost:4000/api/listings/add", // Updated endpoint to match backend
        formData,
        { 
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      
      if (response.data && response.data.success) {
        toast({
          title: "Listing Created",
          description: "Your listing has been published successfully!",
        });
        
        // Reset form and image states
        form.reset();
        setImageFiles([]);
        setImagePreviewUrls([]);
        
        // Redirect to discover page
        router.push("/discover");
      } else {
        throw new Error(response.data?.error || "Unknown error occurred");
      }
    } catch (error: any) {
      console.error("Error creating listing:", error);
      
      // Detailed error logging
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response data:", error.response.data);
        setDebugInfo(error.response.data instanceof Object 
          ? JSON.stringify(error.response.data, null, 2) 
          : String(error.response.data));
      } else if (error.request) {
        console.error("No response received:", error.request);
        setDebugInfo("No response received from the server. Check if the backend is running.");
      } else {
        console.error("Error message:", error.message);
        setDebugInfo(error.message);
      }
      
      toast({
        title: "Error",
        description: error.response?.data?.error || error.message || "Failed to create listing",
        variant: "destructive",
      });
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
                                <SelectItem value="textbooks">Textbooks</SelectItem>
                                <SelectItem value="electronics">Electronics</SelectItem>
                                <SelectItem value="furniture">Furniture</SelectItem>
                                <SelectItem value="tutoring">Tutoring</SelectItem>
                                <SelectItem value="other">Others</SelectItem>
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
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="like_new">Like New</SelectItem>
                                  <SelectItem value="good">Good</SelectItem>
                                  <SelectItem value="fair">Fair</SelectItem>
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
                            {type === "item" ? "Price ($)" : "Hourly Rate ($)"}
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
                            {type === "service" && "Set your hourly rate for this service"}
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
                      {imagePreviewUrls.length < 5 && (
                        <label className="w-full cursor-pointer">
                          <div className="flex flex-col items-center justify-center py-4">
                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="font-medium text-muted-foreground">
                              Upload Images
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Add up to {5 - imagePreviewUrls.length} more images
                            </p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            disabled={uploading || imagePreviewUrls.length >= 5}
                          />
                        </label>
                      )}
                      
                      {uploading && (
                        <div className="flex items-center mt-4">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <p className="text-sm">Uploading...</p>
                        </div>
                      )}
                      
                      {imagePreviewUrls.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3 w-full">
                          {imagePreviewUrls.map((img, index) => (
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

                  {debugInfo && (
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono overflow-auto max-h-48">
                      <p className="font-semibold mb-2">Debug Info:</p>
                      <pre>{debugInfo}</pre>
                    </div>
                  )}

                  <Separator />

                  {/* Submit button */}
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