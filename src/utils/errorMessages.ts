/**
 * User-friendly error messages
 * 
 * Maps technical error codes/statuses to user-friendly messages
 */

import { ApiError } from './apiClient';

export interface ErrorMessageMapping {
  title: string;
  message: string;
  actionable?: string; // What the user can do about it
  technical?: string; // Technical details for debugging
}

/**
 * Get user-friendly error message from an error
 */
export function getUserFriendlyError(error: Error | ApiError): ErrorMessageMapping {
  if (error instanceof ApiError) {
    return getApiErrorMessage(error);
  }

  // Generic error
  return {
    title: 'Something went wrong',
    message: error.message || 'An unexpected error occurred',
    actionable: 'Please try again. If the problem persists, contact support.',
    technical: error.stack,
  };
}

/**
 * Get user-friendly message for API errors
 */
function getApiErrorMessage(error: ApiError): ErrorMessageMapping {
  // Network errors
  if (error.isNetworkError()) {
    if (error.code === 'TIMEOUT') {
      return {
        title: 'Request timed out',
        message: 'The server is taking too long to respond',
        actionable: 'Please check your internet connection and try again',
        technical: error.message,
      };
    }
    return {
      title: 'Connection error',
      message: 'Unable to connect to the server',
      actionable: 'Please check your internet connection and ensure the server is running',
      technical: error.message,
    };
  }

  // 400 Bad Request
  if (error.status === 400) {
    return {
      title: 'Invalid request',
      message: error.message || 'The request contains invalid data',
      actionable: 'Please check your input and try again',
      technical: `${error.code}: ${error.message}`,
    };
  }

  // 401 Unauthorized
  if (error.status === 401) {
    return {
      title: 'Authentication required',
      message: 'You need to log in to access this feature',
      actionable: 'Please log in and try again',
      technical: error.message,
    };
  }

  // 403 Forbidden
  if (error.status === 403) {
    return {
      title: 'Access denied',
      message: 'You don\'t have permission to access this resource',
      actionable: 'Contact an administrator if you believe this is an error',
      technical: error.message,
    };
  }

  // 404 Not Found
  if (error.status === 404) {
    return {
      title: 'Not found',
      message: 'The requested resource could not be found',
      actionable: 'Please check the URL and try again',
      technical: error.message,
    };
  }

  // 409 Conflict
  if (error.status === 409) {
    return {
      title: 'Conflict',
      message: error.message || 'This action conflicts with existing data',
      actionable: 'The resource may have been modified. Please refresh and try again',
      technical: `${error.code}: ${error.message}`,
    };
  }

  // 429 Too Many Requests
  if (error.status === 429) {
    return {
      title: 'Too many requests',
      message: 'You\'ve made too many requests in a short time',
      actionable: 'Please wait a moment and try again',
      technical: error.message,
    };
  }

  // 500 Internal Server Error
  if (error.status === 500) {
    return {
      title: 'Server error',
      message: 'An unexpected error occurred on the server',
      actionable: 'Please try again later. If the problem persists, contact support',
      technical: error.message,
    };
  }

  // 503 Service Unavailable
  if (error.status === 503) {
    return {
      title: 'Service unavailable',
      message: 'The server is temporarily unavailable',
      actionable: 'Please try again in a few moments',
      technical: error.message,
    };
  }

  // Generic server error
  if (error.isServerError()) {
    return {
      title: 'Server error',
      message: 'The server encountered an error processing your request',
      actionable: 'Please try again. If the problem persists, contact support',
      technical: `Status ${error.status}: ${error.message}`,
    };
  }

  // Generic client error
  if (error.isClientError()) {
    return {
      title: 'Request error',
      message: error.message || 'There was a problem with your request',
      actionable: 'Please check your input and try again',
      technical: `Status ${error.status}: ${error.message}`,
    };
  }

  // Fallback
  return {
    title: 'Error',
    message: error.message || 'An error occurred',
    actionable: 'Please try again',
    technical: `${error.code}: ${error.message}`,
  };
}

/**
 * Format error for display in UI
 */
export function formatErrorForDisplay(error: Error | ApiError): string {
  const errorMsg = getUserFriendlyError(error);
  return `${errorMsg.title}: ${errorMsg.message}`;
}

/**
 * Format error with actionable suggestion
 */
export function formatErrorWithAction(error: Error | ApiError): string {
  const errorMsg = getUserFriendlyError(error);
  return `${errorMsg.title}: ${errorMsg.message}. ${errorMsg.actionable || ''}`;
}

/**
 * Log error to console with details
 */
export function logError(error: Error | ApiError, context?: string) {
  const errorMsg = getUserFriendlyError(error);
  
  console.group(`🔴 Error${context ? ` in ${context}` : ''}`);
  console.error('Title:', errorMsg.title);
  console.error('Message:', errorMsg.message);
  if (errorMsg.actionable) {
    console.info('Actionable:', errorMsg.actionable);
  }
  if (errorMsg.technical) {
    console.debug('Technical:', errorMsg.technical);
  }
  if (error instanceof ApiError && error.originalError) {
    console.debug('Original error:', error.originalError);
  }
  console.groupEnd();
}
