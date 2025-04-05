// Sample data for the Emergency Department Tracking System
// This file contains sample data for demonstration purposes

// User sample data
const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin@123", // This would be hashed in production
    role: "admin"
  },
  {
    name: "Dr. John Smith",
    email: "john.smith@example.com",
    password: "Doctor@123", // This would be hashed in production
    role: "doctor"
  },
  {
    name: "Nurse Sarah Johnson",
    email: "sarah.johnson@example.com",
    password: "Nurse@123", // This would be hashed in production
    role: "nurse"
  },
  {
    name: "Triage Officer Mike Brown",
    email: "mike.brown@example.com",
    password: "Triage@123", // This would be hashed in production
    role: "triage"
  }
];

// Patient sample data
const patients = [
  {
    uhid: "UHID001",
    name: "Robert Williams",
    age: 65,
    gender: "Male",
    contactNumber: "555-123-4567",
    address: "123 Main St, Anytown",
    emergencyContact: "Mary Williams (Wife) - 555-123-4568"
  },
  {
    uhid: "UHID002",
    name: "Emily Davis",
    age: 42,
    gender: "Female",
    contactNumber: "555-234-5678",
    address: "456 Oak Ave, Somewhere",
    emergencyContact: "David Davis (Husband) - 555-234-5679"
  },
  {
    uhid: "UHID003",
    name: "Michael Johnson",
    age: 28,
    gender: "Male",
    contactNumber: "555-345-6789",
    address: "789 Pine Rd, Elsewhere",
    emergencyContact: "Susan Johnson (Mother) - 555-345-6780"
  },
  {
    uhid: "UHID004",
    name: "Sophia Martinez",
    age: 8,
    gender: "Female",
    contactNumber: "555-456-7890",
    address: "101 Cedar Ln, Nowhere",
    emergencyContact: "Carlos Martinez (Father) - 555-456-7891"
  },
  {
    uhid: "UHID005",
    name: "James Wilson",
    age: 72,
    gender: "Male",
    contactNumber: "555-567-8901",
    address: "202 Birch St, Anywhere",
    emergencyContact: "Thomas Wilson (Son) - 555-567-8902"
  }
];

// Visit sample data
const visits = [
  {
    patient: "UHID001", // Reference to patient UHID
    arrivalTime: new Date("2025-04-05T07:30:00"),
    chiefComplaint: "Chest pain and shortness of breath",
    zone: "red",
    status: "in-treatment",
    provider: "john.smith@example.com", // Reference to doctor email
    quickAlert: {
      type: "STEMI",
      activatedAt: new Date("2025-04-05T07:45:00"),
      doorToECGTime: 12 // minutes
    },
    mobilityStatus: "stretcher"
  },
  {
    patient: "UHID002",
    arrivalTime: new Date("2025-04-05T08:15:00"),
    chiefComplaint: "Severe headache and dizziness",
    zone: "yellow-a",
    status: "awaiting-results",
    provider: "john.smith@example.com",
    mobilityStatus: "wheelchair"
  },
  {
    patient: "UHID003",
    arrivalTime: new Date("2025-04-05T08:45:00"),
    chiefComplaint: "Laceration on right arm",
    zone: "green",
    status: "waiting",
    provider: null,
    mobilityStatus: "ambulatory"
  },
  {
    patient: "UHID004",
    arrivalTime: new Date("2025-04-05T09:00:00"),
    chiefComplaint: "Fever and cough",
    zone: "yellow-b",
    status: "in-treatment",
    provider: "john.smith@example.com",
    mobilityStatus: "ambulatory"
  },
  {
    patient: "UHID005",
    arrivalTime: new Date("2025-04-05T09:30:00"),
    chiefComplaint: "Weakness on left side of body",
    zone: "red",
    status: "in-treatment",
    provider: "john.smith@example.com",
    quickAlert: {
      type: "STROKE",
      activatedAt: new Date("2025-04-05T09:40:00"),
      doorToCTTime: 18, // minutes
      doorToNeedleTime: 45 // minutes
    },
    mobilityStatus: "stretcher"
  }
];

// Vital signs sample data
const vitalSigns = [
  {
    visit: 0, // Reference to first visit
    recordedAt: new Date("2025-04-05T07:40:00"),
    recordedBy: "sarah.johnson@example.com",
    pulseRate: 110,
    respiratoryRate: 24,
    bloodPressure: {
      systolic: 160,
      diastolic: 95
    },
    temperature: 37.2,
    oxygenSaturation: 92,
    painScore: 8
  },
  {
    visit: 0, // Reference to first visit
    recordedAt: new Date("2025-04-05T08:10:00"),
    recordedBy: "sarah.johnson@example.com",
    pulseRate: 105,
    respiratoryRate: 22,
    bloodPressure: {
      systolic: 155,
      diastolic: 90
    },
    temperature: 37.1,
    oxygenSaturation: 94,
    painScore: 7
  },
  {
    visit: 1, // Reference to second visit
    recordedAt: new Date("2025-04-05T08:25:00"),
    recordedBy: "sarah.johnson@example.com",
    pulseRate: 88,
    respiratoryRate: 18,
    bloodPressure: {
      systolic: 145,
      diastolic: 92
    },
    temperature: 37.0,
    oxygenSaturation: 98,
    painScore: 9
  },
  {
    visit: 3, // Reference to fourth visit
    recordedAt: new Date("2025-04-05T09:10:00"),
    recordedBy: "sarah.johnson@example.com",
    pulseRate: 120,
    respiratoryRate: 22,
    bloodPressure: {
      systolic: 100,
      diastolic: 70
    },
    temperature: 39.2,
    oxygenSaturation: 96,
    painScore: 3
  },
  {
    visit: 4, // Reference to fifth visit
    recordedAt: new Date("2025-04-05T09:45:00"),
    recordedBy: "sarah.johnson@example.com",
    pulseRate: 92,
    respiratoryRate: 20,
    bloodPressure: {
      systolic: 170,
      diastolic: 95
    },
    temperature: 37.0,
    oxygenSaturation: 97,
    painScore: 4
  }
];

// Notes sample data
const notes = [
  {
    visit: 0, // Reference to first visit
    createdAt: new Date("2025-04-05T07:50:00"),
    createdBy: "john.smith@example.com",
    noteType: "physician",
    content: "Patient presents with acute chest pain radiating to left arm, started 1 hour ago. History of hypertension and diabetes. ECG shows ST elevation in leads II, III, aVF. Activating STEMI protocol. Administering aspirin 325mg, clopidogrel 600mg, and heparin bolus. Cardiology consulted for primary PCI."
  },
  {
    visit: 0, // Reference to first visit
    createdAt: new Date("2025-04-05T08:00:00"),
    createdBy: "sarah.johnson@example.com",
    noteType: "nurse",
    content: "IV access established, 18G in right AC. Medications administered as ordered. Patient reports pain level decreased to 6/10. Continuous cardiac monitoring in place. Family notified and en route to hospital."
  },
  {
    visit: 1, // Reference to second visit
    createdAt: new Date("2025-04-05T08:30:00"),
    createdBy: "john.smith@example.com",
    noteType: "physician",
    content: "Patient with sudden onset severe headache described as 'worst headache of life'. No focal neurological deficits noted. Ordering CT head without contrast to rule out subarachnoid hemorrhage. Also ordering CBC, CMP, and coagulation studies."
  },
  {
    visit: 4, // Reference to fifth visit
    createdAt: new Date("2025-04-05T09:50:00"),
    createdBy: "john.smith@example.com",
    noteType: "physician",
    content: "Patient with acute onset left-sided weakness and facial droop. Last known well 45 minutes ago. NIHSS score 14. CT head negative for hemorrhage. Activating stroke protocol and preparing for thrombolysis. Neurology consulted."
  },
  {
    visit: 4, // Reference to fifth visit
    createdAt: new Date("2025-04-05T10:20:00"),
    createdBy: "sarah.johnson@example.com",
    noteType: "nurse",
    content: "tPA administration started at 10:15. Patient being monitored for adverse reactions. Neurovital checks every 15 minutes. Family at bedside and informed of treatment plan."
  }
];

// Orders sample data
const orders = [
  {
    visit: 0, // Reference to first visit
    orderedAt: new Date("2025-04-05T07:55:00"),
    orderedBy: "john.smith@example.com",
    orderType: "medication",
    details: "Aspirin 325mg PO x1",
    status: "completed",
    completedAt: new Date("2025-04-05T08:05:00")
  },
  {
    visit: 0, // Reference to first visit
    orderedAt: new Date("2025-04-05T07:55:00"),
    orderedBy: "john.smith@example.com",
    orderType: "laboratory",
    details: "Cardiac enzymes (Troponin I, CK-MB), CBC, CMP, Lipid panel",
    status: "completed",
    completedAt: new Date("2025-04-05T08:30:00"),
    result: "Troponin I: 0.8 ng/mL (Elevated), CK-MB: 12 ng/mL (Elevated), WBC: 9.2, Hgb: 14.2, Platelets: 210, Na: 138, K: 4.2, Cr: 1.1, Glucose: 142"
  },
  {
    visit: 1, // Reference to second visit
    orderedAt: new Date("2025-04-05T08:35:00"),
    orderedBy: "john.smith@example.com",
    orderType: "imaging",
    details: "CT Head without contrast",
    status: "in-progress"
  },
  {
    visit: 4, // Reference to fifth visit
    orderedAt: new Date("2025-04-05T09:55:00"),
    orderedBy: "john.smith@example.com",
    orderType: "medication",
    details: "Alteplase 0.9 mg/kg (max 90mg), 10% as bolus over 1 min, remainder over 60 min",
    status: "completed",
    completedAt: new Date("2025-04-05T10:15:00")
  },
  {
    visit: 4, // Reference to fifth visit
    orderedAt: new Date("2025-04-05T09:55:00"),
    orderedBy: "john.smith@example.com",
    orderType: "imaging",
    details: "CT Angiogram Head and Neck",
    status: "ordered"
  }
];

// Export all sample data
module.exports = {
  users,
  patients,
  visits,
  vitalSigns,
  notes,
  orders
};
