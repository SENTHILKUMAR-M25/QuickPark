// Parking Space Data Structure Example (JSX version)

// Generate parking slots
const generateSlots = (rows, cols) => {
  const slots = [];
  const statuses = ["available", "booked", "reserved"];

  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const row = String.fromCharCode(65 + r);

      slots.push({
        id: `${row}${c}`,
        label: `${row}${c}`,
        status: statuses[Math.floor(Math.random() * 3)],
      });
    }
  }

  return slots;
};

// Parking spaces
export const mockParkings = [
  {
    id: "p1",
    name: "Metro Mall Parking",
    address: "123 Main St",
    city: "Mumbai",
    type: "both",
    totalSlots: 24,
    availableSlots: 8,
    pricePerHour: 40,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&q=80",
    openTime: "06:00",
    closeTime: "23:00",
    providerId: "prov1",
    slots: generateSlots(3, 8),
  },
  {
    id: "p2",
    name: "City Center Parking",
    address: "456 Park Ave",
    city: "Delhi",
    type: "car",
    totalSlots: 16,
    availableSlots: 5,
    pricePerHour: 60,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&q=80",
    openTime: "07:00",
    closeTime: "22:00",
    providerId: "prov1",
    slots: generateSlots(2, 8),
  },
  {
    id: "p3",
    name: "Airport Parking Zone",
    address: "789 Airport Rd",
    city: "Bangalore",
    type: "both",
    totalSlots: 32,
    availableSlots: 14,
    pricePerHour: 80,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=600&q=80",
    openTime: "00:00",
    closeTime: "23:59",
    providerId: "prov2",
    slots: generateSlots(4, 8),
  },
  {
    id: "p4",
    name: "Tech Park Basement",
    address: "101 IT Park",
    city: "Hyderabad",
    type: "car",
    totalSlots: 20,
    availableSlots: 3,
    pricePerHour: 50,
    rating: 4.0,
    image:
      "https://images.unsplash.com/photo-1621929747188-0b4dc28498d6?w=600&q=80",
    openTime: "08:00",
    closeTime: "20:00",
    providerId: "prov2",
    slots: generateSlots(2, 10),
  },
  {
    id: "p5",
    name: "Riverside Parking",
    address: "222 River Lane",
    city: "Chennai",
    type: "bike",
    totalSlots: 30,
    availableSlots: 18,
    pricePerHour: 20,
    rating: 3.9,
    image:
      "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?w=600&q=80",
    openTime: "06:00",
    closeTime: "21:00",
    providerId: "prov3",
    slots: generateSlots(3, 10),
  },
  {
    id: "p6",
    name: "Grand Theatre Parking",
    address: "55 Theatre Rd",
    city: "Pune",
    type: "both",
    totalSlots: 40,
    availableSlots: 22,
    pricePerHour: 35,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1545179605-1296651e9d39?w=600&q=80",
    openTime: "09:00",
    closeTime: "23:00",
    providerId: "prov3",
    slots: generateSlots(5, 8),
  },
];

// Booking Data
export const mockBookings = [
  {
    id: "b1",
    parkingId: "p1",
    parkingName: "Metro Mall Parking",
    slotLabel: "A3",
    userId: "u1",
    userName: "Rahul Sharma",
    date: "2026-03-15",
    startTime: "10:00",
    endTime: "12:00",
    amount: 80,
    status: "active",
    vehicleNumber: "MH-01-AB-1234",
  },
  {
    id: "b2",
    parkingId: "p2",
    parkingName: "City Center Parking",
    slotLabel: "B2",
    userId: "u1",
    userName: "Rahul Sharma",
    date: "2026-03-14",
    startTime: "14:00",
    endTime: "16:00",
    amount: 120,
    status: "completed",
    vehicleNumber: "MH-01-AB-1234",
  },
];

// Users
export const mockUsers = [
  {
    id: "u1",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    role: "user",
    createdAt: "2026-01-15",
    status: "active",
  },
  {
    id: "u2",
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "9876543211",
    role: "user",
    createdAt: "2026-02-01",
    status: "active",
  },
  {
    id: "u3",
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "9876543212",
    role: "user",
    createdAt: "2026-02-20",
    status: "blocked",
  },
];

// Providers
export const mockProviders = [
  {
    id: "prov1",
    name: "ParkEasy Solutions",
    email: "parkeasy@example.com",
    phone: "9876543220",
    role: "provider",
    createdAt: "2025-12-01",
    status: "active",
  },
  {
    id: "prov2",
    name: "SmartPark India",
    email: "smartpark@example.com",
    phone: "9876543221",
    role: "provider",
    createdAt: "2026-01-10",
    status: "active",
  },
  {
    id: "prov3",
    name: "Urban Parking Co",
    email: "urbanpark@example.com",
    phone: "9876543222",
    role: "provider",
    createdAt: "2026-03-01",
    status: "pending",
  },
];