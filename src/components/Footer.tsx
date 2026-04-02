import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "./ToastProvider";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Footer() {
  const { pushToast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      const text = "Please enter a valid email";
      setMessage(text);
      pushToast(text);
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, source: "footer-newsletter" }),
      });

      const result = (await response.json().catch(() => ({}))) as { message?: string };
      const responseMessage = result.message || "Something went wrong, please try again";

      if (response.ok) {
        setMessage("Thank you for joining");
        setEmail("");
        pushToast("Thank you for joining");
        return;
      }

      if (response.status === 409) {
        setMessage("You are already subscribed");
        pushToast("You are already subscribed");
        return;
      }

      if (response.status === 400) {
        setMessage("Please enter a valid email");
        pushToast("Please enter a valid email");
        return;
      }

      setMessage(responseMessage);
      pushToast("Something went wrong, please try again");
    } catch {
      setMessage("Something went wrong, please try again");
      pushToast("Something went wrong, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-[#72563f]/35 bg-[#1a130d] text-[#f4e6d2]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-sm font-semibold tracking-[0.2em]">VISHNU ART PVT. LTD.</h3>
          <p className="mt-4 text-sm text-[#d8c5ae]">
            Premium manufacturer, exporter, and supplier of wooden handicrafts, decor products, furniture components, and OEM wooden collections.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Quick Links</h4>
          <div className="mt-4 grid gap-2 text-sm text-[#d8c5ae]">
            <Link to="/about" className="hover:text-white">
              About Us
            </Link>
            <Link to="/products" className="hover:text-white">
              Products
            </Link>
            <Link to="/custom-oem" className="hover:text-white">
              Custom Orders / OEM
            </Link>
            <Link to="/order-now" className="hover:text-white">
              Order Now
            </Link>
            <Link to="/quote" className="hover:text-white">
              Request Quote
            </Link>
            <Link to="/admin/subscribers" className="hover:text-white">
              Subscribers
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <div className="mt-4 space-y-3 text-sm text-[#d8c5ae]">
            <p className="flex items-center gap-2">
              <Phone size={14} /> +917878260773
            </p>
            <p className="flex items-center gap-2">
              <Mail size={14} /> vishnuartprivatelimited@gmail.com
            </p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-1" /> Riico industrial area, H1-1043, Boranada, Jodhpur, Rajasthan 342012
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Newsletter</h4>
          <p className="mt-4 text-sm text-[#d8c5ae]">Get updates on new collections and export news.</p>
          <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Work email"
              className="w-full rounded-lg border border-[#72563f] bg-[#ffffff12] px-3 py-2 text-sm text-white outline-none"
              aria-label="Work email"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#8a6136] px-4 py-2 text-sm text-white transition hover:bg-[#9d7042] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Joining..." : "Join"}
            </button>
          </form>
          {message && <p className="mt-2 text-xs text-[#d8c5ae]">{message}</p>}
          <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#ba9a72]">
            <Globe size={15} /> Global Supply Network
          </div>
        </div>
      </div>

      <div className="border-t border-[#72563f]/35 px-4 py-4 text-center text-xs text-[#b9a28a]">
        Copyright {new Date().getFullYear()} VISHNU ART PVT. LTD. All rights reserved.
      </div>
    </footer>
  );
}