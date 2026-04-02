import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { BackToTop, FloatingWhatsApp, ScrollProgress } from "./components/ScrollUtilities";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ToastProvider } from "./components/ToastProvider";
import {
  AboutPage,
  BlogDetailPage,
  BlogPage,
  CertificationsPage,
  CustomOEMPage,
  ContactPage,
  FAQStrip,
  GalleryPage,
  HomePage,
  InfrastructurePage,
  NotFoundPage,
  OrderNowPage,
  ProductDetailPage,
  ProductsPage,
  QualityPage,
  QuotePage,
  SubscribersAdminPage,
} from "./pages";

function AppShell() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  return (
    <div className="overflow-x-hidden bg-[#f7f1e8]">
      <ScrollProgress />
      <Navbar scrolled={scrolled} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/infrastructure" element={<InfrastructurePage />} />
        <Route path="/quality" element={<QualityPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/custom-oem" element={<CustomOEMPage />} />
        <Route path="/order-now" element={<OrderNowPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/admin/subscribers" element={<SubscribersAdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <FAQStrip />
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </BrowserRouter>
  );
}
