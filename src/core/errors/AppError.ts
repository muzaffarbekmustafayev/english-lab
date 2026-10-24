export class AppError extends Error {
  constructor(public override message: string, public statusCode: number = 400) {
    super(message);
    this.name = "AppError";
  }
}

export class VocabularyNotFoundError extends AppError {
  constructor(message: string = "So'zlar bazasi topilmadi yoki bo'sh") {
    super(message, 404);
    this.name = "VocabularyNotFoundError";
  }
}
