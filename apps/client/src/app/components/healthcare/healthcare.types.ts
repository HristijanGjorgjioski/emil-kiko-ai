export const HospitalType = {
  GENERAL: 'GENERAL',
  SPECIALIZED: 'SPECIALIZED',
  REHABILITATION: 'REHABILITATION',
  PSYCHIATRIC: 'PSYCHIATRIC',
  CHILDREN: 'CHILDREN',
  MATERNITY: 'MATERNITY',
};

export type HospitalType = (typeof HospitalType)[keyof typeof HospitalType];

export const Specialization = {
  CARDIOLOGY: 'CARDIOLOGY',
  ORTHOPEDICS: 'ORTHOPEDICS',
  PEDIATRICS: 'PEDIATRICS',
  ONCOLOGY: 'ONCOLOGY',
  RADIOLOGY: 'RADIOLOGY',
  DERMATOLOGY: 'DERMATOLOGY',
  NEUROLOGY: 'NEUROLOGY',
  PSYCHIATRY: 'PSYCHIATRY',
};

export type Specialization =
  (typeof Specialization)[keyof typeof Specialization];

export const CaregiverRole = {
  NURSE: 'NURSE',
  PHYSIOTHERAPIST: 'PHYSIOTHERAPIST',
  SOCIAL_WORKER: 'SOCIAL_WORKER',
  HOME_AIDE: 'HOME_AIDE',
  MIDWIFE: 'MIDWIFE',
};

export type CaregiverRole = (typeof CaregiverRole)[keyof typeof CaregiverRole];

export const HospitalService = {
  EMERGENCY_CARE: 'EMERGENCY_CARE',
  CARDIOLOGY: 'CARDIOLOGY',
  ONCOLOGY: 'ONCOLOGY',
  NEUROLOGY: 'NEUROLOGY',
  PEDIATRICS: 'PEDIATRICS',
  ORTHOPEDIC_SURGERY: 'ORTHOPEDIC_SURGERY',
  RADIOLOGY: 'RADIOLOGY',
  PHYSICAL_THERAPY: 'PHYSICAL_THERAPY',
  PSYCHIATRY: 'PSYCHIATRY',
  MATERNITY_CARE: 'MATERNITY_CARE',
  DERMATOLOGY: 'DERMATOLOGY',
};

export type HospitalService =
  (typeof HospitalService)[keyof typeof HospitalService];

export type Hospital = {
  id: string;
  name: string; // Name of the hospital or clinic
  location: string; // Location of the hospital or clinic
  capacity: number; // Number of patients the hospital can accommodate
  type: HospitalType; // Type of hospital or clinic
  services: HospitalService[]; // List of services provided by the hospital or clinic
  doctors: Doctor[]; // List of doctors working at the hospital or clinic
  caregivers: Caregiver[]; // List of caregivers working at the hospital or clinic
};

export type Doctor = {
  id: string;
  name: string; // Name of the doctor
  specialization: Specialization; // specialization of the doctor
  hospitalId: string | null; // ID of the hospital where the doctor works
  experienceYears: number; // Number of years of experience of the doctor
};

export type Caregiver = {
  id: string;
  name: string; // Name of the caregiver
  role: CaregiverRole; // Role of the caregiver
  experienceYears: number; // Number of years of experience of the caregiver
  hospitalId: string | null; // ID of the hospital where the caregiver works
};

export type SearchResults = {
  hospitals: Hospital[];
  doctors: Doctor[];
  caregivers: Caregiver[];
};

export type Source = 'Hospital' | 'Doctor' | 'Caregiver';

export type HealthcareEntity = Hospital | Doctor | Caregiver;
