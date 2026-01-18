// Mock API functions for trips
// TODO: Replace with actual API calls to backend

export interface TripData {
  startLocation: string;
  destination: string;
  date: Date;
  time: string;
  seats?: number;
  role: "driver" | "carpooler";
}

export interface Trip {
  id: string;
  startLocation: string;
  destination: string;
  date: string;
  time: string;
  seats?: number;
  role: "driver" | "carpooler";
  status: "pending" | "matched" | "confirmed" | "completed";
  createdAt: string;
}

// In-memory storage for mock trips
const mockTrips: Trip[] = [];

export async function submitTrip(tripData: TripData): Promise<{ success: boolean; tripId: string }> {
  // TODO: Connect to real backend API
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newTrip: Trip = {
    id: `trip-${Date.now()}`,
    startLocation: tripData.startLocation,
    destination: tripData.destination,
    date: tripData.date.toISOString(),
    time: tripData.time,
    seats: tripData.seats,
    role: tripData.role,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  mockTrips.push(newTrip);
  console.log("Trip submitted:", newTrip);

  return {
    success: true,
    tripId: newTrip.id,
  };
}

export async function getTrips(): Promise<Trip[]> {
  // TODO: Connect to real backend API
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockTrips;
}

export async function getTripById(id: string): Promise<Trip | undefined> {
  // TODO: Connect to real backend API
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockTrips.find((trip) => trip.id === id);
}

export async function cancelTrip(id: string): Promise<{ success: boolean }> {
  // TODO: Connect to real backend API
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const index = mockTrips.findIndex((trip) => trip.id === id);
  if (index !== -1) {
    mockTrips.splice(index, 1);
    return { success: true };
  }
  return { success: false };
}

export async function confirmRide(tripId: string): Promise<{ success: boolean; confirmationId: string }> {
  // TODO: Connect to real backend API
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log("Ride confirmed:", tripId);

  return {
    success: true,
    confirmationId: `conf-${Date.now()}`,
  };
}
