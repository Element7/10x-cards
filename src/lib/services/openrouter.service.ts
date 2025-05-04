import { z } from "zod";

// Types and interfaces
export interface OpenRouterConfig {
  apiKey: string;
  endpoint: string;
  defaultModel: string;
  modelParams: {
    temperature: number;
    max_tokens: number;
  };
}

// Response schema types
interface JSONSchemaDefinition {
  type: string;
  properties?: Record<string, JSONSchemaDefinition>;
  items?: JSONSchemaDefinition;
  required?: string[];
}

interface ResponseFormat {
  type: "json_schema";
  json_schema: {
    name: string;
    strict: boolean;
    schema: JSONSchemaDefinition;
  };
}

interface RequestPayload {
  system?: string;
  user: string;
  response_format?: ResponseFormat;
  model?: string;
  modelParams?: Partial<OpenRouterConfig["modelParams"]>;
}

// Error types
class OpenRouterError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

class NetworkError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, "NETWORK_ERROR", details);
  }
}

class AuthorizationError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, "AUTH_ERROR", details);
  }
}

class ValidationError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", details);
  }
}

// Config validation schema
const configSchema = z.object({
  apiKey: z.string().min(1),
  endpoint: z.string().url(),
  defaultModel: z.string().min(1),
  modelParams: z.object({
    temperature: z.number().min(0).max(1),
    max_tokens: z.number().positive(),
  }),
});

// Zod schemas for response validation
const flashcardDataSchema = z.object({
  front: z.string(),
  back: z.string(),
});

const flashcardsResponseSchema = z.object({
  flashcards: z.array(flashcardDataSchema),
});

const openRouterResponseSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({
          content: z.string(),
          role: z.string(),
        }),
        finish_reason: z.string(),
      })
    )
    .length(1),
  model: z.string(),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

// JSON Schema for OpenRouter API

export class OpenRouterService {
  private readonly config: OpenRouterConfig;
  private readonly logger: Console;
  private _retryCount = 0;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY_MS = 1000;

  constructor(config: OpenRouterConfig) {
    try {
      this.config = configSchema.parse(config);
    } catch (error) {
      throw new ValidationError("Invalid configuration", error);
    }
    this.logger = console;
  }

  private async setupHeaders(): Promise<Headers> {
    return new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.config.apiKey}`,
      "HTTP-Referer": "https://10x.cards",
    });
  }

  private async retryRequest<T>(requestFn: () => Promise<T>, maxRetries: number = this.MAX_RETRIES): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (this._retryCount >= maxRetries) {
        this._retryCount = 0;
        throw error;
      }

      if (error instanceof NetworkError) {
        this._retryCount++;
        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY_MS * this._retryCount));
        return this.retryRequest(requestFn, maxRetries);
      }

      throw error;
    }
  }

  private async formatRequest(payload: RequestPayload): Promise<unknown> {
    const messages = [];

    if (payload.system) {
      messages.push({
        role: "system",
        content: payload.system,
      });
    }

    messages.push({
      role: "user",
      content: payload.user,
    });

    return {
      model: payload.model || this.config.defaultModel,
      messages,
      temperature: payload.modelParams?.temperature ?? this.config.modelParams.temperature,
      max_tokens: payload.modelParams?.max_tokens ?? this.config.modelParams.max_tokens,
      response_format: payload.response_format,
      stream: false,
    };
  }

  private validateResponse<T extends z.ZodType>(response: unknown, schema: T): z.infer<T> {
    try {
      return schema.parse(response);
    } catch (error) {
      this.logger.error("Response validation failed:", error);
      throw new ValidationError("Invalid response format", error);
    }
  }

  async sendRequest<T extends z.ZodType>(payload: RequestPayload, responseSchema: T): Promise<z.infer<T>> {
    return this.retryRequest(async () => {
      try {
        const formattedRequest = await this.formatRequest(payload);
        const headers = await this.setupHeaders();

        const response = await fetch(this.config.endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(formattedRequest),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new AuthorizationError("Invalid API key or unauthorized");
          }
          throw new NetworkError(`HTTP error! status: ${response.status}`);
        }

        const rawResponse = await response.json();

        // Debug log
        console.log("OpenRouter API Response:", JSON.stringify(rawResponse, null, 2));

        const validatedResponse = this.validateResponse(rawResponse, openRouterResponseSchema);

        // Parse the content string as JSON and validate against the provided schema
        const content = JSON.parse(validatedResponse.choices[0].message.content);
        return this.validateResponse(content, responseSchema);
      } catch (error) {
        if (error instanceof OpenRouterError) {
          throw error;
        }
        if (error instanceof SyntaxError) {
          throw new ValidationError("Invalid JSON in response", error);
        }
        // Log the full error for debugging
        console.error("OpenRouter request error:", error);
        throw new NetworkError("Failed to send request", error);
      }
    });
  }

  async generateFlashcards(sourceText: string): Promise<{ front: string; back: string; source: "ai_full" }[]> {
    const systemPrompt = `You are an expert at creating educational flashcards. Your task is to analyze the provided text and create concise, effective flashcards that capture the key concepts. Each flashcard should have a clear front (question/concept) and back (answer/explanation).

    You must respond with valid JSON in the following format:
    {
      "flashcards": [
        {
          "front": "question or concept",
          "back": "answer or explanation"
        }
      ]
    }`;

    const userPrompt = `Please create educational flashcards from the following text. Focus on the most important concepts and ensure each flashcard is self-contained and clear:\n\n${sourceText}`;

    try {
      const content = await this.sendRequest(
        {
          system: systemPrompt,
          user: userPrompt,
          modelParams: {
            temperature: 0.7,
            max_tokens: 2000,
          },
        },
        flashcardsResponseSchema
      );

      return content.flashcards.map((card) => ({
        ...card,
        source: "ai_full" as const,
      }));
    } catch (error) {
      this.logger.error("Failed to generate flashcards:", error);
      throw error;
    }
  }
}
