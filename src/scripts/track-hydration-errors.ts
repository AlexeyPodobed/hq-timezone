if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (args[0] && typeof args[0] === "string" && args[0].includes("Text content does not match")) {
      console.warn("🔍 Hydration mismatch detected!");
      console.trace("Trace:");
    }

    originalError(...args);
  };
}

export {};
