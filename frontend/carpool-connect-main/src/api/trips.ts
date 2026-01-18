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

// Get Ride by ID (Stub - for RideDetails migration later)
export async function getRideById(id: string): Promise<any> {
  // TODO: Implement
  return null;
}
