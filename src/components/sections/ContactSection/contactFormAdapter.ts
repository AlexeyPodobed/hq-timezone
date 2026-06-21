import type { ContactForm7Response, ContactFormFieldName, ContactFormSubmitResult, ContactFormValues } from "@/types/contactForm";

const fieldNameMap: Record<string, ContactFormFieldName> = {
  "your-name": "name",
  "your-email": "email",
  "your-message": "message",
  "keep-updated": "keepUpdated",
};

export const isContactForm7Response = (value: unknown): value is ContactForm7Response => {
  if (typeof value !== "object" || value === null) return false;

  const response = value as Record<string, unknown>;

  return (
    (response.status === undefined || typeof response.status === "string") &&
    (response.message === undefined || typeof response.message === "string") &&
    (response.invalid_fields === undefined || Array.isArray(response.invalid_fields))
  );
};

export const normalizeContactForm7Response = (response: ContactForm7Response): ContactFormSubmitResult => {
  const isSuccess = response.status === "mail_sent";
  const validationErrors: ContactFormSubmitResult["validationErrors"] = {};

  if (!isSuccess && Array.isArray(response.invalid_fields)) {
    for (const error of response.invalid_fields) {
      if (!error || typeof error !== "object") continue;
      if (typeof error.field !== "string") continue;

      const fieldName = fieldNameMap[error.field];
      if (!fieldName) continue;

      validationErrors[fieldName] = typeof error.message === "string" ? error.message : "Please check this field.";
    }
  }

  return {
    isSuccess,
    message: response.message ?? "Something went wrong. Please try again.",
    validationErrors,
  };
};

export const createContactFormData = (values: ContactFormValues, unitTag: string) => {
  const body = new FormData();

  body.append("your-name", values.name.trim());
  body.append("your-email", values.email.trim());
  body.append("your-message", values.message.trim());

  if (values.keepUpdated) {
    body.append("keep-updated", "1");
  }

  body.append("_wpcf7_unit_tag", unitTag);

  return body;
};
