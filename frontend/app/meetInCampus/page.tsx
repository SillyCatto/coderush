"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import Image from "next/image"
import Link from "next/link"
import { Book, Filter, Laptop, MessageCircle, School, Pencil, Search, SlidersHorizontal, Users, Zap } from "lucide-react"
import Header from "@/app/components/layout/header"
import Footer from "@/app/components/layout/footer"
import { ChatPopup } from "@/app/components/chat/chat-popup"
import { LocationPicker } from "@/app/components/map/location-picker"

// Mock data for items
const ITEMS_DATA = [
  {
    id: 1,
    title: "Calculus Textbook",
    description: "Early Transcendentals, 8th Edition by James Stewart",
    price: 45,
    location: "Main Campus",
    condition: "Like New",
    category: "textbook",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=500",
    seller: "Alex Johnson",
    sellerId: "alex123",
    postedDate: "2 days ago"
  },
  {
    id: 2,
    title: "MacBook Air (2020)",
    description: "M1 chip, 8GB RAM, 256GB SSD, excellent condition",
    price: 750,
    location: "North Campus",
    condition: "Used - Good",
    category: "gadget",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=500",
    seller: "Samantha Lee",
    sellerId: "sam456",
    postedDate: "5 days ago"
  },
  {
    id: 3,
    title: "Physics for Scientists & Engineers",
    description: "4th Edition with online access code included",
    price: 55,
    location: "Science Building",
    condition: "Good",
    category: "textbook",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500",
    seller: "Michael Wong",
    sellerId: "mike789",
    postedDate: "1 week ago"
  },
  {
    id: 4,
    title: "iPad Pro 11\" (2021)",
    description: "With Apple Pencil and Magic Keyboard, perfect for notes",
    price: 820,
    location: "Student Center",
    condition: "Like New",
    category: "gadget",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=500",
    seller: "Emma Taylor",
    sellerId: "emma101",
    postedDate: "3 days ago"
  }
];

// Mock data for services
const SERVICES_DATA = [
  {
    id: 101,
    title: "Calculus Tutoring",
    description: "One-on-one tutoring for Calculus I, II, and III",
    price: 25,
    priceUnit: "per hour",
    location: "Online or In-person",
    category: "tutoring",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=500",
    seller: "Prof. Sarah Miller",
    sellerId: "sarah222",
    rating: 4.9,
    postedDate: "1 day ago"
  },
  {
    id: 102,
    title: "Web Development",
    description: "Custom website development with React and Next.js",
    price: 200,
    priceUnit: "starting at",
    location: "Remote",
    category: "skill",
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=500",
    seller: "Rob Chen",
    sellerId: "rob333",
    rating: 4.7,
    postedDate: "3 days ago"
  },
  {
    id: 103,
    title: "Essay Editing & Proofreading",
    description: "Professional editing for essays and term papers",
    price: 15,
    priceUnit: "per page",
    location: "Online",
    category: "skill",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500",
    seller: "Dr. Emily White",
    sellerId: "emily444",
    rating: 4.8,
    postedDate: "2 days ago"
  },
  {
    id: 104,
    title: "Organic Chemistry Tutoring",
    description: "Help with reaction mechanisms, lab reports, and exam prep",
    price: 30,
    priceUnit: "per hour",
    location: "Chemistry Building or Online",
    category: "tutoring",
    image: "https://images.unsplash.com/photo-1532634993-15f421e42ec0?q=80&w=500",
    seller: "Thomas Grant",
    sellerId: "tom555",
    rating: 4.9,
    postedDate: "1 week ago"
  }
];

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // States for chat popup
  const [chatOpen, setChatOpen] = useState(false)
  const [activeSeller, setActiveSeller] = useState<any>(null)
  const [activeItem, setActiveItem] = useState<any>(null)
  
  // States for location picker
  const [locationPickerOpen, setLocationPickerOpen] = useState(false)
  const [meetupSeller, setMeetupSeller] = useState<any>(null)
  const [meetupItem, setMeetupItem] = useState<any>(null)

  // Filter items based on search and category
  const filteredItems = ITEMS_DATA.filter(item => {
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedCategory === "all") return matchesQuery
    return matchesQuery && item.category === selectedCategory
  })

  // Filter services based on search and category
  const filteredServices = SERVICES_DATA.filter(service => {
    const matchesQuery = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedCategory === "all") return matchesQuery
    return matchesQuery && service.category === selectedCategory
  })

  // Handle location selection and send to backend
  const handleLocationConfirm = async (location: { lat: number; lng: number; name?: string }) => {
    if (!meetupSeller || !meetupItem) return
    
    try {
      // Here you would send the data to your backend API
      console.log("Sending meetup request to backend:", {
        sellerId: meetupSeller.id,
        sellerName: meetupSeller.name,
        itemId: meetupItem.id,
        itemTitle: meetupItem.title,
        itemType: meetupItem.type,
        location
      })
      
      // Example API call (uncomment when you have a backend endpoint)
      // const response = await fetch('/api/meetups', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     sellerId: meetupSeller.id,
      //     itemId: meetupItem.id,
      //     itemType: meetupItem.type,
      //     location
      //   })
      // })
      
      // Show success message - use toast if you have it imported
      alert('Meetup request sent successfully!')
      // or if you have a toast component:
      // toast({
      //   title: "Meetup Request Sent!",
      //   description: `Your request to meet at ${location.name || "the selected location"} has been sent to ${meetupSeller.name}.`,
      // })
      
      // Open chat with the seller after confirming location
      setActiveSeller(meetupSeller)
      setActiveItem(meetupItem)
      setChatOpen(true)
      
      // Close the location picker
      setLocationPickerOpen(false)
      setMeetupSeller(null)
      setMeetupItem(null)
      
    } catch (error) {
      console.error("Failed to send meetup request:", error)
      alert('Failed to send meetup request. Please try again.')
    }
  }

  // Helper function to render appropriate icon for category
  const CategoryIcon = ({ category }: { category: string }) => {
    switch (category) {
      case 'textbook':
        return <Book className="h-4 w-4 mr-1" />
      case 'gadget':
        return <Laptop className="h-4 w-4 mr-1" />
      case 'tutoring':
        return <Pencil className="h-4 w-4 mr-1" />
      case 'skill':
        return <Zap className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-2">Discover items in the campus - More Secure, More Reliable</h1>
          <p className="text-muted-foreground mb-8">
            Uncomfortable with online transactions? Meet in campus to buy and sell items securely.
          </p>

          {/* Search and Filter Bar */}
          <div className="flex gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search for items or services..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex gap-2" onClick={() => setSelectedCategory(selectedCategory === "all" ? "textbook" : "all")}>
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {selectedCategory === "all" ? "Filter" : "Clear"}
                </span>
              </Button>
              
              <Button variant="outline" className="flex gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Sort</span>
              </Button>
            </div>
          </div>

          {/* Tabs for Items and Services */}
          <Tabs defaultValue="items" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="items" className="text-base">
                <Laptop className="h-4 w-4 mr-2" /> Tangible Items
              </TabsTrigger>
              <TabsTrigger value="services" className="text-base">
                <Users className="h-4 w-4 mr-2" /> Services
              </TabsTrigger>
            </TabsList>
            
            {/* Items Tab Content */}
            <TabsContent value="items">
              {selectedCategory !== "all" && selectedCategory !== "tutoring" && selectedCategory !== "skill" && (
                <div className="mb-6">
                  <Badge variant="outline" className="text-sm py-1">
                    <CategoryIcon category={selectedCategory} />
                    {selectedCategory === "textbook" ? "Textbooks" : "Gadgets"}
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
                    <div key={item.id} className="group">
                      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                        <Link href={`/item/${item.id}`}>
                          <div className="aspect-video relative overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between mb-2">
                              <Badge variant="secondary">${item.price}</Badge>
                              <span className="text-sm text-muted-foreground">{item.postedDate}</span>
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
                            <div className="text-sm">{item.location}</div>
                            <div className="text-sm font-medium">{item.seller}</div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              // Set meetup seller and item info for the location picker
                              setMeetupSeller({
                                id: item.sellerId,
                                name: item.seller
                              });
                              setMeetupItem({
                                id: item.id,
                                title: item.title,
                                type: "product"
                              });
                              // Open the location picker dialog
                              setLocationPickerOpen(true);
                            }}
                          >
                            <School className="h-4 w-4 mr-2" />
                            Meet in their Campus
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
              {selectedCategory !== "all" && selectedCategory !== "textbook" && selectedCategory !== "gadget" && (
                <div className="mb-6">
                  <Badge variant="outline" className="text-sm py-1">
                    <CategoryIcon category={selectedCategory} />
                    {selectedCategory === "tutoring" ? "Tutoring" : "Skills & Services"}
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
                    <div key={service.id} className="group">
                      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                        <Link href={`/service/${service.id}`}>
                          <div className="aspect-video relative overflow-hidden">
                            <Image
                              src={service.image}
                              alt={service.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between mb-2">
                              <Badge variant="secondary">
                                ${service.price} <span className="text-xs">{service.priceUnit}</span>
                              </Badge>
                              <span className="text-sm text-muted-foreground">{service.postedDate}</span>
                            </div>
                            <h3 className="text-lg font-medium mb-1">{service.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {service.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <CategoryIcon category={service.category} />
                                <span className="capitalize">{service.category}</span>
                              </div>
                              <div className="flex items-center">
                                <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-sm font-medium">{service.rating}/5.0</span>
                              </div>
                            </div>
                          </CardContent>
                        </Link>
                        <CardFooter className="px-4 py-3 border-t bg-muted/50 flex flex-col gap-2">
                          <div className="flex justify-between w-full">
                            <div className="text-sm">{service.location}</div>
                            <div className="text-sm font-medium">{service.seller}</div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              // Set meetup seller and item info for the location picker
                              setMeetupSeller({
                                id: service.sellerId,
                                name: service.seller
                              });
                              setMeetupItem({
                                id: service.id,
                                title: service.title,
                                type: "service"
                              });
                              // Open the location picker dialog
                              setLocationPickerOpen(true);
                            }}
                          >
                            <School className="h-4 w-4 mr-2" />
                            Meet in their Campus
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Chat popup */}
          {activeSeller && activeItem && (
            <ChatPopup 
              isOpen={chatOpen} 
              onClose={() => setChatOpen(false)} 
              seller={activeSeller} 
              item={activeItem}
            />
          )}
          
          {/* Location picker dialog */}
          {meetupSeller && meetupItem && (
            <LocationPicker 
              isOpen={locationPickerOpen}
              onClose={() => {
                setLocationPickerOpen(false);
                setMeetupSeller(null);
                setMeetupItem(null);
              }}
              onConfirm={handleLocationConfirm}
              sellerName={meetupSeller.name}
              itemTitle={meetupItem.title}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}