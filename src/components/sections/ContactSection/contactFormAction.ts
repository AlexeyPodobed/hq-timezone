"use server";

import { WP_URL } from "@/consts/api";
import type { ContactFormSubmitResult, ContactFormValues } from "@/types/contactForm";

import { createContactFormData, isContactForm7Response, normalizeContactForm7Response } from "./contactFormAdapter";

const formId = process.env.CONTACT_FORM_ID;
const unitTag = process.env.CONTACT_FORM_UNIT_TAG;
const endpoint = `${WP_URL}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`;

const FAILED_RESULT: ContactFormSubmitResult = {
  isSuccess: false,
  message: "Something went wrong. Please try again.",
  validationErrors: {},
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateContactForm = (values: ContactFormValues): ContactFormSubmitResult["validationErrors"] => {
  const validationErrors: ContactFormSubmitResult["validationErrors"] = {};

  if (typeof values?.name !== "string" || values.name.trim().length < 2) {
    validationErrors.name = "Full name must contain at least 2 characters.";
  }

  if (typeof values?.email !== "string" || !EMAIL_PATTERN.test(values.email.trim())) {
    validationErrors.email = "Enter a valid email address.";
  }

  if (typeof values?.message !== "string") {
    validationErrors.message = "Invalid message.";
  }

  if (typeof values?.keepUpdated !== "boolean") {
    validationErrors.keepUpdated = "Invalid checkbox value.";
  }

  return validationErrors;
};

export async function submitContactForm(values: ContactFormValues): Promise<ContactFormSubmitResult> {
  const validationErrors = validateContactForm(values);

  if (Object.keys(validationErrors).length > 0) {
    return {
      isSuccess: false,
      message: "Please check the form fields.",
      validationErrors,
    };
  }

  if (!WP_URL || !formId || !unitTag) {
    console.error("Contact form environment variables are not configured");
    return {
      ...FAILED_RESULT,
      message: "Contact form is not configured.",
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",

      body: createContactFormData(values, unitTag),
      cache: "no-store",
    });

    const data: unknown = await response.json();

    if (!response.ok) {
      throw new Error(`Contact form request failed: ${response.status}`);
    }

    if (!isContactForm7Response(data)) {
      throw new Error("Invalid Contact Form 7 response");
    }

    return normalizeContactForm7Response(data);
  } catch (error) {
    console.error("submitContactForm error:", error);
    return FAILED_RESULT;
  }
}
