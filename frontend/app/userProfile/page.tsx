"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import axios from "axios"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Pencil, User, Phone, Mail, GraduationCap, Map, Calendar, Package, Clock, Plus, Loader } from "lucide-react"
import Header from "@/app/components/layout/header"
import Footer from "@/app/components/layout/footer"
import Link from "next/link"
import Image from "next/image"

// Types based on your API response
interface UserProfile {
  userID: string;
  name: string;
  email: string;
  university?: string;
  dept?: string;
  program?: string;
  year?: number;
  phone?: string;
  dob?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Listing {
  _id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  hourlyRate: number | null;
  condition: string;
  category: string;
  visibility: string;
  seller: {
    _id: string;
    name: string;
    university: string;
  };
  university: string;
  images: string[];
  status: string;
  biddingEnabled: boolean;
  bids?: Array<{
    user: string;
    amount: number;
    _id: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Form schema for profile edit
const profileFormSchema = z.object({
  name: z.string().min(6, "Name must be at least 6 characters").max(50),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(11, "Please enter a valid phone number").optional(),
  dept: z.string().optional(),
  year: z.coerce.number().min(1).max(5).optional()
})

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize form
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dept: "",
      year: 1,
    },
  })

  // Fetch user data and listings
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get user from localStorage (from login)
        const userString = localStorage.getItem('user');
        if (!userString) {
          setError("User data not found. Please log in again.");
          return;
        }
        
        const user: UserProfile = JSON.parse(userString);
        setUserData(user);
        
        // Update form values
        form.reset({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          dept: user.dept || "",
          year: user.year || 1,
        });
        
        // Fetch user's listings
        if (user.userID) {
          const listingsResponse = await axios.get(
            `http://localhost:4000/api/listings/${user.userID}`,
            { withCredentials: true }
          );
          
          if (listingsResponse.data.success) {
            setUserListings(listingsResponse.data.data);
          }
        }
      } catch (err: any) {
        console.error("Error fetching profile data:", err);
        setError(err.response?.data?.message || "Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [form]);

  // Form submission handler
  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      if (!userData?.userID) return;
      
      const response = await axios.put(
        `http://localhost:4000/api/user/profile`,
        data,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update local user data
        setUserData({
          ...userData,
          ...data
        });
        
        // Update localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          localStorage.setItem('user', JSON.stringify({
            ...user,
            ...data
          }));
        }
        
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  // Get program display name
  const getProgramDisplay = (program: string = "") => {
    switch (program) {
      case "undergraduate": return "Undergraduate";
      case "BSc in SWE": return "BSc in SWE";
      case "BSc in CSE": return "BSc in CSE";
      case "graduate": return "Graduate (Masters)";
      case "phd": return "Ph.D.";
      default: return program;
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // No user data
  if (!userData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Please log in</h2>
            <p className="text-muted-foreground">You need to be logged in to view your profile.</p>
            <Link href="/login">
              <Button className="mt-4">
                Go to Login
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-gray-950 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="col-span-1">
              <Card className="sticky top-8">
                <CardHeader className="pb-2 text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24 border-4 border-primary/10 bg-primary/5">
                      <AvatarFallback className="bg-primary/10 text-2xl font-semibold">
                        {userData.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-2xl">{userData.name}</CardTitle>
                  {userData.university && (
                    <CardDescription className="mt-1 flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 mr-1" /> {userData.university}
                    </CardDescription>
                  )}
                  {(userData.program || userData.year) && (
                    <div className="flex justify-center items-center gap-1 mt-2">
                      {userData.program && (
                        <Badge variant="outline" className="bg-primary/10">
                          {getProgramDisplay(userData.program)}
                        </Badge>
                      )}
                      {userData.year && (
                        <Badge variant="secondary">{`Year ${userData.year}`}</Badge>
                      )}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="mt-4">
                    <Separator className="my-4" />
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{userData.email}</span>
                      </div>
                      
                      {userData.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{userData.phone}</span>
                        </div>
                      )}
                      
                      {userData.dept && (
                        <div className="flex items-center gap-3">
                          <Map className="h-4 w-4 text-muted-foreground" />
                          <span>{userData.dept}</span>
                        </div>
                      )}
                      
                      {userData.dob && (
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Born {formatDate(userData.dob)}</span>
                        </div>
                      )}
                      
                      {userData.createdAt && (
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Member since {formatDate(userData.createdAt)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator className="my-4" />
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                          Update your profile information
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your email address" {...field} disabled />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="01XXXXXXXXX" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="dept"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Department</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="year"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Academic Year</FormLabel>
                                  <FormControl>
                                    <Input type="number" min={1} max={5} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-4 pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="col-span-1 md:col-span-2">
              <Tabs defaultValue="listings" className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="listings">My Listings</TabsTrigger>
                </TabsList>
                
                {/* Listings Tab */}
                <TabsContent value="listings">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Your Listings</CardTitle>
                        <CardDescription>
                          Items and services you're currently selling
                        </CardDescription>
                      </div>
                      <Link href="/sell">
                        <Button size="sm" className="gap-1">
                          <Plus className="h-4 w-4" />
                          New Listing
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      {userListings.length === 0 ? (
                        <EmptyState 
                          icon={<Package className="h-10 w-10 text-muted-foreground" />}
                          title="No Listings Yet"
                          description="Start selling items or services to other students"
                          action={
                            <Link href="/sell">
                              <Button>Create Your First Listing</Button>
                            </Link>
                          }
                        />
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {userListings.map(listing => (
                            <Card key={listing._id} className="overflow-hidden">
                              <div className="flex flex-col sm:flex-row">
                                <div className="w-full sm:w-32 h-32 relative bg-muted flex items-center justify-center">
                                  {listing.images && listing.images.length > 0 ? (
                                    <Image 
                                      src={listing.images[0]} 
                                      alt={listing.title}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="text-2xl font-semibold text-muted-foreground">
                                      {listing.category ? listing.category.charAt(0).toUpperCase() : 'L'}
                                    </div>
                                  )}
                                  <Badge 
                                    className={`absolute top-2 left-2 ${
                                      listing.status === 'active' ? 'bg-green-500' : 
                                      listing.status === 'sold' ? 'bg-blue-500' : 'bg-amber-500'
                                    }`}
                                  >
                                    {listing.status === 'active' ? 'Active' : 
                                     listing.status === 'sold' ? 'Sold' : 'Pending'}
                                  </Badge>
                                </div>
                                <div className="p-4 flex-grow">
                                  <div className="flex justify-between">
                                    <h3 className="font-medium">{listing.title}</h3>
                                    <span className="font-bold">${listing.type === "service" ? listing.hourlyRate : listing.price}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline">{listing.category}</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      Posted on {formatDate(listing.createdAt)}
                                    </span>
                                  </div>
                                  <div className="flex gap-2 mt-4">
                                    <Link href={`/listing/edit/${listing._id}`}>
                                      <Button variant="outline" size="sm">Edit</Button>
                                    </Link>
                                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                      Delete
                                    </Button>
                                    {listing.status === 'active' && (
                                      <Button variant="outline" size="sm" className="ml-auto">
                                        Mark as Sold
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Reusable empty state component
function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: { 
  icon: React.ReactNode,
  title: string,
  description: string,
  action: React.ReactNode
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-4">{icon}</div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-1 mb-6">
        {description}
      </p>
      {action}
    </div>
  )
}