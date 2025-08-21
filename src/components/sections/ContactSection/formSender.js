"use client";

const normalizeContactForm7Response = (response) => {
  const isSuccess = response.status === "mail_sent";
  const message = response.message;
  const validationError = isSuccess
    ? {}
    : Object.fromEntries(
        response.invalid_fields.map((error) => {
          const key = error.field ?? "";
          return [key, error.message ?? ""];
        })
      );

  return {
    isSuccess,
    message,
    validationError,
  };
};

export const sendForm = async (formElement) => {
  const { action, method } = formElement;
  const body = new FormData(formElement);
  body.append("_wpcf7_unit_tag", "a258612");

  try {
    const response = await fetch(action, { method, body });
    const json = await response.json();
    return normalizeContactForm7Response(json);
  } catch (error) {
    console.error("sendForm error:", error);
    return {
      isSuccess: false,
      message: "Something went wrong. Please try again.",
      validationError: {},
    };
  }
};
