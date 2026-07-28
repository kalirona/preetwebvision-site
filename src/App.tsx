import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';

// Responsive Code Splitting for ultra-fast mobile loading
const HomePage = React.lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ServiceHubPage = React.lazy(() => import('./pages/ServiceHubPage').then(m => ({ default: m.ServiceHubPage })));
const PortfolioPage = React.lazy(() => import('./pages/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const ServicePage = React.lazy(() => import('./pages/ServicePage').then(m => ({ default: m.ServicePage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const BlogHub = React.lazy(() => import('./pages/BlogHub').then(m => ({ default: m.BlogHub })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const AffiliatePage = React.lazy(() => import('./pages/AffiliatePage').then(m => ({ default: m.AffiliatePage })));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const DynamicPage = React.lazy(() => import('./pages/DynamicPage').then(m => ({ default: m.DynamicPage })));
const PricingPage = React.lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));

const PageLoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#080808] space-y-4 px-6 animate-fade-in">
    <div className="relative flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/10 rounded-full animate-spin border-t-[#FF6B00]" />
      <span className="absolute text-[11px] font-black uppercase text-[#FF6B00] animate-pulse tracking-widest">P</span>
    </div>
    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#888888]">Optimizing Experience...</span>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const { pathname } = useLocation();
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        
        // Active custom code tag injections
        if (data.custom_head_code) {
          try {
            const div = document.createElement('div');
            div.innerHTML = data.custom_head_code;
            Array.from(div.childNodes).forEach(node => {
              if (node.nodeName === 'SCRIPT') {
                const s = document.createElement('script');
                s.text = (node as HTMLScriptElement).text;
                document.head.appendChild(s);
              } else if (node.nodeName === 'STYLE') {
                const st = document.createElement('style');
                st.textContent = node.textContent;
                document.head.appendChild(st);
              }
            });
          } catch (e) {
            console.error("Head injection issue", e);
          }
        }

        if (data.custom_body_top_code) {
          try {
            const div = document.createElement('div');
            div.innerHTML = data.custom_body_top_code;
            document.body.insertBefore(div, document.body.firstChild);
          } catch (e) {
            console.error("Body top injection issue", e);
          }
        }

        if (data.custom_body_footer_code) {
          try {
             const div = document.createElement('div');
             div.innerHTML = data.custom_body_footer_code;
             document.body.appendChild(div);
          } catch (e) {
            console.error("Body footer injection issue", e);
          }
        }
      })
      .catch(err => console.error("CMS index parameters fail:", err));
  }, []);
  
  return (
    <div className="min-h-screen bg-[#080808] text-[#BFBFBF] font-sans selection:bg-[#FF6B00] selection:text-white overflow-x-hidden">
      <Helmet>
        <title>{settings?.global_meta_title || "Preet Web Vision - SEO & WordPress Marketing Agency"}</title>
        <meta name="description" content={settings?.global_meta_description || "Preet Web Vision is a professional digital marketing agency specializing in high-performance WordPress development and results-driven SEO strategies."} />
        <link rel="canonical" href={`https://preetwebvision.com${pathname}`} />
        {settings?.google_search_console_tag && (
          <meta name="google-site-verification" content={settings.google_search_console_tag.replace('google-site-verification=', '')} />
        )}
        {settings?.bing_webmaster_tag && (
          <meta name="msvalidate.01" content={settings.bing_webmaster_tag.replace('msvalidate.01=', '')} />
        )}
      </Helmet>
      <ScrollToTop />
      {!pathname.startsWith('/admin') && <Navbar />}
      <main>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/index.html" element={<HomePage />} />
            <Route path="/services" element={<ServiceHubPage />} />
            <Route path="/services.html" element={<ServiceHubPage />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            <Route path="/ecommerce.html" element={<ServicePage overrideSlug="ecommerce-development" />} />
            <Route path="/ai-agents.html" element={<ServicePage overrideSlug="ai-agents" />} />
            <Route path="/web-apps.html" element={<ServicePage overrideSlug="web-apps" />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/pricing.html" element={<PricingPage />} />
            <Route path="/case-studies" element={<PortfolioPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio.html" element={<PortfolioPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/contact.html" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about.html" element={<AboutPage />} />
            <Route path="/blog" element={<BlogHub />} />
            <Route path="/blog.html" element={<BlogHub />} />
            <Route path="/tools" element={<AffiliatePage />} />
            <Route path="/seo.html" element={<ServicePage overrideSlug="seo" />} />
            <Route path="/google-ads.html" element={<ServicePage overrideSlug="google-ads" />} />
            <Route path="/social-media.html" element={<ServicePage overrideSlug="social-media" />} />
            <Route path="/ai-automation.html" element={<ServicePage overrideSlug="ai-automation" />} />
            <Route path="/web-design.html" element={<ServicePage overrideSlug="web-design" />} />
            <Route path="/email-marketing.html" element={<ServicePage overrideSlug="email-marketing" />} />
            <Route path="/p/:slug" element={<DynamicPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </React.Suspense>
      </main>
      {!pathname.startsWith('/admin') && <Footer />}
      {!pathname.startsWith('/admin') && <ChatWidget />}
    </div>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}
