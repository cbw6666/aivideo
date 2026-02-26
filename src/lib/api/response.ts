import { ApiError } from "./error";

/**
 * Standard success response
 */
export function apiSuccess<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

/**
 * Standard error response
 */
export function apiError(message: string, status = 400, details?: unknown) {
  return Response.json(
    {
      success: false,
      error: { message, details },
    },
    { status }
  );
}

/**
 * Handle errors and return appropriate response
 */
export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return apiError(error.message, error.status, error.details);
  }
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  console.error("Unexpected error:", errorMessage, errorStack);
  // In development, return detailed error info
  if (process.env.NODE_ENV === "development") {
    return apiError(errorMessage || "Internal server error", 500, { stack: errorStack });
  }
  return apiError("Internal server error", 500);
}
