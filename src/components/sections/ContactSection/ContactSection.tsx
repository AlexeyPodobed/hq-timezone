import { memo } from "react";

import { Container } from "@/common/Container";
import "./ContactSection.scss";
import { ImageWrapper } from "@/common/ImageWrapper.tsx";
import { ContactForm } from "@/components/sections/ContactSection/ContactForm.tsx";

interface ContactSectionProps {
  background_image: {
    url: string;
    alt: string;
    height: number;
    width: number;
  };
  image: {
    url: string;
    alt: string;
    height: number;
    width: number;
  };
}

export const ContactSection = memo<ContactSectionProps>(({ background_image, image }) => {
  return (
    <section className="contact">
      <ImageWrapper
        src={background_image?.url}
        alt={background_image?.alt}
        className="contact__bg"
      />
      <Container>
        <div className="contact-row">
          <div className="contact-col contact-col--img">
            <ImageWrapper
              src={image?.url}
              alt={image?.alt}
              className="contact__img"
            />
          </div>
          <div className="contact-col">
            <div className="contact__title">Help us make this better!</div>

            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
});

ContactSection.displayName = "ContactSection";
