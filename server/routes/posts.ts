import express from 'express';
import { readData, writeData } from '../db.js';
import { authenticateAdmin } from './admin.js';

const router = express.Router();

const INITIAL_POSTS = [
  {
    id: "post-1",
    slug: "wordpress-seo-2026",
    title: "WordPress SEO: Ultimate Guide for 2026",
    excerpt: "Learn the latest technical SEO strategies to make your WordPress site rank higher and load faster in the AI-search era.",
    content: "# WordPress SEO: Ultimate Guide for 2026\n\nSEO is pivoting. In the era of AI integrations and conversational answers, standard keyword optimization is no longer enough.\n\n## Modern Technical Audits\n1. Ensure Core Web Vitals are entirely green.\n2. Add complete Schema JSON-LD markup.\n3. Keep HTML structure clean and highly semantic.\n\nOptimized loading speed remains the #1 ranking factor.",
    category: "WordPress Tutorials",
    date: "May 15, 2026",
    author: "Preet",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    status: "PUBLISHED",
    seo: {
      metaTitle: "WordPress SEO Guide 2026 | Technical Search Dominance",
      metaDescription: "The absolute master guide on optimizing WordPress for 2026. Code benchmarks, page speed optimizations, and dynamic structure guides.",
      focusKeyword: "WordPress SEO",
      tags: ["WordPress", "SEO", "Optimization"]
    },
    updatedAt: new Date().toISOString()
  },
  {
    id: "post-2",
    slug: "ai-tools-for-digital-growth",
    title: "Top 10 AI Tools for Rapid Digital Growth",
    excerpt: "Efficiency is the new growth. Discover the AI platforms that are saving agencies 20+ hours a week on content and data analysis.",
    content: "# Top 10 AI Tools for Rapid Digital Growth\n\nAI is not going to replace marketers, but marketers who use AI will replace those who don't.\n\n## The Elite Stack\n- **Gemini Pro**: The king of large-context logical reasoning.\n- **Vercel AI SDK**: Supercharge your Next.js apps with streaming completions.\n- **Screaming Frog AI**: Automate full technical sitemaps and content audits.\n\nWe audit agencies and show them exactly how to save 20 hours per week using these automated workflows.",
    category: "Digital Marketing Tips",
    date: "May 10, 2026",
    author: "Admin",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    status: "PUBLISHED",
    seo: {
      metaTitle: "AI Tools for Agencies | Supercharged Scale",
      metaDescription: "Learn about the top ten AI tools that are currently accelerating developer speed, content deployment, and metadata workflows in 2026.",
      focusKeyword: "AI Content Automation",
      tags: ["AI Tools", "Growth", "Marketing"]
    },
    updatedAt: new Date().toISOString()
  }
];

// GET /api/posts
router.get("/", async (req, res) => {
  let list = await readData<any>('posts');
  if (list.length === 0) {
    list = INITIAL_POSTS;
    await writeData('posts', list);
  }
  res.json(list);
});

// GET /api/posts/:slug
router.get("/:slug", async (req, res) => {
  let list = await readData<any>('posts');
  if (list.length === 0) {
    list = INITIAL_POSTS;
    await writeData('posts', list);
  }
  const post = list.find((p: any) => p.slug === req.params.slug);
  if (post) {
    return res.json(post);
  }
  res.status(404).json({ error: "Post not found" });
});

// POST /api/posts (Admin only)
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const { title, slug, content, excerpt, category, image, author, status, seo } = req.body;
    if (!title || !slug) {
      return res.status(400).json({ error: "Title and slug are required" });
    }

    const list = await readData<any>('posts');
    if (list.some((p: any) => p.slug === slug)) {
      return res.status(400).json({ error: "Slug is already in use" });
    }

    const newPost = {
      id: `POST-${Date.now()}`,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      title,
      content: content || "",
      excerpt: excerpt || "",
      category: category || "Uncategorized",
      image: image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: author || "Admin",
      status: status || "DRAFT",
      seo: {
        metaTitle: seo?.metaTitle || title,
        metaDescription: seo?.metaDescription || "",
        focusKeyword: seo?.focusKeyword || "",
        tags: seo?.tags || []
      },
      updatedAt: new Date().toISOString()
    };

    list.push(newPost);
    await writeData('posts', list);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// PUT /api/posts/:id (Admin only)
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, excerpt, category, image, author, status, seo } = req.body;
    const list = await readData<any>('posts');
    const index = list.findIndex((p: any) => p.id === id);

    if (index !== -1) {
      const formattedSlug = slug ? slug.trim().toLowerCase().replace(/\s+/g, '-') : list[index].slug;
      if (slug && list.some((p: any) => p.id !== id && p.slug === formattedSlug)) {
        return res.status(400).json({ error: "Slug is already in use by another post" });
      }

      list[index] = {
        ...list[index],
        title: title || list[index].title,
        slug: formattedSlug,
        content: content !== undefined ? content : list[index].content,
        excerpt: excerpt !== undefined ? excerpt : list[index].excerpt,
        category: category || list[index].category,
        image: image || list[index].image,
        author: author || list[index].author,
        status: status || list[index].status,
        seo: {
          metaTitle: seo?.metaTitle || list[index].seo?.metaTitle || title || list[index].title,
          metaDescription: seo?.metaDescription || list[index].seo?.metaDescription || "",
          focusKeyword: seo?.focusKeyword || list[index].seo?.focusKeyword || "",
          tags: seo?.tags || list[index].seo?.tags || []
        },
        updatedAt: new Date().toISOString()
      };

      await writeData('posts', list);
      return res.json(list[index]);
    }
    res.status(404).json({ error: "Post not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE /api/posts/:id (Admin only)
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const list = await readData<any>('posts');
    const filtered = list.filter((p: any) => p.id !== id);

    if (list.length === filtered.length) {
      return res.status(404).json({ error: "Post not found" });
    }

    await writeData('posts', filtered);
    res.json({ success: true, message: "Post removed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
