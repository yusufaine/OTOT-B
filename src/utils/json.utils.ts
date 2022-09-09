export type JsonResponseType = {
  status: string;
  message: string;
  data?: {};
};

function buildJsonResponse(
  status: string,
  message: string,
  data?: Object
): JsonResponseType {
  return {
    status,
    message,
    ...(true && data),
  };
}

export function buildErrorJson(
  message: string,
  data?: Object
): JsonResponseType {
  return buildJsonResponse("error", message, data);
}

export function buildSuccessJson(
  message: string,
  data?: Object
): JsonResponseType {
  return buildJsonResponse("success", message, data);
}
