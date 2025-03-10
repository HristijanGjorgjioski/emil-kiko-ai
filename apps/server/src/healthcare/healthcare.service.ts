import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { healthcareData } from './dummy-data';
import { PrismaService } from '../prisma/prisma.service';

export type Source = 'Hospital' | 'Doctor' | 'Caregiver';

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

  async determineSearchableEntities(text: string): Promise<Source[]> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that classifies healthcare-related search queries into one or more categories: "Hospital", "Doctor", or "Caregiver". 
          Analyze the given search input and determine which entities are most relevant. 
          - Use "Hospital" when the query involves medical facilities, treatments, or specialized medical care.
          - Use "Doctor" when the query is about medical professionals, diagnoses, or specific specializations.
          - Use "Caregiver" when the query involves personal care, assistance, or non-medical support. Examples are a "nurse", "midwife", or "home aide".
          - Use both "Hospital" and "Doctor" for any health problems that have unspecified requirements.
          - If the query applies to multiple entities, include all relevant options.
          - Return a JSON object with a single key "searchableEntity" containing an array of the appropriate entity names.
          - Do NOT include any extra text, only the JSON response.`,
        },
        {
          role: 'user',
          content: `Query: "${text}"\n\nReturn a JSON response.`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content).searchableEntity;
  }

  async search(text: string) {
    const searchableEntity = await this.determineSearchableEntities(text);
    console.log(searchableEntity);
    const embedding = await this.getCachedEmbedding(text);

    const subQueries = searchableEntity.map(
      (table) => `
        (SELECT "id", embedding <-> $1::vector AS distance, '${table}' AS source
         FROM "${table}"
         ORDER BY distance
         LIMIT 5)
      `
    );
    const annex = subQueries.length > 1 ? 'ORDER BY distance LIMIT 5' : '';

    const query = `${subQueries.join(' UNION ALL ')} ${annex}`;

    console.log(query);

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
    /**
     * TODO Emil: check how to make this work:
    const healthcareEntity = await this.prisma.$queryRaw`
    SELECT "embedding"::TEXT
    FROM "${source}"
    WHERE "id" = ${id}
    `;
     */

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
