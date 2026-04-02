import { useEffect } from "react";

type PageMetaProps = {
  title: string;
  description: string;
};

export function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    document.title = `${title} | VISHNU ART PVT. LTD.`;

    const updateMeta = (name: string, content: string, key: "name" | "property") => {
      const selector = key === "name" ? `meta[name='${name}']` : `meta[property='${name}']`;
      let tag = document.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(key, name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateMeta("description", description, "name");
    updateMeta("og:title", `${title} | VISHNU ART PVT. LTD.`, "property");
    updateMeta("og:description", description, "property");
    updateMeta("og:type", "website", "property");
    updateMeta("og:site_name", "VISHNU ART PVT. LTD.", "property");
    updateMeta("twitter:card", "summary_large_image", "name");
  }, [description, title]);

  return null;
}