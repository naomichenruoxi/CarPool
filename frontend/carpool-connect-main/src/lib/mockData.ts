// Mock data for CarPool app
// TODO: Replace with actual API calls to backend

export interface Ride {
  id: string;
  driver: {
    name: string;
    avatar: string;
    rating: number;
    trips: number;
  };
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  seats: number;
  availableSeats: number;
  car: string;
  amenities: string[];
}

export const mockRides: Ride[] = [
  {
    id: "1",
    driver: {
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 4.9,
      trips: 127,
    },
    from: "San Francisco",
    to: "Los Angeles",
    date: "2025-01-20",
    time: "08:00",
    price: 45,
    seats: 4,
    availableSeats: 3,
    car: "Tesla Model 3",
    amenities: ["AC", "Music", "Pet Friendly"],
  },
  {
    id: "2",
    driver: {
      name: "Marcus Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      rating: 4.7,
      trips: 89,
    },
    from: "San Francisco",
    to: "Sacramento",
    date: "2025-01-20",
    time: "10:30",
    price: 25,
    seats: 4,
    availableSeats: 2,
    car: "Honda Accord",
    amenities: ["AC", "Music"],
  },
  {
    id: "3",
    driver: {
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      rating: 5.0,
      trips: 203,
    },
    from: "Los Angeles",
    to: "San Diego",
    date: "2025-01-21",
    time: "14:00",
    price: 20,
    seats: 3,
    availableSeats: 2,
    car: "Toyota Prius",
    amenities: ["AC", "Quiet Ride", "No Smoking"],
  },
  {
    id: "4",
    driver: {
      name: "David Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      rating: 4.8,
      trips: 156,
    },
    from: "Oakland",
    to: "Los Angeles",
    date: "2025-01-22",
    time: "07:00",
    price: 50,
    seats: 4,
    availableSeats: 4,
    car: "BMW 3 Series",
    amenities: ["AC", "Music", "Luggage Space"],
  },
  {
    id: "5",
    driver: {
      name: "Lisa Thompson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      rating: 4.6,
      trips: 45,
    },
    from: "San Jose",
    to: "Santa Barbara",
    date: "2025-01-22",
    time: "09:00",
    price: 35,
    seats: 4,
    availableSeats: 3,
    car: "Ford Escape",
    amenities: ["AC", "Pet Friendly", "Luggage Space"],
  },
];

// Mock API functions
// TODO: Replace these with actual API calls

export async function searchRides(from: string, to: string, date: string): Promise<Ride[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return mockRides.filter((ride) => {
    const matchFrom = !from || ride.from.toLowerCase().includes(from.toLowerCase());
    const matchTo = !to || ride.to.toLowerCase().includes(to.toLowerCase());
    const matchDate = !date || ride.date === date;
    return matchFrom && matchTo && matchDate;
  });
}

export async function getRideById(id: string): Promise<Ride | undefined> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return mockRides.find((ride) => ride.id === id);
}

export async function bookRide(rideId: string, seats: number): Promise<{ success: boolean; message: string }> {
  // TODO: Implement actual booking logic with backend
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return {
    success: true,
    message: "Ride booked successfully!",
  };
}

export async function createRide(rideData: Partial<Ride>): Promise<{ success: boolean; ride?: Ride }> {
  // TODO: Implement actual ride creation with backend
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const newRide: Ride = {
    id: String(mockRides.length + 1),
    driver: {
      name: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      rating: 5.0,
      trips: 0,
    },
    from: rideData.from || "",
    to: rideData.to || "",
    date: rideData.date || "",
    time: rideData.time || "",
    price: rideData.price || 0,
    seats: rideData.seats || 4,
    availableSeats: rideData.seats || 4,
    car: rideData.car || "",
    amenities: rideData.amenities || [],
  };
  
  return { success: true, ride: newRide };
}

// Trip submission for the new flow
export interface TripData {
  startLocation: string;
  destination: string;
  date: Date;
  time: string;
  seats?: number;
  role: "driver" | "carpooler";
}

export async function submitTrip(tripData: TripData): Promise<{ success: boolean; tripId: string }> {
  // TODO: Connect to real backend API
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  console.log("Trip submitted:", tripData);
  
  return { 
    success: true, 
    tripId: `trip-${Date.now()}`,
  };
}
