import {
  HospitalType,
  HospitalService,
  Specialization,
  CaregiverRole,
} from '@prisma/client';

export type Hospital = {
  id: string;
  name: string; // Name of the hospital or clinic
  location: string; // Location of the hospital or clinic
  capacity: number; // Number of patients the hospital can accommodate
  type: HospitalType; // Type of hospital or clinic
  services: HospitalService[]; // List of services provided by the hospital or clinic
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

export const healthcareData = {
  hospitals: [
    {
      id: '1',
      name: 'General Medical Center',
      location: 'New York, USA',
      capacity: 500,
      type: 'GENERAL',
      services: [
        HospitalService.EMERGENCY_CARE,
        HospitalService.CARDIOLOGY,
        HospitalService.ONCOLOGY,
        HospitalService.PEDIATRICS,
        HospitalService.ORTHOPEDIC_SURGERY,
      ],
    },
    {
      id: '2',
      name: 'Cardiology Hospital',
      location: 'Boston, USA',
      capacity: 200,
      type: 'SPECIALIZED',
      services: [HospitalService.CARDIOLOGY, HospitalService.EMERGENCY_CARE],
    },
    {
      id: '3',
      name: 'NeuroCare Clinic',
      location: 'San Francisco, USA',
      capacity: 150,
      type: 'SPECIALIZED',
      services: [HospitalService.NEUROLOGY, HospitalService.PSYCHIATRY],
    },
    {
      id: '4',
      name: "Children's Hospital",
      location: 'Chicago, USA',
      capacity: 300,
      type: 'CHILDREN',
      services: [HospitalService.PEDIATRICS, HospitalService.EMERGENCY_CARE],
    },
    {
      id: '5',
      name: 'Cancer Treatment Institute',
      location: 'Houston, USA',
      capacity: 250,
      type: 'SPECIALIZED',
      services: [HospitalService.ONCOLOGY, HospitalService.RADIOLOGY],
    },
    {
      id: '6',
      name: 'Orthopedic and Sports Medicine Hospital',
      location: 'Los Angeles, USA',
      capacity: 180,
      type: 'SPECIALIZED',
      services: [
        HospitalService.ORTHOPEDIC_SURGERY,
        HospitalService.PHYSICAL_THERAPY,
      ],
    },
    {
      id: '7',
      name: 'Rehabilitation Center',
      location: 'Seattle, USA',
      capacity: 120,
      type: 'REHABILITATION',
      services: [HospitalService.PHYSICAL_THERAPY, HospitalService.PSYCHIATRY],
    },
    {
      id: '8',
      name: 'Maternity Care Center',
      location: 'Miami, USA',
      capacity: 220,
      type: 'MATERNITY',
      services: [HospitalService.MATERNITY_CARE],
    },
    {
      id: '9',
      name: 'Psychiatric Wellness Institute',
      location: 'Denver, USA',
      capacity: 100,
      type: 'PSYCHIATRIC',
      services: [HospitalService.PSYCHIATRY],
    },
    {
      id: '10',
      name: 'Advanced Dermatology Clinic',
      location: 'Atlanta, USA',
      capacity: 80,
      type: 'SPECIALIZED',
      services: [HospitalService.DERMATOLOGY],
    },
  ] as Hospital[],
  doctors: [
    {
      id: '1',
      name: 'Dr. Alice Morgan',
      specialization: Specialization.CARDIOLOGY,
      hospitalId: '1',
      experienceYears: 5,
    },
    {
      id: '2',
      name: 'Dr. Benjamin Carter',
      specialization: Specialization.ONCOLOGY,
      hospitalId: '1',
      experienceYears: 1,
    },
    {
      id: '3',
      name: 'Dr. Clara Dawson',
      specialization: Specialization.PEDIATRICS,
      hospitalId: '1',
      experienceYears: 2,
    },
    {
      id: '4',
      name: 'Dr. Daniel Evans',
      specialization: Specialization.ORTHOPEDICS,
      hospitalId: '1',
      experienceYears: 15,
    },
    {
      id: '5',
      name: 'Dr. Edward Foster',
      specialization: Specialization.CARDIOLOGY,
      hospitalId: '2',
      experienceYears: 7,
    },
    {
      id: '6',
      name: 'Dr. Fiona Grant',
      specialization: Specialization.CARDIOLOGY,
      hospitalId: '2',
      experienceYears: 8,
    },
    {
      id: '7',
      name: 'Dr. George Harrison',
      specialization: Specialization.NEUROLOGY,
      hospitalId: '3',
      experienceYears: 7,
    },
    {
      id: '8',
      name: 'Dr. Helen Ingram',
      specialization: Specialization.PSYCHIATRY,
      hospitalId: '3',
      experienceYears: 6,
    },
    {
      id: '9',
      name: 'Dr. Ian Jacobs',
      specialization: Specialization.PEDIATRICS,
      hospitalId: '4',
      experienceYears: 3,
    },
    {
      id: '10',
      name: 'Dr. Julia King',
      specialization: Specialization.PEDIATRICS,
      hospitalId: '4',
      experienceYears: 4,
    },
    {
      id: '11',
      name: 'Dr. Kevin Lewis',
      specialization: Specialization.ONCOLOGY,
      hospitalId: '5',
      experienceYears: 6,
    },
    {
      id: '12',
      name: 'Dr. Linda Moore',
      specialization: Specialization.RADIOLOGY,
      hospitalId: '5',
      experienceYears: 5,
    },
    {
      id: '13',
      name: 'Dr. Michael Nolan',
      specialization: Specialization.ORTHOPEDICS,
      hospitalId: '6',
      experienceYears: 10,
    },
    {
      id: '14',
      name: 'Dr. Nancy Owens',
      specialization: Specialization.CARDIOLOGY,
      hospitalId: '6',
      experienceYears: 11,
    },
    {
      id: '15',
      name: 'Dr. Oliver Perry',
      specialization: Specialization.CARDIOLOGY,
      hospitalId: '7',
      experienceYears: 9,
    },
    {
      id: '16',
      name: 'Dr. Patricia Quinn',
      specialization: Specialization.PSYCHIATRY,
      hospitalId: '7',
      experienceYears: 5,
    },
    {
      id: '17',
      name: 'Dr. Quentin Roberts',
      specialization: Specialization.PEDIATRICS,
      hospitalId: '8',
      experienceYears: 9,
    },
    {
      id: '18',
      name: 'Dr. Rachel Smith',
      specialization: Specialization.PEDIATRICS,
      hospitalId: '8',
      experienceYears: 2,
    },
    {
      id: '19',
      name: 'Dr. Samuel Thompson',
      specialization: Specialization.PSYCHIATRY,
      hospitalId: '9',
      experienceYears: 4,
    },
    {
      id: '20',
      name: 'Dr. Theresa Underwood',
      specialization: Specialization.DERMATOLOGY,
      hospitalId: '10',
      experienceYears: 3,
    },
    {
      id: '21',
      name: 'Dr. Ursula Vega',
      specialization: Specialization.CARDIOLOGY,
      hospitalId: null,
      experienceYears: 5,
    },
    {
      id: '22',
      name: 'Dr. Victor Watson',
      specialization: Specialization.NEUROLOGY,
      hospitalId: null,
      experienceYears: 7,
    },
    {
      id: '23',
      name: 'Dr. Wendy Xu',
      specialization: Specialization.ONCOLOGY,
      hospitalId: null,
      experienceYears: 6,
    },
    {
      id: '24',
      name: 'Dr. Xavier Young',
      specialization: Specialization.PEDIATRICS,
      hospitalId: null,
      experienceYears: 8,
    },
    {
      id: '25',
      name: 'Dr. Yolanda Zimmerman',
      specialization: Specialization.ORTHOPEDICS,
      hospitalId: null,
      experienceYears: 9,
    },
    {
      id: '26',
      name: 'Dr. Zachary Allen',
      specialization: Specialization.DERMATOLOGY,
      hospitalId: null,
      experienceYears: 10,
    },
    {
      id: '27',
      name: 'Dr. Adam Baker',
      specialization: Specialization.CARDIOLOGY,
      hospitalId: '1',
      experienceYears: 1,
    },
    {
      id: '28',
      name: 'Dr. Brenda Collins',
      specialization: Specialization.RADIOLOGY,
      hospitalId: '2',
      experienceYears: 2,
    },
    {
      id: '29',
      name: 'Dr. Charles Dean',
      specialization: Specialization.NEUROLOGY,
      hospitalId: '3',
      experienceYears: 7,
    },
    {
      id: '30',
      name: 'Dr. Denise Ellis',
      specialization: Specialization.PEDIATRICS,
      hospitalId: '8',
      experienceYears: 5,
    },
  ] as Doctor[],
  caregivers: [
    {
      id: '1',
      name: 'Emily Carter',
      role: CaregiverRole.NURSE,
      experienceYears: 5,
      hospitalId: '1',
    },
    {
      id: '2',
      name: 'Michael Johnson',
      role: CaregiverRole.PHYSIOTHERAPIST,
      experienceYears: 8,
      hospitalId: '2',
    },
    {
      id: '3',
      name: 'Sophia Lee',
      role: CaregiverRole.SOCIAL_WORKER,
      experienceYears: 6,
      hospitalId: '3',
    },
    {
      id: '4',
      name: 'Daniel Martinez',
      role: CaregiverRole.NURSE,
      experienceYears: 10,
      hospitalId: '4',
    },
    {
      id: '5',
      name: 'Olivia White',
      role: CaregiverRole.HOME_AIDE,
      experienceYears: 4,
      hospitalId: '5',
    },
    {
      id: '6',
      name: 'Ethan Williams',
      role: CaregiverRole.PHYSIOTHERAPIST,
      experienceYears: 7,
      hospitalId: '6',
    },
    {
      id: '7',
      name: 'Ava Brown',
      role: CaregiverRole.SOCIAL_WORKER,
      experienceYears: 3,
      hospitalId: '7',
    },
    {
      id: '8',
      name: 'Lucas Anderson',
      role: CaregiverRole.MIDWIFE,
      experienceYears: 5,
      hospitalId: '8',
    },
    {
      id: '9',
      name: 'Mia Thompson',
      role: CaregiverRole.NURSE,
      experienceYears: 9,
      hospitalId: '9',
    },
    {
      id: '10',
      name: 'William Scott',
      role: CaregiverRole.PHYSIOTHERAPIST,
      experienceYears: 6,
      hospitalId: '10',
    },
    {
      id: '11',
      name: 'Noah Harris',
      role: CaregiverRole.HOME_AIDE,
      experienceYears: 2,
      hospitalId: '1',
    },
    {
      id: '12',
      name: 'Isabella Young',
      role: CaregiverRole.NURSE,
      experienceYears: 7,
      hospitalId: '2',
    },
    {
      id: '13',
      name: 'Liam Nelson',
      role: CaregiverRole.SOCIAL_WORKER,
      experienceYears: 5,
      hospitalId: '3',
    },
    {
      id: '14',
      name: 'Grace Hall',
      role: CaregiverRole.MIDWIFE,
      experienceYears: 8,
      hospitalId: '4',
    },
    {
      id: '15',
      name: 'Elijah Green',
      role: CaregiverRole.PHYSIOTHERAPIST,
      experienceYears: 6,
      hospitalId: '5',
    },
    {
      id: '16',
      name: 'Scarlett King',
      role: CaregiverRole.NURSE,
      experienceYears: 9,
      hospitalId: '6',
    },
    {
      id: '17',
      name: 'Henry Baker',
      role: CaregiverRole.HOME_AIDE,
      experienceYears: 4,
      hospitalId: '7',
    },
    {
      id: '18',
      name: 'Lily Carter',
      role: CaregiverRole.MIDWIFE,
      experienceYears: 5,
      hospitalId: '8',
    },
    {
      id: '19',
      name: 'Benjamin Foster',
      role: CaregiverRole.SOCIAL_WORKER,
      experienceYears: 7,
      hospitalId: '9',
    },
    {
      id: '20',
      name: 'Charlotte Reed',
      role: CaregiverRole.NURSE,
      experienceYears: 6,
      hospitalId: '10',
    },
    {
      id: '21',
      name: 'Oliver Adams',
      role: CaregiverRole.PHYSIOTHERAPIST,
      experienceYears: 8,
      hospitalId: '1',
    },
    {
      id: '22',
      name: 'Victoria Allen',
      role: CaregiverRole.SOCIAL_WORKER,
      experienceYears: 5,
      hospitalId: '1',
    },
    {
      id: '23',
      name: 'Samuel Carter',
      role: CaregiverRole.HOME_AIDE,
      experienceYears: 3,
      hospitalId: '2',
    },
    {
      id: '24',
      name: 'Amelia Cooper',
      role: CaregiverRole.SOCIAL_WORKER,
      experienceYears: 6,
      hospitalId: '3',
    },
    {
      id: '25',
      name: 'Alexander Torres',
      role: CaregiverRole.PHYSIOTHERAPIST,
      experienceYears: 4,
    }, // Independent
    {
      id: '26',
      name: 'Zoe Brooks',
      role: CaregiverRole.NURSE,
      experienceYears: 10,
    }, // Independent
    {
      id: '27',
      name: 'Nathaniel Collins',
      role: CaregiverRole.SOCIAL_WORKER,
      experienceYears: 7,
    }, // Independent
    {
      id: '28',
      name: 'Stella Rogers',
      role: CaregiverRole.HOME_AIDE,
      experienceYears: 2,
    }, // Independent
    {
      id: '29',
      name: 'Isaac Bennett',
      role: CaregiverRole.PHYSIOTHERAPIST,
      experienceYears: 5,
    }, // Independent
    {
      id: '30',
      name: 'Evelyn Hughes',
      role: CaregiverRole.MIDWIFE,
      experienceYears: 4,
    }, // Independent
  ] as Caregiver[],
};
