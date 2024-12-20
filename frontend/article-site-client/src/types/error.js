export type ErrorResponse = {
  status: number;
  message: string;
  errors: Record<string, string>;
  timestamp: string;
}; 