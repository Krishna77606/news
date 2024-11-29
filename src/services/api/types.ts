export interface AIServiceResponse {
  choices: Array<{
    text: string;
  }>;
}

export interface AIRequestPayload {
  prompt: string;
  max_tokens: number;
  temperature: number;
}