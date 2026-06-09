export class AppError extends Error {
  readonly code: string;

  private constructor(code: string, message: string) {
    super(message);
    this.name = "AppError";
    this.code = code;
  }

  static clientNotFound(): AppError {
    return new AppError("CLIENT_NOT_FOUND", "Client not found");
  }

  static projectsNotFound(): AppError {
    return new AppError("PROJECTS_NOT_FOUND", "Projects not found");
  }
}
