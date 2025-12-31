import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError, type ApiRequestConfig } from "./types";

// Environment configuration
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://jsonplaceholder.typicode.com";
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

// Generate unique request ID
const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Create axios instance with default config
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Enable withCredentials for CORS with credentials
  // withCredentials: true,
});

// Request interceptor - runs before EVERY request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const apiConfig = config as InternalAxiosRequestConfig & ApiRequestConfig;

    // Generate request ID if not provided
    if (!apiConfig.requestId) {
      apiConfig.requestId = generateRequestId();
    }

    // Add request ID to headers for tracking
    if (apiConfig.headers) {
      apiConfig.headers["X-Request-ID"] = apiConfig.requestId;
    }

    // Add authentication token
    // Uncomment when you need auth
    // if (!apiConfig.skipAuth) {
    //   const token = localStorage.getItem("auth_token");
    //   if (token && apiConfig.headers) {
    //     apiConfig.headers.Authorization = `Bearer ${token}`;
    //   }
    // }

    // Log request in development
    if (isDevelopment) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        {
          requestId: apiConfig.requestId,
          params: config.params,
          data: config.data,
        }
      );
    }

    return config;
  },
  (error) => {
    if (isDevelopment) {
      console.error("[API Request Error]", error);
    }
    return Promise.reject(
      new ApiError(
        error.message || "Request configuration error",
        undefined,
        "REQUEST_ERROR",
        error
      )
    );
  }
);

// Response interceptor - runs after EVERY response
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const requestId = (
      response.config as InternalAxiosRequestConfig & ApiRequestConfig
    ).requestId;

    // Log response in development
    if (isDevelopment) {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          requestId,
          status: response.status,
          data: response.data,
        }
      );
    }

    return response;
  },
  (error) => {
    const requestId = (
      error.config as InternalAxiosRequestConfig & ApiRequestConfig
    )?.requestId;
    const apiConfig = error.config as InternalAxiosRequestConfig &
      ApiRequestConfig;

    // Log error in development
    if (isDevelopment) {
      console.error(
        `[API Error] ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }`,
        {
          requestId,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        }
      );
    }

    // Skip default error handler if requested
    if (apiConfig?.skipErrorHandler) {
      return Promise.reject(error);
    }

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message =
        (error.response.data as { message?: string })?.message ||
        error.message ||
        "An error occurred";

      switch (status) {
        case 400:
          return Promise.reject(
            new ApiError(
              message || "Bad request",
              400,
              "BAD_REQUEST",
              error.response.data
            )
          );
        case 401:
          // Handle unauthorized - clear token, redirect to login, etc.
          // localStorage.removeItem("auth_token");
          // window.location.href = "/login";
          return Promise.reject(
            new ApiError(
              message || "Unauthorized",
              401,
              "UNAUTHORIZED",
              error.response.data
            )
          );
        case 403:
          return Promise.reject(
            new ApiError(
              message || "Forbidden",
              403,
              "FORBIDDEN",
              error.response.data
            )
          );
        case 404:
          return Promise.reject(
            new ApiError(
              message || "Resource not found",
              404,
              "NOT_FOUND",
              error.response.data
            )
          );
        case 422:
          return Promise.reject(
            new ApiError(
              message || "Validation error",
              422,
              "VALIDATION_ERROR",
              error.response.data
            )
          );
        case 429:
          return Promise.reject(
            new ApiError(
              message || "Too many requests",
              429,
              "RATE_LIMIT",
              error.response.data
            )
          );
        case 500:
        case 502:
        case 503:
        case 504:
          return Promise.reject(
            new ApiError(
              message || "Server error",
              status,
              "SERVER_ERROR",
              error.response.data
            )
          );
        default:
          return Promise.reject(
            new ApiError(message, status, "HTTP_ERROR", error.response.data)
          );
      }
    } else if (error.request) {
      // Request made but no response received (network error, timeout, etc.)
      return Promise.reject(
        new ApiError(
          "Network error. Please check your connection.",
          undefined,
          "NETWORK_ERROR",
          error.request
        )
      );
    } else {
      // Error setting up the request
      return Promise.reject(
        new ApiError(
          error.message || "Request error",
          undefined,
          "REQUEST_ERROR",
          error
        )
      );
    }
  }
);

// Export default for convenience
export default api;
