import { z } from "zod";

// Types and interfaces
interface OpenRouterConfig {
  apiKey: string;
  endpoint: string;
  defaultModel: string;
  modelParams: {
    temperature: number;
    max_tokens: number;
  };
}

interface RequestPayload {
  system?: string;
  user: string;
  response_format?: {
    type: string;
    json_schema: {
      name: string;
      strict: boolean;
      schema: Record<string, unknown>;
    };
  };
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

export class OpenRouterService {
  private readonly config: OpenRouterConfig;
  private readonly logger: Console;
  private _retryCount = 0;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY_MS = 1000;

  constructor(config: OpenRouterConfig) {
    try {
      // Validate config using zod
      this.config = configSchema.parse(config);
    } catch (error) {
      throw new ValidationError("Invalid configuration", error);
    }

    // Initialize logger
    this.logger = console;
  }

  private async setupHeaders(): Promise<Headers> {
    return new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.config.apiKey}`,
      "HTTP-Referer": "https://10x.cards", // Replace with actual domain
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
    try {
      return {
        messages: [
          ...(payload.system ? [{ role: "system", content: payload.system }] : []),
          { role: "user", content: payload.user },
        ],
        model: payload.model || this.config.defaultModel,
        ...(payload.modelParams || this.config.modelParams),
        response_format: payload.response_format,
      };
    } catch (error) {
      throw new ValidationError("Failed to format request", error);
    }
  }
}
