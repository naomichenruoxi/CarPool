import api from "@/lib/axios";

export interface TripData {
  startLocation: string;
  destination: string;
  date: Date; // or string
  time: string;
  seats?: number;
  role: "driver" | "carpooler";
  price?: number;
  car?: string;
  amenities?: string[];
}

export interface MatchResult {
  id: number;
  origin: string;
  destination: string;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  driver: {
    name: string;
    personalityProfile: any;
  };
  matchMetrics?: {
    detour: number;
    overlap: string;
  };
  aiExplanation?: string;
}

// Create a Trip (Driver)
export async function submitTrip(tripData: TripData): Promise<{ success: boolean; tripId: string }> {
  try {
    const response = await api.post('/trips', {
      origin: tripData.startLocation,
      destination: tripData.destination,
      departureTime: `${tripData.date}T${tripData.time}:00.000Z`, // Simplified ISO construction
      availableSeats: tripData.seats || 3,
      pricePerSeat: tripData.price || 10,
    });
    return { success: true, tripId: response.data.id.toString() };
  } catch (error) {
    console.error("Failed to submit trip:", error);
    return { success: false, tripId: "" };
  }
}

// Search Matches (Passenger)
export async function searchMatches(searchData: { from: string, to: string, time?: string }): Promise<MatchResult[]> {
  try {
    const response = await api.post('/matches', {
      origin: searchData.from,
      destination: searchData.to,
      time: searchData.time
    });
    return response.data;
  } catch (error) {
    console.error("Failed to search matches:", error);
    return [];
  }
}

// Get All Trips (List)
export async function getTrips(filters?: { from?: string; to?: string; date?: string }): Promise<any[]> {
  try {
    const params: any = {};
    if (filters?.from) params.origin = filters.from;
    if (filters?.to) params.destination = filters.to;
    if (filters?.date) params.date = filters.date;

    const response = await api.get('/trips', { params });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Confirm a Ride (Stub for now)
export async function confirmRide(tripId: string): Promise<{ success: boolean; confirmationId: string }> {
  // TODO: Implement backend confirmation logic
  return {
    success: true,
    confirmationId: `conf-${Date.now()}`
  };
}

// Request a Ride (Booking Request) with pickup/dropoff locations
export async function createBookingRequest(
  tripId: number,
  options?: {
    initialMessage?: string;
    pickupAddress?: string;
    pickupLat?: number;
    pickupLng?: number;
    dropoffAddress?: string;
    dropoffLat?: number;
    dropoffLng?: number;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await api.post('/bookings', {
      tripId,
      initialMessage: options?.initialMessage,
      pickupAddress: options?.pickupAddress,
      pickupLat: options?.pickupLat,
      pickupLng: options?.pickupLng,
      dropoffAddress: options?.dropoffAddress,
      dropoffLat: options?.dropoffLat,
      dropoffLng: options?.dropoffLng,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Booking request failed:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Failed to send booking request"
    };
  }
}

// Get Ride by ID
export async function getRideById(id: string): Promise<any> {
  try {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get trip:", error);
    return null;
  }
}

// Get booking details with detour calculation and AI match summary
export async function getBookingDetails(bookingId: number): Promise<{
  booking: any;
  detourInfo: {
    originalDuration: number;
    modifiedDuration: number;
    extraDuration: number;
    detourPercentage: number;
  } | null;
  compatibilitySummary: string | null;
} | null> {
  try {
    const response = await api.get(`/bookings/${bookingId}/details`);
    return response.data;
  } catch (error) {
    console.error("Failed to get booking details:", error);
    return null;
  }
}

// Update booking status (approve/reject)
export async function updateBookingStatus(
  bookingId: number,
  status: 'APPROVED' | 'REJECTED'
): Promise<{ success: boolean; error?: string }> {
  try {
    await api.patch(`/bookings/${bookingId}/status`, { status });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update booking status:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Failed to update booking"
    };
  }
}

// Get all booking requests for current user's trips (as driver)
export async function getDriverBookingRequests(): Promise<any[]> {
  try {
    const response = await api.get('/bookings/driver-requests');
    return response.data;
  } catch (error) {
    console.error("Failed to get driver booking requests:", error);
    return [];
  }
}
