import { SERVICES, BLOG_POSTS } from '../constants';

export interface CmsResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Service to handle dynamic content from a headless CMS like Strapi.
 * Currently simulates the fetching logic while being "Production-Ready".
 */
export const cmsService = {
  /**
   * Fetches blog posts with SEO metadata.
   * Can be easily swapped with: fetch(`${STRAPI_API_URL}/api/posts?populate=*`)
   */
  async getBlogPosts() {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const posts = await response.json();
        if (Array.isArray(posts)) {
          return {
            data: posts,
            meta: { total: posts.length }
          };
        }
      }
    } catch (err) {
      console.error("Failed to fetch posts from backend, falling back to static BLOG_POSTS list:", err);
    }
    return {
      data: BLOG_POSTS,
      meta: { total: BLOG_POSTS.length }
    };
  },

  /**
   * Fetches service details by slug.
   */
  async getServiceBySlug(slug: string) {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const services = await response.json();
        if (Array.isArray(services)) {
          const matched = services.find((s: any) => s.slug === slug);
          if (matched) return matched;
        }
      }
    } catch (err) {
      console.error("Backend services unreached, using defaults", err);
    }
    
    // Fallback constants lookups
    const service = SERVICES.find(s => s.slug === slug);
    return service || null;
  },

  /**
   * Forwards a new lead to the backend API.
   */
  async submitLead(leadData: any) {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    
    if (!response.ok) {
      throw new Error('SaaS Linkage Failed');
    }
    
    return response.json();
  }
};
