"use client";

import { clsx } from "clsx";
import React, { useState } from "react";

import { Loader } from "@/components/base/Loader";

import { sendForm } from "./formSender";

export const ContactForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resultMessage, setResultMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);

    e.preventDefault();
    const form = e.currentTarget;

    const response = await sendForm(form);

    if (response.isSuccess) {
      setErrors({});
      setIsSuccess(true);
      form.reset();
    } else {
      setErrors(response.validationError);
      setIsSuccess(false);
    }

    setResultMessage(response.message);
    setIsLoading(false);
  };
  return (
    <div className="contact-form">
      {isLoading && (
        <div className="contact-form__loader">
          <Loader />
        </div>
      )}
      <form
        method="post"
        action="https://hqt.mopski.pp.ua/wp-json/contact-form-7/v1/contact-forms/56/feedback"
        onSubmit={handleSubmit}
        className={isLoading ? "disabled" : ""}
      >
        <div className="contact-form-inner">
          <div className="contact-form-row">
            <div className="contact-form-col">
              <input
                name="your-name"
                type="text"
                className={errors["your-name"] ? "invalid" : ""}
                placeholder="Full Name*"
              />
              {errors["your-name"] && <span className="error-message">{errors["your-name"]}</span>}
            </div>
            <div className="contact-form-col">
              <input
                name="your-email"
                type="email"
                className={errors["your-email"] ? "invalid" : ""}
                placeholder="Email Address*"
              />
              {errors["your-email"] && <span className="error-message">{errors["your-email"]}</span>}
            </div>
          </div>
          <textarea
            name="your-message"
            placeholder="Share your ideas here"
          ></textarea>
          <label className="checkbox-with-text">
            <input
              name="keep-updated"
              type="checkbox"
            />
            <span className="custom-checkbox"></span>
            <span className="checkbox-with-text__text">Keep me updated when calendar integrations (Google or Outlook) become available.</span>
          </label>
          <input
            type="submit"
            value="SUBMIT"
            disabled={isLoading}
          />
        </div>
      </form>
      {resultMessage && <div className={clsx(isSuccess ? "success" : "error", "contact-form-result")}>{resultMessage}</div>}
    </div>
  );
};
