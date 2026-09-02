export type AIGatewayErrorCode =
  | "TIMEOUT"
  | "CONNECTION_ERROR"
  | "HTTP_ERROR"
  | "INVALID_RESPONSE"
  | "EMPTY_RESPONSE"
  | "UNKNOWN_ERROR";

export interface AIGatewayRequest {
  prompt: string;

  model?: string;

  temperature?: number;

  numPredict?: number;
}

export interface AIGatewayResponse {
  success: boolean;

  text: string;

  provider: string;

  model: string;

  duration: number;

  error?: string;

  errorCode?: AIGatewayErrorCode;
}