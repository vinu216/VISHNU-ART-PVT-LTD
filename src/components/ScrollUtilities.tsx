import { motion, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-[#7d552f] via-[#b88952] to-[#e0bf8e]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 rounded-full border border-[#8f6f4f]/45 bg-[#22180f]/90 p-3 text-[#fff4e4] shadow-xl backdrop-blur transition ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/917878260773?text=Hello%20VISHNU%20ART%20PVT.%20LTD.,%20I%20need%20help%20with%20wooden%20product%20orders."
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 left-4 z-50 rounded-full bg-[#25d366] px-4 py-2 text-sm font-semibold text-white shadow-xl transition hover:brightness-105 sm:left-6"
    >
      WhatsApp
    </a>
  );
}