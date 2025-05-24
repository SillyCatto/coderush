"use client"

import { useState, useEffect } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"
import { LeafletCss } from "./leaflet-css"
import L from "leaflet"

// Fix for marker icons
const fixMarkerIcon = () => {
  // Only run on client
  if (typeof window !== "undefined") {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
    });
  }
};

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)
// Import useMapEvents hook directly
import { useMapEvents } from 'react-leaflet';

// Map click handler component
function MapClickHandler({ onClick }: { onClick: (e: any) => void }) {
  useMapEvents({
    click: onClick
  })
  return null
}

// Default center - set to a general university location
const defaultCenter = {
  lat: 40.1092, 
  lng: -88.2272
}

type LocationPickerProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (location: { lat: number; lng: number; name?: string }) => void
  sellerName: string
  itemTitle: string
}

export function LocationPicker({ 
  isOpen, 
  onClose, 
  onConfirm,
  sellerName,
  itemTitle
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name?: string } | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Initialize map on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Fix marker icons when component mounts
      fixMarkerIcon();
      setMapReady(true)
      
      // Clean up function
      return () => {
        setSelectedLocation(null)
      }
    }
  }, [])

  // Handle map click
  const handleMapClick = (e: any) => {
    setSelectedLocation({
      lat: e.latlng.lat,
      lng: e.latlng.lng
    })
  }

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Use Nominatim search API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      
      const results = await response.json();
      setSearchResults(results);
      
      // If we have results, select the first one
      if (results.length > 0) {
        const firstResult = results[0];
        setSelectedLocation({
          lat: parseFloat(firstResult.lat),
          lng: parseFloat(firstResult.lon),
          name: firstResult.display_name
        });
      }
    } catch (error) {
      console.error("Error searching locations:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search result selection
  const selectSearchResult = (result: any) => {
    setSelectedLocation({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      name: result.display_name
    });
    setSearchResults([]);
    setSearchQuery("");
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (selectedLocation) {
      onConfirm(selectedLocation)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select a Meeting Location</DialogTitle>
          <DialogDescription>
            Choose a safe public location to meet {sellerName} for {itemTitle}
          </DialogDescription>
        </DialogHeader>

        {/* Add Leaflet CSS */}
        <LeafletCss />

        {/* Search field */}
        <div className="relative mb-4">
          <div className="flex">
            <Input
              type="text"
              placeholder="Search for a location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
              className="ml-2"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
          
          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 focus:bg-slate-100 border-b last:border-b-0"
                  onClick={() => selectSearchResult(result)}
                >
                  {result.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        {!mapReady ? (
          <div className="w-full h-[400px] flex items-center justify-center bg-muted">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <div className="mt-2 text-sm text-muted-foreground">Loading map...</div>
            </div>
          </div>
        ) : (
          <>
            <div className="h-[400px] w-full relative">
              <MapContainer
                center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [defaultCenter.lat, defaultCenter.lng]}
                zoom={selectedLocation ? 16 : 13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Selected location marker */}
                {selectedLocation && (
                  <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                    <Popup>
                      <div>
                        <strong>Meeting Point</strong>
                        {selectedLocation.name && <p className="text-sm">{selectedLocation.name}</p>}
                      </div>
                    </Popup>
                  </Marker>
                )}
                
                {/* Map click handler */}
                <MapClickHandler onClick={handleMapClick} />
              </MapContainer>
            </div>

            {selectedLocation && (
              <div className="mt-4 p-3 bg-muted rounded-md flex items-center">
                <MapPin className="text-primary mr-2 h-4 w-4" />
                <div>
                  <p className="font-medium text-sm">
                    {selectedLocation.name 
                      ? `Meeting at: ${selectedLocation.name}` 
                      : "Custom location selected"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Coordinates: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedLocation}
          >
            Confirm Meeting Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}