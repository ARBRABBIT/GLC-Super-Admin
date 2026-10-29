import type {
  ProjectTimelineItem,
  ProjectDistributionCategory,
  OperationsOverviewData,
  PipelineStage,
  MaintenanceOfficerProfile,
  ServiceRequestPipelineItem,
  FieldOfficerOption,
  WorkOrderPipelineItem
} from '../types/maintenance.types';

// ─── High Quality Sample Images for Farmland Thumbnails ───────────────────────
export const SAMPLE_FARMLAND_THUMBNAILS = {
  farmhouse1: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=120&q=80",
  farmhouse2: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=120&q=80",
  fencing1: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=120&q=80",
  fencing2: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=120&q=80",
  borewell1: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=120&q=80",
  borewell2: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=120&q=80",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
};

// ─── Projects Timeline Dynamic Data ───────────────────────────────────────────
export const INITIAL_PROJECTS_TIMELINE: ProjectTimelineItem[] = [
  {
    id: "proj-1",
    code: "GLC SOS 01",
    title: "GLC SOS 01 FARMHOUSE",
    category: "FARMHOUSE",
    progressPercentage: 82,
    status: "In Progress",
    themeColor: "blue",
    images: [SAMPLE_FARMLAND_THUMBNAILS.farmhouse1, SAMPLE_FARMLAND_THUMBNAILS.farmhouse2]
  },
  {
    id: "proj-2",
    code: "GLC SOS 07",
    title: "GLC SOS 07 FENCING",
    category: "FENCING",
    progressPercentage: 45,
    status: "In Progress",
    themeColor: "green",
    images: [SAMPLE_FARMLAND_THUMBNAILS.fencing1, SAMPLE_FARMLAND_THUMBNAILS.fencing2]
  },
  {
    id: "proj-3",
    code: "GLC SOS 09",
    title: "GLC SOS 09 BOREWELL",
    category: "BOREWELL",
    progressPercentage: 45,
    status: "In Progress",
    themeColor: "green",
    images: [SAMPLE_FARMLAND_THUMBNAILS.borewell1, SAMPLE_FARMLAND_THUMBNAILS.borewell2]
  },
  {
    id: "proj-4",
    code: "GLC SOS 04",
    title: "GLC SOS 04 FARMHOUSE",
    category: "FARMHOUSE",
    progressPercentage: 45,
    status: "In Progress",
    themeColor: "green",
    images: [SAMPLE_FARMLAND_THUMBNAILS.farmhouse2, SAMPLE_FARMLAND_THUMBNAILS.farmhouse1]
  }
];

// ─── Project Distribution Donut Chart Data ────────────────────────────────────
export const INITIAL_PROJECT_DISTRIBUTION: {
  totalProjects: number;
  categories: ProjectDistributionCategory[];
} = {
  totalProjects: 450,
  categories: [
    {
      id: "fencing",
      name: "Fencing",
      count: 189,
      color: "#1E75BB" // Deep vibrant blue
    },
    {
      id: "borewell",
      name: "Borewell",
      count: 149,
      color: "#95C11E" // Lime green
    },
    {
      id: "farmhouse",
      name: "Farmhouse",
      count: 112,
      color: "#BCE3D9" // Pale mint / teal tint
    }
  ]
};

// ─── Operations Overview Spline Chart Data by Year ────────────────────────────
export const OPERATIONS_OVERVIEW_BY_YEAR: Record<number, OperationsOverviewData> = {
  2026: {
    year: 2026,
    totalServiceRequests: "55.7K",
    serviceRequestsTrend: "up",
    serviceRequestsChangePercent: "+12.4%",
    totalWorkOrders: "3.4K",
    workOrdersTrend: "down",
    workOrdersChangePercent: "-2.1%",
    monthlyTrend: [
      { month: "Jan", serviceRequests: 500, workOrders: 500 },
      { month: "Feb", serviceRequests: 1150, workOrders: 650 },
      { month: "Mar", serviceRequests: 1550, workOrders: 820 },
      { month: "Apr", serviceRequests: 1980, workOrders: 800 },
      { month: "May", serviceRequests: 2120, workOrders: 700 },
      { month: "Jun", serviceRequests: 2180, workOrders: 720 }
    ]
  },
  2025: {
    year: 2025,
    totalServiceRequests: "48.2K",
    serviceRequestsTrend: "up",
    serviceRequestsChangePercent: "+8.3%",
    totalWorkOrders: "3.9K",
    workOrdersTrend: "up",
    workOrdersChangePercent: "+4.5%",
    monthlyTrend: [
      { month: "Jan", serviceRequests: 420, workOrders: 400 },
      { month: "Feb", serviceRequests: 890, workOrders: 580 },
      { month: "Mar", serviceRequests: 1200, workOrders: 710 },
      { month: "Apr", serviceRequests: 1650, workOrders: 750 },
      { month: "May", serviceRequests: 1800, workOrders: 690 },
      { month: "Jun", serviceRequests: 1950, workOrders: 710 }
    ]
  },
  2024: {
    year: 2024,
    totalServiceRequests: "36.8K",
    serviceRequestsTrend: "up",
    serviceRequestsChangePercent: "+15.0%",
    totalWorkOrders: "2.8K",
    workOrdersTrend: "down",
    workOrdersChangePercent: "-1.2%",
    monthlyTrend: [
      { month: "Jan", serviceRequests: 300, workOrders: 350 },
      { month: "Feb", serviceRequests: 600, workOrders: 480 },
      { month: "Mar", serviceRequests: 950, workOrders: 600 },
      { month: "Apr", serviceRequests: 1300, workOrders: 640 },
      { month: "May", serviceRequests: 1450, workOrders: 580 },
      { month: "Jun", serviceRequests: 1600, workOrders: 600 }
    ]
  }
};

// ─── Pipeline Stepper Stages ───────────────────────────────────────────────────
export const INITIAL_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "new-requests",
    title: "New Requests",
    subtitle: "Action Required",
    count: 18,
    iconName: "mail",
    badgeColor: "#1E75BB",
    iconBgColor: "#EBF3FA",
    iconColor: "#1E75BB"
  },
  {
    id: "under-verification",
    title: "Under Verification",
    subtitle: "In Field",
    count: 9,
    iconName: "alert",
    badgeColor: "#1E75BB",
    iconBgColor: "#FEF7EC",
    iconColor: "#F59E0B"
  },
  {
    id: "pending-uploads",
    title: "Pending Uploads",
    subtitle: "Work Updates",
    count: 6,
    iconName: "sync",
    badgeColor: "#1E75BB",
    iconBgColor: "#EFF8FF",
    iconColor: "#0284C7"
  },
  {
    id: "in-progress",
    title: "In – Progress",
    subtitle: "Work",
    count: 5,
    iconName: "team",
    badgeColor: "#1E75BB",
    iconBgColor: "#F5F3FF",
    iconColor: "#8B5CF6"
  },
  {
    id: "completed",
    title: "Completed",
    subtitle: "Handed Over",
    count: 7,
    iconName: "clipboard",
    badgeColor: "#1E75BB",
    iconBgColor: "#ECFDF5",
    iconColor: "#10B981"
  }
];

// ─── Default Maintenance Officer Profile (Figma Match) ───────────────────────
export const DEFAULT_MAINTENANCE_OFFICER: MaintenanceOfficerProfile = {
  name: "Raj Kumar",
  firstName: "Raj Kumar",
  lastName: "Boga",
  dateOfBirth: "23/04/1994",
  phone: "+91 882 983 9362",
  role: "Maintenance Officer",
  email: "Rajkumarboga@gmail.com",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  bannerUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
  unreadNotificationsCount: 3
};

// ─── Dynamic Service Request Pipeline Items (Figma Match) ─────────────────────
export const INITIAL_SERVICE_REQUESTS: ServiceRequestPipelineItem[] = [
  {
    id: "sr-1",
    code: "GLCSOS1",
    customerName: "Suresh Reddy",
    serviceCategory: "Borewell",
    location: "Hyderabad",
    description: "Deep borewell maintenance and...",
    iconType: "borewell",
    stage: "New Requests",
    landId: "GLCSOS1",
    landSize: "5.0 Acres",
    address: "Plot 42, Green Valley, Shamshabad Mandal, Hyderabad.",
    preferredVisitDate: "Oct 24, 2026",
    servicesList: [
      { name: "Borewell Drilling", icon: "borewell" },
      { name: "Farmhouse Construction", icon: "farmhouse" },
      { name: "Organic Farming Setup", icon: "organic", subtitle: "(Premium Timber / Orchard (60/40))" }
    ],
    requirementsText: "Deep borewell maintenance and yield testing for monsoon season preparedness.",
    phone: "+91 98765 43210",
    surveyNumber: "Survey No. #442, 445",
    userNotes: "Initial soil test completed. Pending structural clearance for the north-west quadrant.",
    liveLocationUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-2",
    code: "GLCSOS2",
    customerName: "Ananya Kapoor",
    serviceCategory: "Fencing",
    serviceCategoryExtra: "+ 2",
    location: "West Godavari",
    description: "Perimeter security upgrade and electric...",
    iconType: "fencing",
    stage: "New Requests",
    landId: "GLCSOS2",
    landSize: "8.2 Acres",
    address: "Survey 118, Eluru Road, West Godavari District.",
    preferredVisitDate: "Nov 02, 2026",
    servicesList: [
      { name: "Boundary Fencing", icon: "fencing" },
      { name: "Solar Power Setup", icon: "farmhouse" }
    ],
    requirementsText: "Barbed wire 7-strand fence with concrete poles and solar perimeter lighting.",
    phone: "+91 98451 22334",
    surveyNumber: "Survey No. #118/A",
    userNotes: "Neighbor boundary demarcations confirmed by local revenue authority.",
    liveLocationUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-3",
    code: "GLCSOS3",
    customerName: "Vikram Seth",
    serviceCategory: "Farmhouse",
    location: "Warangal",
    description: "Structural inspection and smart home...",
    iconType: "farmhouse",
    stage: "New Requests",
    landId: "GLCSOS3",
    landSize: "3.5 Acres",
    address: "Plot 19, Kakatiya Agro Estate, Warangal.",
    preferredVisitDate: "Oct 28, 2026",
    servicesList: [
      { name: "Farmhouse Architecture & Build", icon: "farmhouse" },
      { name: "Rainwater Harvesting", icon: "borewell" }
    ],
    requirementsText: "Eco-friendly stone and timber cottage with solar backup and smart irrigation.",
    phone: "+91 97112 33445",
    surveyNumber: "Survey No. #304",
    userNotes: "Soil bearing capacity verified for G+1 structure.",
    liveLocationUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-4",
    code: "GLCSOS4",
    customerName: "Suresh Reddy",
    serviceCategory: "Fencing",
    location: "Hyderabad",
    description: "Certification audit and organic fertilizer...",
    iconType: "fencing",
    stage: "New Requests",
    landId: "GLCSOS4",
    landSize: "12.0 Acres",
    address: "Sector 4, Manair Basin Farmlands, Hyderabad.",
    preferredVisitDate: "Nov 10, 2026",
    servicesList: [
      { name: "Chainlink Perimeter Fencing", icon: "fencing" },
      { name: "Organic Plantation Setup", icon: "organic" }
    ],
    requirementsText: "Heavy gauge chainlink mesh and organic soil enrichment for sandalwood orchard.",
    phone: "+91 96554 11223",
    surveyNumber: "Survey No. #89/2",
    userNotes: "Drip system water source connection to be finalized.",
    liveLocationUrl: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-5",
    code: "GLCSOS5",
    customerName: "Tamim Iqbal",
    serviceCategory: "Fencing",
    serviceCategoryExtra: "+2",
    location: "Karimnagar",
    description: "Certification audit and organic fertilizer...",
    iconType: "fencing",
    stage: "New Requests",
    landId: "GLCSOS5",
    landSize: "6.0 Acres",
    address: "Plot 8, Godavari Green Belt, Karimnagar.",
    preferredVisitDate: "Nov 15, 2026",
    servicesList: [
      { name: "Boundary Security Fencing", icon: "fencing" },
      { name: "Borewell Drilling", icon: "borewell" }
    ],
    requirementsText: "Composite fence and 450ft borewell drilling test.",
    phone: "+91 95443 66778",
    surveyNumber: "Survey No. #201",
    userNotes: "Groundwater survey reports ready.",
    liveLocationUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-6",
    code: "GLCSOS6",
    customerName: "Suresh Reddy",
    serviceCategory: "Borewell",
    location: "Hyderabad",
    description: "Deep borewell maintenance and...",
    iconType: "borewell",
    stage: "New Requests",
    landId: "GLCSOS6",
    landSize: "5.0 Acres",
    address: "Plot 42, Green Valley, Shamshabad Mandal, Hyderabad.",
    preferredVisitDate: "Nov 18, 2026",
    servicesList: [
      { name: "Borewell Drilling", icon: "borewell" }
    ],
    requirementsText: "Deep borewell maintenance and pump reconditioning.",
    phone: "+91 98765 43210",
    surveyNumber: "Survey No. #442",
    userNotes: "Water level inspection scheduled.",
    liveLocationUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-7",
    code: "GLCSOS7",
    customerName: "Ananya Kapoor",
    serviceCategory: "Fencing",
    location: "West Godavari",
    description: "Perimeter security upgrade and electric...",
    iconType: "fencing",
    stage: "New Requests",
    landId: "GLCSOS7",
    landSize: "8.2 Acres",
    address: "Survey 118, Eluru Road, West Godavari District.",
    preferredVisitDate: "Nov 20, 2026",
    servicesList: [
      { name: "Boundary Fencing", icon: "fencing" }
    ],
    requirementsText: "Perimeter security upgrade and electric wire fence.",
    phone: "+91 98451 22334",
    surveyNumber: "Survey No. #118/B",
    userNotes: "Survey completed.",
    liveLocationUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-uv-1",
    farmlandId: 567,
    service_request_item_id: 7,
    serviceRequestItemId: 7,
    code: "GLCSOS1",
    customerName: "Suresh Reddy",
    assignedOfficer: "Amit Sharma",
    serviceCategory: "Borewell",
    location: "Hyderabad",
    createdDate: "12 May 2025",
    description: "Deep borewell maintenance and pump yield reconditioning.",
    iconType: "borewell",
    stage: "Quotations",
    landId: "GLCSOS1",
    landSize: "5 Acres",
    address: "Plot 42, Green Valley, Shamshabad Mandal, Hyderabad.",
    preferredVisitDate: "Oct 24, 2026",
    estimatedCost: "₹ 2 Lakhs",
    estimatedDuration: "90 Days",
    statusText: "Quotation Created",
    cardAction: "approve",
    servicesList: [
      { name: "Farmhouse Construction", icon: "farmhouse" },
      { name: "Borewell Drilling", icon: "borewell" },
      { name: "Organic Farming Setup", icon: "organic", subtitle: "(Premium Timber / Orchard (60/40))" }
    ],
    requirementsText: "Need a 2-BHK farmhouse with a wide porch and deep borewell near the north gate.",
    serviceDescription: "the scope of work, parts required, and labor details...",
    phone: "+91 98765 43210",
    surveyNumber: "Survey No. #442, 445",
    userNotes: "Verification completed by officer Amit Sharma.",
    assignedOfficerDetails: {
      name: "Amit Sharma",
      phone: "+9112345678910",
      email: "amitsharma45@gmail.com",
      assignedDate: "12th June 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-uv-2",
    code: "GLCSOS2",
    customerName: "Priya Sharma",
    assignedOfficer: "Rahul Gupta",
    serviceCategory: "Fencing",
    serviceCategoryExtra: "+2",
    location: "West Godavari",
    createdDate: "11 May 2025",
    description: "Perimeter security upgrade and electric wire fence boundary.",
    iconType: "fencing",
    stage: "Quotations",
    landId: "GLCSOS2",
    landSize: "5 Acres",
    address: "Survey 118, Eluru Road, West Godavari District.",
    preferredVisitDate: "Nov 02, 2026",
    estimatedCost: "₹ 2 Lakhs",
    estimatedDuration: "90 Days",
    statusText: "Quotation Created",
    cardAction: "approve",
    servicesList: [
      { name: "Boundary Fencing", icon: "fencing" },
      { name: "Solar Power Setup", icon: "farmhouse" }
    ],
    requirementsText: "Barbed wire 7-strand fence with concrete poles and solar perimeter lighting.",
    serviceDescription: "the scope of work, parts required, and labor details...",
    phone: "+91 98451 22334",
    surveyNumber: "Survey No. #118/A",
    userNotes: "Officer on site.",
    assignedOfficerDetails: {
      name: "Rahul Gupta",
      phone: "+9112345678910",
      email: "rahulgupta@gmail.com",
      assignedDate: "11th June 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-uv-3",
    code: "GLCSOS3",
    customerName: "Vikram Malhotra",
    assignedOfficer: "Ravi Kumar",
    serviceCategory: "Farmhouse",
    location: "Warangal",
    createdDate: "10 May 2025",
    description: "Structural inspection and smart home automation layout.",
    iconType: "farmhouse",
    stage: "Quotations",
    landId: "GLCSOS3",
    landSize: "3.5 Acres",
    address: "Plot 19, Kakatiya Agro Estate, Warangal.",
    preferredVisitDate: "Oct 28, 2026",
    estimatedCost: "₹ 12 Lakhs",
    estimatedDuration: "90 Days",
    statusText: "Under Verification",
    cardAction: "view-details",
    servicesList: [
      { name: "Farmhouse Architecture & Build", icon: "farmhouse" },
      { name: "Rainwater Harvesting", icon: "borewell" }
    ],
    requirementsText: "Eco-friendly stone and timber cottage with solar backup and smart irrigation.",
    serviceDescription: "Architectural blueprint layout and timber framework fabrication.",
    phone: "+91 97112 33445",
    surveyNumber: "Survey No. #304",
    userNotes: "Soil bearing capacity verified.",
    assignedOfficerDetails: {
      name: "Ravi Kumar",
      phone: "+9112345678910",
      email: "ravikumar@gmail.com",
      assignedDate: "10th June 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-uv-4",
    code: "GLCSOS4",
    customerName: "Ananya Kapoor",
    assignedOfficer: "Arjun Singh",
    serviceCategory: "Fencing",
    serviceCategoryExtra: "+1",
    location: "Karimnagar",
    createdDate: "09 May 2025",
    description: "Heavy gauge chainlink mesh and organic soil enrichment.",
    iconType: "fencing",
    stage: "Quotations",
    landId: "GLCSOS4",
    landSize: "12.0 Acres",
    address: "Sector 4, Manair Basin Farmlands, Karimnagar.",
    preferredVisitDate: "Nov 10, 2026",
    estimatedCost: "₹ 4.8 Lakhs",
    estimatedDuration: "90 Days",
    statusText: "Quotation Created",
    cardAction: "approve",
    servicesList: [
      { name: "Chainlink Perimeter Fencing", icon: "fencing" },
      { name: "Organic Plantation Setup", icon: "organic" }
    ],
    requirementsText: "Heavy gauge chainlink mesh and organic soil enrichment for sandalwood orchard.",
    serviceDescription: "the scope of work, parts required, and labor details...",
    phone: "+91 96554 11223",
    surveyNumber: "Survey No. #89/2",
    userNotes: "Boundary pegs marked.",
    assignedOfficerDetails: {
      name: "Arjun Singh",
      phone: "+9112345678910",
      email: "arjunsingh@gmail.com",
      assignedDate: "09th June 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-uv-5",
    code: "GLCSOS5",
    customerName: "Karthik Verma",
    assignedOfficer: "Rahul Mehta",
    serviceCategory: "Farmhouse",
    location: "Warangal",
    createdDate: "08 May 2025",
    description: "Eco-friendly farmhouse building blueprint inspection.",
    iconType: "farmhouse",
    stage: "Quotations",
    landId: "GLCSOS5",
    landSize: "3.5 Acres",
    address: "Plot 19, Kakatiya Agro Estate, Warangal.",
    preferredVisitDate: "Oct 28, 2026",
    estimatedCost: "₹ 12 Lakhs",
    estimatedDuration: "90 Days",
    statusText: "Under Verification",
    cardAction: "view-details",
    servicesList: [
      { name: "Farmhouse Construction", icon: "farmhouse" }
    ],
    requirementsText: "Eco-friendly stone and timber cottage.",
    serviceDescription: "Foundation framing and quality certification.",
    phone: "+91 97112 33445",
    surveyNumber: "Survey No. #304",
    userNotes: "Soil bearing capacity verified.",
    assignedOfficerDetails: {
      name: "Rahul Mehta",
      phone: "+9112345678910",
      email: "rahulmehta@gmail.com",
      assignedDate: "08th June 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-uv-6",
    code: "GLCSOS6",
    customerName: "Sunita Patel",
    assignedOfficer: "Suresh Sharma",
    serviceCategory: "Borewell",
    serviceCategoryExtra: "+2",
    location: "Hyderabad",
    createdDate: "07 May 2025",
    description: "Deep borewell maintenance and pump yield reconditioning.",
    iconType: "borewell",
    stage: "Quotations",
    landId: "GLCSOS6",
    landSize: "5 Acres",
    address: "Plot 42, Green Valley, Shamshabad Mandal, Hyderabad.",
    preferredVisitDate: "Oct 24, 2026",
    estimatedCost: "₹ 2 Lakhs",
    estimatedDuration: "90 Days",
    statusText: "Quotation Created",
    cardAction: "approve",
    servicesList: [
      { name: "Borewell Yield Inspection", icon: "borewell" }
    ],
    requirementsText: "Deep borewell maintenance and pump reconditioning.",
    serviceDescription: "the scope of work, parts required, and labor details...",
    phone: "+91 98765 43210",
    surveyNumber: "Survey No. #442, 445",
    userNotes: "Assigned officer on site.",
    assignedOfficerDetails: {
      name: "Suresh Sharma",
      phone: "+9112345678910",
      email: "sureshsharma@gmail.com",
      assignedDate: "07th June 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-uv-7",
    code: "GLCSOS7",
    customerName: "Deepak Rao",
    assignedOfficer: "Amit Joshi",
    serviceCategory: "Fencing",
    location: "West Godavari",
    createdDate: "06 May 2025",
    description: "Perimeter security upgrade and electric wire fence boundary.",
    iconType: "fencing",
    stage: "Quotations",
    landId: "GLCSOS7",
    landSize: "8.2 Acres",
    address: "Survey 118, Eluru Road, West Godavari District.",
    preferredVisitDate: "Nov 02, 2026",
    estimatedCost: "₹ 3.5 Lakhs",
    estimatedDuration: "90 Days",
    statusText: "Under Verification",
    cardAction: "view-details",
    servicesList: [
      { name: "Boundary Fencing", icon: "fencing" }
    ],
    requirementsText: "Barbed wire 7-strand fence with concrete poles.",
    serviceDescription: "Fence reinforcement and solar sensor boundary integration.",
    phone: "+91 98451 22334",
    surveyNumber: "Survey No. #118/A",
    userNotes: "Verification in progress.",
    assignedOfficerDetails: {
      name: "Amit Joshi",
      phone: "+9112345678910",
      email: "amitjoshi@gmail.com",
      assignedDate: "06th June 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-uv-8",
    code: "GLCSOS8",
    customerName: "Meera Krishnan",
    assignedOfficer: "Rajesh Gupta",
    serviceCategory: "Farmhouse",
    location: "Warangal",
    createdDate: "05 May 2025",
    description: "Structural inspection and smart home automation layout.",
    iconType: "farmhouse",
    stage: "Quotations",
    landId: "GLCSOS8",
    landSize: "3.5 Acres",
    address: "Plot 19, Kakatiya Agro Estate, Warangal.",
    preferredVisitDate: "Oct 28, 2026",
    estimatedCost: "₹ 12 Lakhs",
    estimatedDuration: "90 Days",
    statusText: "Under Verification",
    cardAction: "view-details",
    servicesList: [
      { name: "Farmhouse Architecture & Build", icon: "farmhouse" }
    ],
    requirementsText: "Eco-friendly stone cottage.",
    serviceDescription: "Architectural blueprint layout and timber framework fabrication.",
    phone: "+91 97112 33445",
    surveyNumber: "Survey No. #304",
    userNotes: "Quotation drafted.",
    assignedOfficerDetails: {
      name: "Rajesh Gupta",
      phone: "+9112345678910",
      email: "rajeshgupta@gmail.com",
      assignedDate: "05th June 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-uv-9",
    code: "GLCSOS9",
    customerName: "Ramesh Choudhary",
    assignedOfficer: "Nikhil Agarwal",
    serviceCategory: "Fencing",
    serviceCategoryExtra: "+1",
    location: "Karimnagar",
    createdDate: "04 May 2025",
    description: "Certification audit and organic fertilizer drip line installation.",
    iconType: "fencing",
    stage: "Quotations",
    landId: "GLCSOS9",
    landSize: "12.0 Acres",
    address: "Sector 4, Manair Basin Farmlands, Karimnagar.",
    preferredVisitDate: "Nov 15, 2026",
    estimatedCost: "₹ 4.8 Lakhs",
    estimatedDuration: "90 Days",
    statusText: "Quotation Created",
    cardAction: "approve",
    servicesList: [
      { name: "Boundary Security Fencing", icon: "fencing" }
    ],
    requirementsText: "Composite fence and 450ft borewell drilling test.",
    serviceDescription: "the scope of work, parts required, and labor details...",
    phone: "+91 95443 66778",
    surveyNumber: "Survey No. #201",
    userNotes: "Officer on site.",
    assignedOfficerDetails: {
      name: "Nikhil Agarwal",
      phone: "+9112345678910",
      email: "nikhilagarwal@gmail.com",
      assignedDate: "04th June 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80"
  },
  // ─── Customer Response Items Matching Figma (Accepted, Rejected, Awaiting) ─────
  {
    id: "sr-cr-1",
    code: "GLCSOS1",
    customerName: "Suresh Reddy",
    serviceCategory: "Borewell",
    location: "Hyderabad",
    description: "Deep borewell maintenance and pump yield reconditioning.",
    iconType: "borewell",
    stage: "Customer Response",
    customerResponseStatus: "Accepted",
    quotationAmount: "₹1,45,000",
    createdDate: "13 May 2025",
    dateSent: "10 May 2025",
    acceptanceDate: "13 May 2025",
    landId: "GLCSOS1",
    landSize: "5.0 Acres",
    address: "Plot 42, Green Valley, Shamshabad Mandal, Hyderabad.",
    preferredVisitDate: "Oct 24, 2026",
    servicesList: [
      { name: "Borewell", icon: "borewell" }
    ],
    requirementsText: "Depth estimation of 450 ft and 5HP pump quotation approved.",
    phone: "+91 98491 00211",
    assignedOfficer: "Amit Sharma",
    assignedOfficerDetails: {
      name: "Amit Sharma",
      phone: "+91 98491 00211",
      email: "amit.sharma@glc.com",
      assignedDate: "13 May 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-cr-2",
    code: "GLCSOS2",
    customerName: "Ananya Kapoor",
    serviceCategory: "Fencing",
    serviceCategoryExtra: "+2",
    location: "West Godavari",
    description: "Perimeter security upgrade and electric wire fence boundary.",
    iconType: "fencing",
    stage: "Customer Response",
    customerResponseStatus: "Accepted",
    quotationAmount: "₹2,05,000",
    createdDate: "12 May 2025",
    dateSent: "09 May 2025",
    acceptanceDate: "12 May 2025",
    landId: "GLCSOS2",
    landSize: "6.5 Acres",
    address: "Survey 118, Eluru Road, West Godavari District.",
    preferredVisitDate: "Nov 02, 2026",
    servicesList: [
      { name: "Fencing", icon: "fencing" },
      { name: "Farmhouse Construction", icon: "farmhouse" },
      { name: "Organic Farming", icon: "organic" }
    ],
    requirementsText: "Farmhouse & organic approved, fencing rejected.",
    phone: "+91 94402 11322",
    assignedOfficer: "Rahul Gupta",
    assignedOfficerDetails: {
      name: "Rahul Gupta",
      phone: "+91 94402 11322",
      email: "rahul.gupta@glc.com",
      assignedDate: "12 May 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-cr-3",
    code: "GLCSOS3",
    customerName: "Vikram Seth",
    serviceCategory: "Farmhouse",
    serviceCategoryExtra: "+1",
    location: "Warangal",
    description: "Structural inspection and smart home automation layout.",
    iconType: "farmhouse",
    stage: "Customer Response",
    customerResponseStatus: "Pending Review",
    quotationAmount: "₹5,20,000",
    createdDate: "11 May 2025",
    dateSent: "08 May 2025",
    landId: "GLCSOS3",
    landSize: "4.0 Acres",
    address: "Plot 19, Kakatiya Agro Estate, Warangal.",
    preferredVisitDate: "Oct 28, 2026",
    servicesList: [
      { name: "Farmhouse Construction", icon: "farmhouse" },
      { name: "Borewell", icon: "borewell" }
    ],
    requirementsText: "Consulting with structural engineer regarding earthquake-resistant foundation.",
    phone: "+91 91211 44533",
    assignedOfficer: "Ravi Kumar",
    assignedOfficerDetails: {
      name: "Ravi Kumar",
      phone: "+91 91211 44533",
      email: "ravi.kumar@glc.com",
      assignedDate: "11 May 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-cr-4",
    code: "GLCSOS4",
    customerName: "Suresh Reddy",
    serviceCategory: "Fencing",
    location: "Hyderabad",
    description: "Chainlink perimeter boundary fencing.",
    iconType: "fencing",
    stage: "Customer Response",
    customerResponseStatus: "Accepted",
    quotationAmount: "₹1,85,000",
    createdDate: "10 May 2025",
    dateSent: "07 May 2025",
    acceptanceDate: "10 May 2025",
    landId: "GLCSOS4",
    landSize: "5.0 Acres",
    address: "Sector 4, Manair Basin Farmlands, Hyderabad.",
    preferredVisitDate: "Nov 10, 2026",
    servicesList: [
      { name: "Fencing", icon: "fencing" }
    ],
    requirementsText: "Customer approved quotation on portal.",
    phone: "+91 98491 00211",
    assignedOfficer: "Amit Sharma",
    assignedOfficerDetails: {
      name: "Amit Sharma",
      phone: "+91 98491 00211",
      email: "amit.sharma@glc.com",
      assignedDate: "10 May 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-cr-5",
    code: "GLCSOS5",
    customerName: "Tamim Iqbal",
    serviceCategory: "Farmhouse",
    serviceCategoryExtra: "+2",
    location: "Karimnagar",
    description: "Composite farmhouse and 450ft borewell drilling.",
    iconType: "farmhouse",
    stage: "Customer Response",
    customerResponseStatus: "Accepted",
    quotationAmount: "₹4,20,000",
    createdDate: "09 May 2025",
    dateSent: "05 May 2025",
    acceptanceDate: "09 May 2025",
    landId: "GLCSOS5",
    landSize: "6.0 Acres",
    address: "Plot 8, Godavari Green Belt, Karimnagar.",
    preferredVisitDate: "Nov 15, 2026",
    servicesList: [
      { name: "Farmhouse", icon: "farmhouse" },
      { name: "Borewell", icon: "borewell" }
    ],
    requirementsText: "Customer signed estimation agreement.",
    phone: "+91 95443 66778",
    assignedOfficer: "Nikhil Agarwal",
    assignedOfficerDetails: {
      name: "Nikhil Agarwal",
      phone: "+91 95443 66778",
      email: "nikhil.agarwal@glc.com",
      assignedDate: "09 May 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-cr-6",
    code: "GLCSOS6",
    customerName: "Sabbir Rahman",
    serviceCategory: "Fencing",
    serviceCategoryExtra: "+1",
    location: "Hyderabad",
    description: "Heavy gauge chainlink boundary fencing.",
    iconType: "fencing",
    stage: "Customer Response",
    customerResponseStatus: "Pending",
    quotationAmount: "₹1,90,000",
    createdDate: "10 May 2025",
    dateSent: "07 May 2025",
    landId: "GLCSOS6",
    landSize: "5.0 Acres",
    address: "Plot 42, Green Valley, Shamshabad Mandal, Hyderabad.",
    preferredVisitDate: "Oct 24, 2026",
    servicesList: [
      { name: "Fencing", icon: "fencing" }
    ],
    requirementsText: "Awaiting customer approval.",
    phone: "+91 98765 43210",
    assignedOfficer: "Amit Sharma",
    assignedOfficerDetails: {
      name: "Amit Sharma",
      phone: "+91 98491 00211",
      email: "amit.sharma@glc.com",
      assignedDate: "10 May 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-cr-7",
    code: "GLCSOS7",
    customerName: "Shakib Al Hasan",
    serviceCategory: "Fencing",
    serviceCategoryExtra: "+3",
    location: "Delhi",
    description: "Perimeter boundary survey and solar fencing installation.",
    iconType: "fencing",
    stage: "Customer Response",
    customerResponseStatus: "Pending",
    quotationAmount: "₹3,40,000",
    createdDate: "11 May 2025",
    dateSent: "08 May 2025",
    landId: "GLCSOS7",
    landSize: "8.2 Acres",
    address: "Survey 118, Outer Ring Road, Delhi.",
    preferredVisitDate: "Nov 02, 2026",
    servicesList: [
      { name: "Fencing", icon: "fencing" }
    ],
    requirementsText: "Pending review on material specs.",
    phone: "+91 98451 22334",
    assignedOfficer: "Ravi Kumar",
    assignedOfficerDetails: {
      name: "Ravi Kumar",
      phone: "+91 91211 44533",
      email: "ravi.kumar@glc.com",
      assignedDate: "11 May 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sr-cr-8",
    code: "GLCSOS8",
    customerName: "Mushfiqur Rahim",
    serviceCategory: "Fencing",
    serviceCategoryExtra: "+2",
    location: "Bangalore",
    description: "Perimeter chainlink fencing with concrete pillars.",
    iconType: "fencing",
    stage: "Customer Response",
    customerResponseStatus: "Accepted",
    quotationAmount: "₹2,75,000",
    createdDate: "12 May 2025",
    dateSent: "09 May 2025",
    acceptanceDate: "12 May 2025",
    landId: "GLCSOS8",
    landSize: "3.5 Acres",
    address: "Plot 19, Whitefield Agro Estate, Bangalore.",
    preferredVisitDate: "Oct 28, 2026",
    servicesList: [
      { name: "Fencing", icon: "fencing" }
    ],
    requirementsText: "Ready for move to workorder.",
    phone: "+91 97112 33445",
    assignedOfficer: "Rahul Gupta",
    assignedOfficerDetails: {
      name: "Rahul Gupta",
      phone: "+91 94402 11322",
      email: "rahul.gupta@glc.com",
      assignedDate: "12 May 2025"
    },
    liveLocationUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80"
  }
];

// ─── Available Field Officers for Assignment ──────────────────────────────────
export const AVAILABLE_FIELD_OFFICERS: FieldOfficerOption[] = [
  { id: "fo-1", name: "Amit Sharma", role: "Field Officer", location: "Hyderabad", phone: "+91 98110 01122", assignedCount: 4 },
  { id: "fo-2", name: "Vikram Singh", role: "Field Officer", location: "Hyderabad", phone: "+91 98220 02233", assignedCount: 7 },
  { id: "fo-3", name: "Rahul Kumar", role: "Field Officer", location: "Shamshabad", phone: "+91 98330 03344", assignedCount: 3 },
  { id: "fo-4", name: "Arjun Reddy", role: "Field Officer", location: "Hyderabad", phone: "+91 98440 04455", assignedCount: 5 },
  { id: "fo-5", name: "Ramesh Kumar", role: "Field Officer", location: "Hyderabad", phone: "+91 98550 05566", assignedCount: 2 },
  { id: "fo-6", name: "Priya Sharma", role: "Field Officer", location: "Hyderabad", phone: "+91 98660 06677", assignedCount: 3 }
];

// ─── Work Order Pipeline Mock Data (Figma Match) ──────────────────────────────
export const INITIAL_WORK_ORDERS: WorkOrderPipelineItem[] = [
  // In - Progress Work Orders (Figma Image 1, 2, 4)
  {
    id: "wo-ip-1",
    code: "ID – 4092",
    farmlandId: "GLCSOS1",
    customerName: "Suresh Reddy",
    category: "BOREWELL",
    servicesExtraCount: 2,
    serviceCategoryExtra: "+2",
    location: "Chevella",
    assignedFO: "Rahul Verma",
    status: "In Progress",
    uploadTag: "PENDING UPLOAD",
    updatePending: true,
    iconType: "borewell",
    overallProgress: 30,
    estimatedCompletion: "Dec 2026",
    currentPhase: "Drilling",
    updateDate: "October 24, 2026",
    siteCode: "Site SOS 01",
    phases: [
      { id: "p1", name: "Ground water survey and point selection", status: "DONE" },
      { id: "p2", name: "Drilling", status: "IN PROGRESS" },
      { id: "p3", name: "Water quality test", status: "PENDING" },
      { id: "p4", name: "Pump and electrical installation", status: "PENDING" },
      { id: "p5", name: "Trail run and handover", status: "PENDING" }
    ],
    sitePhotos: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.005 N, 81.785 E"
      },
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.005 N, 81.785 E"
      },
      {
        url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.005 N, 81.785 E"
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.005 N, 81.785 E"
      }
    ],
    foNote: "Ground water survey point verified at 420 ft depth. Rotary rig drilling in progress through secondary rock stratum with steady casing progress."
  },
  {
    id: "wo-ip-2",
    code: "ID – 4092",
    farmlandId: "GLCSOS2",
    customerName: "Priya Das",
    category: "FENCING",
    location: "Moinabad",
    assignedFO: "Priya Das",
    status: "In Progress",
    uploadTag: "PENDING UPLOAD",
    updatePending: true,
    iconType: "fencing",
    overallProgress: 45,
    estimatedCompletion: "Nov 2026",
    currentPhase: "Concrete pole fixing",
    updateDate: "October 24, 2026",
    siteCode: "Site SOS 02",
    phases: [
      { id: "p1", name: "Perimeter survey and boundary demarcation", status: "DONE" },
      { id: "p2", name: "Concrete pole installation & curing", status: "IN PROGRESS" },
      { id: "p3", name: "Barbed wire & chainlink mesh stringing", status: "PENDING" },
      { id: "p4", name: "Security gate & solar perimeter sensor fixture", status: "PENDING" },
      { id: "p5", name: "Final security audit and handover", status: "PENDING" }
    ],
    sitePhotos: [
      {
        url: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      },
      {
        url: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      },
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      },
      {
        url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      }
    ],
    foNote: "Concrete pole installation completed along northern and eastern bounds. Tensile wire strainers prepared for stringing phase."
  },
  {
    id: "wo-ip-3",
    code: "ID – 4092",
    farmlandId: "GLCSOS3",
    customerName: "Rahul Verma",
    category: "BOREWELL",
    servicesExtraCount: 1,
    serviceCategoryExtra: "+1",
    location: "Chevella",
    assignedFO: "Rahul Verma",
    status: "In Progress",
    uploadTag: "PENDING UPLOAD",
    updatePending: true,
    iconType: "borewell",
    overallProgress: 30,
    estimatedCompletion: "Dec 2026",
    currentPhase: "Drilling",
    updateDate: "October 24, 2026",
    siteCode: "Site SOS 03",
    phases: [
      { id: "p1", name: "Ground water survey and point selection", status: "DONE" },
      { id: "p2", name: "Drilling", status: "IN PROGRESS" },
      { id: "p3", name: "Water quality test", status: "PENDING" },
      { id: "p4", name: "Pump and electrical installation", status: "PENDING" },
      { id: "p5", name: "Trail run and handover", status: "PENDING" }
    ],
    sitePhotos: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.005 N, 81.785 E"
      },
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.005 N, 81.785 E"
      },
      {
        url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.005 N, 81.785 E"
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.005 N, 81.785 E"
      }
    ],
    foNote: "Ground water survey point verified at 420 ft depth. Rotary rig drilling in progress through secondary rock stratum with steady casing progress."
  },
  {
    id: "wo-ip-4",
    code: "ID – 4092",
    farmlandId: "GLCSOS4",
    customerName: "Rahul Verma",
    category: "BOREWELL",
    location: "Chevella",
    assignedFO: "Rahul Verma",
    status: "In Progress",
    uploadTag: "RECENTLY ADDED",
    updatePending: false,
    iconType: "borewell",
    overallProgress: 30,
    estimatedCompletion: "Dec 2026",
    currentPhase: "Drilling",
    updateDate: "October 24, 2026",
    siteCode: "Site SOS 04",
    phases: [
      { id: "p1", name: "Ground water survey and point selection", status: "DONE" },
      { id: "p2", name: "Drilling", status: "IN PROGRESS" },
      { id: "p3", name: "Water quality test", status: "PENDING" },
      { id: "p4", name: "Pump and electrical installation", status: "PENDING" },
      { id: "p5", name: "Trail run and handover", status: "PENDING" }
    ],
    sitePhotos: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.005 N, 81.785 E"
      },
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.005 N, 81.785 E"
      },
      {
        url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.005 N, 81.785 E"
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.005 N, 81.785 E"
      }
    ],
    foNote: "Ground water survey point verified at 420 ft depth. Rotary rig drilling in progress."
  },
  {
    id: "wo-ip-5",
    code: "ID – 4092",
    farmlandId: "GLCSOS5",
    customerName: "Priya Das",
    category: "FARMHOUSE",
    servicesExtraCount: 1,
    serviceCategoryExtra: "+1",
    location: "Shankarpally",
    assignedFO: "Priya Das",
    status: "In Progress",
    uploadTag: "PENDING UPLOAD",
    updatePending: true,
    iconType: "farmhouse",
    overallProgress: 25,
    estimatedCompletion: "Jan 2027",
    currentPhase: "Foundation and framing",
    updateDate: "October 24, 2026",
    siteCode: "Site SOS 05",
    phases: [
      { id: "p1", name: "Site clearing and layout marking", status: "DONE" },
      { id: "p2", name: "Foundation and framing", status: "IN PROGRESS" },
      { id: "p3", name: "Walls, columns, and roof slab", status: "PENDING" },
      { id: "p4", name: "Plumbing and electrical", status: "PENDING" },
      { id: "p5", name: "Plastering, flooring, doors, windows, painting", status: "PENDING" },
      { id: "p6", name: "Final check and handover", status: "PENDING" }
    ],
    sitePhotos: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      },
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      },
      {
        url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      }
    ],
    foNote: "Foundation curing complete. Timber framing initiated for the west wing. Quality checks pass on all initial joints."
  },
  {
    id: "wo-ip-6",
    code: "ID – 4092",
    farmlandId: "GLCSOS5",
    customerName: "Priya Das",
    category: "FARMHOUSE",
    servicesExtraCount: 1,
    serviceCategoryExtra: "+1",
    location: "Shankarpally",
    assignedFO: "Priya Das",
    status: "In Progress",
    uploadTag: "PENDING UPLOAD",
    updatePending: true,
    iconType: "farmhouse",
    overallProgress: 25,
    estimatedCompletion: "Jan 2027",
    currentPhase: "Foundation and framing",
    updateDate: "October 24, 2026",
    siteCode: "Site SOS 05",
    phases: [
      { id: "p1", name: "Site clearing and layout marking", status: "DONE" },
      { id: "p2", name: "Foundation and framing", status: "IN PROGRESS" },
      { id: "p3", name: "Walls, columns, and roof slab", status: "PENDING" },
      { id: "p4", name: "Plumbing and electrical", status: "PENDING" },
      { id: "p5", name: "Plastering, flooring, doors, windows, painting", status: "PENDING" },
      { id: "p6", name: "Final check and handover", status: "PENDING" }
    ],
    sitePhotos: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      },
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      },
      {
        url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      }
    ],
    foNote: "Foundation curing complete. Timber framing initiated for the west wing. Quality checks pass on all initial joints."
  },
  {
    id: "wo-ip-7",
    code: "ID – 4092",
    farmlandId: "GLCSOS5",
    customerName: "Priya Das",
    category: "FARMHOUSE",
    servicesExtraCount: 1,
    serviceCategoryExtra: "+1",
    location: "Shankarpally",
    assignedFO: "Priya Das",
    status: "In Progress",
    uploadTag: "PENDING UPLOAD",
    updatePending: true,
    iconType: "farmhouse",
    overallProgress: 25,
    estimatedCompletion: "Jan 2027",
    currentPhase: "Foundation and framing",
    updateDate: "October 24, 2026",
    siteCode: "Site SOS 05",
    phases: [
      { id: "p1", name: "Site clearing and layout marking", status: "DONE" },
      { id: "p2", name: "Foundation and framing", status: "IN PROGRESS" },
      { id: "p3", name: "Walls, columns, and roof slab", status: "PENDING" },
      { id: "p4", name: "Plumbing and electrical", status: "PENDING" },
      { id: "p5", name: "Plastering, flooring, doors, windows, painting", status: "PENDING" },
      { id: "p6", name: "Final check and handover", status: "PENDING" }
    ],
    sitePhotos: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      },
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      },
      {
        url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E"
      }
    ],
    foNote: "Foundation curing complete. Timber framing initiated for the west wing. Quality checks pass on all initial joints."
  },

  // Completed Work Orders Matching Figma Image 3
  {
    id: "wo-comp-1",
    code: "ID – 4092",
    farmlandId: "GLCSOS13",
    customerName: "Rahul Verma",
    category: "BOREWELL",
    servicesExtraCount: 1,
    serviceCategoryExtra: "+1",
    location: "Chevella",
    assignedFO: "Rahul Verma",
    status: "Completed",
    iconType: "borewell",
    overallProgress: 100,
    timelineJourney: "June – Oct 2025",
    finalPayment: "₹3,30,000",
    transactionId: "GLC-TXN-8829102-S",
    amountBalance: "₹0",
    settlementDate: "Oct 24, 2023",
    documents: [
      { name: "Occupancy Certificate", size: "2.4 MB", type: "pdf" },
      { name: "Structural Warranty", size: "1.8 MB", type: "pdf" },
      { name: "Final Tax Invoice", size: "0.9 MB", type: "pdf" }
    ]
  },
  {
    id: "wo-comp-2",
    code: "ID – 4092",
    farmlandId: "GLCSOS14",
    customerName: "Priya Das",
    category: "ORGANIC FARMING",
    location: "Moinabad",
    assignedFO: "Priya Das",
    status: "Completed",
    iconType: "organic",
    overallProgress: 100,
    timelineJourney: "June – Oct 2025",
    finalPayment: "₹3,30,000",
    transactionId: "GLC-TXN-8829102-S",
    amountBalance: "₹0",
    settlementDate: "Oct 24, 2023",
    documents: [
      { name: "Occupancy Certificate", size: "2.4 MB", type: "pdf" },
      { name: "Structural Warranty", size: "1.8 MB", type: "pdf" },
      { name: "Final Tax Invoice", size: "0.9 MB", type: "pdf" }
    ]
  },
  {
    id: "wo-comp-3",
    code: "ID – 4092",
    farmlandId: "GLCSOS15",
    customerName: "Suresh Reddy",
    category: "FARMHOUSE",
    servicesExtraCount: 1,
    serviceCategoryExtra: "+1",
    location: "Shankarpally",
    assignedFO: "Suresh Reddy",
    status: "Completed",
    iconType: "farmhouse",
    overallProgress: 100,
    timelineJourney: "June – Oct 2025",
    finalPayment: "₹3,30,000",
    transactionId: "GLC-TXN-8829102-S",
    amountBalance: "₹0",
    settlementDate: "Oct 24, 2023",
    documents: [
      { name: "Occupancy Certificate", size: "2.4 MB", type: "pdf" },
      { name: "Structural Warranty", size: "1.8 MB", type: "pdf" },
      { name: "Final Tax Invoice", size: "0.9 MB", type: "pdf" }
    ]
  },
  {
    id: "wo-comp-4",
    code: "ID – 4092",
    farmlandId: "GLCSOS16",
    customerName: "Rahul Verma",
    category: "FENCING",
    location: "Chevella",
    assignedFO: "Rahul Verma",
    status: "Completed",
    iconType: "fencing",
    overallProgress: 100,
    timelineJourney: "June – Oct 2025",
    finalPayment: "₹3,30,000",
    transactionId: "GLC-TXN-8829102-S",
    amountBalance: "₹0",
    settlementDate: "Oct 24, 2023",
    documents: [
      { name: "Occupancy Certificate", size: "2.4 MB", type: "pdf" },
      { name: "Structural Warranty", size: "1.8 MB", type: "pdf" },
      { name: "Final Tax Invoice", size: "0.9 MB", type: "pdf" }
    ]
  },
  {
    id: "wo-comp-5",
    code: "ID – 4092",
    farmlandId: "GLCSOS16",
    customerName: "Rahul Verma",
    category: "FENCING",
    location: "Chevella",
    assignedFO: "Rahul Verma",
    status: "Completed",
    iconType: "fencing",
    overallProgress: 100,
    timelineJourney: "June – Oct 2025",
    finalPayment: "₹3,30,000",
    transactionId: "GLC-TXN-8829102-S",
    amountBalance: "₹0",
    settlementDate: "Oct 24, 2023",
    documents: [
      { name: "Occupancy Certificate", size: "2.4 MB", type: "pdf" },
      { name: "Structural Warranty", size: "1.8 MB", type: "pdf" },
      { name: "Final Tax Invoice", size: "0.9 MB", type: "pdf" }
    ]
  },
  {
    id: "wo-comp-6",
    code: "ID – 4092",
    farmlandId: "GLCSOS16",
    customerName: "Rahul Verma",
    category: "FENCING",
    location: "Chevella",
    assignedFO: "Rahul Verma",
    status: "Completed",
    iconType: "fencing",
    overallProgress: 100,
    timelineJourney: "June – Oct 2025",
    finalPayment: "₹3,30,000",
    transactionId: "GLC-TXN-8829102-S",
    amountBalance: "₹0",
    settlementDate: "Oct 24, 2023",
    documents: [
      { name: "Occupancy Certificate", size: "2.4 MB", type: "pdf" },
      { name: "Structural Warranty", size: "1.8 MB", type: "pdf" },
      { name: "Final Tax Invoice", size: "0.9 MB", type: "pdf" }
    ]
  },
  {
    id: "wo-comp-7",
    code: "ID – 4092",
    farmlandId: "GLCSOS16",
    customerName: "Rahul Verma",
    category: "FENCING",
    location: "Chevella",
    assignedFO: "Rahul Verma",
    status: "Completed",
    iconType: "fencing",
    overallProgress: 100,
    timelineJourney: "June – Oct 2025",
    finalPayment: "₹3,30,000",
    transactionId: "GLC-TXN-8829102-S",
    amountBalance: "₹0",
    settlementDate: "Oct 24, 2023",
    documents: [
      { name: "Occupancy Certificate", size: "2.4 MB", type: "pdf" },
      { name: "Structural Warranty", size: "1.8 MB", type: "pdf" },
      { name: "Final Tax Invoice", size: "0.9 MB", type: "pdf" }
    ]
  }
];

// ─── Helper to dynamically create a Work Order from an Approved Service Request ──
export const createWorkOrderFromServiceRequest = (
  item: ServiceRequestPipelineItem
): WorkOrderPipelineItem => {
  const categoryMap: Record<string, "BOREWELL" | "FENCING" | "FARMHOUSE" | "ORGANIC"> = {
    Borewell: "BOREWELL",
    Fencing: "FENCING",
    Farmhouse: "FARMHOUSE",
    "Organic Management": "ORGANIC",
  };

  const cat: "BOREWELL" | "FENCING" | "FARMHOUSE" | "ORGANIC" =
    categoryMap[item.serviceCategory] || "BOREWELL";

  const cleanFarmlandId = item.landId || item.code || "GLCSOS1";

  return {
    id: `wo-${item.id || item.code}-${Date.now()}`,
    code: "ID – 4092",
    farmlandId: cleanFarmlandId,
    customerName: item.customerName || "—",
    category: cat,
    location: item.location || "Chevella",
    surveyNumber: item.surveyNumber || "Survey No. #442, 445",
    assignedFO: item.assignedOfficer || "Rahul Verma",
    status: "In Progress",
    uploadTag: "PENDING UPLOAD",
    updatePending: true,
    iconType: item.iconType || "borewell",
    overallProgress: 25,
    estimatedCompletion: "Dec 2026",
    currentPhase: "Site clearing and layout marking",
    updateDate: "October 24, 2026",
    siteCode: item.landId || "Site SOS 01",
    phases: [
      { id: "p1", name: "Site clearing and layout marking", status: "DONE" },
      { id: "p2", name: "Foundation and framing", status: "IN PROGRESS" },
      { id: "p3", name: "Walls, columns, and roof slab", status: "PENDING" },
      { id: "p4", name: "Plumbing and electrical", status: "PENDING" },
      { id: "p5", name: "Plastering, flooring, doors, windows, painting", status: "PENDING" },
      { id: "p6", name: "Final check and handover", status: "PENDING" }
    ],
    sitePhotos: [
      {
        url:
          item.liveLocationUrl ||
          "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E",
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E",
      },
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E",
      },
      {
        url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
        timestamp: "Oct 24",
        locationGps: "17.004 N, 81.783 E",
      }
    ],
    foNote: `Foundation curing complete. Timber framing initiated for the west wing. Quality checks pass on all initial joints.`,
  };
};
