export class CustomError extends Error {
  description: string;

  constructor(message: string, description: string) {
    super(message);
    this.description = description;
    this.name = 'CustomError';
  }
}
