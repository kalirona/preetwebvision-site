import express from 'express';
import { readData, writeData } from '../db.js';
import { authenticateAdmin } from './admin.js';
import { executeCentralAIRequest, getCentralAILogs } from '../aiService.js';

const router = express.Router();

const MOCK_CHAT_SESSIONS = [
  {
    sessionId: "sess-991",
    userName: "Guest 991 (Phoenix, AZ)",
    email: "phoenix_ecom@gmail.com",
    lastMessage: "Do you build headless Shopify custom liquid themes?",
    status: "active",
    tags: ["Shopify"],
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    messages: [
      { sender: "user", message: "Hello! I am looking for a developer for my Shopify store.", timestamp: new Date(Date.now() - 4000000).toISOString() },
      { sender: "admin", message: "Hi! We specialize in high-converting Shopify designs. Tell us more about your products.", timestamp: new Date(Date.now() - 3800000).toISOString() },
      { sender: "user", message: "Do you build headless Shopify custom liquid themes?", timestamp: new Date(Date.now() - 3600000).toISOString() }
    ]
  },
  {
    sessionId: "sess-992",
    userName: "Guest 992 (Chicago, IL)",
    email: "chicago_marketer@yahoo.com",
    lastMessage: "What is your pricing model for WordPress SEO audits?",
    status: "resolved",
    tags: ["WordPress", "SEO"],
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    messages: [
      { sender: "user", message: "I want to rank higher for local organic SEO. Do you optimize WordPress sites?", timestamp: new Date(Date.now() - 8000000).toISOString() },
      { sender: "admin", message: "Yes, our WordPress SEO engine guarantees a Core Web Vitals score of 90+ and complete structured schemas.", timestamp: new Date(Date.now() - 7600000).toISOString() },
      { sender: "user", message: "What is your pricing model for WordPress SEO audits?", timestamp: new Date(Date.now() - 7200000).toISOString() }
    ]
  }
];

// GET /api/chat/sessions (Admin only)
router.get("/sessions", authenticateAdmin, async (req, res) => {
  let list = await readData<any>('chats');
  if (list.length === 0) {
    list = MOCK_CHAT_SESSIONS;
    await writeData('chats', list);
  }
  res.json(list);
});

// GET /api/chat/messages (Public / User)
router.get("/messages", async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  const list = await readData<any>('chats');
  const session = list.find((s: any) => s.sessionId === sessionId);
  if (session) {
    return res.json(session.messages);
  }
  res.json([]);
});

// POST /api/chat/messages (Public / User & AI automated responses)
router.post("/messages", async (req, res) => {
  try {
    const { sessionId, message, userName, email } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: "sessionId and message are required" });
    }

    const list = await readData<any>('chats');
    let sessionIndex = list.findIndex((s: any) => s.sessionId === sessionId);

    const messageEntry = {
      sender: "user",
      message,
      timestamp: new Date().toISOString()
    };

    if (sessionIndex === -1) {
      const newSession = {
        sessionId,
        userName: userName || `Guest-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        email: email || "",
        lastMessage: message,
        status: "active",
        tags: [],
        timestamp: new Date().toISOString(),
        messages: [messageEntry]
      };
      list.unshift(newSession);
      sessionIndex = 0;
    } else {
      list[sessionIndex].messages.push(messageEntry);
      list[sessionIndex].lastMessage = message;
      list[sessionIndex].timestamp = new Date().toISOString();
    }

    // AI Auto-Response simulation
    const lowercaseMsg = message.toLowerCase();
    let replyText = "";
    
    if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi ") || lowercaseMsg.includes("hey")) {
      replyText = "Hello! Welcome to Preet Web Vision. We are experts in high-performance WordPress & Shopify design and enterprise SEO solutions. How can we help you scale today?";
    } else if (lowercaseMsg.includes("wordpress") || lowercaseMsg.includes("wp")) {
      replyText = "Our custom WordPress themes are custom built (no bloat) to target perfect 100/100 Core Web Vitals on PageSpeed. Would you like to schedule an audit or get a design quote?";
    } else if (lowercaseMsg.includes("shopify") || lowercaseMsg.includes("ecom")) {
      replyText = "We build tailored Shopify liquid themes and headless storefronts engineered to maximize Average Order Value. Can we discuss your production catalog?";
    } else if (lowercaseMsg.includes("pricing") || lowercaseMsg.includes("cost") || lowercaseMsg.includes("packages")) {
      replyText = "We offer bespoke development and growth retainers tailored entirely to your requirements. Usually WordPress custom builds start at $4K and SEO audits at $1.2K. Shall we book a direct consultation call?";
    } else if (lowercaseMsg.includes("booking") || lowercaseMsg.includes("schedule") || lowercaseMsg.includes("appointment")) {
      replyText = "You can schedule a live audit directly through our client appointment scheduler on our contact page, or just tell us your email and preferred time here and we'll book it now!";
    } else {
      // Route through Central AI service adhering to the credit tracking policy
      const result = await executeCentralAIRequest({
        prompt: `Generate a concise, friendly, helpful response to this visitor message: "${message}"`,
        systemInstruction: "You are Preet Web Vision's friendly customer support agent. We design custom, ultra-fast websites in WordPress/Shopify & perform advanced SEO audits to help clients rank higher.",
        preferredModel: "gemini-3.5-flash",
        creditCost: 1
      });
      
      if (result.success) {
        replyText = result.text;
      }
      
      if (!replyText) {
        replyText = "Thank you for reaching out! One of our design engineers will audit your message and reply back within 1 hour. Feel free to leave your contact info.";
      }
    }

    // Append AI Auto-Response if we have one
    if (replyText) {
      const autoResponseEntry = {
        sender: "admin",
        message: replyText,
        isAiSuggested: true,
        timestamp: new Date().toISOString()
      };
      
      // Auto-tagging based on content
      const currentTags = list[sessionIndex].tags || [];
      if ((lowercaseMsg.includes("wordpress") || lowercaseMsg.includes("wp")) && !currentTags.includes("WordPress")) {
        currentTags.push("WordPress");
      }
      if ((lowercaseMsg.includes("shopify") || lowercaseMsg.includes("ecom")) && !currentTags.includes("Shopify")) {
        currentTags.push("Shopify");
      }
      if (lowercaseMsg.includes("seo") && !currentTags.includes("SEO")) {
        currentTags.push("SEO");
      }
      
      list[sessionIndex].tags = currentTags;
      list[sessionIndex].messages.push(autoResponseEntry);
      list[sessionIndex].lastMessage = replyText;
    }

    await writeData('chats', list);
    res.json({ success: true, messages: list[sessionIndex].messages });
  } catch (error) {
    res.status(500).json({ error: "Failed to dispatch message" });
  }
});

// POST /api/chat/reply (Admin only)
router.post("/reply", authenticateAdmin, async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: "sessionId and message are required" });
    }

    const list = await readData<any>('chats');
    const sessionIndex = list.findIndex((s: any) => s.sessionId === sessionId);
    if (sessionIndex === -1) {
      return res.status(404).json({ error: "Session not found" });
    }

    const replyEntry = {
      sender: "admin",
      message,
      timestamp: new Date().toISOString()
    };

    list[sessionIndex].messages.push(replyEntry);
    list[sessionIndex].lastMessage = message;
    list[sessionIndex].timestamp = new Date().toISOString();

    await writeData('chats', list);
    res.json(list[sessionIndex]);
  } catch (error) {
    res.status(500).json({ error: "Failed to send reply" });
  }
});

// POST /api/chat/suggest-reply (Admin only - generates answer via Gemini)
router.post("/suggest-reply", authenticateAdmin, async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const list = await readData<any>('chats');
    const session = list.find((s: any) => s.sessionId === sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Get the history to provide to Gemini
    const historyText = session.messages.map((m: any) => `${m.sender === 'user' ? 'Client' : 'Admin'}: ${m.message}`).join("\n");
    
    let suggestedText = "";
    
    const prompt = `You are Preet, the principal strategist at Preet Web Vision. 
Our agency builds custom super fast WordPress websites, premium custom Shopify stores, and enterprise local and technical SEO audits.
Given this user conversation log, write an elite, professional, conversion-oriented reply option for the admin to choose and send:
\n${historyText}\n
Answer as "Preet". Speak directly, concisely, and provide high value. Keep the response under 100 words, highly scannable and ready to use.`;

    const result = await executeCentralAIRequest({
      prompt,
      systemInstruction: "You are Preet, leading digital strategist for premium performance speed audits & enterprise organic web growth.",
      preferredModel: "gemini-3.5-flash",
      creditCost: 1
    });

    if (result.success) {
      suggestedText = result.text;
    }

    if (!suggestedText) {
      // Hardcoded fallback logic
      const lastUserMsg = [...session.messages].reverse().find(m => m.sender === 'user')?.message || "";
      suggestedText = `Hi, Preet here. I reviewed your message regarding "${lastUserMsg}". We would love to collaborate. We can design an optimized theme tailored to your brand with guaranteed green Core Web Vitals. Let's schedule a brief 15 mins screen-share call this week to align on scope. What days work best for you?`;
    }

    res.json({ suggestion: suggestedText });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate AI auto-suggestion" });
  }
});

// PATCH /api/chat/sessions/:sessionId/status (Admin only)
router.patch("/sessions/:sessionId/status", authenticateAdmin, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, tags } = req.body;
    const list = await readData<any>('chats');
    const index = list.findIndex((s: any) => s.sessionId === sessionId);
    
    if (index !== -1) {
      if (status) list[index].status = status;
      if (tags) list[index].tags = tags;
      await writeData('chats', list);
      return res.json(list[index]);
    }
    res.status(404).json({ error: "Session not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update session" });
  }
});

// GET /api/chat/ai-logs (Admin only - retrieves central AI records)
router.get("/ai-logs", authenticateAdmin, async (req, res) => {
  try {
    const logs = await getCentralAILogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch central AI logs ledger" });
  }
});

export default router;
