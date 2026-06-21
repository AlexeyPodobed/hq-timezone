"use client";

import clsx from "clsx";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Loader } from "@/components/base/Loader";
import type { ContactFormValues } from "@/types/contactForm";

import { submitContactForm } from "./contactFormAction";

interface SubmitResult {
  isSuccess: boolean;
  message: string;
}

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  message: "",
  keepUpdated: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ContactForm = () => {
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  const {
    register,

    handleSubmit,

    setError,

    reset,

    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues,

    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (values) => {
    setSubmitResult(null);

    const result = await submitContactForm(values);

    if (!result.isSuccess) {
      for (const [fieldName, message] of Object.entries(result.validationErrors)) {
        setError(fieldName as keyof ContactFormValues, {
          type: "server",
          message,
        });
      }

      setSubmitResult({
        isSuccess: false,
        message: result.message,
      });

      return;
    }

    reset();

    setSubmitResult({
      isSuccess: true,
      message: result.message,
    });
  };

  return (
    <div className="contact-form">
      {isSubmitting && (
        <div className="contact-form__loader">
          <Loader />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={isSubmitting ? "disabled" : ""}
        noValidate
        aria-busy={isSubmitting}
      >
        <div className="contact-form-inner">
          <div className="contact-form-row">
            <div className="contact-form-col">
              <label
                htmlFor="contact-name"
                className="sr-only"
              >
                Full Name
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="Full Name*"
                className={errors.name ? "invalid" : ""}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                {...register("name", {
                  required: "Full name is required.",
                  minLength: {
                    value: 2,
                    message: "Full name must contain at least 2 characters.",
                  },
                })}
              />

              {errors.name?.message && (
                <span
                  id="contact-name-error"
                  className="error-message"
                  role="alert"
                >
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="contact-form-col">
              <label
                htmlFor="contact-email"
                className="sr-only"
              >
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="Email Address*"
                className={errors.email ? "invalid" : ""}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                {...register("email", {
                  required: "Email address is required.",
                  pattern: {
                    value: EMAIL_PATTERN,
                    message: "Enter a valid email address.",
                  },
                })}
              />

              {errors.email?.message && (
                <span
                  id="contact-email-error"
                  className="error-message"
                  role="alert"
                >
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          <label
            htmlFor="contact-message"
            className="sr-only"
          >
            Your ideas
          </label>
          <textarea
            id="contact-message"
            placeholder="Share your ideas here"
            {...register("message")}
          />

          <label className="checkbox-with-text">
            <input
              type="checkbox"
              {...register("keepUpdated")}
            />
            <span className="custom-checkbox" />
            <span className="checkbox-with-text__text">Keep me updated when calendar integrations (Google or Outlook) become available.</span>
          </label>

          <input
            type="submit"
            value="SUBMIT"
            disabled={isSubmitting}
          />
        </div>
      </form>

      {submitResult && (
        <div
          className={clsx(submitResult.isSuccess ? "success" : "error", "contact-form-result")}
          role={submitResult.isSuccess ? "status" : "alert"}
          aria-live="polite"
        >
          {submitResult.message}
        </div>
      )}
    </div>
  );
};
