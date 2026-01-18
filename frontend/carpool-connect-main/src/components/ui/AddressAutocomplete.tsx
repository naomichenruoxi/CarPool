import { useEffect, useState } from "react";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressAutocompleteProps {
    value: string;
    onChange: (value: string, lat?: number, lng?: number) => void;
    onValidationChange?: (isValid: boolean) => void;
    isValid?: boolean;
    placeholder?: string;
    className?: string;
    country?: string;
}

const AddressAutocomplete = ({ value, onChange, onValidationChange, isValid, placeholder = "Search address...", className }: AddressAutocompleteProps) => {
    const [open, setOpen] = useState(false);

    // CRITICAL FIX: Check if API Key and Script are actually available.
    // If not, fall back to a simple Input to avoid locking the UI.
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    // Check if google global is available (script loaded)
    const isScriptLoaded = typeof window !== 'undefined' && (window as any).google && (window as any).google.maps;

    // Use a fallback mode if no key is provided
    // We cannot call usePlacesAutocomplete conditionally, so we must separate the component 
    // or return early before the hook if possible (not in React).
    // Actually, hooks must be called unconditionally.
    // So we will render a "Smart" component or a "Dumb" component based on the key.

    if (!apiKey) {
        return (
            <div className="relative w-full">
                <Input
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn("w-full", className)}
                />
            </div>
        );
    }

    // If key exists, we render the smart component
    return <GooglePlacesInput value={value} onChange={onChange} onValidationChange={onValidationChange} isValid={isValid} placeholder={placeholder} className={className} />;
};

// Inner component that uses the hook (only rendered if API key is present)
const GooglePlacesInput = ({ value, onChange, onValidationChange, isValid, placeholder, className }: AddressAutocompleteProps) => {
    const [open, setOpen] = useState(false);
    const requestOptions = {
        types: ["address"],
        ...(country ? { componentRestrictions: { country } } : {})
    };
    const {
        ready,
        value: searchValue,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions,
        debounce: 300,
        defaultValue: value,
    });

    // Sync with parent value updates
    useEffect(() => {
        if (value !== searchValue) {
            setValue(value, false);
        }
    }, [value, setValue]);

    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();
        setOpen(false);

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            onChange(address, lat, lng);
            // Mark as valid when user selects from dropdown
            onValidationChange?.(true);
        } catch (error) {
            console.error("Error: ", error);
            onChange(address);
            // Still mark as invalid if geocoding fails
            onValidationChange?.(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative w-full">
                    <div className="relative">
                        <Input
                            placeholder={placeholder}
                            value={searchValue}
                            onChange={(e) => {
                                setValue(e.target.value);
                                onChange(e.target.value);
                                // Invalidate when user types (they need to select again)
                                onValidationChange?.(false);
                                if (!open) setOpen(true);
                            }}
                            disabled={false}
                            className={cn("w-full pr-8", className, isValid === false && searchValue.length > 0 && "border-orange-400 focus:border-orange-400")}
                            onFocus={() => setOpen(true)}
                        />
                        {/* Validation indicator */}
                        {searchValue.length > 0 && (
                            isValid ? (
                                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                            ) : (
                                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-400 animate-pulse" />
                            )
                        )}
                        {!ready && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground opacity-50" />}
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                <Command>
                    <CommandList>
                        {status === "OK" && data.map(({ place_id, description }) => (
                            <CommandItem
                                key={place_id}
                                onSelect={() => handleSelect(description)}
                            >
                                <MapPin className="mr-2 h-4 w-4 opacity-50" />
                                {description}
                            </CommandItem>
                        ))}
                        {status === "ZERO_RESULTS" && <CommandEmpty>No results found.</CommandEmpty>}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default AddressAutocomplete;
