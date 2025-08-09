export interface DivingIncident {
  id: string;
  dateTime: string;
  location: {
    site: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  diver: {
    name: string;
    age: number;
    certificationLevel: string;
    yearsOfExperience: number;
    numberOfDives: number;
  };
  dive: {
    maxDepth: number;
    bottomTime: number;
    waterTemperature: number;
    visibility: number;
    diveType: 'recreational' | 'technical' | 'commercial' | 'training';
    gasUsed: string;
    diveComputer: string;
    decoStops: Array<{
      depth: number;
      duration: number;
    }>;
  };
  incident: {
    type: 'DCS Type I' | 'DCS Type II' | 'AGE' | 'Barotrauma' | 'Other';
    symptoms: string[];
    onsetTime: string;
    firstAid: string[];
    evacuation: boolean;
    hyperbaricTreatment: boolean;
    treatmentTable?: string;
    outcome: 'full recovery' | 'partial recovery' | 'ongoing treatment' | 'fatal';
  };
  contributingFactors: string[];
  notes: string;
  reportedBy: {
    name: string;
    role: string;
    contact: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const SYMPTOM_OPTIONS = [
  'Joint pain',
  'Muscle pain',
  'Fatigue',
  'Skin rash',
  'Numbness',
  'Tingling',
  'Weakness',
  'Dizziness',
  'Nausea',
  'Visual disturbances',
  'Hearing problems',
  'Difficulty breathing',
  'Chest pain',
  'Confusion',
  'Loss of consciousness',
  'Paralysis',
  'Seizure',
  'Other'
];

export const FIRST_AID_OPTIONS = [
  '100% Oxygen',
  'Fluids (oral)',
  'Fluids (IV)',
  'Aspirin',
  'Rest',
  'Emergency evacuation',
  'CPR',
  'Other'
];

export const CONTRIBUTING_FACTORS = [
  'Rapid ascent',
  'Missed decompression stops',
  'Repetitive diving',
  'Flying after diving',
  'Dehydration',
  'Alcohol consumption',
  'Heavy exercise',
  'Cold exposure',
  'Patent foramen ovale (PFO)',
  'Poor physical fitness',
  'Equipment malfunction',
  'Dive computer failure',
  'Exceeding no-decompression limits',
  'Other'
];