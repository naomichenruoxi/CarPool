import { MapPin, Clock, Route } from "lucide-react";

interface MapPlaceholderProps {
  distance: number;
  duration: number;
  detour: number;
}

/**
 * MapPlaceholder Component
 * 
 * This is a placeholder component that will be replaced with a real Google Maps
 * integration in the future.
 * 
 * TODO: Replace with actual Google Maps implementation:
 * - Install @react-google-maps/api package
 * - Add GOOGLE_MAPS_API_KEY to environment variables
 * - Mount <GoogleMap> component with <DirectionsRenderer> for route visualization
 * - Use Places Autocomplete for origin/destination inputs
 * 
 * Example future implementation:
 * ```tsx
 * import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
 * 
 * const Map = ({ origin, destination }) => {
 *   const { isLoaded } = useJsApiLoader({ googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY });
 *   // ... directions service logic
 *   return <GoogleMap><DirectionsRenderer directions={directions} /></GoogleMap>;
 * };
 * ```
 */
const MapPlaceholder = ({ distance, duration, detour }: MapPlaceholderProps) => {
  return (
    <div className="w-full rounded-2xl bg-muted/50 border-2 border-dashed border-border overflow-hidden">
      {/* Map container - Replace this div with GoogleMap component */}
      <div className="h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground font-medium">
            Route visualization will render here
          </p>
          <p className="text-xs text-muted-foreground/60">
            Google Maps integration coming soon
          </p>
        </div>
      </div>

      {/* Route statistics */}
      <div className="grid grid-cols-3 divide-x divide-border bg-card p-4">
        <div className="text-center px-2">
          <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
            <Route className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Distance</span>
          </div>
          <p className="text-xl font-bold text-foreground">{distance} km</p>
        </div>
        
        <div className="text-center px-2">
          <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Duration</span>
          </div>
          <p className="text-xl font-bold text-foreground">{duration} min</p>
        </div>
        
        <div className="text-center px-2">
          <div className="flex items-center justify-center gap-1.5 text-accent mb-1">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Detour</span>
          </div>
          <p className="text-xl font-bold text-foreground">+{detour} km</p>
        </div>
      </div>
    </div>
  );
};

export default MapPlaceholder;
