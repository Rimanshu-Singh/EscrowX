import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Listing } from '../models/Listing';
import { User } from '../models/User';

// Helper to seed listings if database is empty
async function seedListings() {
  try {
    // Find some users to associate with listings
    let clientUser = await User.findOne({ role: 'CLIENT' });
    let freelancerUser = await User.findOne({ role: 'FREELANCER' });

    // If no users exist, create mock users
    if (!clientUser) {
      clientUser = new User({
        name: 'Priya Shah',
        email: 'priya@escrowx.co',
        password: 'mockpassword123',
        walletAddress: 'GCLV...982X',
        role: 'CLIENT',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
        trustScore: 92,
        badge: 'Gold'
      });
      await clientUser.save();
    }

    if (!freelancerUser) {
      freelancerUser = new User({
        name: 'Alex Rivera',
        email: 'alex@escrowx.co',
        password: 'mockpassword123',
        walletAddress: 'GB7N...HXR4',
        role: 'FREELANCER',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        trustScore: 96,
        badge: 'Platinum'
      });
      await freelancerUser.save();
    }

    // Now define 16 realistic listings
    const mockListings = [
      {
        title: "I Build AI Agents Using LangChain & Python",
        description: "I will design and deploy a custom AI agent tailored to your workflow. I specialize in building agents using LangChain, LangGraph, and Python. Can automate customer support, web scraping, and workflow automation. Includes full API integration.",
        coverImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
        type: "SERVICE",
        role: "FREELANCER",
        createdBy: freelancerUser._id,
        price: 350,
        budget: 0,
        deliveryDays: 7,
        skills: ["AI", "LangChain", "Python", "Automation"],
        tags: ["AI Agent", "LangChain", "Python", "Automation"],
        status: "active"
      },
      {
        title: "Soroban Smart Contract Auditing & Testing",
        description: "Get your Stellar smart contracts (Soroban) audited by an expert. I will perform deep security vulnerability assessments, gas optimization reviews, and write comprehensive Rust unit tests to guarantee security.",
        coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
        type: "SERVICE",
        role: "FREELANCER",
        createdBy: freelancerUser._id,
        price: 500,
        budget: 0,
        deliveryDays: 5,
        skills: ["Stellar", "Soroban", "Rust", "Smart Contracts"],
        tags: ["Soroban", "Rust", "Stellar", "Audit"],
        status: "active"
      },
      {
        title: "Modern React Web App Development with TailwindCSS",
        description: "I will design and build a responsive, high-performance React web application using TailwindCSS and TypeScript. Features clean code structure, smooth Framer Motion animations, and optimal SEO meta tags.",
        coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        type: "SERVICE",
        role: "FREELANCER",
        createdBy: freelancerUser._id,
        price: 300,
        budget: 0,
        deliveryDays: 6,
        skills: ["React", "TailwindCSS", "TypeScript", "Frontend"],
        tags: ["React", "TailwindCSS", "Frontend", "UI"],
        status: "active"
      },
      {
        title: "UI/UX Design for Premium SaaS Dashboards",
        description: "Create a world-class user interface for your SaaS dashboard. I deliver premium interactive Figma prototypes, component design systems, and wireframes following Apple-like minimal design systems.",
        coverImage: "https://images.unsplash.com/photo-1581291518655-9523c932dedf?auto=format&fit=crop&w=800&q=80",
        type: "SERVICE",
        role: "FREELANCER",
        createdBy: freelancerUser._id,
        price: 400,
        budget: 0,
        deliveryDays: 10,
        skills: ["Figma", "UI/UX Design", "SaaS", "Apple Aesthetic"],
        tags: ["Figma", "UI/UX", "Design", "SaaS"],
        status: "active"
      },
      {
        title: "AI-Powered Customer Support Integration",
        description: "I will deploy a customer support AI assistant on your website. It uses OpenAI GPT-4 and custom embeddings to answer support tickets, syncs with Zendesk, and reports chats back to your Slack channel.",
        coverImage: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=800&q=80",
        type: "SERVICE",
        role: "FREELANCER",
        createdBy: freelancerUser._id,
        price: 450,
        budget: 0,
        deliveryDays: 8,
        skills: ["GPT-4", "Zendesk", "Slack", "Customer Support AI"],
        tags: ["AI Agent", "Zendesk", "Customer Support", "Integration"],
        status: "active"
      },
      {
        title: "Automated Data Extraction & Scraper Pipelines",
        description: "Need web scraping or database automation? I build high-concurrency Node/Python web scrapers that bypass Cloudflare and output clean JSON/CSV directly to your AWS S3 bucket daily.",
        coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
        type: "SERVICE",
        role: "FREELANCER",
        createdBy: freelancerUser._id,
        price: 250,
        budget: 0,
        deliveryDays: 4,
        skills: ["Python", "Web Scraping", "Automation", "AWS"],
        tags: ["Scraping", "Python", "Automation", "Database"],
        status: "active"
      },
      {
        title: "Stellar Asset Issuer & Payment Gateway Setup",
        description: "I will set up asset issuing accounts on Stellar, create custom tokens, establish trustlines, and build a payments integration gateway for your website supporting XLM/USDC payments.",
        coverImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80",
        type: "SERVICE",
        role: "FREELANCER",
        createdBy: freelancerUser._id,
        price: 380,
        budget: 0,
        deliveryDays: 6,
        skills: ["Stellar", "Payments", "Token", "Web3"],
        tags: ["Stellar", "Payments", "Gateway", "Token"],
        status: "active"
      },
      {
        title: "Figma to React + Next.js Production-Ready Code",
        description: "I will convert your Figma layout files into a clean Next.js web app. The code will be structured into modular React components, responsive, and optimized for maximum Vercel SEO score.",
        coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
        type: "SERVICE",
        role: "FREELANCER",
        createdBy: freelancerUser._id,
        price: 420,
        budget: 0,
        deliveryDays: 7,
        skills: ["React", "Next.js", "Figma", "Vercel"],
        tags: ["React", "Next.js", "Frontend", "Figma"],
        status: "active"
      },
      {
        title: "LangChain Chatbots with Custom Knowledge Bases",
        description: "I build RAG systems. Give me your PDFs, Notion pages, and markdown documents, and I will construct an intelligent chatbot using LangChain and Pinecone vector databases that answers questions with extreme accuracy.",
        coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        type: "SERVICE",
        role: "FREELANCER",
        createdBy: freelancerUser._id,
        price: 480,
        budget: 0,
        deliveryDays: 9,
        skills: ["LangChain", "Vector Databases", "AI", "RAG"],
        tags: ["LangChain", "RAG", "Vector", "Bot"],
        status: "active"
      },
      {
        title: "Need Expert Developer to Build Soroban Escrow System",
        description: "We need a smart contract engineer to write a Soroban multi-signature escrow contract on the Stellar network. Must support fund locking, timed release, dispute arbitration, and refund options.",
        coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
        type: "PROJECT",
        role: "CLIENT",
        createdBy: clientUser._id,
        price: 0,
        budget: 600,
        deliveryDays: 14,
        skills: ["Stellar", "Soroban", "Rust", "Smart Contracts"],
        tags: ["Stellar", "Soroban", "Rust", "Escrow"],
        status: "active"
      },
      {
        title: "UI/UX Redesign for DeFi Lending Dashboard",
        description: "Looking for an experienced designer to revamp our DeFi dashboard interface. Clean, modern, Apple-style UI. Provide Figma wireframes, high-fidelity mockups, and layout guidelines.",
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        type: "PROJECT",
        role: "CLIENT",
        createdBy: clientUser._id,
        price: 0,
        budget: 500,
        deliveryDays: 12,
        skills: ["Figma", "UI/UX Design", "DeFi", "Dashboard"],
        tags: ["Figma", "UI/UX", "Design", "DeFi"],
        status: "active"
      },
      {
        title: "AI Customer Agent for E-Commerce Store",
        description: "We are seeking a developer to build an AI agent that answers customer inquiries, checks tracking info via Shopify APIs, and processes return requests. LangChain or OpenAI assistants preferred.",
        coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
        type: "PROJECT",
        role: "CLIENT",
        createdBy: clientUser._id,
        price: 0,
        budget: 550,
        deliveryDays: 10,
        skills: ["AI", "Shopify API", "LangChain", "Customer Support AI"],
        tags: ["Shopify", "AI Agent", "E-Commerce", "LangChain"],
        status: "active"
      },
      {
        title: "Build Automation Pipeline for Social Media Posts",
        description: "We need a Python developer to build a script that auto-generates graphics using PIL, creates SEO-optimized captions using GPT-4, and schedules posts to Twitter, LinkedIn, and Instagram.",
        coverImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
        type: "PROJECT",
        role: "CLIENT",
        createdBy: clientUser._id,
        price: 0,
        budget: 350,
        deliveryDays: 8,
        skills: ["Python", "GPT-4", "Automation", "APIs"],
        tags: ["Python", "Automation", "Social Media", "APIs"],
        status: "active"
      },
      {
        title: "Stellar Wallet Integration for Next.js App",
        description: "Need a freelancer to integrate Freighter and Albedo wallet support into our Next.js project. Must handle wallet state management, token balance checking, and signature requests.",
        coverImage: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80",
        type: "PROJECT",
        role: "CLIENT",
        createdBy: clientUser._id,
        price: 0,
        budget: 400,
        deliveryDays: 5,
        skills: ["Stellar", "Freighter", "Next.js", "React"],
        tags: ["Stellar", "Freighter", "Wallet", "Next.js"],
        status: "active"
      },
      {
        title: "Full-Stack SaaS MVP with Stripe Payments",
        description: "Looking for a full-stack Node + React developer to build an MVP for our micro-SaaS. Need user auth (Google/email), subscription tiers via Stripe, and database setup (PostgreSQL/MongoDB).",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        type: "PROJECT",
        role: "CLIENT",
        createdBy: clientUser._id,
        price: 0,
        budget: 750,
        deliveryDays: 20,
        skills: ["React", "Node.js", "SaaS", "Stripe"],
        tags: ["SaaS", "Stripe", "Node", "MVP"],
        status: "active"
      },
      {
        title: "LangChain Pipeline for Automated Document Summarization",
        description: "We ingest summaries of hundreds of PDFs daily. We need a high-speed LangChain pipeline that parses files, extracts key metadata, runs summaries using Claude 3, and saves them to MongoDB.",
        coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        type: "PROJECT",
        role: "CLIENT",
        createdBy: clientUser._id,
        price: 0,
        budget: 480,
        deliveryDays: 10,
        skills: ["LangChain", "Claude 3", "Python", "MongoDB"],
        tags: ["LangChain", "Summarizer", "Python", "PDF"],
        status: "active"
      }
    ];

    const seededListings = mockListings.map(item => {
      const isProject = item.type === 'PROJECT';
      const user = isProject ? clientUser : freelancerUser;
      return new Listing({
        ...item,
        ownerId: user._id,
        ownerWalletAddress: user.walletAddress,
        ownerUsername: user.username || user.name,
      });
    });

    for (const listing of seededListings) {
      await listing.save();
      if (listing.type === 'PROJECT') {
        listing.projectId = listing._id;
      } else {
        listing.serviceId = listing._id;
      }
      await listing.save();
    }

    console.log("Auto-seeded 16 marketplace listings successfully!");
  } catch (err: any) {
    console.error("Failed to seed listings:", err.message);
  }
}

// Create a new listing (gigs/services/projects)
export async function createListing(req: AuthRequest, res: Response) {
  try {
    const { title, description, coverImage, type, role, price, budget, deliveryDays, skills, tags, attachments } = req.body;
    const userId = req.user?.userId;

    if (!title || !description || !type || !role || !deliveryDays) {
      return res.status(400).json({ error: 'Title, description, type, role, and deliveryDays are required' });
    }

    if (role === 'CLIENT' && type === 'PROJECT') {
      return res.status(400).json({ error: 'Projects must be created and published through the Escrow Creation and Funding workflow.' });
    }

    // Fetch owner details from DB
    const owner = await User.findById(userId);
    if (!owner) {
      return res.status(404).json({ error: 'Owner user not found' });
    }

    const listing = new Listing({
      title,
      description,
      coverImage: coverImage || '',
      type,
      role,
      createdBy: userId,
      price: price || 0,
      budget: budget || 0,
      deliveryDays,
      skills: skills || [],
      tags: tags || [],
      attachments: attachments || [],
      status: 'active',
      ownerId: userId,
      ownerWalletAddress: owner.walletAddress,
      ownerUsername: owner.username || owner.name,
    });

    await listing.save();

    if (type === 'PROJECT') {
      listing.projectId = listing._id;
    } else {
      listing.serviceId = listing._id;
    }
    await listing.save();

    return res.status(201).json(listing);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Get all listings with advanced filtering, sorting, pagination
export async function getListings(req: AuthRequest, res: Response) {
  try {
    const { search, type, role, minPrice, maxPrice, minBudget, maxBudget, skills, sort, page = 1, limit = 10 } = req.query;

    // Auto-seed if database is empty of listings
    const totalListingsCount = await Listing.countDocuments();
    if (totalListingsCount === 0) {
      await seedListings();
    }

    const query: any = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      query.type = type;
    }

    if (role) {
      query.role = role;
    }

    // Handle prices (for Services)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Handle budget (for Projects)
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    // Handle skills array (matching any in the list or exact match)
    if (skills) {
      const skillsArray = typeof skills === 'string' ? skills.split(',') : (skills as string[]);
      query.skills = { $in: skillsArray.map(s => new RegExp(s.trim(), 'i')) };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skipNum = (pageNum - 1) * limitNum;

    // Sorting
    let sortQuery: any = { createdAt: -1 };
    if (sort) {
      if (sort === 'price_asc') sortQuery = { price: 1, budget: 1 };
      else if (sort === 'price_desc') sortQuery = { price: -1, budget: -1 };
      else if (sort === 'oldest') sortQuery = { createdAt: 1 };
      else if (sort === 'newest') sortQuery = { createdAt: -1 };
    }

    const totalListings = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .populate('createdBy', 'name email walletAddress trustScore badge avatar role')
      .sort(sortQuery)
      .skip(skipNum)
      .limit(limitNum);

    return res.json({
      listings,
      pagination: {
        total: totalListings,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(totalListings / limitNum)
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Get details of a single listing
export async function getListingDetails(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('createdBy', 'name email walletAddress trustScore badge avatar role');
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    return res.json(listing);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Get listings created by the logged-in user
export async function getMyListings(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const listings = await Listing.find({ createdBy: userId }).sort({ createdAt: -1 });
    return res.json(listings);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Update a listing
export async function updateListing(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    let listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    if (listing.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }

    const updatedData = { ...req.body, updatedAt: Date.now() };
    listing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });
    
    return res.json(listing);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Delete a listing
export async function deleteListing(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(id);
    return res.json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
