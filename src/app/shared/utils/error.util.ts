import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { MSG } from '../../core/constants/messages.constants';

interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  const apiErr = (error as { error?: ApiError })?.error;
  if (apiErr?.message) {
    return apiErr.message;
  }

  return MSG.ERROR.GENERIC;
}

export function notifyApiError(error: unknown): void {
  Notify.failure(extractErrorMessage(error));
}
