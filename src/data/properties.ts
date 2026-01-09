export type PropertyType = 'apartment' | 'villa' | 'plot' | 'commercial' | 'house';
export type ListingType = 'sale' | 'rent';
export type PropertyStatus = 'active' | 'sold' | 'rented' | 'pending';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  listingType: ListingType;
  price: number;
  priceUnit?: string;
  deposit?: number;
  maintenance?: number;
  location: {
    city: string;
    area: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  status: PropertyStatus;
  amenities: string[];
  images: string[];
  featured: boolean;
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export const properties: Property[] = [
  {
    id: '1',
    title: 'Luxury 3BHK Apartment with Sea View',
    description: 'Experience luxury living in this stunning 3BHK apartment featuring panoramic sea views, modern interiors, and world-class amenities. Perfect for families seeking a premium lifestyle.',
    type: 'apartment',
    listingType: 'sale',
    price: 15000000,
    location: {
      city: 'Mumbai',
      area: 'Bandra West',
      address: 'Sea Breeze Towers, Carter Road',
      coordinates: { lat: 19.0596, lng: 72.8295 }
    },
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1850,
    status: 'active',
    amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Power Backup', 'Club House'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
    ],
    featured: true,
    agentId: 'agent1',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Modern 2BHK in Prime Location',
    description: 'Well-designed 2BHK apartment in the heart of the city. Close to metro station, schools, and shopping centers. Ideal for young professionals and small families.',
    type: 'apartment',
    listingType: 'rent',
    price: 45000,
    priceUnit: 'month',
    deposit: 200000,
    maintenance: 5000,
    location: {
      city: 'Mumbai',
      area: 'Andheri East',
      address: 'Infinity Mall Road, MIDC',
      coordinates: { lat: 19.1136, lng: 72.8697 }
    },
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1100,
    status: 'active',
    amenities: ['Gym', 'Parking', 'Security', 'Power Backup', 'Lift'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    featured: true,
    agentId: 'agent1',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Spacious Villa with Private Garden',
    description: 'Exquisite 4BHK villa featuring a private garden, terrace, and premium finishes throughout. Perfect for those seeking privacy and space in a gated community.',
    type: 'villa',
    listingType: 'sale',
    price: 45000000,
    location: {
      city: 'Pune',
      area: 'Koregaon Park',
      address: 'Green Valley Enclave',
      coordinates: { lat: 18.5362, lng: 73.8932 }
    },
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 3500,
    status: 'active',
    amenities: ['Private Garden', 'Terrace', 'Parking', 'Security', 'Club House', 'Swimming Pool'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ],
    featured: true,
    agentId: 'agent2',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  },
  {
    id: '4',
    title: 'Commercial Office Space - IT Park',
    description: 'Premium office space in a Grade A IT park. Fully furnished with modern workstations, conference rooms, and 24/7 access. Ideal for tech companies.',
    type: 'commercial',
    listingType: 'rent',
    price: 150000,
    priceUnit: 'month',
    deposit: 900000,
    location: {
      city: 'Bangalore',
      area: 'Whitefield',
      address: 'Phoenix Tech Park, ITPL Road',
      coordinates: { lat: 12.9698, lng: 77.7500 }
    },
    bedrooms: 0,
    bathrooms: 4,
    areaSqFt: 5000,
    status: 'active',
    amenities: ['Parking', 'Security', 'Power Backup', 'Cafeteria', 'Conference Room', 'High-Speed Internet'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'
    ],
    featured: false,
    agentId: 'agent1',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  },
  {
    id: '5',
    title: 'Cozy 1BHK Studio Apartment',
    description: 'Perfect starter home or investment property. This well-maintained 1BHK offers great rental returns and is located near major employment hubs.',
    type: 'apartment',
    listingType: 'sale',
    price: 4500000,
    location: {
      city: 'Mumbai',
      area: 'Powai',
      address: 'Hiranandani Gardens',
      coordinates: { lat: 19.1176, lng: 72.9060 }
    },
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 650,
    status: 'active',
    amenities: ['Gym', 'Security', 'Power Backup', 'Lift', 'Garden'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
    ],
    featured: false,
    agentId: 'agent2',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '6',
    title: 'Premium Plot in Developing Area',
    description: 'Excellent investment opportunity! Clear title plot in a rapidly developing area with upcoming metro connectivity. Perfect for building your dream home.',
    type: 'plot',
    listingType: 'sale',
    price: 8000000,
    location: {
      city: 'Pune',
      area: 'Hinjewadi',
      address: 'Near Rajiv Gandhi IT Park',
      coordinates: { lat: 18.5912, lng: 73.7380 }
    },
    bedrooms: 0,
    bathrooms: 0,
    areaSqFt: 2400,
    status: 'active',
    amenities: ['Gated Community', 'Road Access', 'Water Connection', 'Electricity'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800'
    ],
    featured: false,
    agentId: 'agent1',
    createdAt: '2023-12-28',
    updatedAt: '2023-12-28'
  }
];

export const formatPrice = (price: number, listingType: ListingType): string => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lac`;
  } else {
    return `₹${price.toLocaleString('en-IN')}`;
  }
};

export const getPropertyTypeLabel = (type: PropertyType): string => {
  const labels: Record<PropertyType, string> = {
    apartment: 'Apartment',
    villa: 'Villa',
    plot: 'Plot',
    commercial: 'Commercial',
    house: 'House'
  };
  return labels[type];
};

export const getStatusBadge = (status: PropertyStatus): { label: string; variant: 'default' | 'success' | 'warning' } => {
  const badges: Record<PropertyStatus, { label: string; variant: 'default' | 'success' | 'warning' }> = {
    active: { label: 'Available', variant: 'success' },
    sold: { label: 'Sold', variant: 'default' },
    rented: { label: 'Rented', variant: 'default' },
    pending: { label: 'Pending', variant: 'warning' }
  };
  return badges[status];
};
