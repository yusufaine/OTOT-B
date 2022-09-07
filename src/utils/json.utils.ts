function buildJsonResponse(status: string, message: string, data?: Object) {
  return {
    status,
    message,
    ...(true && data),
  };
}

export function buildErrorJson(message: string, data?: Object) {
  return buildJsonResponse("error", message, data);
}

export function buildSuccessJson(message: string, data?: Object) {
  return buildJsonResponse("success", message, data);
}
