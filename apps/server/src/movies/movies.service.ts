import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { moviesDummyData } from './dummy-data';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MoviesService {
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
  async haiku() {
    const completion = this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      store: true,
      messages: [{ role: 'user', content: 'write a haiku about ai' }],
    });

    const result = await completion;
    console.log(result.choices[0].message);
    return result;
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
    console.log(embedding);
    return embedding;
  }

  async seedDB() {
    for (const movie of moviesDummyData) {
      const combinedText = `Name: ${movie.name}, Director: ${movie.director}, 
      Genre: ${movie.genre}, Cast: ${movie.cast}, Plot: ${movie.plot} Setting: ${movie.setting}`;

      const embedding = await this.getEmbedding(combinedText);

      const created = await this.prisma.movie.create({
        data: {
          name: movie.name,
          director: movie.director,
          genre: movie.genre,
          cast: movie.cast,
          plot: movie.plot,
          setting: movie.setting,
        },
      });

      const embeddingForDb = JSON.stringify(embedding);
      await this.prisma.$executeRaw`
      UPDATE "Movie"
      SET "embedding" = (${embeddingForDb}::vector)
      WHERE "id" = ${created.id}
      `;
    }

    return 'SEEDED!';
  }

  async similar(text: string) {
    const embedding = await this.getCachedEmbedding(text);

    const response = await this.prisma.$queryRaw`
    SELECT "name" FROM "Movie"
    ORDER BY embedding <-> ${JSON.stringify(embedding)}::vector
    LIMIT 5
    `;

    return response;
  }

  async testCache() {
    const input = '3';
    const value = '100';

    if (this.cache.has(input)) {
      console.log('USING CACHED VALUE');
      return this.cache.get(input);
    }
    this.cache.set(input, value);
    return value;
  }
}
