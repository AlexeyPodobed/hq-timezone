import { memo } from "react";

import { Container } from "@/common/Container";
import "./ContactSection.scss";
import { ImageWrapper } from "@/common/ImageWrapper.tsx";

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
    <section className="contact bordered-section">
      <ImageWrapper
        src={background_image.url}
        alt={background_image.alt}
        className="contact__bg"
      />
      <Container>
        <div className="contact-row">
          <div className="contact-col">
            <ImageWrapper
              src={image.url}
              alt={image.alt}
              className="contact__img"
            />
          </div>
          <div className="contact-col">
            <div className="contact__title">Help us make this better!</div>
            <div className="contact-form">
              <form>
                <div className="contact-form-inner">
                  <div className="contact-form-row">
                    <div className="contact-form-col">
                      <input
                        type="text"
                        className="contact-form__input h3-reg"
                        placeholder="Full Name*"
                      />
                    </div>
                    <div className="contact-form-col">
                      <input
                        type="email"
                        className="contact-form__input h3-reg"
                        placeholder="Email Address*"
                      />
                    </div>
                  </div>
                  <textarea placeholder="Share your ideas here"></textarea>
                  <label className="checkbox-with-text">
                    <input type="checkbox" />
                    <span className="custom-checkbox"></span>
                    <span>Keep me updated when calendar integrations (Google or Outlook) become available.</span>
                  </label>
                  <input
                    type="submit"
                    value="SUBMIT"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
});

ContactSection.displayName = "ContactSection";
