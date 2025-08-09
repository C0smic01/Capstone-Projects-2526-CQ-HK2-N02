class APIError extends Error {
  code?: number;
  status?: string;

  constructor(message: string, code?: number, status?: string) {
    super(message);
    this.name = "APIError";
    this.code = code;
    this.status = status;
  }
}

export default APIError;