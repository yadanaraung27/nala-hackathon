/**
 * API Client with comprehensive error handling
 * 
 * This module provides a centralized way to make API calls with:
 * - Automatic error handling and classification
 * - Type-safe error responses
 * - Retry logic for transient failures
 * - User-friendly error messages
 */

export class ApiError extends Error {
  status: number;
  code: string;
  originalError?: any;

  constructor(message: string, status: number, code: string, originalError?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.originalError = originalError;
  }

  /**
   * Check if this is a network error (no response from server)
   */
  isNetworkError(): boolean {
    return this.status === 0 || this.code === 'NETWORK_ERROR';
  }

  /**
   * Check if this is a client error (4xx)
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if this is a server error (5xx)
   */
  isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Check if this error might be resolved by retrying
   */
  isRetryable(): boolean {
    return this.status === 503 || this.status === 504 || this.status === 0;
  }
}

export interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number; // milliseconds
  retries?: number; // number of retry attempts
  retryDelay?: number; // milliseconds between retries
}

/**
 * Make an API call with automatic error handling
 * 
 * @param url - The API endpoint URL
 * @param options - Request options
 * @returns Promise resolving to the response data
 * @throws ApiError on failure
 */
export async function apiCall<T = any>(
  url: string,
  options: ApiCallOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    timeout = 30000,
    retries = 0,
    retryDelay = 1000,
  } = options;

  let lastError: ApiError | null = null;

  // Retry loop
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      console.log(`Retrying API call to ${url} (attempt ${attempt + 1}/${retries + 1})`);
    }

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Make the request
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        let errorCode = `HTTP_${response.status}`;
        let errorBody: any = null;

        try {
          errorBody = await response.json();
          if (errorBody.message) {
            errorMessage = errorBody.message;
          }
          if (errorBody.error) {
            errorCode = errorBody.error;
          }
        } catch {
          // Response body is not JSON
          errorMessage = await response.text() || errorMessage;
        }

        const error = new ApiError(errorMessage, response.status, errorCode, errorBody);

        // Retry on retryable errors
        if (error.isRetryable() && attempt < retries) {
          lastError = error;
          continue;
        }

        throw error;
      }

      // Parse successful response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text() as any;
      }

    } catch (error: any) {
      // Handle network errors (fetch failures)
      if (error.name === 'AbortError') {
        lastError = new ApiError(
          `Request to ${url} timed out after ${timeout}ms`,
          0,
          'TIMEOUT',
          error
        );
      } else if (error instanceof ApiError) {
        lastError = error;
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        lastError = new ApiError(
          'Network error: Unable to connect to server. Please check your connection.',
          0,
          'NETWORK_ERROR',
          error
        );
      } else {
        lastError = new ApiError(
          error.message || 'An unexpected error occurred',
          0,
          'UNKNOWN_ERROR',
          error
        );
      }

      // Retry on network errors
      if (lastError.isRetryable() && attempt < retries) {
        continue;
      }
    }
  }

  // If we get here, all retries failed
  throw lastError || new ApiError('Request failed after all retries', 0, 'MAX_RETRIES_EXCEEDED');
}

/**
 * GET request helper
 */
export async function apiGet<T = any>(url: string, options: Omit<ApiCallOptions, 'method' | 'body'> = {}): Promise<T> {
  return apiCall<T>(url, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export async function apiPost<T = any>(url: string, body?: any, options: Omit<ApiCallOptions, 'method' | 'body'> = {}): Promise<T> {
  return apiCall<T>(url, { ...options, method: 'POST', body });
}

/**
 * PUT request helper
 */
export async function apiPut<T = any>(url: string, body?: any, options: Omit<ApiCallOptions, 'method' | 'body'> = {}): Promise<T> {
  return apiCall<T>(url, { ...options, method: 'PUT', body });
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = any>(url: string, options: Omit<ApiCallOptions, 'method' | 'body'> = {}): Promise<T> {
  return apiCall<T>(url, { ...options, method: 'DELETE' });
}
