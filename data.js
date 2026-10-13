// SetuConnect Mock Database Seeds

const INITIAL_SCHEMES = [
  {
    id: "scheme-1",
    state: "Telangana",
    name: "Aasara Pension Scheme",
    category: "Financial",
    eligibility: "Daily wage laborers, senior citizens, and widows.",
    documents: "Aadhaar Card, Age Proof, Local Address Proof",
    description: "Financial assistance providing monthly pension to support the vulnerable sections of society, including old age and single workers.",
    link: "https://aasara.telangana.gov.in"
  },
  {
    id: "scheme-2",
    state: "Telangana",
    name: "Rythu Bandhu Scheme",
    category: "Financial",
    eligibility: "Agricultural laborers and land-owning farmers.",
    documents: "Pattadar Passbook, Aadhaar Card, Bank Account Details",
    description: "Investment support scheme providing financial support per acre per season to farmers and agriculture workers.",
    link: "https://rythubandhu.telangana.gov.in"
  },
  {
    id: "scheme-3",
    state: "Andhra Pradesh",
    name: "YSR Cheyutha",
    category: "Financial",
    eligibility: "Women workers aged 45-60 from minority communities.",
    documents: "Aadhaar Card, Caste Certificate, Bank Passbook",
    description: "Financial empowerment scheme providing annual cash assistance to help start small business units.",
    link: "https://ap.gov.in"
  },
  {
    id: "scheme-4",
    state: "Andhra Pradesh",
    name: "YSR Aarogyasri",
    category: "Health",
    eligibility: "BPL card holders and low-income informal workers.",
    documents: "Aarogyasri Card / Rice Card, Aadhaar Card",
    description: "Universal health coverage scheme providing free quality healthcare and surgical treatment in network hospitals.",
    link: "https://aarogyasri.ap.gov.in"
  },
  {
    id: "scheme-5",
    state: "Uttar Pradesh",
    name: "UP Shramik Panjikaran Yojana",
    category: "Job",
    eligibility: "Unorganized laborers aged 18-60 years.",
    documents: "Aadhaar Card, Bank Account, Ration Card, Mobile Number",
    description: "Labor department registration providing identity cards and access to 17+ state labor welfare schemes.",
    link: "https://upbocw.in"
  },
  {
    id: "scheme-6",
    state: "Uttar Pradesh",
    name: "UP Rojeegar Mela",
    category: "Job",
    eligibility: "Unemployed youth and skilled/semi-skilled migrant workers.",
    documents: "Educational certificates, Identity Proof, Resume",
    description: "Employment exchange program connecting local and returning migrant workers with private and public employers.",
    link: "https://sewayojan.up.nic.in"
  },
  {
    id: "scheme-7",
    state: "Tamil Nadu",
    name: "Amma Unavagam Scheme",
    category: "Food",
    eligibility: "Open to all migrant workers and low-income citizens.",
    documents: "None required (walk-in service)",
    description: "Highly subsidized food program run by municipal corporations offering healthy meals at nominal costs (₹1 to ₹5).",
    link: "https://www.chennaicorporation.gov.in"
  },
  {
    id: "scheme-8",
    state: "Tamil Nadu",
    name: "TN Labor Welfare Board Assistance",
    category: "Financial",
    eligibility: "Registered construction and manual workers.",
    documents: "Labor Board Registration Card, Bank Passbook",
    description: "Cash grants for marriage, education, maternity, and natural death benefits for registered laborers.",
    link: "https://labour.tn.gov.in"
  },
  {
    id: "scheme-9",
    state: "Karnataka",
    name: "Kayaka Scheme",
    category: "Financial",
    eligibility: "Self-help groups and cooperative labor societies.",
    documents: "SHG Registration, Aadhaar Card, Project Report",
    description: "Provides zero-interest and low-interest loans up to ₹10 Lakhs to labor cooperatives to start micro-enterprises.",
    link: "https://karnataka.gov.in"
  },
  {
    id: "scheme-10",
    state: "Karnataka",
    name: "Ambedkar Shramik Sahaya Scheme",
    category: "Housing",
    eligibility: "Urban unorganized construction laborers.",
    documents: "Labor Card, Aadhaar Card, Income Certificate",
    description: "Housing and transit shelter scheme providing temporary rental support and housing subsidies for migrant builders.",
    link: "https://kashramik.kar.nic.in"
  },
  {
    id: "scheme-11",
    state: "Central",
    name: "PM Shram Yogi Maan-dhan (PM-SYM)",
    category: "Financial",
    eligibility: "Unorganized workers aged 18-40 with monthly income < ₹15,000.",
    documents: "Aadhaar Card, Savings Bank Account with IFSC",
    description: "Voluntary and contributory pension scheme providing a assured monthly pension of ₹3,000 after reaching age 60.",
    link: "https://maandhan.in"
  },
  {
    id: "scheme-12",
    state: "Central",
    name: "One Nation One Ration Card (ONORC)",
    category: "Food",
    eligibility: "All NFSA ration card holders (highly beneficial for migrants).",
    documents: "Ration Card, Aadhaar Card",
    description: "Allows migrant workers to buy subsidized foodgrains from any Fair Price Shop (FPS) anywhere in the country.",
    link: "https://nfsa.gov.in"
  }
];

const INITIAL_HOSPITALS = [
  {
    id: "hosp-1",
    state: "Telangana",
    name: "Gandhi Hospital",
    location: "Secunderabad, Hyderabad",
    contact: "040-27505566",
    type: "Government General Hospital (Free)",
    distance: "1.2 km"
  },
  {
    id: "hosp-2",
    state: "Telangana",
    name: "Osmania General Hospital",
    location: "Afzal Gunj, Hyderabad",
    contact: "040-24600122",
    type: "Government General Hospital (Free)",
    distance: "3.5 km"
  },
  {
    id: "hosp-3",
    state: "Andhra Pradesh",
    name: "King George Hospital",
    location: "Maharanipeta, Visakhapatnam",
    contact: "0891-2564891",
    type: "Government General Hospital (Free)",
    distance: "2.1 km"
  },
  {
    id: "hosp-4",
    state: "Uttar Pradesh",
    name: "Dr. Ram Manohar Lohia Institute",
    location: "Vibhuti Khand, Lucknow",
    contact: "0522-4918555",
    type: "Government Specialty Hospital (Subsidy)",
    distance: "4.8 km"
  },
  {
    id: "hosp-5",
    state: "Tamil Nadu",
    name: "Rajiv Gandhi Government General Hospital",
    location: "Park Town, Chennai",
    contact: "044-25305000",
    type: "Government General Hospital (Free)",
    distance: "0.8 km"
  },
  {
    id: "hosp-6",
    state: "Karnataka",
    name: "Victoria Hospital",
    location: "Kalasipalyam, Bengaluru",
    contact: "080-26701150",
    type: "Government General Hospital (Free)",
    distance: "1.5 km"
  }
];

const OCCUPATIONS = [
  "Construction Worker",
  "Agricultural Laborer",
  "Brick Kiln Worker",
  "Domestic Maid / Housekeeper",
  "Mason (Mistri)",
  "Painter",
  "Plumber",
  "Electrician",
  "Carpenter",
  "Security Guard",
  "Tailor / Textile Worker",
  "Delivery Executive",
  "Factory Assembly Operator",
  "Rickshaw / Auto Driver"
];

const SKILL_CATEGORIES = [
  "Unskilled",
  "Semi-Skilled",
  "Skilled",
  "Highly Skilled"
];

const STATES = [
  "Telangana",
  "Andhra Pradesh",
  "Uttar Pradesh",
  "Tamil Nadu",
  "Karnataka",
  "Bihar",
  "Jharkhand",
  "West Bengal",
  "Odisha",
  "Madhya Pradesh",
  "Rajasthan"
];

const STATE_CODES = {
  "Bihar": "BR",
  "Uttar Pradesh": "UP",
  "Telangana": "TG",
  "Andhra Pradesh": "AP",
  "West Bengal": "WB",
  "Jharkhand": "JH",
  "Odisha": "OD",
  "Tamil Nadu": "TN",
  "Karnataka": "KA",
  "Madhya Pradesh": "MP",
  "Rajasthan": "RJ",
  "Maharashtra": "MH"
};

// Initial mock databases
const DEFAULT_WORKERS = [
  {
    id: "BR-MW-2026-9823",
    name: "Ramesh Kumar",
    phone: "9876543210",
    dob: "1992-08-15",
    gender: "Male",
    homeState: "Bihar",
    currentState: "Telangana",
    occupation: "Construction Worker",
    skillCategory: "Skilled",
    emergencyContact: "9988776655",
    bloodGroup: "O+",
    verified: true,
    bankStatus: "Linked",
    upiId: "rameshkumar@okaxis",
    aadhaar: "XXXX-XXXX-4321"
  },
  {
    id: "UP-MW-2026-4432",
    name: "Savitri Devi",
    phone: "9123456789",
    dob: "1988-04-20",
    gender: "Female",
    homeState: "Uttar Pradesh",
    currentState: "Karnataka",
    occupation: "Domestic Maid / Housekeeper",
    skillCategory: "Semi-Skilled",
    emergencyContact: "9122334455",
    bloodGroup: "B+",
    verified: false,
    bankStatus: "Linked",
    upiId: "savitridevi@okybl",
    aadhaar: "XXXX-XXXX-9876"
  }
];

const DEFAULT_EMPLOYERS = [
  {
    id: "EMP-101",
    companyName: "L&T Construction Projects",
    contactName: "Vikram Malhotra (Project Manager)",
    phone: "9000112233",
    location: "Gachibowli, Hyderabad, Telangana",
    verified: true
  },
  {
    id: "EMP-102",
    companyName: "Greenwood Farms & Agro",
    contactName: "Rajasekhar Reddy (Owner)",
    phone: "9440556677",
    location: "Vijayawada, Andhra Pradesh",
    verified: true
  }
];

const DEFAULT_EMPLOYMENTS = [
  {
    id: "JOB-501",
    workerId: "BR-MW-2026-9823",
    employerId: "EMP-101",
    companyName: "L&T Construction Projects",
    location: "Gachibowli, Hyderabad, Telangana",
    jobTitle: "Senior Mason",
    joiningDate: "2026-01-10",
    exitDate: "2026-05-15",
    dailyWage: 650,
    status: "Completed",
    paymentStatus: "Paid"
  },
  {
    id: "JOB-502",
    workerId: "BR-MW-2026-9823",
    employerId: "EMP-101",
    companyName: "L&T Construction Projects",
    location: "Gachibowli, Hyderabad, Telangana",
    jobTitle: "Senior Mason",
    joiningDate: "2026-06-01",
    exitDate: "", // ongoing
    dailyWage: 700,
    status: "Ongoing",
    paymentStatus: "Pending"
  }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-1",
    workerId: "BR-MW-2026-9823",
    message: "New Welfare Scheme 'ONORC' is available in your current state: Telangana. Apply now!",
    status: "unread",
    date: "2026-07-06T10:30:00Z"
  },
  {
    id: "notif-2",
    workerId: "BR-MW-2026-9823",
    message: "Wage credit of ₹19,500 has been initiated by L&T Construction Projects.",
    status: "read",
    date: "2026-05-16T18:45:00Z"
  }
];

const DEFAULT_NODAL_OFFICERS = [
  {
    id: "NO-BR-01",
    state: "Bihar",
    stateCode: "BR",
    name: "Shri Alok Ranjan (IAS)",
    designation: "State Migrant Labor Nodal Officer & Labor Commissioner",
    department: "Department of Labour Resources, Govt. of Bihar",
    phone: "8888888888",
    email: "nodal.migrant@bihar.gov.in",
    officeLocation: "Vikas Bhawan, Patna, Bihar"
  },
  {
    id: "NO-TG-01",
    state: "Telangana",
    stateCode: "TG",
    name: "Smt. K. Sunitha (IAS)",
    designation: "Special Secretary & State Nodal Officer for Inter-State Workers",
    department: "Labour, Employment & Training Dept, Govt. of Telangana",
    phone: "8888888889",
    email: "nodalofficer.migrant@telangana.gov.in",
    officeLocation: "BRKR Bhavan, Hyderabad, Telangana"
  },
  {
    id: "NO-UP-01",
    state: "Uttar Pradesh",
    stateCode: "UP",
    name: "Shri Rajesh Verma (PFS)",
    designation: "Additional Labor Commissioner & Migrant Welfare In-charge",
    department: "Labor Department, Government of Uttar Pradesh",
    phone: "8888888890",
    email: "nodal.shramik@up.gov.in",
    officeLocation: "Khandari Road, Lucknow, Uttar Pradesh"
  }
];

const DEFAULT_GRIEVANCES = [
  {
    id: "GRV-2026-101",
    workerId: "BR-MW-2026-9823",
    workerName: "Ramesh Kumar",
    workerPhone: "9876543210",
    homeState: "Bihar",
    currentState: "Telangana",
    category: "Wage Non-Payment",
    employerName: "L&T Construction Projects",
    disputedAmount: 14000,
    description: "Pending daily wages for 20 working days in May 2026. Subcontractor delaying release despite verified passbook entry.",
    status: "Under Investigation",
    priority: "High",
    filedDate: "2026-07-02T11:20:00Z",
    updatedDate: "2026-07-05T14:10:00Z",
    assignedOfficerState: "Bihar",
    officerRemarks: "Notice issued to site project manager. Wage settlement meeting fixed with Telangana labor desk."
  },
  {
    id: "GRV-2026-102",
    workerId: "UP-MW-2026-4432",
    workerName: "Savitri Devi",
    workerPhone: "9123456789",
    homeState: "Uttar Pradesh",
    currentState: "Karnataka",
    category: "Welfare Scheme Access Denial",
    employerName: "Private Household",
    disputedAmount: 0,
    description: "Local fair price ration shop in Bengaluru rejected One Nation One Ration Card claiming out-of-state card cannot be scanned.",
    status: "Action Taken",
    priority: "Medium",
    filedDate: "2026-06-25T09:15:00Z",
    updatedDate: "2026-06-28T16:30:00Z",
    assignedOfficerState: "Uttar Pradesh",
    officerRemarks: "Communicated with Karnataka Civil Supplies Nodal Cell. FPS shopkeeper instructed to enable biometric ONORC terminal."
  }
];

const DEFAULT_STATE_REQUESTS = [
  {
    id: "REQ-2026-501",
    fromState: "Telangana",
    toState: "Bihar",
    workerId: "BR-MW-2026-9823",
    workerName: "Ramesh Kumar",
    requestType: "Home State Domicile & eKYC Verification",
    reason: "Verification required for Inter-State Transit Housing Allotment in Hyderabad.",
    status: "Approved",
    date: "2026-06-20T10:00:00Z"
  },
  {
    id: "REQ-2026-502",
    fromState: "Karnataka",
    toState: "Uttar Pradesh",
    workerId: "UP-MW-2026-4432",
    workerName: "Savitri Devi",
    requestType: "Inter-State Emergency Medical Aid Sponsorship",
    reason: "Free emergency hospitalization coverage cross-clearance.",
    status: "Pending",
    date: "2026-07-04T12:30:00Z"
  }
];
