"use server";

import { processContact, type FormResult } from "@/lib/demo-forms";

/**
 * Demonstration only: validates the message on the server and returns a result.
 * It does not send email, store anything, log personal data or call any external service.
 */
export async function submitContact(_previous: FormResult, formData: FormData): Promise<FormResult> {
  return processContact(formData);
}
