"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LocationPickerProps } from "./location-picker";

// Placeholder component to show while map is loading
export function MapPlaceholder() {
  return (
    <div className="w-full h-[400px] flex items-center justify-center bg-muted">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <div className="mt-2 text-sm text-muted-foreground">Loading map...</div>
      </div>
    </div>
  );
}

// Dynamic import of the location picker with no SSR
export const LocationPickerWithNoSSR = dynamic<LocationPickerProps>(
  () => import("./location-picker").then((mod) => mod.LocationPicker),
  { 
    ssr: false,
    loading: () => <MapPlaceholder />
  }
);