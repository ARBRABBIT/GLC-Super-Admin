// ─── Mock Dashboard Data for Super Admin ──────────────────────────────────────

import type { DashboardData } from '../types/dashboard';

export const mockDashboardData: DashboardData = {
  visitors: {
    nriPercentage: 40,
    localPercentage: 60,
    vsLastWeekLabel: 'vs Last Week',
  },

  totalSales: {
    amount: 4360000,
    changePercent: 8.33,
    sparklineData: [20, 35, 25, 40, 30, 45, 38, 50, 42],
  },

  farmlandStats: {
    totalFarmlands: 14563,
    activePools: 20,
  },

  statusCards: [
    { label: 'Approved',    value: 1567, type: 'approved' },
    { label: 'Rejected',    value: 1222, type: 'rejected' },
    { label: 'In-Progress', value: 2427, type: 'in-progress' },
  ],

  salesReport: [
    { day: 'Mo', target: 10, actual: 8,  escrow: 5,  projected: 12 },
    { day: 'Tu', target: 15, actual: 12, escrow: 8,  projected: 18 },
    { day: 'We', target: 45, actual: 35, escrow: 20, projected: 40 },
    { day: 'Th', target: 20, actual: 18, escrow: 10, projected: 25 },
    { day: 'Fr', target: 25, actual: 22, escrow: 15, projected: 28 },
    { day: 'Sa', target: 18, actual: 15, escrow: 12, projected: 20 },
    { day: 'Su', target: 22, actual: 20, escrow: 14, projected: 24 },
  ],

  topPerformers: [
    {
      id: '1',
      name: 'Shaurya.K',
      amount: '₹3.1L',
      avatar: '/super-admin/performers/performer1.png',
    },
    {
      id: '2',
      name: 'Shankar.S',
      amount: '₹3.1L',
      avatar: '/super-admin/performers/performer2.png',
    },
    {
      id: '3',
      name: 'Arjun V.',
      amount: '₹4.2L',
      avatar: '/super-admin/performers/performer3.png',
      isTopPerformer: true,
    },
    {
      id: '4',
      name: 'Rahul.M',
      amount: '₹2.8L',
      avatar: '/super-admin/performers/performer4.png',
    },
    {
      id: '5',
      name: 'Ram.V',
      amount: '₹3.1L',
      avatar: '/super-admin/performers/performer5.png',
    },
  ],

  topPerformersDetailed: [
    {
      id: '1',
      name: 'Kishore Moore',
      amount: '₹5.8Cr',
      avatar: 'https://i.pravatar.cc/150?u=kishore',
      isTopPerformer: true,
      rank: 1,
      farms: 58,
      sales: '₹5.8Cr',
      saleReports: 0
    },
    {
      id: '2',
      name: 'Laakhan Rai',
      amount: '₹3.2Cr',
      avatar: 'https://i.pravatar.cc/150?u=laakhan',
      rank: 2,
      farms: 42,
      sales: '₹3.2Cr',
      saleReports: 0
    },
    {
      id: '3',
      name: 'Lakshya Chaubey',
      amount: '₹2.9Cr',
      avatar: 'https://i.pravatar.cc/150?u=lakshya',
      rank: 3,
      farms: 39,
      sales: '₹2.9Cr',
      saleReports: 0
    },
    {
      id: '4',
      name: 'Harman Rao',
      amount: '',
      avatar: 'https://i.pravatar.cc/150?u=harman',
      rank: 4,
      farms: 35,
      sales: '',
      saleReports: 12
    },
    {
      id: '5',
      name: 'Brij Mohan',
      amount: '',
      avatar: 'https://i.pravatar.cc/150?u=brij',
      rank: 5,
      farms: 33,
      sales: '',
      saleReports: 10
    },
    {
      id: '6',
      name: 'Ramesh Oberoi',
      amount: '',
      avatar: 'https://i.pravatar.cc/150?u=ramesh',
      rank: 6,
      farms: 31,
      sales: '',
      saleReports: 15
    },
    {
      id: '7',
      name: 'Lakshaman G.',
      amount: '',
      avatar: 'https://i.pravatar.cc/150?u=lakshaman',
      rank: 7,
      farms: 28,
      sales: '',
      saleReports: 9
    },
    {
      id: '8',
      name: 'Rakesh Walia',
      amount: '',
      avatar: 'https://i.pravatar.cc/150?u=rakesh',
      rank: 8,
      farms: 25,
      sales: '',
      saleReports: 14
    },
    {
      id: '9',
      name: 'Ram Varma',
      amount: '',
      avatar: 'https://i.pravatar.cc/150?u=ram',
      rank: 9,
      farms: 22,
      sales: '',
      saleReports: 8
    },
    {
      id: '10',
      name: 'Kishan S.',
      amount: '',
      avatar: 'https://i.pravatar.cc/150?u=kishan',
      rank: 10,
      farms: 20,
      sales: '',
      saleReports: 11
    }
  ],

  subscriberGrowth: {
    segments: [
      { label: 'Platinum', value: 561, color: '#3B3B3B' },
      { label: 'Gold',     value: 311, color: '#8B9A46' },
      { label: 'Silver',   value: 435, color: '#C5D654' },
    ],
    unitsTotal: 1247,
  },

  assignedFarmlands: [
    {
      id: 1,
      farm_code: "GLC SOS 01",
      total_acres: "120",
      valuation: "₹10,000",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60",
      badges: ["RED LATERITE", "ACTIVE YIELD"],
      agent: { first_name: "Ram", last_name: "Varma", img: "/super-admin/performers/performer5.png" }
    },
    {
      id: 2,
      farm_code: "GLC SOS 02",
      total_acres: "120",
      valuation: "₹10,000",
      image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=500&auto=format&fit=crop&q=60",
      badges: [],
      agent: { first_name: "Ram", last_name: "Varma", img: "/super-admin/performers/performer5.png" }
    },
    {
      id: 3,
      farm_code: "GLC SOS 03",
      total_acres: "120",
      valuation: "₹10,000",
      image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=60",
      badges: ["PRISTINE WATER", "ORGANIC CERT"],
      agent: { first_name: "Ram", last_name: "Varma", img: "/super-admin/performers/performer5.png" }
    }
  ] as any,

  farmlandsList: [
    {
      id: "GLC-SOS-L-01",
      title: "GLC SOS 01",
      acres: "10 Acres",
      soilType: "Red Laterite",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60",
      agent: { name: "Ram Varma", avatar: "/super-admin/performers/performer5.png" }
    },
    {
      id: "GLC-SOS-L-02",
      title: "GLC SOS 02",
      acres: "5 Acres",
      soilType: "Alluvial Gold",
      image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=500&auto=format&fit=crop&q=60",
      agent: { name: "Ajesh Sharma", avatar: "/super-admin/performers/performer2.png" }
    },
    {
      id: "GLC-SOS-L-03",
      title: "GLC SOS 03",
      acres: "8 Acres",
      soilType: "Sandy Loam",
      image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=60",
      agent: { name: "Rajiv Kapoor", avatar: "/super-admin/performers/performer3.png" }
    },
    {
      id: "GLC-SOS-L-04",
      title: "GLC SOS 04",
      acres: "1.2 Acres",
      soilType: "Red Laterite",
      image: "https://images.unsplash.com/photo-1621508678036-7c08a91ec552?w=500&auto=format&fit=crop&q=60",
      agent: { name: "Vikram Gouda", avatar: "/super-admin/performers/performer1.png" }
    }
  ],

  usersList: [
    { id: "U01", name: "Ram Varma", email: "ram.varma@example.com", avatar: "https://i.pravatar.cc/150?u=ram", type: "NRI", isSubscribed: true, tier: "silver", source: "Website" },
    { id: "U02", name: "Kishore Moore", email: "ram.kishore@example.com", avatar: "https://i.pravatar.cc/150?u=kishore", type: "Local", isSubscribed: true, tier: "gold", source: "Mobile" },
    { id: "U03", name: "Ramesh Oberoi", email: "ramesh.oberoi@example.com", avatar: "https://i.pravatar.cc/150?u=ramesh", type: "Local", isSubscribed: false, tier: "bronze", source: "Website" },
    { id: "U04", name: "Anita Desai", email: "anita.d@example.com", avatar: "https://i.pravatar.cc/150?u=anita", type: "NRI", isSubscribed: true, tier: "gold", source: "Mobile" },
    { id: "U05", name: "Vikram Singh", email: "vikram.s@example.com", avatar: "https://i.pravatar.cc/150?u=vikram", type: "Local", isSubscribed: true, tier: "silver", source: "Website" },
    { id: "U06", name: "Priya Patel", email: "priya.p@example.com", avatar: "https://i.pravatar.cc/150?u=priya", type: "NRI", isSubscribed: false, tier: "bronze", source: "Mobile" },
    { id: "U07", name: "Arjun Reddy", email: "arjun.r@example.com", avatar: "https://i.pravatar.cc/150?u=arjun", type: "Local", isSubscribed: true, tier: "gold", source: "Website" },
    { id: "U08", name: "Sunita Sharma", email: "sunita.s@example.com", avatar: "https://i.pravatar.cc/150?u=sunita", type: "NRI", isSubscribed: false, tier: "silver", source: "Mobile" },
    { id: "U09", name: "Karan Johar", email: "karan.j@example.com", avatar: "https://i.pravatar.cc/150?u=karan", type: "Local", isSubscribed: false, tier: "bronze", source: "Website" },
    { id: "U10", name: "Meera Bai", email: "meera.b@example.com", avatar: "https://i.pravatar.cc/150?u=meera", type: "NRI", isSubscribed: true, tier: "gold", source: "Mobile" },
  ],

  assignedFarmlandDetails: {
    id: "GLC SOS 01",
    status: {
      systemStatus: "Active",
      liveStatus: "Live on Website"
    },
    assetDetails: {
      location: "West Godvari, AP",
      agentName: "Ravi Kumar",
      agentAvatar: "https://i.pravatar.cc/150?u=ravi",
      creationTime: "6th Oct, 12:53 PM",
      lastUpdated: "8th Oct, 09:15 AM"
    },
    heroData: {
      title: "GLC SOS 01",
      location: "West Godvari, AP",
      badge: "LIVE ON WEBSITE",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
    }
  },

  customerInformation: {
    farmlandId: "GLCSOS 01",
    ownerDetails: {
      firstName: "Ramudu",
      lastName: "Kumar",
      email: "ramudu@example.com",
      phoneNumber: "+91-8577483738",
      dob: "12 Oct 1980",
      religion: "Hindu",
      gender: "Male",
      locationLink: "17.4835850, 78.3805050",
      mapImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop"
    },
    familyTree: {
      owner: { name: "Arjun Mehta", info: "Male, 42 yrs", avatar: "https://i.pravatar.cc/150?u=arjun2" },
      father: { name: "Vikram Mehta", info: "Male, 72 yrs", avatar: "https://i.pravatar.cc/150?u=vikram" },
      spouse: { name: "Priya Mehta", info: "Female, 40 yrs", avatar: "https://i.pravatar.cc/150?u=priya" },
      mother: { name: "Sushila Mehta", info: "Female, 68 yrs", avatar: "https://i.pravatar.cc/150?u=sushila" },
      daughter: { name: "Ananya Mehta", info: "Female, 12 yrs", avatar: "https://i.pravatar.cc/150?u=ananya" }
    },
    landDetails: {
      state: "Andhra Pradesh",
      district: "West Godavari",
      area: "Thanuku",
      acquisitionCategory: "Ancestral Property",
      agent: "Agent Vinod",
      landConversion: "Acres",
      valueForArea: "1,00,000.00",
      agentReferralLocation: "Another Location",
      geoReference: {
        coordinates: "N 38.2975° W 122.2869°",
        gridElev: "GRID: 84T-QK • ELEV: 12m"
      },
      largeAerialImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop",
      smallMapImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop"
    }
  },

  userProfile: {
    id: "1",
    name: "Rakesh Walia",
    avatar: "https://i.pravatar.cc/150?u=rakesh",
    tier: "GOLD TIER",
    isActive: true,
    email: "rakesh.walia@greenlandcap.com",
    phone: "+91 912 345 6789",
    stats: {
      farmlandPurchases: 3,
      timesSubscribed: 10,
      viewsLeft: 6
    },
    recentActivity: [
      {
        id: "act1",
        title: "Purchased Farm Land",
        subtitle: "West Godavari, AP",
        badge: "ID: GLCSOS 01",
        statusText: "₹2,24,50,000",
        date: "Oct 24, 10:42 AM",
        borderColor: "border-[#8BC34A]" // Green
      },
      {
        id: "act2",
        title: "Shown Interest in Farmland",
        subtitle: "East Godavari, AP",
        badge: "ID: GLCSOS 02",
        statusText: "Document Access",
        date: "Oct 24, 10:42 AM",
        borderColor: "border-gray-200" // Gray
      },
      {
        id: "act3",
        title: "Subscribed to Gold Tier Plan",
        subtitle: "Annual Plan Payment Processed",
        statusText: "Completed",
        date: "Oct 24, 10:42 AM",
        borderColor: "border-[#8BC34A]" // Green
      },
      {
        id: "act4",
        title: "Logged In",
        subtitle: "Web Session via Chrome/Mac",
        statusText: "Success",
        date: "Oct 24, 10:42 AM",
        borderColor: "border-gray-200" // Gray
      },
      {
        id: "act5",
        title: "Joined Waitlist",
        subtitle: "West Godavari, A.P",
        badge: "ID: GLCSOS 09",
        statusText: "Success",
        date: "Oct 24, 10:42 AM",
        borderColor: "border-gray-200" // Gray
      }
    ]
  },

  farmlandSpecificDetails: {
    id: "GLCSOS 01",
    status: "Active Asset",
    location: "East Godavari, AP",
    area: "2,450 Acres",
    totalVisitors: 45,
    visitorsGrowth: "+2.4%",
    documentationUnlocked: 14,
    purchaseRequests: 6,
    momentumTimeline: [
      { dayLabel: "20 Days Ago", visits: 10, enquiries: 0, unlocks: 0, total: 10 },
      { dayLabel: "", visits: 15, enquiries: 0, unlocks: 0, total: 15 },
      { dayLabel: "", visits: 20, enquiries: 5, unlocks: 0, total: 25 },
      { dayLabel: "", visits: 25, enquiries: 8, unlocks: 0, total: 33 },
      { dayLabel: "", visits: 35, enquiries: 10, unlocks: 0, total: 45 },
      { dayLabel: "", visits: 45, enquiries: 15, unlocks: 5, total: 65 },
      { dayLabel: "", visits: 30, enquiries: 5, unlocks: 2, total: 37 },
      { dayLabel: "", visits: 60, enquiries: 20, unlocks: 10, total: 90 },
      { dayLabel: "", visits: 50, enquiries: 15, unlocks: 8, total: 73 },
      { dayLabel: "", visits: 40, enquiries: 10, unlocks: 5, total: 55 },
      { dayLabel: "", visits: 70, enquiries: 30, unlocks: 15, total: 115 },
      { dayLabel: "", visits: 80, enquiries: 35, unlocks: 20, total: 135 },
      { dayLabel: "", visits: 45, enquiries: 10, unlocks: 5, total: 60 },
      { dayLabel: "Today", visits: 90, enquiries: 40, unlocks: 25, total: 155 }
    ],
    conversionCommandUsers: [
      {
        id: "usr1",
        name: "Kishore Kumar",
        avatar: "https://i.pravatar.cc/150?u=kishore2",
        stage: "Engaged",
        stageColor: "bg-[#E8F5E9] text-[#2E7D32]",
        phone: "+91 912 345 6789",
        query: "3rd Oct - 4:13",
        actions: "Requested an enquiry",
        comments: "Lorem ipsum dolor...",
        commentsHighlight: "Active Deal",
        subscriptions: "Subscribed"
      },
      {
        id: "usr2",
        name: "Paramesh",
        avatar: "https://i.pravatar.cc/150?u=paramesh",
        stage: "Closing",
        stageColor: "bg-[#FFF8E1] text-[#F57F17]",
        phone: "+91 912 345 6789",
        query: "3rd Oct - 4:13",
        actions: "Visited",
        comments: "",
        commentsHighlight: "Awaiting Response",
        subscriptions: "Subscribed"
      },
      {
        id: "usr3",
        name: "Harish",
        avatar: "https://i.pravatar.cc/150?u=harish",
        stage: "Discovery",
        stageColor: "bg-[#E3F2FD] text-[#1565C0]",
        phone: "+91 912 345 6789",
        query: "3rd Oct - 4:13",
        actions: "Documents Unlocked",
        comments: "Lorem ipsum dolor...",
        commentsHighlight: "Follow-up Scheduled",
        subscriptions: "Subscribed"
      },
      {
        id: "usr4",
        name: "Mohan",
        avatar: "https://i.pravatar.cc/150?u=mohan",
        stage: "Discovery",
        stageColor: "bg-[#E3F2FD] text-[#1565C0]",
        phone: "+91 912 345 6789",
        query: "3rd Oct - 4:13",
        actions: "Requested an enquiry",
        comments: "Lorem ipsum dolor...",
        commentsHighlight: "Interested",
        subscriptions: "N/A"
      },
      {
        id: "usr5",
        name: "Laakhan Rai",
        avatar: "https://i.pravatar.cc/150?u=laakhan2",
        stage: "Cold",
        stageColor: "bg-[#F5F5F5] text-[#757575]",
        phone: "+91 912 345 6789",
        query: "3rd Oct - 4:13",
        actions: "Requested an enquiry",
        comments: "N/A",
        subscriptions: "N/A"
      }
    ]
  },

  agentProfile: {
    id: "1",
    name: "Kishore Moore",
    avatar: "https://i.pravatar.cc/150?u=kishore",
    role: "Agent",
    pendingReview: 38,
    rejectedDeals: 12,
    completedDeals: 142,
    growth: "+12% growth",
    performanceIndex: "Performance Index 4.3",
    closeRatio: 78,
    avgResponse: "1.8h",
    quarterPerf: "Stable",
    transactions: [
      {
        id: "trx1",
        farmlandId: "Green Land Capital SOS 01",
        date: "Oct 24, 2024",
        position: "Website",
        landValue: "₹41.2M",
        commission: "₹1,26,000",
        status: "Cleared"
      },
      {
        id: "trx2",
        farmlandId: "Green Land Capital SOS 02",
        date: "Oct 22, 2024",
        position: "Regional Officer",
        landValue: "₹120.5M",
        commission: "₹3,75,000",
        status: "Processing"
      },
      {
        id: "trx3",
        farmlandId: "Green Land Capital SOS 03",
        date: "Oct 18, 2024",
        position: "CCS Officer",
        landValue: "₹29.1M",
        commission: "₹63,000",
        status: "Cleared"
      },
      {
        id: "trx4",
        farmlandId: "Green Land Capital SOS 03",
        date: "Oct 24, 2024",
        position: "Field Officer",
        landValue: "₹40.2M",
        commission: "₹1,26,000",
        status: "Cleared"
      },
      {
        id: "trx5",
        farmlandId: "Green Land Capital SOS 04",
        date: "Oct 22, 2024",
        position: "Intelligence Officer",
        landValue: "₹19.5M",
        commission: "₹3,75,000",
        status: "Processing"
      },
      {
        id: "trx6",
        farmlandId: "Green Land Capital SOS 05",
        date: "Oct 18, 2024",
        position: "Website",
        landValue: "₹33.1M",
        commission: "₹63,000",
        status: "Cleared"
      }
    ]
  },

  poolBuyingPools: [
    {
      id: "POOL-001",
      location: "Hyderabad, Telangana",
      farmlandId: "GLCSOS 043",
      investors: 45,
      status: "Active" as const,
      raisedAmount: 750000,
      targetAmount: 1000000,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "POOL-002",
      location: "Hyderabad, Telangana",
      farmlandId: "GLCSOS 043",
      investors: 45,
      status: "Active" as const,
      raisedAmount: 750000,
      targetAmount: 1000000,
      image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "POOL-003",
      location: "Hyderabad, Telangana",
      farmlandId: "GLCSOS 043",
      investors: 45,
      status: "Active" as const,
      raisedAmount: 750000,
      targetAmount: 1000000,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "POOL-004",
      location: "Hyderabad, Telangana",
      farmlandId: "GLCSOS 043",
      investors: 45,
      status: "Active" as const,
      raisedAmount: 750000,
      targetAmount: 1000000,
      image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "POOL-005",
      location: "Hyderabad, Telangana",
      farmlandId: "GLCSOS 043",
      investors: 45,
      status: "Active" as const,
      raisedAmount: 750000,
      targetAmount: 1000000,
      image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "POOL-006",
      location: "Hyderabad, Telangana",
      farmlandId: "GLCSOS 043",
      investors: 45,
      status: "Active" as const,
      raisedAmount: 750000,
      targetAmount: 1000000,
      image: "https://images.unsplash.com/photo-1621508678036-7c08a91ec552?w=500&auto=format&fit=crop&q=60"
    }
  ],

  poolDetails: {
    "POOL-001": {
      id: "POOL-001",
      farmlandId: "GLCSOS 043",
      totalLandArea: "3.00 Acres",
      raisedAmount: "₹7.50 Cr",
      targetAmount: "₹10.00 Cr",
      totalInvestment: "₹25,00,000",
      totalInvestors: 32,
      mapImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80",
      investors: [
        {
          id: "INV-1024",
          name: "Rajesh Kumar",
          avatar: "https://i.pravatar.cc/150?u=rajesh",
          investedAmount: "5,00,000",
          landAllocated: "0.33 Acres",
          ownershipPercent: "10.00%",
          location: "Hyderabad, Telangana",
          investedOn: "12 May 2026",
          plotId: "A-01",
          poolName: "GLC SOS 01",
          status: "Active" as const,
          tenure: "36 Months"
        },
        {
          id: "INV-1025",
          name: "Vishnu",
          avatar: "https://i.pravatar.cc/150?u=vishnu",
          investedAmount: "5,00,000",
          landAllocated: "0.33 Acres",
          ownershipPercent: "10.00%",
          location: "Hyderabad, Telangana",
          investedOn: "12 May 2026",
          plotId: "A-02",
          poolName: "GLC SOS 01",
          status: "Active" as const,
          tenure: "36 Months"
        },
        {
          id: "INV-1026",
          name: "Tamim",
          avatar: "https://i.pravatar.cc/150?u=tamim",
          investedAmount: "5,00,000",
          landAllocated: "0.33 Acres",
          ownershipPercent: "10.00%",
          location: "Hyderabad, Telangana",
          investedOn: "12 May 2026",
          plotId: "A-03",
          poolName: "GLC SOS 01",
          status: "Active" as const,
          tenure: "36 Months"
        },
        {
          id: "INV-1027",
          name: "Lakshman Rao",
          avatar: "https://i.pravatar.cc/150?u=lakshman",
          investedAmount: "5,00,000",
          landAllocated: "0.20 Acres",
          ownershipPercent: "6.67%",
          location: "Hyderabad, Telangana",
          investedOn: "12 May 2026",
          plotId: "B-01",
          poolName: "GLC SOS 01",
          status: "Active" as const,
          tenure: "36 Months"
        },
        {
          id: "INV-1028",
          name: "Ram Gopal",
          avatar: "https://i.pravatar.cc/150?u=ramgopal",
          investedAmount: "7,50,000",
          landAllocated: "1.5 Acres",
          ownershipPercent: "15.00%",
          location: "Hyderabad, Telangana",
          investedOn: "12 May 2026",
          plotId: "C-01",
          poolName: "GLC SOS 01",
          status: "Active" as const,
          tenure: "36 Months"
        },
        {
          id: "INV-1029",
          name: "Rajesh Kumar",
          avatar: "https://i.pravatar.cc/150?u=rajesh2",
          investedAmount: "3,00,000",
          landAllocated: "0.50 Acres",
          ownershipPercent: "5.00%",
          location: "Hyderabad, Telangana",
          investedOn: "12 May 2026",
          plotId: "D-01",
          poolName: "GLC SOS 01",
          status: "Active" as const,
          tenure: "24 Months"
        },
        {
          id: "INV-1030",
          name: "Arjun Kumar",
          avatar: "https://i.pravatar.cc/150?u=arjunkumar",
          investedAmount: "4,00,000",
          landAllocated: "1.02 Acres",
          ownershipPercent: "8.00%",
          location: "Hyderabad, Telangana",
          investedOn: "12 May 2026",
          plotId: "E-01",
          poolName: "GLC SOS 01",
          status: "Active" as const,
          tenure: "36 Months"
        }
      ]
    }
  }
};
