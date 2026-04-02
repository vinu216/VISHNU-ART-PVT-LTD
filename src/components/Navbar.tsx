import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../data/siteData";

type NavbarProps = { scrolled: boolean };

export function Navbar({ scrolled }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();
  const productMenu = useMemo(() => navItems.find((item) => item.label === "Products"), []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileProductsOpen(false);
    setMegaOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "border-b border-[#8b6a46]/35 bg-[#1a130d]/90 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-[#f8ebd9]">
          <p className="text-sm font-semibold tracking-[0.24em]">VISHNU ART PVT. LTD.</p>
          <p className="hidden text-[10px] uppercase tracking-[0.16em] text-[#d8bc96] sm:block">Premium Wooden Products</p>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => {
            if (item.children) {
              return (
                <div key={item.label} className="relative" onMouseLeave={() => setMegaOpen(false)}>
                  <button
                    onMouseEnter={() => setMegaOpen(true)}
                    className="flex items-center gap-1 text-sm text-[#e8d9c6] transition hover:text-white"
                  >
                    {item.label}
                    <ChevronDown size={15} />
                  </button>
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute left-1/2 top-full mt-4 w-[650px] -translate-x-1/2 rounded-2xl border border-[#876647]/45 bg-[#24190f]/95 p-6 shadow-2xl backdrop-blur"
                      >
                        <p className="text-xs uppercase tracking-[0.22em] text-[#d4b07b]">Product Categories</p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          {productMenu?.children?.map((child) => (
                            <Link
                              key={child.label}
                              to={child.path}
                              className="rounded-lg border border-[#7d5f43]/35 bg-[#ffffff0e] px-4 py-3 text-sm text-[#f2e5d5] transition hover:border-[#caa56a] hover:bg-[#ffffff17]"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
            return (
              <Link key={item.label} to={item.path} className={`text-sm transition ${isActive ? "text-[#d4b07b]" : "text-[#e8d9c6] hover:text-white"}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button onClick={() => setMobileOpen((prev) => !prev)} className="text-[#f8ebd9] lg:hidden" aria-label="Open menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[#7d5e43]/35 bg-[#1b130d]/95 px-4 py-4 lg:hidden"
          >
            <div className="grid gap-3">
              {navItems.map((item) => {
                if (item.children) {
                  return (
                    <div key={item.label} className="rounded-lg border border-[#6f553d]/45 bg-[#ffffff08] p-3">
                      <button
                        type="button"
                        onClick={() => setMobileProductsOpen((prev) => !prev)}
                        className="flex w-full items-center justify-between text-sm text-[#f0e0cb]"
                      >
                        {item.label}
                        <ChevronDown size={16} className={`transition ${mobileProductsOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {mobileProductsOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 grid gap-2 overflow-hidden"
                          >
                            {item.children.map((child) => (
                              <Link key={child.label} to={child.path} className="rounded-md bg-[#ffffff0e] px-3 py-2 text-xs text-[#e6d4be]">
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link key={item.label} to={item.path} className="text-sm text-[#f0e0cb]">
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}