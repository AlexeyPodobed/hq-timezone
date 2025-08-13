const config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        clash: ['"ClashGrotesk"', "sans-serif"],
      },
      colors: {
        "primary-1": "#2b2b2b",
        "text-primary": "#2b2b2b",
        "text-secondary": "#E6E6DD",
        "border-primary": "#e6e6dd",
        yellow: "#F0FF6E",
      },
      fontSize: {
        "inherit-size": "inherit",
        md: "1rem",
      },
      spacing: {
        4.5: "1.125rem",
        5.3: "1.375rem",
        header: "7.875rem",
        headerMob: "7.313rem",
      },
      borderRadius: {
        s: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
      },
      boxShadow: {
        default: "0 0 20px 0 rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(90deg, #963488 0%, #FC6F32 50%, #FF4A59 100%)",
        "gradient-dark": "linear-gradient(90deg, #000000 -200%, #191E2A 100%)",
      },
    },
    screens: {
      xxs: "640px",
      xs: "768px",
      sm: "1024px",
      hd: "1280px",
      mac: "1440px",
      "hd+": "1600px",
      fhd: "1920px",
      "2k": "2560px",
      "4k": "3840px",
    },
  },
  plugins: [require("tailwind-hamburgers")],
};

export default config;
