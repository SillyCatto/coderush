"use client"

import { useState } from "react"
import { format } from "date-fns"
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
import { Pencil, User, Phone, Mail, GraduationCap, Map, Calendar, Package, Clock, Plus } from "lucide-react"
import Header from "@/app/components/layout/header"
import Footer from "@/app/components/layout/footer"
import Link from "next/link"

// Dummy user data
const dummyUser = {
  id: "u12345",
  name: "Alex Johnson",
  email: "alex.johnson@iut-dhaka.edu",
  university: "Islamic University of Technology",
  department: "Computer Science and Engineering",
  year: 3,
  phone: "01712345678",
  program: "undergraduate",
  dob: new Date("2001-05-15"),
  role: "user",
  createdAt: new Date("2023-09-01"),
  bio: "Computer Science student passionate about web development and AI. Looking for tech books and study groups!",
  listings: [
    {
      id: "l1",
      title: "Data Structures Textbook",
      price: 45,
      status: "active",
      category: "textbook",
      createdAt: new Date("2024-03-15"),
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500"
    },
    {
      id: "l2",
      title: "Graphics Tablet",
      price: 120,
      status: "sold",
      category: "electronics",
      createdAt: new Date("2024-02-10"),
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=500"
    }
  ],
  memberSince: "Sep 2023"
}

// Form schema for profile edit
const profileFormSchema = z.object({
  name: z.string().min(6, "Name must be at least 6 characters").max(50),
  bio: z.string().max(250, "Bio must not exceed 250 characters").optional(),
  phone: z.string().min(11, "Please enter a valid phone number"),
  department: z.string(),
  year: z.coerce.number().min(1).max(5)
})

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  
  // Initialize form
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: dummyUser.name,
      bio: dummyUser.bio || "",
      phone: dummyUser.phone,
      department: dummyUser.department,
      year: dummyUser.year,
    },
  })

  // Form submission handler
  const onSubmit = (data: z.infer<typeof profileFormSchema>) => {
    console.log("Profile updated:", data)
    setIsEditing(false)
    // Here you would typically call an API to update the user profile
  }

  const formatDate = (date: Date) => {
    return format(date, "MMMM d, yyyy")
  }

  // Get program display name
  const getProgramDisplay = (program: string) => {
    switch (program) {
      case "undergraduate": return "Undergraduate"
      case "graduate": return "Graduate (Masters)"
      case "phd": return "Ph.D."
      default: return program
    }
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
                        {dummyUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-2xl">{dummyUser.name}</CardTitle>
                  <CardDescription className="mt-1 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 mr-1" /> {dummyUser.university}
                  </CardDescription>
                  <div className="flex justify-center items-center gap-1 mt-2">
                    <Badge variant="outline" className="bg-primary/10">
                      {getProgramDisplay(dummyUser.program)}
                    </Badge>
                    <Badge variant="secondary">{`Year ${dummyUser.year}`}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="mt-4">
                    <Separator className="my-4" />
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{dummyUser.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{dummyUser.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Map className="h-4 w-4 text-muted-foreground" />
                        <span>{dummyUser.department}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Born {formatDate(dummyUser.dob)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Member since {dummyUser.memberSince}</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {dummyUser.bio}
                    </p>
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
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Tell others about yourself" 
                                    className="resize-none" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Max 250 characters
                                </FormDescription>
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
                              name="department"
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
              <Tabs defaultValue="listings" className="w-full">                <TabsList className="grid w-full grid-cols-1">
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
                      {dummyUser.listings.length === 0 ? (
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
                          {dummyUser.listings.map(listing => (
                            <Card key={listing.id} className="overflow-hidden">
                              <div className="flex flex-col sm:flex-row">
                                <div className="w-full sm:w-32 h-32 relative bg-muted flex items-center justify-center">
                                  <div className="text-2xl font-semibold text-muted-foreground">
                                    {listing.category.charAt(0).toUpperCase()}
                                  </div>
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
                                    <span className="font-bold">${listing.price}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline">{listing.category}</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      Posted on {formatDate(listing.createdAt)}
                                    </span>
                                  </div>
                                  <div className="flex gap-2 mt-4">
                                    <Button variant="outline" size="sm">Edit</Button>
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