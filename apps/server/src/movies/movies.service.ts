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

    return new Float32Array(response.data[0].embedding);
  }

  async getCachedEmbedding(text: string) {
    console.log('TEXT', text);
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
    const firstMovie = moviesDummyData[0];
    const combinedText = `Name: ${firstMovie.name}, Director: ${firstMovie.director}, 
    Genre: ${firstMovie.genre}, Cast: ${firstMovie.cast}, Plot: ${firstMovie.plot} Setting: ${firstMovie.setting}`;

    const embedding = await this.getCachedEmbedding(combinedText);

    const created = await this.prisma.movie.create({
      data: {
        name: firstMovie.name,
        director: firstMovie.director,
        genre: firstMovie.genre,
        cast: firstMovie.cast,
        plot: firstMovie.plot,
        setting: firstMovie.setting,
      },
    });
    // await this.prisma.$executeRaw`
    // -- CreateExtension
    // UPDATE "Movie"
    // SET "embedding" = (${embedding}::vector)
    // WHERE "id" = ${created.id}
    // `;

    return embedding;
    // console.log(embedding);
    return created.id;
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
