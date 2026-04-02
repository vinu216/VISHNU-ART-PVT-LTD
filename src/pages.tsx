import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Factory,
  FileText,
  Globe2,
  Leaf,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AnimatedCounter } from "./components/AnimatedCounter";
import { PageMeta } from "./components/PageMeta";
import { SectionHeader } from "./components/SectionHeader";
import { useToast } from "./components/ToastProvider";
import {
  blogs,
  certifications,
  faqs,
  galleryItems,
  oemServices,
  processSteps,
  products,
  qualityPillars,
  stats,
} from "./data/siteData";

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

type OrderRow = {
  woodType: string;
  size: string;
  pcs: string;
  cft: string;
};

type QuickOrderCustomer = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  message: string;
};

type SubscriberRecord = {
  email: string;
  createdAt: string;
  source: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ORDER_API_CANDIDATES = ["/api/order", "/api/send-order"];

const isPositiveNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0;
};

async function submitOrderRequest(payload: unknown) {
  let lastStatus = 0;

  for (const endpoint of ORDER_API_CANDIDATES) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.status === 404) {
      lastStatus = 404;
      continue;
    }

    if (!response.ok) {
      lastStatus = response.status;
      break;
    }

    return;
  }

  if (lastStatus >= 500) {
    throw new Error("Something went wrong, please try again.");
  }

  throw new Error("Unable to submit order right now. Please try again.");
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

function ProductCard({ id, name, category, image, shortDescription }: (typeof products)[number]) {
  return (
    <Link
      to={`/products/${id}`}
      className="group overflow-hidden rounded-2xl border border-[#7a5e44]/35 bg-[#211911]/60 transition hover:-translate-y-1 hover:border-[#caa56a]/50"
    >
      <div className="h-56 overflow-hidden">
        <img src={image} alt={name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#d4b07b]">{category}</p>
        <h3 className="mt-2 text-xl text-[#f9f4ed]">{name}</h3>
        <p className="mt-3 text-sm text-[#dacbbb]">{shortDescription}</p>
      </div>
    </Link>
  );
}

function BlogCard({ slug, title, excerpt, category, image, date }: (typeof blogs)[number]) {
  return (
    <Link
      to={`/blog/${slug}`}
      className="group overflow-hidden rounded-2xl border border-[#7a5e44]/30 bg-[#211911]/55 transition hover:border-[#caa56a]/50"
    >
      <img src={image} alt={title} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#d4b07b]">{category}</p>
        <h3 className="mt-2 text-lg text-[#f8f2e9]">{title}</h3>
        <p className="mt-2 text-sm text-[#d8cbbb]">{excerpt}</p>
        <p className="mt-4 text-xs text-[#b9a593]">{date}</p>
      </div>
    </Link>
  );
}

function QuickOrderSection() {
  const { pushToast } = useToast();
  const [rows, setRows] = useState<OrderRow[]>([{ woodType: "", size: "", pcs: "", cft: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totals = useMemo(() => {
    const totalPcs = rows.reduce((sum, row) => sum + (Number(row.pcs) || 0), 0);
    const totalCft = rows.reduce((sum, row) => sum + (Number(row.cft) || 0), 0);
    return { totalPcs, totalCft };
  }, [rows]);

  const updateRow = (index: number, field: keyof OrderRow, value: string) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const addRow = () => setRows((prev) => [...prev, { woodType: "", size: "", pcs: "", cft: "" }]);
  const removeRow = (index: number) => setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));

  const validate = (customer: QuickOrderCustomer) => {
    const nextErrors: Record<string, string> = {};
    ["fullName", "companyName", "email", "phone"].forEach((field) => {
      if (!String(customer[field as keyof QuickOrderCustomer] || "").trim()) nextErrors[field] = "Required";
    });
    if (customer.email && !emailPattern.test(customer.email)) {
      nextErrors.email = "Invalid email";
    }

    rows.forEach((row, index) => {
      if (!row.woodType.trim()) nextErrors[`row-${index}-woodType`] = "Required";
      if (!row.size.trim()) nextErrors[`row-${index}-size`] = "Required";
      const hasPcs = row.pcs.trim().length > 0;
      const hasCft = row.cft.trim().length > 0;

      if (!hasPcs && !hasCft) {
        nextErrors[`row-${index}-quantity`] = "Enter PCS or CFT";
      }
      if (hasPcs && !isPositiveNumber(row.pcs)) {
        nextErrors[`row-${index}-pcs`] = "Enter valid PCS";
      }
      if (hasCft && !isPositiveNumber(row.cft)) {
        nextErrors[`row-${index}-cft`] = "Enter valid CFT";
      }
    });
    return nextErrors;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");
    const formData = new FormData(e.currentTarget);
    const customer: QuickOrderCustomer = {
      fullName: String(formData.get("fullName") || ""),
      companyName: String(formData.get("companyName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
    };

    const nextErrors = validate(customer);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      await submitOrderRequest({
        orderType: "quick",
        customer: { ...customer, country: "-", address: "-" },
        rows,
        totals,
      });

      pushToast("Quick order submitted. Our team will respond shortly.");
      setSuccess("Your quick order has been sent successfully to our sales desk.");
      setRows([{ woodType: "", size: "", pcs: "", cft: "" }]);
      e.currentTarget.reset();
    } catch (error) {
      console.error("Quick order submission failed", error);
      pushToast("Something went wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#1c140f] py-8 sm:py-10">
      <div className={container}>
        <div className="rounded-3xl border border-[#7c6046]/40 bg-[#24190f]/85 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#caa56a]">Quick Order</p>
              <h2 className="mt-2 font-serif text-2xl text-[#f9efe1] sm:text-3xl">Send your wood requirement directly to us</h2>
            </div>
            <a
              href="https://wa.me/917878260773"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#9c7a56] bg-[#ffffff08] px-5 py-2 text-sm text-[#f2e4d3] transition hover:bg-[#ffffff12]"
            >
              WhatsApp CTA
            </a>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <div className="overflow-hidden rounded-2xl border border-[#7c6046]/45 bg-[#1f150e]">
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm text-[#f4e6d4]">
                  <thead className="bg-[#2d2016] text-[#e3c7a0]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Wood Type</th>
                      <th className="px-4 py-3 font-medium">Size</th>
                      <th className="px-4 py-3 font-medium">PCS</th>
                      <th className="px-4 py-3 font-medium">CFT</th>
                      <th className="px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={`home-order-row-${index}`} className="border-t border-[#5a4634]/55 align-top">
                        <td className="px-3 py-3">
                          <input
                            value={row.woodType}
                            onChange={(e) => updateRow(index, "woodType", e.target.value)}
                            className="w-full rounded-lg border border-[#765c45] bg-[#2a1d13] px-3 py-2 text-[#f4e6d4] outline-none"
                            placeholder="Teak / Walnut"
                          />
                          {errors[`row-${index}-woodType`] && <p className="mt-1 text-xs text-rose-300">{errors[`row-${index}-woodType`]}</p>}
                        </td>
                        <td className="px-3 py-3">
                          <input
                            value={row.size}
                            onChange={(e) => updateRow(index, "size", e.target.value)}
                            className="w-full rounded-lg border border-[#765c45] bg-[#2a1d13] px-3 py-2 text-[#f4e6d4] outline-none"
                            placeholder="L x W x H"
                          />
                          {errors[`row-${index}-size`] && <p className="mt-1 text-xs text-rose-300">{errors[`row-${index}-size`]}</p>}
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            min="1"
                            value={row.pcs}
                            onChange={(e) => updateRow(index, "pcs", e.target.value)}
                            className="w-full rounded-lg border border-[#765c45] bg-[#2a1d13] px-3 py-2 text-[#f4e6d4] outline-none"
                            placeholder="0"
                          />
                          {(errors[`row-${index}-pcs`] || errors[`row-${index}-quantity`]) && (
                            <p className="mt-1 text-xs text-rose-300">{errors[`row-${index}-pcs`] || errors[`row-${index}-quantity`]}</p>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={row.cft}
                            onChange={(e) => updateRow(index, "cft", e.target.value)}
                            className="w-full rounded-lg border border-[#765c45] bg-[#2a1d13] px-3 py-2 text-[#f4e6d4] outline-none"
                            placeholder="0.00"
                          />
                          {(errors[`row-${index}-cft`] || errors[`row-${index}-quantity`]) && (
                            <p className="mt-1 text-xs text-rose-300">{errors[`row-${index}-cft`] || errors[`row-${index}-quantity`]}</p>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#8e7358] px-3 py-2 text-xs text-[#f5e7d5] transition hover:border-[#caa56a]"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 p-4 md:hidden">
                {rows.map((row, index) => (
                  <div key={`mobile-home-order-row-${index}`} className="rounded-xl border border-[#715640] bg-[#2a1d13] p-3">
                    <div className="grid gap-2">
                      <input
                        value={row.woodType}
                        onChange={(e) => updateRow(index, "woodType", e.target.value)}
                        className="w-full rounded-lg border border-[#765c45] bg-[#23180f] px-3 py-2 text-sm text-[#f4e6d4] outline-none"
                        placeholder="Wood Type"
                      />
                      {errors[`row-${index}-woodType`] && <p className="text-xs text-rose-300">{errors[`row-${index}-woodType`]}</p>}
                      <input
                        value={row.size}
                        onChange={(e) => updateRow(index, "size", e.target.value)}
                        className="w-full rounded-lg border border-[#765c45] bg-[#23180f] px-3 py-2 text-sm text-[#f4e6d4] outline-none"
                        placeholder="Size"
                      />
                      {errors[`row-${index}-size`] && <p className="text-xs text-rose-300">{errors[`row-${index}-size`]}</p>}
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          value={row.pcs}
                          onChange={(e) => updateRow(index, "pcs", e.target.value)}
                          className="w-full rounded-lg border border-[#765c45] bg-[#23180f] px-3 py-2 text-sm text-[#f4e6d4] outline-none"
                          placeholder="PCS"
                        />
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={row.cft}
                          onChange={(e) => updateRow(index, "cft", e.target.value)}
                          className="w-full rounded-lg border border-[#765c45] bg-[#23180f] px-3 py-2 text-sm text-[#f4e6d4] outline-none"
                          placeholder="CFT"
                        />
                      </div>
                      {(errors[`row-${index}-pcs`] || errors[`row-${index}-cft`] || errors[`row-${index}-quantity`]) && (
                        <p className="text-xs text-rose-300">
                          {errors[`row-${index}-pcs`] || errors[`row-${index}-cft`] || errors[`row-${index}-quantity`]}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#8e7358] px-3 py-2 text-xs text-[#f5e7d5]"
                      >
                        <Trash2 size={14} /> Remove Row
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-[#5a4634]/55 bg-[#251a12] p-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={addRow}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#c79b60] px-4 py-2 text-sm font-semibold text-[#1e130c] transition hover:bg-[#d7ac75]"
                >
                  <Plus size={15} /> Add Row
                </button>
                <div className="flex flex-wrap gap-2 text-xs text-[#e4cfb6]">
                  <span className="rounded-full border border-[#886a4d] px-3 py-1">Total PCS: {totals.totalPcs}</span>
                  <span className="rounded-full border border-[#886a4d] px-3 py-1">Total CFT: {totals.totalCft.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-[#735740]/45 bg-[#1f150e] p-4 sm:p-5 lg:grid-cols-2">
              <div>
                <input name="fullName" placeholder="Full Name" className="w-full rounded-lg border border-[#7a5e45] bg-[#2a1d13] px-4 py-2.5 text-sm text-[#f4e6d4] outline-none" />
                {errors.fullName && <p className="mt-1 text-xs text-rose-300">{errors.fullName}</p>}
              </div>
              <div>
                <input name="companyName" placeholder="Company Name" className="w-full rounded-lg border border-[#7a5e45] bg-[#2a1d13] px-4 py-2.5 text-sm text-[#f4e6d4] outline-none" />
                {errors.companyName && <p className="mt-1 text-xs text-rose-300">{errors.companyName}</p>}
              </div>
              <div>
                <input name="email" type="email" placeholder="Email" className="w-full rounded-lg border border-[#7a5e45] bg-[#2a1d13] px-4 py-2.5 text-sm text-[#f4e6d4] outline-none" />
                {errors.email && <p className="mt-1 text-xs text-rose-300">{errors.email}</p>}
              </div>
              <div>
                <input name="phone" type="tel" placeholder="Phone" className="w-full rounded-lg border border-[#7a5e45] bg-[#2a1d13] px-4 py-2.5 text-sm text-[#f4e6d4] outline-none" />
                {errors.phone && <p className="mt-1 text-xs text-rose-300">{errors.phone}</p>}
              </div>
              <div className="lg:col-span-2">
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Message (optional)"
                  className="w-full rounded-lg border border-[#7a5e45] bg-[#2a1d13] px-4 py-2.5 text-sm text-[#f4e6d4] outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-3 lg:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#c79b60] px-5 py-2.5 text-sm font-semibold text-[#1f140d] transition hover:bg-[#d7ac75] disabled:opacity-70"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {isSubmitting ? "Submitting..." : "Submit Order"}
                </button>
                <a
                  href="https://wa.me/917878260773"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-[#8e7358] px-5 py-2.5 text-sm text-[#f4e6d4] transition hover:border-[#caa56a]"
                >
                  WhatsApp
                </a>
              </div>

              {success && <p className="rounded-lg border border-emerald-800/70 bg-emerald-950/45 p-3 text-sm text-emerald-200 lg:col-span-2">{success}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const featuredCategories = [...new Set(products.map((p) => p.category))];

  return (
    <>
      <PageMeta
        title="Home"
        description="VISHNU ART PVT. LTD. is a premium manufacturer and exporter of wooden products, handcrafted decor, furniture components, and custom OEM collections."
      />

      <section className="relative min-h-[88vh] overflow-hidden bg-[#1a130d]">
        <img
          src="https://images.unsplash.com/photo-1616627454115-323f7ac5f353?auto=format&fit=crop&w=2200&q=80"
          alt="Premium wooden craftsmanship"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a130d] via-[#1a130d]/85 to-[#2e2117]/55" />
        <div className={`${container} relative flex min-h-[88vh] items-center pt-24 sm:pt-28`}>
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="text-sm font-semibold tracking-[0.24em] text-[#d4b07b]"
            >
              VISHNU ART PVT. LTD.
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="mt-6 font-serif text-4xl leading-tight text-[#fff8f0] sm:text-6xl"
            >
              Premium Wooden Craftsmanship for Global Markets
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16 }}
              className="mt-6 max-w-2xl text-sm text-[#f0e1d0] sm:text-base"
            >
              Manufacturer, exporter, and supplier of high-end wooden products, handcrafted decor, furniture components, and custom OEM ranges tailored for international buyers.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <Link to="/products" className="rounded-full bg-[#c79b60] px-7 py-3 text-sm font-semibold text-[#1f140d] transition hover:bg-[#d9b27d]">
                Explore Products
              </Link>
              <Link
                to="/quote"
                className="rounded-full border border-[#f7e6cc]/35 bg-[#ffffff14] px-7 py-3 text-sm font-medium text-[#fef8ee] backdrop-blur transition hover:bg-[#ffffff24]"
              >
                Request a Quote
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#21170f] py-8 sm:py-10">
        <div className={`${container} grid gap-4 sm:grid-cols-2 lg:grid-cols-4`}>
          {stats.map((item) => (
            <AnimatedCounter key={item.label} value={item.value} label={item.label} />
          ))}
        </div>
      </section>

      <QuickOrderSection />

      <section className="bg-[#f7f1e8] py-14 sm:py-16">
        <div className={`${container} grid gap-10 lg:grid-cols-2 lg:items-center`}>
          <Reveal>
            <img
              src="https://images.unsplash.com/photo-1611486212557-88be5ff6f941?auto=format&fit=crop&w=1200&q=80"
              alt="Wooden products workshop"
              className="h-[430px] w-full rounded-3xl object-cover"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <SectionHeader
              eyebrow="About VISHNU ART"
              title="Heritage Craft Skills Backed by Export-Grade Manufacturing"
              description="We blend traditional wood craftsmanship with modern production systems to deliver premium wooden collections with dependable quality, finish consistency, and international shipping readiness."
            />
            <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6a4b2f] transition hover:text-[#8b623e]">
              Know More <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#1c140e] py-16 sm:py-20">
        <div className={container}>
          <SectionHeader
            eyebrow="Featured Categories"
            title="A Curated Range of Premium Wooden Products"
            description="Designed for global retail, hospitality, decor brands, and private label procurement teams."
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((category, i) => (
              <Reveal key={category} delay={i * 0.05}>
                <Link
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="flex min-h-[7.5rem] items-center rounded-xl border border-[#8f6f4f]/35 bg-[#ffffff0a] px-5 py-4 text-sm text-[#f2e5d4] transition hover:border-[#caa56a] hover:bg-[#ffffff14]"
                >
                  {category}
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.slice(0, 6).map((product, i) => (
              <Reveal key={product.id} delay={i * 0.05}>
                <ProductCard {...product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f9f4ec] py-16 sm:py-20">
        <div className={container}>
          <SectionHeader
            eyebrow="Why Choose Us"
            title="Craft Integrity, Manufacturing Discipline, Export Reliability"
            description="Every product is built through a documented workflow that protects material quality, finish standards, and shipment performance."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Leaf, "Responsible Wood Selection", "Traceable timber and controlled seasoning for long-term durability."],
              [Factory, "Integrated Production", "Machining, handcrafting, and finishing under one quality-controlled unit."],
              [ShieldCheck, "Quality Assurance", "Batch-level checks and standardized test records before dispatch."],
              [Globe2, "Export-Focused Execution", "Documentation, packaging, and logistics support for global markets."],
            ].map(([Icon, title, text]) => (
              <div key={title as string} className="rounded-2xl border border-[#cdb89f]/50 bg-white/70 p-6 transition hover:shadow-lg">
                <Icon size={20} className="text-[#8a6136]" />
                <h3 className="mt-4 text-lg text-[#2b211a]">{title as string}</h3>
                <p className="mt-2 text-sm text-[#665442]">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#21170f] py-16 sm:py-20">
        <div className={`${container} grid gap-10 lg:grid-cols-2`}>
          <Reveal>
            <SectionHeader
              eyebrow="Manufacturing Preview"
              title="From Raw Timber to Premium Finished Product"
              description="Our structured production chain combines precision machinery, skilled artisans, and monitored quality checkpoints."
            />
            <div className="mt-7 space-y-3">
              {processSteps.slice(0, 4).map((step) => (
                <div key={step} className="flex items-center gap-3 text-sm text-[#ead7c1]">
                  <CheckCircle2 size={16} className="text-[#d4b07b]" />
                  {step}
                </div>
              ))}
            </div>
            <Link to="/infrastructure" className="mt-6 inline-flex rounded-full border border-[#c7a373]/45 px-5 py-2 text-sm text-[#f6ead9] transition hover:bg-[#ffffff14]">
              Explore Infrastructure
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <SectionHeader
              eyebrow="Quality Commitment"
              title="Quality Is Embedded at Every Stage"
              description="Raw material checks, in-process controls, and final inspection reports ensure consistent export-grade standards."
            />
            <div className="mt-7 space-y-3">
              {qualityPillars.slice(0, 4).map((point) => (
                <div key={point} className="flex items-center gap-3 text-sm text-[#ead7c1]">
                  <BadgeCheck size={16} className="text-[#d4b07b]" />
                  {point}
                </div>
              ))}
            </div>
            <Link to="/quality" className="mt-6 inline-flex rounded-full border border-[#c7a373]/45 px-5 py-2 text-sm text-[#f6ead9] transition hover:bg-[#ffffff14]">
              View Quality Standards
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f7f2e9] py-16 sm:py-20">
        <div className={container}>
          <SectionHeader eyebrow="Blog / News" title="Latest Insights from Wood Manufacturing and Export" />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {blogs.slice(0, 3).map((blog, i) => (
              <Reveal key={blog.slug} delay={i * 0.06}>
                <BlogCard {...blog} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#7d6247]/40 bg-gradient-to-r from-[#2a1f15] via-[#3b2b1e] to-[#2a1f15] py-12">
        <div className={`${container} flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center`}>
          <h3 className="font-serif text-2xl text-[#fff2de]">Looking for a trusted wooden products manufacturing partner?</h3>
          <Link to="/contact" className="rounded-full bg-[#d6b07d] px-6 py-3 text-sm font-semibold text-[#26190f] transition hover:bg-[#e3c18e]">
            Speak with Our Team
          </Link>
        </div>
      </section>
    </>
  );
}

export function AboutPage() {
  return (
    <main className="bg-[#f8f1e8] pt-28 text-[#2d221a]">
      <PageMeta title="About Us" description="Learn the story, mission, values, and leadership vision behind VISHNU ART PVT. LTD." />

      <section className={`${container} py-16`}>
        <SectionHeader
          eyebrow="Company Overview"
          title="A Legacy of Wood Craftsmanship Built for Global Business"
          description="VISHNU ART PVT. LTD. is a premium wooden products manufacturer and exporter known for design-led craftsmanship, controlled manufacturing, and dependable international delivery."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Mission",
              d: "Deliver premium wooden products with uncompromising quality, thoughtful design, and transparent export execution.",
            },
            {
              t: "Vision",
              d: "Become a globally preferred partner for handcrafted and OEM wooden product programs across retail and hospitality markets.",
            },
            {
              t: "Values",
              d: "Integrity, craftsmanship, responsible sourcing, process discipline, and long-term client partnerships.",
            },
          ].map((item) => (
            <div key={item.t} className="rounded-2xl border border-[#d9c7af] bg-white/80 p-6">
              <h3 className="text-lg font-semibold">{item.t}</h3>
              <p className="mt-3 text-sm text-[#5f4d3d]">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#21170f] py-16 text-[#f7ead9]">
        <div className={container}>
          <SectionHeader
            eyebrow="Leadership Message"
            title="Craftsmanship Is Our Heritage, Consistency Is Our Promise"
            description="We built VISHNU ART PVT. LTD. to bridge artisanal excellence with modern manufacturing reliability. Every order we dispatch represents our commitment to trust, quality, and long-term client growth."
          />
        </div>
      </section>

      <section className={`${container} py-16`}>
        <SectionHeader eyebrow="Journey" title="Our Company Milestones" />
        <div className="mt-8 space-y-4 border-l border-[#a8865f]/60 pl-6">
          {[
            "2002 - Started as a specialized wood craft workshop in Moradabad",
            "2009 - Established export packaging and documentation unit",
            "2016 - Expanded to furniture components and OEM manufacturing",
            "2022 - Installed upgraded wood seasoning and finishing infrastructure",
            "2026 - Serving buyers across 30+ countries with multi-category portfolio",
          ].map((item) => (
            <div key={item} className="text-sm text-[#5e4c3c]">
              {item}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <AnimatedCounter key={item.label} value={item.value} label={item.label} />
          ))}
        </div>
      </section>
    </main>
  );
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const category = searchParams.get("category") ?? "All";
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 520);
    return () => clearTimeout(timer);
  }, [search, category]);

  const filtered = useMemo(
    () =>
      products.filter((item) => {
        const categoryMatch = category === "All" || item.category === category;
        const searchMatch =
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase());
        return categoryMatch && searchMatch;
      }),
    [category, search]
  );

  return (
    <main className="bg-[#f6f0e7] pt-28 text-[#2d221a]">
      <PageMeta title="Products" description="Browse premium wooden products with category filters, search, and detailed specifications." />

      <section className={`${container} py-16`}>
        <SectionHeader
          eyebrow="Product Catalog"
          title="Premium Wooden Product Portfolio"
          description="Filter by category and search quickly to find decor, handicrafts, furniture components, and export utility ranges."
        />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setSearchParams(item === "All" ? {} : { category: item })}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  category === item
                    ? "bg-[#8a6136] text-white"
                    : "border border-[#ccb392] bg-white/70 text-[#5f4d3c] hover:border-[#b18c62]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e8973]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-full border border-[#ccb392] bg-white/80 py-2 pl-9 pr-4 text-sm outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-[#dac7b2]" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const [tab, setTab] = useState("Specifications");
  const { pushToast } = useToast();
  const product = products.find((item) => item.id === slug);

  if (!product) {
    return (
      <main className="bg-[#f6f0e7] pt-32 text-[#2d221a]">
        <div className={`${container} pb-20`}>
          <h1 className="text-3xl">Product not found.</h1>
        </div>
      </main>
    );
  }

  const tabs = ["Specifications", "Applications", "Features", "Packaging", "FAQ"];
  const tabContent: Record<string, React.ReactNode> = {
    Specifications: <ul className="space-y-2 text-sm text-[#534333]">{product.specifications.map((item) => <li key={item}>- {item}</li>)}</ul>,
    Applications: <ul className="space-y-2 text-sm text-[#534333]">{product.applications.map((item) => <li key={item}>- {item}</li>)}</ul>,
    Features: <ul className="space-y-2 text-sm text-[#534333]">{product.features.map((item) => <li key={item}>- {item}</li>)}</ul>,
    Packaging: <ul className="space-y-2 text-sm text-[#534333]">{product.packaging.map((item) => <li key={item}>- {item}</li>)}</ul>,
    FAQ: (
      <div className="space-y-3">
        {product.faq.map((item) => (
          <div key={item.q} className="rounded-xl border border-[#d8c5ae] bg-white/80 p-4">
            <p className="text-sm font-semibold text-[#2e241c]">{item.q}</p>
            <p className="mt-2 text-sm text-[#5c4b3b]">{item.a}</p>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <main className="bg-[#f6f0e7] pt-28 text-[#2d221a]">
      <PageMeta title={product.name} description={product.shortDescription} />

      <section className={`${container} grid gap-10 py-16 lg:grid-cols-2`}>
        <img src={product.image} alt={product.name} className="h-[450px] w-full rounded-3xl object-cover" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#8b6a46]">{product.category}</p>
          <h1 className="mt-3 font-serif text-4xl text-[#2d221a]">{product.name}</h1>
          <p className="mt-4 text-sm text-[#5c4b3b]">{product.shortDescription}</p>
          <button
            onClick={() => pushToast("Product inquiry submitted. Our sales desk will contact you soon.")}
            className="mt-7 rounded-full bg-[#8a6136] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#9f7140]"
          >
            Inquire This Product
          </button>
        </div>
      </section>

      <section className={`${container} pb-20`}>
        <div className="flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                item === tab ? "bg-[#8a6136] text-white" : "border border-[#ccb392] bg-white/80 text-[#5e4c3b]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-[#d8c5ae] bg-[#fffdf9] p-6">{tabContent[tab]}</div>
      </section>
    </main>
  );
}

export function InfrastructurePage() {
  return (
    <main className="bg-[#f8f2ea] pt-28 text-[#2d221a]">
      <PageMeta title="Manufacturing / Infrastructure" description="Explore our infrastructure, machinery, capacity, workflow, and safety systems." />

      <section className={`${container} py-16`}>
        <SectionHeader
          eyebrow="Infrastructure"
          title="Modern Wood Manufacturing with Artisan Detail"
          description="Our facility is designed for precision, consistency, and quality visibility from timber seasoning to final export packaging."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            [Factory, "Advanced Machinery", "CNC routers, profiling units, and calibrated finishing lines."],
            [Users, "Skilled Workforce", "Experienced artisans and technical operators across each process stage."],
            [Building2, "Production Capacity", "Multi-shift planning for high-volume and mixed-SKU programs."],
            [ShieldCheck, "Safety Standards", "Structured safety protocols and documented compliance practices."],
          ].map(([Icon, title, text]) => (
            <div key={title as string} className="rounded-2xl border border-[#d6c3ad] bg-white/80 p-6">
              <Icon size={20} className="text-[#8a6136]" />
              <h3 className="mt-4 text-lg">{title as string}</h3>
              <p className="mt-2 text-sm text-[#5f4d3d]">{text as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#24190f] py-16 text-[#f3e4d1]">
        <div className={container}>
          <SectionHeader eyebrow="Process Workflow" title="Step-by-Step Manufacturing Flow" description="A controlled workflow built for quality and predictable lead times." />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, i) => (
              <div key={step} className="rounded-xl border border-[#7f6348]/40 bg-[#ffffff0c] p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-[#d2b086]">Step {i + 1}</p>
                <p className="mt-2">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function QualityPage() {
  return (
    <main className="bg-[#f8f2ea] pt-28 text-[#2d221a]">
      <PageMeta title="Quality Assurance" description="Quality methods, standards, checkpoints, and testing workflow at VISHNU ART PVT. LTD." />

      <section className={`${container} py-16`}>
        <SectionHeader
          eyebrow="Quality Assurance"
          title="Multi-Layered Quality Framework for Wooden Exports"
          description="We run quality checkpoints throughout material preparation, machining, finishing, and pre-shipment packaging."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            [CheckCircle2, "Incoming Inspection", "Wood moisture, grain structure, and dimensions verified."],
            [BadgeCheck, "In-Process Validation", "Joinery, calibration, and finish consistency monitored."],
            [Award, "Final Audit", "Lot-based final review before packing and dispatch."],
            [ShieldCheck, "Documentation", "Inspection reports and traceability logs for buyer confidence."],
          ].map(([Icon, title, text]) => (
            <div key={title as string} className="rounded-2xl border border-[#d8c5ae] bg-white/80 p-5">
              <Icon size={20} className="text-[#8a6136]" />
              <p className="mt-3 text-sm font-semibold">{title as string}</p>
              <p className="mt-2 text-sm text-[#5f4d3d]">{text as string}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function GalleryPage() {
  const [category, setCategory] = useState("All");
  const [openImage, setOpenImage] = useState<(typeof galleryItems)[number] | null>(null);
  const categories = ["All", ...new Set(galleryItems.map((item) => item.category))];
  const filtered = galleryItems.filter((item) => category === "All" || item.category === category);

  return (
    <main className="bg-[#f7f1e8] pt-28 text-[#2d221a]">
      <PageMeta title="Gallery" description="Browse our wooden product gallery, manufacturing visuals, and export operations." />

      <section className={`${container} py-16`}>
        <SectionHeader
          eyebrow="Gallery"
          title="Visual Showcase"
          description="Explore our products, infrastructure, manufacturing process, and export preparation."
        />
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm ${
                category === item ? "bg-[#8a6136] text-white" : "border border-[#c9af8d] bg-white/80 text-[#5e4c3b]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((item) => (
            <button key={item.title} onClick={() => setOpenImage(item)} className="mb-4 w-full overflow-hidden rounded-2xl text-left">
              <img src={item.image} alt={item.title} className="w-full object-cover transition duration-500 hover:scale-105" />
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {openImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenImage(null)}
            className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4"
          >
            <div className="max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-[#20160f] p-3 text-white" onClick={(e) => e.stopPropagation()}>
              <img src={openImage.image} alt={openImage.title} className="max-h-[75vh] w-full rounded-xl object-cover" />
              <p className="mt-3 text-sm font-medium">{openImage.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export function CertificationsPage() {
  const [active, setActive] = useState<(typeof certifications)[number] | null>(null);

  return (
    <main className="bg-[#f7f1e8] pt-28 text-[#2d221a]">
      <PageMeta title="Certifications" description="Trust and compliance credentials of VISHNU ART PVT. LTD." />

      <section className={`${container} py-16`}>
        <SectionHeader
          eyebrow="Certifications"
          title="Global Trust Built on Verified Standards"
          description="Our certifications support buyer confidence in quality systems, ethical trade, and sourcing responsibility."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {certifications.map((item) => (
            <button
              key={item.title}
              onClick={() => setActive(item)}
              className="overflow-hidden rounded-2xl border border-[#d4c0a7] bg-white/80 text-left transition hover:border-[#b88f61]"
            >
              <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
              <div className="p-5">
                <p className="text-lg font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-[#725c47]">{item.issuer}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/75 p-4"
            onClick={() => setActive(null)}
          >
            <div className="mx-auto mt-14 max-w-3xl rounded-2xl bg-[#fffaf4] p-6" onClick={(e) => e.stopPropagation()}>
              <img src={active.image} alt={active.title} className="h-[360px] w-full rounded-xl object-cover" />
              <p className="mt-4 text-2xl font-semibold text-[#2d221a]">{active.title}</p>
              <p className="text-sm text-[#6b5844]">{active.issuer}</p>
              <button onClick={() => setActive(null)} className="mt-6 rounded-lg bg-[#8a6136] px-4 py-2 text-sm text-white">
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export function CustomOEMPage() {
  const { pushToast } = useToast();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    pushToast("OEM request received. Our product team will share a feasibility response shortly.");
    e.currentTarget.reset();
  };

  return (
    <main className="bg-[#f7f1e8] pt-28 text-[#2d221a]">
      <PageMeta title="Custom Orders / OEM Services" description="End-to-end OEM services for custom wooden product development and export supply." />

      <section className={`${container} py-16`}>
        <SectionHeader
          eyebrow="Custom Orders / OEM"
          title="Private Label and Bespoke Wood Manufacturing"
          description="Partner with our OEM team for concept development, prototyping, production planning, and export-ready execution."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {oemServices.map((item) => (
            <div key={item.title} className="rounded-2xl border border-[#d8c5ae] bg-white/80 p-6">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-[#5f4d3d]">{item.description}</p>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-10 rounded-2xl border border-[#d8c5ae] bg-white/85 p-6">
          <h3 className="text-xl font-semibold">Share Your OEM Requirement</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input required placeholder="Company Name" className="rounded-lg border border-[#d2bea4] bg-white px-4 py-3 text-sm outline-none" />
            <input required placeholder="Contact Person" className="rounded-lg border border-[#d2bea4] bg-white px-4 py-3 text-sm outline-none" />
            <input required type="email" placeholder="Work Email" className="rounded-lg border border-[#d2bea4] bg-white px-4 py-3 text-sm outline-none" />
            <input required placeholder="Phone Number" className="rounded-lg border border-[#d2bea4] bg-white px-4 py-3 text-sm outline-none" />
            <textarea
              required
              rows={4}
              placeholder="Product concept, dimensions, finish, quantity, and target market"
              className="rounded-lg border border-[#d2bea4] bg-white px-4 py-3 text-sm outline-none md:col-span-2"
            />
            <button className="rounded-lg bg-[#8a6136] px-4 py-3 text-sm font-medium text-white md:col-span-2">Submit OEM Inquiry</button>
          </div>
        </form>
      </section>
    </main>
  );
}

export function OrderNowPage() {
  const { pushToast } = useToast();
  const [rows, setRows] = useState<OrderRow[]>([{ woodType: "", size: "", pcs: "", cft: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totals = useMemo(() => {
    const totalPcs = rows.reduce((sum, row) => sum + (Number(row.pcs) || 0), 0);
    const totalCft = rows.reduce((sum, row) => sum + (Number(row.cft) || 0), 0);
    return { totalPcs, totalCft };
  }, [rows]);

  const updateRow = (index: number, field: keyof OrderRow, value: string) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const addRow = () => setRows((prev) => [...prev, { woodType: "", size: "", pcs: "", cft: "" }]);
  const removeRow = (index: number) => setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));

  const validate = (formData: FormData) => {
    const nextErrors: Record<string, string> = {};
    ["fullName", "companyName", "email", "phone", "country", "address"].forEach((field) => {
      if (!String(formData.get(field) || "").trim()) nextErrors[field] = "Required";
    });
    const email = String(formData.get("email") || "").trim();
    if (email && !emailPattern.test(email)) nextErrors.email = "Invalid email";

    rows.forEach((row, index) => {
      if (!row.woodType.trim()) nextErrors[`row-${index}-woodType`] = "Required";
      if (!row.size.trim()) nextErrors[`row-${index}-size`] = "Required";
      if (!row.pcs.trim() || !isPositiveNumber(row.pcs)) nextErrors[`row-${index}-pcs`] = "Enter valid PCS";
      if (!row.cft.trim() || !isPositiveNumber(row.cft)) nextErrors[`row-${index}-cft`] = "Enter valid CFT";
    });

    return nextErrors;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");
    const formData = new FormData(e.currentTarget);
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      orderType: "standard",
      customer: {
        fullName: String(formData.get("fullName") || ""),
        companyName: String(formData.get("companyName") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        country: String(formData.get("country") || ""),
        address: String(formData.get("address") || ""),
        message: String(formData.get("message") || ""),
      },
      rows,
      totals,
    };

    try {
      setIsSubmitting(true);
      await submitOrderRequest(payload);

      pushToast("Order submitted successfully. Our team will contact you shortly.");
      setSuccess("Thank you. Your wooden product order has been sent to our sales team.");
      setRows([{ woodType: "", size: "", pcs: "", cft: "" }]);
      e.currentTarget.reset();
    } catch (error) {
      console.error("Order submission failed", error);
      pushToast("Something went wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#f8f2ea] pt-28 text-[#2d221a]">
      <PageMeta title="Order Now" description="Submit multi-item wooden product orders with row-wise details and direct order email delivery." />

      <section className={`${container} py-16`}>
        <SectionHeader
          eyebrow="Order Now"
          title="Place Multi-Item Wooden Product Orders in One Structured Request"
          description="Add wood type, size, PCS, and CFT row by row, then submit customer details for immediate order handling by VISHNU ART PVT. LTD."
        />

        <form onSubmit={onSubmit} className="mt-8 space-y-8">
          <div className="overflow-hidden rounded-2xl border border-[#d7c2aa] bg-white/90">
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f2e5d5] text-[#4d3a2a]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Wood Type</th>
                    <th className="px-4 py-3 font-semibold">Size</th>
                    <th className="px-4 py-3 font-semibold">PCS</th>
                    <th className="px-4 py-3 font-semibold">CFT</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={`order-row-${index}`} className="border-t border-[#eadcc9] align-top">
                      <td className="px-4 py-3">
                        <input
                          value={row.woodType}
                          onChange={(e) => updateRow(index, "woodType", e.target.value)}
                          className="w-full rounded-lg border border-[#d4c0a6] px-3 py-2 outline-none"
                          placeholder="Teak / Walnut / Acacia"
                        />
                        {errors[`row-${index}-woodType`] && <p className="mt-1 text-xs text-rose-500">{errors[`row-${index}-woodType`]}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <input value={row.size} onChange={(e) => updateRow(index, "size", e.target.value)} className="w-full rounded-lg border border-[#d4c0a6] px-3 py-2 outline-none" placeholder="L x W x H" />
                        {errors[`row-${index}-size`] && <p className="mt-1 text-xs text-rose-500">{errors[`row-${index}-size`]}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="1"
                          value={row.pcs}
                          onChange={(e) => updateRow(index, "pcs", e.target.value)}
                          className="w-full rounded-lg border border-[#d4c0a6] px-3 py-2 outline-none"
                          placeholder="0"
                        />
                        {errors[`row-${index}-pcs`] && <p className="mt-1 text-xs text-rose-500">{errors[`row-${index}-pcs`]}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={row.cft}
                          onChange={(e) => updateRow(index, "cft", e.target.value)}
                          className="w-full rounded-lg border border-[#d4c0a6] px-3 py-2 outline-none"
                          placeholder="0.00"
                        />
                        {errors[`row-${index}-cft`] && <p className="mt-1 text-xs text-rose-500">{errors[`row-${index}-cft`]}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#d8c5ae] px-3 py-2 text-xs text-[#5e4b39] transition hover:border-[#b68b5c]"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {rows.map((row, index) => (
                <div key={`order-mobile-row-${index}`} className="rounded-xl border border-[#d8c5ae] bg-[#fbf4eb] p-3">
                  <div className="grid gap-2">
                    <input
                      value={row.woodType}
                      onChange={(e) => updateRow(index, "woodType", e.target.value)}
                      className="w-full rounded-lg border border-[#d4c0a6] px-3 py-2 text-sm outline-none"
                      placeholder="Wood Type"
                    />
                    {errors[`row-${index}-woodType`] && <p className="text-xs text-rose-500">{errors[`row-${index}-woodType`]}</p>}
                    <input
                      value={row.size}
                      onChange={(e) => updateRow(index, "size", e.target.value)}
                      className="w-full rounded-lg border border-[#d4c0a6] px-3 py-2 text-sm outline-none"
                      placeholder="Size"
                    />
                    {errors[`row-${index}-size`] && <p className="text-xs text-rose-500">{errors[`row-${index}-size`]}</p>}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="1"
                        value={row.pcs}
                        onChange={(e) => updateRow(index, "pcs", e.target.value)}
                        className="w-full rounded-lg border border-[#d4c0a6] px-3 py-2 text-sm outline-none"
                        placeholder="PCS"
                      />
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={row.cft}
                        onChange={(e) => updateRow(index, "cft", e.target.value)}
                        className="w-full rounded-lg border border-[#d4c0a6] px-3 py-2 text-sm outline-none"
                        placeholder="CFT"
                      />
                    </div>
                    {(errors[`row-${index}-pcs`] || errors[`row-${index}-cft`]) && (
                      <p className="text-xs text-rose-500">{errors[`row-${index}-pcs`] || errors[`row-${index}-cft`]}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#d8c5ae] px-3 py-2 text-xs text-[#5e4b39]"
                    >
                      <Trash2 size={14} /> Remove Row
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-[#eadcc9] bg-[#fcf8f2] p-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={addRow} className="inline-flex items-center gap-2 rounded-lg bg-[#8a6136] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#9d7042]">
                <Plus size={15} /> Add Row
              </button>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#4f3d2d]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d8c5ae] px-3 py-1">
                  <CircleDollarSign size={15} /> Total PCS: {totals.totalPcs}
                </span>
                <span className="rounded-full border border-[#d8c5ae] px-3 py-1">Total CFT: {totals.totalCft.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-[#d8c5ae] bg-white/90 p-6 md:grid-cols-2">
            <div>
              <input name="fullName" placeholder="Full Name" className="w-full rounded-lg border border-[#d2bea4] px-4 py-3 text-sm outline-none" />
              {errors.fullName && <p className="mt-1 text-xs text-rose-500">{errors.fullName}</p>}
            </div>
            <div>
              <input name="companyName" placeholder="Company Name" className="w-full rounded-lg border border-[#d2bea4] px-4 py-3 text-sm outline-none" />
              {errors.companyName && <p className="mt-1 text-xs text-rose-500">{errors.companyName}</p>}
            </div>
            <div>
              <input name="email" type="email" placeholder="Email" className="w-full rounded-lg border border-[#d2bea4] px-4 py-3 text-sm outline-none" />
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
            </div>
            <div>
              <input name="phone" type="tel" placeholder="Phone Number" className="w-full rounded-lg border border-[#d2bea4] px-4 py-3 text-sm outline-none" />
              {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
            </div>
            <div>
              <input name="country" placeholder="Country" className="w-full rounded-lg border border-[#d2bea4] px-4 py-3 text-sm outline-none" />
              {errors.country && <p className="mt-1 text-xs text-rose-500">{errors.country}</p>}
            </div>
            <div>
              <input name="address" placeholder="Address" className="w-full rounded-lg border border-[#d2bea4] px-4 py-3 text-sm outline-none" />
              {errors.address && <p className="mt-1 text-xs text-rose-500">{errors.address}</p>}
            </div>
            <textarea name="message" rows={4} placeholder="Message / Notes" className="rounded-lg border border-[#d2bea4] px-4 py-3 text-sm outline-none md:col-span-2" />

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-[#8a6136] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#9e7244] disabled:opacity-75"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isSubmitting ? "Submitting Order..." : "Submit Order"}
              </button>
            </div>

            {success && <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 md:col-span-2">{success}</p>}
          </div>
        </form>
      </section>
    </main>
  );
}

export function BlogPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const filtered = blogs.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 420);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className="bg-[#f8f2ea] pt-28 text-[#2d221a]">
      <PageMeta title="Blog / News" description="Read latest articles on wooden product sourcing, quality, trends, and export readiness." />

      <section className={`${container} py-16`}>
        <SectionHeader eyebrow="Blog / News" title="Insights from Craft, Manufacturing, and Export" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by topic or category"
          className="mt-8 w-full rounded-full border border-[#ccb392] bg-white px-4 py-3 text-sm outline-none md:w-96"
        />
        {loading ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-[#dac7b2]" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {filtered.map((item) => (
              <BlogCard key={item.slug} {...item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f2ea] text-[#2d221a]">
        Article not found.
      </main>
    );
  }

  return (
    <main className="bg-[#f8f2ea] pt-28 text-[#2d221a]">
      <PageMeta title={blog.title} description={blog.excerpt} />

      <article className={`${container} py-16`}>
        <button onClick={() => navigate(-1)} className="text-sm font-medium text-[#8a6136]">
          Back to Blog
        </button>
        <h1 className="mt-5 max-w-4xl font-serif text-4xl">{blog.title}</h1>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#8b6a46]">{blog.date}</p>
        <img src={blog.image} alt={blog.title} className="mt-8 h-[430px] w-full rounded-3xl object-cover" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <p className="text-base leading-relaxed text-[#503f31]">{blog.content}</p>
          <aside className="rounded-2xl border border-[#d7c3ab] bg-white/80 p-6">
            <h3 className="text-lg font-semibold">Recent Posts</h3>
            <div className="mt-4 space-y-2 text-sm text-[#5a493a]">
              {blogs.slice(0, 4).map((item) => (
                <Link key={item.slug} to={`/blog/${item.slug}`} className="block hover:text-[#8a6136]">
                  {item.title}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}

export function ContactPage() {
  const { pushToast } = useToast();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    pushToast("Inquiry submitted successfully. Our team will contact you within 24 business hours.");
    e.currentTarget.reset();
  };

  return (
    <main className="bg-[#f7f1e8] pt-28 text-[#2d221a]">
      <PageMeta title="Contact Us" description="Contact VISHNU ART PVT. LTD. for exports, OEM support, and product inquiries." />

      <section className={`${container} grid gap-8 py-16 lg:grid-cols-2`}>
        <div>
          <SectionHeader
            eyebrow="Contact Us"
            title="Let Us Discuss Your Product Requirement"
            description="Connect with our team for product sourcing, OEM development, and export supply programs."
          />
          <div className="mt-8 space-y-3 text-sm text-[#5e4c3c]">
            <p>Phone: +917878260773</p>
            <p>Email: vishnuartprivatelimited@gmail.com</p>
            <p>Business Hours: Monday to Saturday, 9:00 AM - 6:30 PM IST</p>
            <p>Factory Address: Riico industrial area, H1-1043, Boranada, Jodhpur, Rajasthan 342012</p>
            <a href="https://wa.me/917878260773" target="_blank" rel="noreferrer" className="inline-block rounded-full bg-[#1fa658] px-4 py-2 text-white">
              WhatsApp Us
            </a>
          </div>
          <iframe
            title="VISHNU ART location"
            src="https://www.google.com/maps?q=Riico+industrial+area,+H1-1043,+Boranada,+Jodhpur,+Rajasthan+342012&output=embed"
            className="mt-6 h-72 w-full rounded-2xl border border-[#d4bea0]"
          />
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-[#d8c5ae] bg-white/85 p-6">
          <h3 className="text-xl font-semibold">Send an Inquiry</h3>
          <div className="mt-6 grid gap-4">
            <input required placeholder="Full Name" className="rounded-lg border border-[#d2bea4] bg-white px-4 py-3 text-sm outline-none" />
            <input required placeholder="Company Name" className="rounded-lg border border-[#d2bea4] bg-white px-4 py-3 text-sm outline-none" />
            <input required type="email" placeholder="Work Email" className="rounded-lg border border-[#d2bea4] bg-white px-4 py-3 text-sm outline-none" />
            <input required placeholder="Phone Number" className="rounded-lg border border-[#d2bea4] bg-white px-4 py-3 text-sm outline-none" />
            <textarea required rows={4} placeholder="Your message" className="rounded-lg border border-[#d2bea4] bg-white px-4 py-3 text-sm outline-none" />
            <button className="rounded-lg bg-[#8a6136] px-4 py-3 text-sm font-medium text-white">Submit Inquiry</button>
          </div>
        </form>
      </section>
    </main>
  );
}

export function QuotePage() {
  const { pushToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");

  const validate = (formData: FormData) => {
    const nextErrors: Record<string, string> = {};
    ["name", "company", "email", "phone", "interest", "quantity", "message"].forEach((key) => {
      if (!String(formData.get(key) || "").trim()) nextErrors[key] = "Required";
    });
    if (!emailPattern.test(String(formData.get("email") || "").trim())) nextErrors.email = "Invalid email";
    return nextErrors;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setSuccess("");
    if (Object.keys(nextErrors).length > 0) return;
    pushToast("Quote request submitted. Our team will send a proposal.");
    setSuccess("Thank you. Your request has been received and our team will get back with a tailored quote.");
    e.currentTarget.reset();
  };

  return (
    <main className="bg-[#f8f2ea] pt-28 text-[#2d221a]">
      <PageMeta title="Request a Quote" description="Submit your RFQ for wooden products, OEM services, and export supply programs." />

      <section className={`${container} py-16`}>
        <SectionHeader
          eyebrow="Request a Quote"
          title="Share Your Requirement for a Detailed Proposal"
          description="Provide product interest, quantity, and technical details so we can prepare a precise commercial offer."
        />

        <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-2xl border border-[#d8c5ae] bg-white/85 p-6 md:grid-cols-2">
          {[
            ["name", "Full Name"],
            ["company", "Company Name"],
            ["email", "Work Email"],
            ["phone", "Phone Number"],
            ["interest", "Product Interest"],
            ["quantity", "Estimated Quantity"],
          ].map(([name, placeholder]) => (
            <div key={name}>
              <input name={name} placeholder={placeholder} className="w-full rounded-lg border border-[#d2bea4] bg-white px-4 py-3 text-sm outline-none" />
              {errors[name] && <p className="mt-1 text-xs text-rose-500">{errors[name]}</p>}
            </div>
          ))}

          <div className="md:col-span-2">
            <textarea
              name="message"
              rows={4}
              placeholder="Project details, product specs, target market, and preferred timeline"
              className="w-full rounded-lg border border-[#d2bea4] bg-white px-4 py-3 text-sm outline-none"
            />
            {errors.message && <p className="mt-1 text-xs text-rose-500">{errors.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-[#6c5945]">Attach reference file (optional)</label>
            <input
              type="file"
              className="mt-2 w-full text-sm text-[#6c5945] file:mr-4 file:rounded-md file:border-0 file:bg-[#8a6136] file:px-3 file:py-2 file:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <button className="rounded-lg bg-[#8a6136] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#9e7244]">Submit RFQ</button>
          </div>

          {success && <p className="md:col-span-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p>}
        </form>
      </section>
    </main>
  );
}

export function SubscribersAdminPage() {
  const { pushToast } = useToast();
  const [adminKey, setAdminKey] = useState("");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<SubscriberRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredRows = rows.filter((item) => item.email.toLowerCase().includes(query.toLowerCase()));

  const loadSubscribers = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/subscribers", {
        headers: {
          "Content-Type": "application/json",
          ...(adminKey.trim() ? { "x-admin-key": adminKey.trim() } : {}),
        },
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        data?: SubscriberRecord[];
      };

      if (!response.ok) {
        if (response.status === 401) {
          setError("Access denied. Please enter the admin key.");
          pushToast("Access denied");
          return;
        }

        setError("Something went wrong, please try again.");
        pushToast("Something went wrong, please try again.");
        return;
      }

      setRows(Array.isArray(result.data) ? result.data : []);
      pushToast("Subscribers loaded");
    } catch {
      setError("Something went wrong, please try again.");
      pushToast("Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
    // Intentionally run only once for initial load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="bg-[#f8f2ea] pt-28 text-[#2d221a]">
      <PageMeta title="Subscribers" description="Internal subscribers list for VISHNU ART PVT. LTD. newsletter management." />

      <section className={`${container} py-16`}>
        <SectionHeader
          eyebrow="Admin"
          title="Newsletter Subscribers"
          description="View and search stored newsletter subscribers. Latest records appear first."
        />

        <div className="mt-8 rounded-2xl border border-[#d8c5ae] bg-white/85 p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
            <div>
              <label className="text-sm font-medium text-[#5d4a39]">Admin key (optional for local)</label>
              <input
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                type="password"
                placeholder="Enter admin key"
                className="mt-2 w-full rounded-lg border border-[#d2bea4] bg-white px-4 py-3 text-sm outline-none"
              />
            </div>
            <button
              onClick={loadSubscribers}
              disabled={isLoading}
              className="rounded-lg bg-[#8a6136] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9e7244] disabled:opacity-70"
            >
              {isLoading ? "Loading..." : "Load Subscribers"}
            </button>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7459]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search email"
                className="w-full rounded-lg border border-[#d2bea4] bg-white py-3 pl-9 pr-4 text-sm outline-none md:w-64"
              />
            </div>
          </div>

          {error && <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

          <div className="mt-5 overflow-hidden rounded-xl border border-[#e2d4c3]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f3e8da] text-[#5d4936]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Joined At</th>
                    <th className="px-4 py-3 font-semibold">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((item) => (
                    <tr key={`${item.email}-${item.createdAt}`} className="border-t border-[#eee2d3]">
                      <td className="px-4 py-3 text-[#3d2f24]">{item.email}</td>
                      <td className="px-4 py-3 text-[#5b4a3a]">{new Date(item.createdAt).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-[#5b4a3a]">{item.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!isLoading && filteredRows.length === 0 && <p className="px-4 py-8 text-center text-sm text-[#6f5d4c]">No subscribers found.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}

export function FAQStrip() {
  const [open, setOpen] = useState(0);
  const location = useLocation();
  if (location.pathname !== "/") return null;

  return (
    <section className="bg-[#f5eee4] py-14 sm:py-16 text-[#2d221a]">
      <div className={container}>
        <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="mt-8 space-y-3">
          {faqs.map((item, i) => (
            <div key={item.q} className="rounded-2xl border border-[#d8c5ae] bg-white/80 p-4">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full text-left text-sm font-semibold">
                {item.q}
              </button>
              {open === i && <p className="mt-2 text-sm text-[#5c4b3c]">{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#1f1711] px-4 text-[#f9ebd7]">
      <div className="text-center">
        <FileText className="mx-auto text-[#d4b07b]" />
        <h1 className="mt-4 text-3xl">Page Not Found</h1>
        <Link to="/" className="mt-5 inline-block rounded-full bg-[#8a6136] px-5 py-2 text-sm text-white">
          Return Home
        </Link>
      </div>
    </main>
  );
}