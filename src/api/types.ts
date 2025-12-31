import type { AxiosRequestConfig } from "axios";
import type { QueryFunctionContext } from "@tanstack/react-query";

// API Response wrapper (common pattern)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// Custom API Error class
export class ApiError extends Error {
  status?: number;
  code?: string;
  response?: unknown;

  constructor(
    message: string,
    status?: number,
    code?: string,
    response?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.response = response;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export type ApiRequestConfig = AxiosRequestConfig & {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
  requestId?: string;
};

// API Request Context - passed from React Query
export interface ApiRequestContext {
  signal?: AbortSignal;
}

export const getApiRequestContext = (
  context?: QueryFunctionContext
): ApiRequestContext => {
  return {
    signal: context?.signal,
  };
};
