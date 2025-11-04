import { apiFetch } from '../../../shared/services/api';

interface CreateCheckoutSessionResponse {
  sessionId: string;
  sessionUrl: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  enrolled: boolean;
  courseId: string;
  message: string;
}

/**
 * Create a Stripe checkout session for course enrollment
 */
export async function createCheckoutSession(courseId: string): Promise<CreateCheckoutSessionResponse> {
  return apiFetch<CreateCheckoutSessionResponse>(`/payments/create-checkout-session`, {
    method: 'POST',
    body: JSON.stringify({ courseId })
  });
}

/**
 * Verify payment and complete enrollment
 */
export async function verifyPayment(sessionId: string): Promise<VerifyPaymentResponse> {
  return apiFetch<VerifyPaymentResponse>(`/payments/verify-session/${sessionId}`, {
    method: 'GET'
  });
}
