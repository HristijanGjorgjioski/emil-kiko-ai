import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { healthcareData } from './dummy-data';
import { PrismaService } from '../prisma/prisma.service';

export type Source = 'Hospital' | 'Doctor' | 'Caregiver';
type FilteringClauses = {
  searchableEntity: Source[];
  Doctor: string;
  Hospital: string;
  Caregiver: string;
};

@Injectable()
export class HealthcareService {
  private readonly aiApiKey: string;
  private readonly openai: OpenAI;
  private cache = new Map();

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    this.aiApiKey = this.configService.get('OPEN_AI_KEY');
    this.openai = new OpenAI({ apiKey: this.aiApiKey });
  }

  async getEmbedding(text: string) {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }

  async getCachedEmbedding(text: string) {
    if (this.cache.has(text)) {
      console.log('USING CACHED VALUE');
      return this.cache.get(text);
    }
    const embedding = await this.getEmbedding(text);
    this.cache.set(text, embedding);
    return embedding;
  }

  async seedAddressPhoneAndEmail() {
    const mockAddresses = [
      '12 Ocean View Drive, Hamilton, Bermuda',
      "45 Palm Grove Road, St. George's, Bermuda",
      '78 Lighthouse Lane, Somerset, Bermuda',
      '23 Coral Bay Street, Warwick, Bermuda',
      '56 Hibiscus Avenue, Devonshire, Bermuda',
    ];
    const doctors = await this.prisma.doctor.findMany();
    const hospitals = await this.prisma.hospital.findMany();
    const caregivers = await this.prisma.caregiver.findMany();

    const randomAddress = () =>
      mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
    const randomPhone = () =>
      `+1-441-${Math.floor(1000000 + Math.random() * 9000000)}`; // Bermuda phone format
    const randomEmail = (name: string) =>
      `${name.replace(/\s+/g, '').toLowerCase()}@example.com`;

    for (const doctor of doctors) {
      await this.prisma.doctor.update({
        where: { id: doctor.id },
        data: {
          address: randomAddress(),
          phone: randomPhone(),
          email: randomEmail(doctor.name),
        },
      });
    }

    for (const hospital of hospitals) {
      await this.prisma.hospital.update({
        where: { id: hospital.id },
        data: {
          address: randomAddress(),
          phone: randomPhone(),
          email: randomEmail(hospital.name),
        },
      });
    }

    for (const caregiver of caregivers) {
      await this.prisma.caregiver.update({
        where: { id: caregiver.id },
        data: {
          address: randomAddress(),
          phone: randomPhone(),
          email: randomEmail(caregiver.name),
        },
      });
    }

    console.log('Seeding completed!');
  }

  async seedDB() {
    try {
      await this.prisma.hospital.createMany({
        data: healthcareData.hospitals,
      });
      await this.prisma.doctor.createMany({
        data: healthcareData.doctors,
      });
      await this.prisma.caregiver.createMany({
        data: healthcareData.caregivers,
      });
      console.log('Seeded dummy data');
    } catch (error) {
      console.error(error);
    }

    await this.seedEmbeddings();
    await this.seedAddressPhoneAndEmail();
    return 'SEEDED!';
  }

  async seedEmbeddings() {
    await this.seedHospitalEmbeddings();
    await this.seedDoctorEmbeddings();
    await this.seedCaregiverEmbeddings();
    console.log('Seeded embeddings');
  }

  async seedHospitalEmbeddings() {
    const hospitals = await this.prisma.hospital.findMany({
      include: {
        doctors: true,
        caregivers: true,
      },
    });
    for (const hospital of hospitals) {
      console.log(hospital);
      const doctors = hospital.doctors
        .map(
          (doctor) =>
            `${doctor.name} (Experience: ${doctor.experienceYears}, Specializaton: ${doctor.specialization})`
        )
        .join(', ');
      const caregivers = hospital.caregivers
        .map(
          (caregiver) =>
            `${caregiver.name} (Experience: ${caregiver.experienceYears}, Role: ${caregiver.role})`
        )
        .join(', ');
      const combinedText = `Name: ${hospital.name}, Location: ${hospital.location},
      Capacity: ${hospital.capacity}, Type: ${hospital.type}, Doctors: ${doctors}, Caregivers: ${caregivers}`;
      console.log(combinedText);

      const embedding = await this.getEmbedding(combinedText);
      const embeddingForDb = JSON.stringify(embedding);
      await this.prisma.$executeRaw`
      UPDATE "Hospital"
      SET "embedding" = (${embeddingForDb}::vector)
      WHERE "id" = ${hospital.id}
      `;
    }
  }

  async seedDoctorEmbeddings() {
    const doctors = await this.prisma.doctor.findMany();
    for (const doctor of doctors) {
      const combinedText = `${doctor.name} (Experience: ${doctor.experienceYears}, Specializaton: ${doctor.specialization})`;
      const embedding = await this.getEmbedding(combinedText);
      const embeddingForDb = JSON.stringify(embedding);
      await this.prisma.$executeRaw`
      UPDATE "Doctor"
      SET "embedding" = (${embeddingForDb}::vector)
      WHERE "id" = ${doctor.id}
      `;
    }
  }

  async seedCaregiverEmbeddings() {
    const caregivers = await this.prisma.caregiver.findMany();
    for (const caregiver of caregivers) {
      const combinedText = `${caregiver.name} (Experience: ${caregiver.experienceYears}, Role: ${caregiver.role})`;
      const embedding = await this.getEmbedding(combinedText);
      const embeddingForDb = JSON.stringify(embedding);
      await this.prisma.$executeRaw`
      UPDATE "Caregiver"
      SET "embedding" = (${embeddingForDb}::vector)
      WHERE "id" = ${caregiver.id}
      `;
    }
  }

  gpt4oMini = 'gpt-4o-mini' as const;
  gpt4Turbo = 'gpt-4-turbo' as const;
  // TODO Emil: with gpt4oMini "I am an addict" returns [] for searchableEntity.
  async generateSQLFilteringClauses(text: string): Promise<FilteringClauses> {
    const response = await this.openai.chat.completions.create({
      model: this.gpt4oMini,
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that classifies healthcare-related search queries and generates SQL filtering clauses for a healthcare database. Your task is two-fold:

1. **Entity Classification:** Analyze the given search query and determine which of the following entities are most relevant: "Hospital", "Doctor", and "Caregiver". Use these guidelines:
   - Use "Hospital" if the query mentions medical facilities, hospital names, locations, treatments, or services.
   - Use "Doctor" if the query mentions medical professionals, diagnoses, or specific specializations.
   - Use "Caregiver" if the query involves personal care, assistance, or terms such as nurse, midwife, or home aide.
   - Use both "Hospital" and "Doctor" for any health or other problem that cannot be categorized in any other way.
   - If the query applies to multiple entities, include all relevant options.

2. **SQL Filtering Clause Generation:** From the search query, extract filtering criteria that map to the database fields. For each entity, generate a valid SQL condition (always start with "WHERE", and include all needed keywords, like "AND", "BETWEEN", etc) that can be used to filter results:
   - For the **Hospital** table, consider fields such as "location", "services", "type" and "capacity". For example, if the query mentions "New York", include a condition like "location ILIKE '%New York%'". If the query mentions "cardiology", consider a clause like "'CARDIOLOGY' = ANY(services)".
   - For the **Doctor** table, consider the "specialization" field. For instance, if the query mentions "cardiology", include a condition like "specialization = 'CARDIOLOGY'".
   - For the **Caregiver** table, consider the "role" field. For example, if the query mentions "nurse", include a condition like "role = 'NURSE'".
   - For all 3 tables, include a clause that filters by the entity's name or any other relevant field. Only use parts of the query that clearly map to these fields; any other parts should be ignored for the filtering criteria. For names include only proper nouns.

Only use parts of the query that clearly map to these fields; any other parts should be ignored for the filtering criteria. If no applicable filter is deduced for an entity, return an empty string for that entity's clause.

Return a JSON object with exactly these four keys:
- "searchableEntity": an array of the relevant entity names (e.g., "["Hospital", "Doctor"]")
- "Doctor": a string containing the SQL filter for the Doctor table (or an empty string if none)
- "Hospital": a string containing the SQL filter for the Hospital table (or an empty string if none)
- "Caregiver": a string containing the SQL filter for the Caregiver table (or an empty string if none)

For context, here is a brief summary of the relevant parts of the database schema:
- **Hospital:** fields include "id", "name", "location", "capacity", "type" (one of these enum values: 'GENERAL', 'SPECIALIZED' ,'REHABILITATION', 'PSYCHIATRIC', 'CHILDREN', 'MATERNITY'), 
and "services" (an array of these enum values: 'EMERGENCY_CARE', 'CARDIOLOGY', ONCOLOGY', 'NEUROLOGY', 'PEDIATRICS', 'ORTHOPEDIC_SURGERY', 'RADIOLOGY', 'PHYSICAL_THERAPY', 'PSYCHIATRY', 'MATERNITY_CARE', 'DERMATOLOGY').
- **Doctor:** fields include "id", "name", "specialization", "experienceYears", and "hospitalId". Specialization is an enum with these possible values: 
'CARDIOLOGY', 'ORTHOPEDICS', 'PEDIATRICS', 'ONCOLOGY', 'RADIOLOGY', 'DERMATOLOGY', 'NEUROLOGY', 'PSYCHIATRY'.
- **Caregiver:** fields include "id", "name", "role", "experienceYears", and "hospitalId". Role is an enum with these possible values: 'NURSE', 'MIDWIFE', 'HOME_AIDE', 'CAREGIVER', 'PHYSIOTHERAPIST'.

Do not include any additional text or explanation in your output—only return the JSON object with the specified keys.`,
        },
        {
          role: 'user',
          content: `Query: "${text}"\n\nReturn a JSON response.`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);
  }

  async search(text: string) {
    const sqlFilteringClauses = await this.generateSQLFilteringClauses(text);
    console.log(sqlFilteringClauses);
    const embedding = await this.getCachedEmbedding(text);

    console.log('HOSPITAL WHERE CLAUE', sqlFilteringClauses['Hospital']);

    const subQueries = sqlFilteringClauses.searchableEntity.map(
      (table) => `
        (SELECT "id", embedding <-> $1::vector AS distance, '${table}' AS source
         FROM "${table}"
         ${sqlFilteringClauses[table]}
         ORDER BY distance
         LIMIT 5)
      `
    );
    const annex = subQueries.length > 1 ? 'ORDER BY distance LIMIT 5' : '';

    const query = `${subQueries.join(' UNION ALL ')} ${annex}`;

    console.log('QUERY', query);

    const response = (await this.prisma.$queryRawUnsafe(
      query,
      JSON.stringify(embedding)
    )) as {
      id: string;
      source: Source;
    }[];

    console.log(response);
    return this.getMultiple(response);
  }

  async get(id: string, source: Source) {
    console.log('GET', id, source);
    const response =
      source === 'Hospital'
        ? await this.prisma.hospital.findUnique({
            where: { id },
            include: {
              doctors: true,
              caregivers: true,
            },
          })
        : source === 'Doctor'
        ? await this.prisma.doctor.findUnique({
            where: { id },
          })
        : await this.prisma.caregiver.findUnique({
            where: { id },
          });

    return response;
  }

  async recommended(id: string, source: Source) {
    console.log('RECOMMENDED1', id, source);
    const healthcareEntity = await this.prisma.$queryRawUnsafe(
      `SELECT "embedding"::TEXT FROM "${source}" WHERE "id" = $1`,
      id
    );

    const embedding = healthcareEntity[0]?.embedding;
    if (!embedding) {
      throw new Error('Healthcare entity not found');
    }

    const response = (await this.prisma.$queryRawUnsafe(
      `SELECT "id"
       FROM "${source}"
       WHERE "id" != $1
       ORDER BY "embedding" <-> $2::vector
       LIMIT 5`,
      id,
      embedding
    )) as { id: string }[];

    return this.getMultiple(response.map((item) => ({ id: item.id, source })));
  }

  async getMultiple(
    data: {
      id: string;
      source: Source;
    }[]
  ) {
    const hospitalIds = data
      .filter((item) => item.source === 'Hospital')
      .map((item) => item.id);
    const doctorIds = data
      .filter((item) => item.source === 'Doctor')
      .map((item) => item.id);
    const caregiverIds = data
      .filter((item) => item.source === 'Caregiver')
      .map((item) => item.id);
    const hospitals = await this.prisma.hospital.findMany({
      where: {
        id: { in: hospitalIds },
      },
      include: {
        doctors: true,
        caregivers: true,
      },
    });

    const doctors = await this.prisma.doctor.findMany({
      where: {
        id: { in: doctorIds },
      },
    });

    const caregivers = await this.prisma.caregiver.findMany({
      where: {
        id: { in: caregiverIds },
      },
    });
    return { hospitals, doctors, caregivers };
  }
}
