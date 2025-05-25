"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Book, Filter, Laptop, MessageCircle, Pencil, Search, SlidersHorizontal, Users, Zap } from "lucide-react"
import Header from "@/app/components/layout/header"
import Footer from "@/app/components/layout/footer"
import { ChatPopup } from "@/app/components/chat/chat-popup"
import axios from "axios"

// Define types for listings
interface Seller {
  _id: string;
  name: string;
  university: string;
}

interface Bid {
  user: string;
  amount: number;
  _id: string;
  timestamp: string;
}

interface Listing {
  _id: string;
  title: string;
  description: string;
  type: "item" | "service";
  price: number;
  hourlyRate: number | null;
  condition: string;
  category: string;
  visibility: string;
  seller: Seller;
  university: string;
  images: string[];
  status: string;
  biddingEnabled: boolean;
  bids?: Bid[];
  createdAt: string;
  updatedAt: string;
}

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for real data from API
  const [listings, setListings] = useState<Listing[]>([])
  
  // Add these states for the chat popup
  const [chatOpen, setChatOpen] = useState(false)
  const [activeSeller, setActiveSeller] = useState<any>(null)
  const [activeItem, setActiveItem] = useState<any>(null)

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true)
        
        // Get auth token from localStorage
        const user = localStorage.getItem('user')
        if (!user) {
          throw new Error("You need to be logged in to view listings")
        }
        
        // Fetch listings from API
        const response = await axios.get(
          "http://localhost:4000/api/listings",
          { withCredentials: true }
        )
        
        if (response.data && response.data.data) {
          setListings(response.data.data)
        }
      } catch (err: any) {
        console.error("Error fetching listings:", err)
        setError(err.message || "Failed to load listings")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchListings()
  }, [])
  
  // Filter items and services based on search and category
  const filteredItems = listings
    .filter(listing => listing.type === "item")
    .filter(listing => {
      const matchesQuery = 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (selectedCategory === "all") return matchesQuery
      return matchesQuery && listing.category === selectedCategory
    })
  
  const filteredServices = listings
    .filter(listing => listing.type === "service")
    .filter(listing => {
      const matchesQuery = 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (selectedCategory === "all") return matchesQuery
      return matchesQuery && listing.category === selectedCategory
    })

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffDays / 30)} months ago`;
    }
  };
  
  // Helper function to render appropriate icon for category
  const CategoryIcon = ({ category }: { category: string }) => {
    switch(category) {
      case 'textbooks':
        return <Book className="h-3.5 w-3.5 mr-1.5" />
      case 'electronics':
        return <Laptop className="h-3.5 w-3.5 mr-1.5" />
      case 'tutoring':
        return <Pencil className="h-3.5 w-3.5 mr-1.5" />
      case 'skill':
        return <Zap className="h-3.5 w-3.5 mr-1.5" />
      default:
        return <Laptop className="h-3.5 w-3.5 mr-1.5" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col justify-center items-center h-64">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Discover</h1>
          <p className="text-muted-foreground mb-8">
            Find textbooks, gadgets, tutoring services, and more from other students
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
            {/* Filters */}
            <div className="space-y-6">
              <div className="flex items-center rounded-lg border px-3 focus-within:ring-1 focus-within:ring-ring">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for items or services..." 
                  className="border-0 focus-visible:ring-0" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </h3>
                <div className="space-y-4">
                  <Button 
                    variant={selectedCategory === "all" ? "default" : "outline"} 
                    className="w-full justify-start" 
                    onClick={() => setSelectedCategory("all")}
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" /> All Categories
                  </Button>
                  <Button 
                    variant={selectedCategory === "electronics" ? "default" : "outline"} 
                    className="w-full justify-start" 
                    onClick={() => setSelectedCategory("electronics")}
                  >
                    <Laptop className="h-4 w-4 mr-2" /> Electronics
                  </Button>
                  <Button 
                    variant={selectedCategory === "textbooks" ? "default" : "outline"} 
                    className="w-full justify-start" 
                    onClick={() => setSelectedCategory("textbooks")}
                  >
                    <Book className="h-4 w-4 mr-2" /> Textbooks
                  </Button>
                  <Button 
                    variant={selectedCategory === "tutoring" ? "default" : "outline"} 
                    className="w-full justify-start" 
                    onClick={() => setSelectedCategory("tutoring")}
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Tutoring Services
                  </Button>
                  <Button 
                    variant={selectedCategory === "other" ? "default" : "outline"} 
                    className="w-full justify-start" 
                    onClick={() => setSelectedCategory("other")}
                  >
                    <Users className="h-4 w-4 mr-2" /> Other Services
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <Tabs defaultValue="items">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="items">
                  <Laptop className="h-4 w-4 mr-2" /> Tangible Items
                </TabsTrigger>
                <TabsTrigger value="services">
                  <Users className="h-4 w-4 mr-2" /> Services
                </TabsTrigger>
              </TabsList>
              
              {/* Items Tab Content */}
              <TabsContent value="items">
                {selectedCategory !== "all" && selectedCategory !== "tutoring" && selectedCategory !== "other" && (
                  <div className="mb-6">
                    <Badge variant="outline" className="text-sm py-1">
                      <CategoryIcon category={selectedCategory} />
                      {selectedCategory === "textbooks" ? "Textbooks" : "Electronics"}
                      <button className="ml-2 hover:text-destructive" onClick={() => setSelectedCategory("all")}>✕</button>
                    </Badge>
                  </div>
                )}
                
                {filteredItems.length === 0 ? (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-medium">No items found</h3>
                    <p className="text-muted-foreground mt-2">
                      Try changing your search query or filter
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <div key={item._id} className="group">
                        <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                          <Link href={`/item/${item._id}`}>
                            <div className="aspect-video relative overflow-hidden">
                              {item.images && item.images.length > 0 ? (
                                <Image
                                  src={item.images[0]}
                                  alt={item.title}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500">
                                  No Image
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <div className="flex justify-between mb-2">
                                <Badge variant="secondary">${item.price}</Badge>
                                <span className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</span>
                              </div>
                              <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {item.description}
                              </p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <CategoryIcon category={item.category} />
                                <span className="capitalize">{item.category}</span>
                                <span className="mx-2">•</span>
                                <span>{item.condition}</span>
                              </div>
                            </CardContent>
                          </Link>
                          <CardFooter className="px-4 py-3 border-t bg-muted/50 flex flex-col gap-2">
                            <div className="flex justify-between w-full">
                              <div className="text-sm">{item.university}</div>
                              <div className="text-sm font-medium">{item.seller.name}</div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                setActiveSeller({
                                  id: item.seller._id,
                                  name: item.seller.name
                                });
                                setActiveItem({
                                  id: item._id,
                                  title: item.title,
                                  type: "product"
                                });
                                setChatOpen(true);
                              }}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Chat with Seller
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Services Tab Content */}
              <TabsContent value="services">
                {selectedCategory !== "all" && selectedCategory !== "textbooks" && selectedCategory !== "electronics" && (
                  <div className="mb-6">
                    <Badge variant="outline" className="text-sm py-1">
                      <CategoryIcon category={selectedCategory} />
                      {selectedCategory === "tutoring" ? "Tutoring" : "Other Services"}
                      <button className="ml-2 hover:text-destructive" onClick={() => setSelectedCategory("all")}>✕</button>
                    </Badge>
                  </div>
                )}
                
                {filteredServices.length === 0 ? (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-medium">No services found</h3>
                    <p className="text-muted-foreground mt-2">
                      Try changing your search query or filter
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                      <div key={service._id} className="group">
                        <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                          <Link href={`/service/${service._id}`}>
                            <div className="aspect-video relative overflow-hidden">
                              {service.images && service.images.length > 0 ? (
                                <Image
                                  src={service.images[0]}
                                  alt={service.title}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500">
                                  No Image
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <div className="flex justify-between mb-2">
                                <div className="font-medium">
                                  ${service.hourlyRate} <span className="text-xs">per hour</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{formatDate(service.createdAt)}</span>
                              </div>
                              <h3 className="text-lg font-medium mb-1">{service.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {service.description}
                              </p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <CategoryIcon category={service.category} />
                                <span className="capitalize">{service.category}</span>
                              </div>
                            </CardContent>
                          </Link>
                          <CardFooter className="px-4 py-3 border-t bg-muted/50 flex flex-col gap-2">
                            <div className="flex justify-between w-full">
                              <div className="text-sm">{service.university}</div>
                              <div className="text-sm font-medium">{service.seller.name}</div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                setActiveSeller({
                                  id: service.seller._id,
                                  name: service.seller.name
                                });
                                setActiveItem({
                                  id: service._id,
                                  title: service.title,
                                  type: "service"
                                });
                                setChatOpen(true);
                              }}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Chat with Seller
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Chat popup if active */}
        {activeSeller && activeItem && (
          <ChatPopup
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            seller={activeSeller}
            item={activeItem}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}