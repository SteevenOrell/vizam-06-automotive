"use server";

import { processTestDrive, type FormResult } from "@/lib/demo-forms";

/**
 * Demonstration only: validates the request again on the server (never trust the client) and returns a result.
 * It does not send email, store anything, log personal data or call any external service.
 */
export async function submitTestDrive(_previous: FormResult, formData: FormData): Promise<FormResult> {
  return processTestDrive(formData, new Date());
}
