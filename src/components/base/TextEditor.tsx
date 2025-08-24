import clsx from "clsx";
import parse, { DOMNode, domToReact, Element } from "html-react-parser";
import { HTMLAttributes, memo } from "react";

import { ImageWrapper } from "@/common/ImageWrapper";

interface TextEditor extends HTMLAttributes<HTMLDivElement> {
  content: string;
}

export const TextEditor = memo<TextEditor>(({ content, className, ...props }) => {
  const options = {
    replace: (domNode: DOMNode) => {
      if (domNode instanceof Element) {
        switch (domNode.name.toLowerCase()) {
          case "img": {
            const { src } = domNode.attribs;
            return (
              <ImageWrapper
                src={src}
                className="image-wrapper w-full h-full rounded-md xs:rounded-xl overflow-hidden"
              />
            );
          }
          case "a": {
            const { attribs, children } = domNode;
            return <a {...attribs}>{domToReact(children as DOMNode[], options)}</a>;
          }
        }
      }
    },
  };

  return (
    <div
      className={clsx("textEditor", className)}
      {...props}
    >
      {parse(content, options)}
    </div>
  );
});

TextEditor.displayName = "TextEditor";
