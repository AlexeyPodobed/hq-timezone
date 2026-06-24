export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
  keepUpdated: boolean;
}

export interface ContactForm7InvalidField {
  field?: string;
  message?: string;
}

export interface ContactForm7Response {
  status?: string;
  message?: string;
  invalid_fields?: ContactForm7InvalidField[];
}

export type ContactFormFieldName = keyof ContactFormValues;

export interface ContactFormSubmitResult {
  isSuccess: boolean;
  message: string;
  validationErrors: Partial<Record<ContactFormFieldName, string>>;
}
