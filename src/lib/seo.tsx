import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  schema?: Record<string, any>;
  breadcrumbs?: { name: string; url: string }[];
  noindex?: boolean;
  keywords?: string;
}

const SITE_NAME = 'Preet Web Vision';
const SITE_URL = 'https://preetwebvision.com';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
const TWITTER_HANDLE = '@preetwebvision';

export const SEO = ({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  schema,
  breadcrumbs,
  noindex = false,
  keywords,
}: SEOProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : `${SITE_URL}/`;

  // Build breadcrumb schema
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": crumb.name,
      "item": `${SITE_URL}${crumb.url}`
    }))
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#FF6B00" />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="referrer" content="origin-when-cross-origin" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          "name": SITE_NAME,
          "url": SITE_URL,
          "logo": {
            "@type": "ImageObject",
            "url": `${SITE_URL}/images/preet_founder.png`,
            "width": 512,
            "height": 512
          },
          "description": "High-performance WordPress development and bespoke digital marketing & SEO strategies.",
          "foundingDate": "2020",
          "founder": {
            "@type": "Person",
            "name": "Preet Kalirona"
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "DLF Cyber City Phase-II",
            "addressLocality": "Gurgaon",
            "addressRegion": "Haryana",
            "postalCode": "122002",
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-99990-00000",
            "contactType": "sales",
            "availableLanguage": ["English", "Hindi"]
          },
          "sameAs": [
            "https://twitter.com/preetwebvision",
            "https://linkedin.com/company/preetwebvision",
            "https://facebook.com/preetwebvision",
            "https://instagram.com/preetwebvision"
          ]
        })}
      </script>

      {/* LocalBusiness Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${SITE_URL}/#localbusiness`,
          "name": SITE_NAME,
          "image": DEFAULT_OG_IMAGE,
          "url": SITE_URL,
          "telephone": "+91-99990-00000",
          "email": "hello@preetwebvision.com",
          "priceRange": "$$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "DLF Cyber City Phase-II",
            "addressLocality": "Gurgaon",
            "addressRegion": "Haryana",
            "postalCode": "122002",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 28.4900,
            "longitude": 77.0900
          },
          "openingHoursSpecification": [
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Monday", "opens": "09:00", "closes": "18:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Tuesday", "opens": "09:00", "closes": "18:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "09:00", "closes": "18:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "09:00", "closes": "18:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "09:00", "closes": "18:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "10:00", "closes": "14:00" }
          ],
          "areaServed": [
            { "@type": "City", "name": "Gurgaon" },
            { "@type": "City", "name": "Delhi" },
            { "@type": "City", "name": "Noida" },
            { "@type": "City", "name": "India" },
            { "@type": "Country", "name": "Worldwide" }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Digital Marketing Services",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO Services" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Design & Development" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Google Ads Management" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Social Media Marketing" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Automation" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E-Commerce Solutions" } }
            ]
          }
        })}
      </script>

      {/* Breadcrumb Schema */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {/* Custom Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

// Reusable breadcrumb component
export const Breadcrumbs = ({ items }: { items: { name: string; url: string }[] }) => {
  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-6 pt-24 pb-0 relative z-10">
      <ol className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider">
        <li>
          <a href="/" className="text-[#8B8B8B] hover:text-[#FF6B00] transition-colors">Home</a>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-[#8B8B8B]">/</span>
            {i === items.length - 1 ? (
              <span className="text-[#FFB347]" aria-current="page">{item.name}</span>
            ) : (
              <a href={item.url} className="text-[#8B8B8B] hover:text-[#FF6B00] transition-colors">{item.name}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};