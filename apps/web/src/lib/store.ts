import { Profile, Project, Skill, SkillCategory, Experience, Education, Certification, BlogPost, BlogCategory, BlogTag, ContactMessage, SiteSettings, AiConversation, AiMessage } from "@portfolio/shared-types";
import { hashPassword } from "@/lib/auth";

const now = () => new Date().toISOString();
const id = () => Math.random().toString(36).slice(2, 10);

export interface Db {
  profile: Profile;
  skillCategories: SkillCategory[];
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  blogCategories: BlogCategory[];
  blogTags: BlogTag[];
  blogPosts: BlogPost[];
  contactMessages: ContactMessage[];
  siteSettings: SiteSettings;
  analytics: { type: string; path?: string; createdAt: string }[];
  aiConversations: AiConversation[];
  aiMessages: AiMessage[];
  adminUsers: { id: string; email: string; passwordHash: string; role: string }[];
}

function seed(): Db {
  const profile: Profile = {
    id: "profile-1",
    fullName: "Marcus Mallari",
    professionalTitle: "Business Informatics Student | Web Developer | Project Manager",
    headline: "Building digital solutions with purpose.",
    biography: [
      "I'm Marcus, a fourth-year Bachelor of Science in Information Technology student majoring in Business Informatics (BAM) at PHINMA Araullo University.",
      "I'm interested in building useful digital experiences and technology-driven business solutions. My academic work has included smart scheduling, e-commerce, and payroll systems — projects where I both developed and coordinated the work.",
      "I work with HTML, CSS, JavaScript, SQL, and Node.js, and I enjoy solving practical problems through software.",
      "Most of my experience comes from academic projects where I have balanced hands-on development with project coordination, organizing timelines, delegating responsibilities, and supporting team communication.",
      "I'm looking for opportunities to grow as a developer and contribute to teams that build useful, well-designed products.",
    ].join("\n\n"),
    profileImageUrl: "/profile.jpg",
    location: "Puncan, Carranglan, Nueva Ecija, Philippines",
    email: "mxwllmallari@gmail.com",
    phone: "0953 800 6480",
    availabilityStatus: "Available for opportunities",
    githubUrl: "",
    linkedinUrl: "",
    facebookUrl: "",
    websiteUrl: "",
    resumeUrl: "",
    createdAt: now(),
    updatedAt: now(),
  };

  const skillCategories: SkillCategory[] = [
    { id: "sc-web", name: "Programming and Web Development", slug: "programming-and-web-development", displayOrder: 1 },
    { id: "sc-db", name: "Database", slug: "database", displayOrder: 2 },
    { id: "sc-tools", name: "Development Tools", slug: "development-tools", displayOrder: 3 },
    { id: "sc-productivity", name: "Productivity", slug: "productivity", displayOrder: 4 },
  ];

  const skills: Skill[] = [
    { id: "s1", name: "HTML", categoryId: "sc-web", displayOrder: 1, createdAt: now(), updatedAt: now() },
    { id: "s2", name: "CSS", categoryId: "sc-web", displayOrder: 2, createdAt: now(), updatedAt: now() },
    { id: "s3", name: "JavaScript", categoryId: "sc-web", displayOrder: 3, createdAt: now(), updatedAt: now() },
    { id: "s4", name: "Node.js", categoryId: "sc-web", displayOrder: 4, createdAt: now(), updatedAt: now() },
    { id: "s5", name: "SQL", categoryId: "sc-db", displayOrder: 1, createdAt: now(), updatedAt: now() },
    { id: "s6", name: "Visual Studio Code", categoryId: "sc-tools", displayOrder: 1, createdAt: now(), updatedAt: now() },
    { id: "s7", name: "XAMPP", categoryId: "sc-tools", displayOrder: 2, createdAt: now(), updatedAt: now() },
    { id: "s8", name: "Microsoft Office", categoryId: "sc-productivity", displayOrder: 1, createdAt: now(), updatedAt: now() },
  ];

  const projects: Project[] = [
    {
      id: "p1",
      title: "Smart Scheduling System",
      slug: "smart-scheduling-system",
      summary: "Web-based scheduling system built to replace manual planning.",
      description: "A web-based scheduling system built to replace manual planning. Designed to organize class or meeting schedules in one place, reduce conflicts, and make updates easy to share.",
      overview: "A web-based scheduling system built to replace manual planning for class and meeting schedules.",
      problem: "Planning schedules by hand made conflicts easy to miss, updates hard to communicate, and every change slow to apply.",
      objectives: [
        "Organize class and meeting schedules in one place",
        "Reduce scheduling conflicts",
        "Make schedule updates easy to share",
      ],
      keyFeatures: [
        "Centralized schedule management in a single web application",
        "Conflict-aware planning to help avoid overlapping schedules",
        "Updatable schedules that are easy to share with others",
      ],
      contributions: [
        "Designed and developed the system end to end",
        "Coordinated the project timeline and team communication",
      ],
      coverImageUrl: "",
      category: "Academic Project",
      techStack: ["HTML", "CSS", "JavaScript", "Node.js", "SQL"],
      status: "published",
      featured: true,
      liveUrl: "https://racsready.its-au.space",
      githubUrl: "",
      developmentDate: "2026-01-01",
      images: [],
      views: 0,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "p2",
      title: "Shoe Ordering System",
      slug: "shoe-ordering-system",
      summary: "E-commerce web application for a shoe collection.",
      description: "An e-commerce web application for a shoe collection, allowing customers to browse products, view product details, and place orders online.",
      overview: "An e-commerce web application built for a shoe collection, bringing the ordering process online.",
      problem: "The shoe collection had no online storefront, so customers had no way to browse products or place orders outside in-person transactions.",
      objectives: [
        "Let customers browse the shoe collection online",
        "Present each product with clear details",
        "Allow customers to place orders directly through the site",
      ],
      keyFeatures: [
        "Product browsing across the shoe collection",
        "Product detail pages for individual items",
        "Online order placement",
      ],
      contributions: [
        "Designed and developed the system end to end",
        "Coordinated the project timeline and team communication",
      ],
      coverImageUrl: "",
      category: "Academic Project",
      techStack: ["HTML", "CSS", "JavaScript", "Node.js", "SQL"],
      status: "published",
      featured: true,
      liveUrl: "https://khysncollection.onlinewebshop.net",
      githubUrl: "",
      developmentDate: "2025-01-01",
      images: [],
      views: 0,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "p3",
      title: "Simple Payroll Management System",
      slug: "simple-payroll-management-system",
      summary: "Payroll system for computing and tracking employee payouts.",
      description: "A payroll management system that computes employee pay, records deductions, and maintains a history of employee payouts.",
      overview: "A payroll management system that computes employee pay and keeps reliable payout records.",
      problem: "Computing pay and tracking deductions by hand was slow and error-prone, and there was no dependable history of past payouts.",
      objectives: [
        "Compute employee pay accurately",
        "Record deductions properly",
        "Maintain a history of employee payouts",
      ],
      keyFeatures: [
        "Automated pay computation",
        "Deduction recording",
        "Payout history records",
      ],
      contributions: [
        "Designed and developed the system end to end",
        "Coordinated the project work and team communication",
      ],
      coverImageUrl: "",
      category: "Academic Project",
      techStack: ["HTML", "CSS", "JavaScript", "SQL"],
      status: "published",
      featured: false,
      liveUrl: "https://finalexam.onlinewebshop.net",
      githubUrl: "",
      developmentDate: "2024-01-01",
      images: [],
      views: 0,
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const experiences: Experience[] = [
    {
      id: "e1",
      company: "Student Academic Projects",
      position: "Project Manager",  
      location: "Nueva Ecija, Philippines",
      startDate: "2024-01-01",
      current: true,
      description: "Designed and developed most of the project work hands-on — the Smart Scheduling System, Shoe Ordering System, and Simple Payroll Management System — while coordinating timelines and team communication for student academic projects.",
      responsibilities: [
        "Designed and developed most of the work hands-on across academic and personal projects",
        "Owned projects end to end: planning, development, deployment, and documentation",
        "Coordinated project timelines and milestones",
        "Supported team communication",
        "Used Microsoft Office tools for scheduling, documentation, and reporting",
        "Personally handled the majority of the implementation",
      ],
      technologies: ["HTML", "CSS", "JavaScript", "Node.js", "SQL"],
      achievements: ["Delivered the Smart Scheduling System, Shoe Ordering System, and Simple Payroll Management System"],
      displayOrder: 1,
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const education: Education[] = [
    {
      id: "ed1",
      institution: "PHINMA Araullo University",
      degree: "Bachelor of Science in Information Technology (BSIT)",
      fieldOfStudy: "Business Informatics (BAM)",
      status: "Fourth-Year Student",
      startDate: "2022-08-01",
      endDate: "",
      description: "Fourth-year undergraduate studies combining information technology with business analysis, systems development, and project management.",
      displayOrder: 1,
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const certifications: Certification[] = [
    {
      id: "c1",
      name: "Oracle Analytics Cloud 2025 Certified Professional",
      issuer: "Oracle University",
      issueDate: "2025-09-10",
      expiryDate: "2027-09-10",
      credentialUrl: "/certs/oracle-analytics-cloud-2025-certified-professional.pdf",
      imageUrl: "/certs/oracle-analytics-cloud-2025-certified-professional.jpg",
      displayOrder: 1,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "c2",
      name: "Oracle Cloud Infrastructure 2025 Certified Networking Professional",
      issuer: "Oracle University",
      issueDate: "2025-10-22",
      credentialUrl: "/certs/oracle-cloud-infrastructure-2025-certified-networking-professional.pdf",
      imageUrl: "/certs/oracle-cloud-infrastructure-2025-certified-networking-professional.jpg",
      displayOrder: 2,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "c3",
      name: "Oracle Cloud Database Services 2025 Certified Professional",
      issuer: "Oracle University",
      issueDate: "2025-10-22",
      credentialUrl: "/certs/oracle-cloud-database-services-2025-certified-professional.pdf",
      imageUrl: "/certs/oracle-cloud-database-services-2025-certified-professional.jpg",
      displayOrder: 3,
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const blogCategories: BlogCategory[] = [
    { id: "bc1", name: "Engineering", slug: "engineering" },
    { id: "bc2", name: "Career", slug: "career" },
  ];
  const blogTags: BlogTag[] = [
    { id: "bt1", name: "Next.js", slug: "nextjs" },
    { id: "bt2", name: "React", slug: "react" },
  ];
  const blogPosts: BlogPost[] = [
    {
      id: "b1",
      title: "Building a Futuristic Portfolio",
      slug: "building-a-futuristic-portfolio",
      excerpt: "How I designed and built a premium portfolio ecosystem.",
      content: "## Introduction\n\nThis is a sample article. Edit it in the admin dashboard.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.",
      coverImageUrl: "",
      categoryId: "bc1",
      tagIds: ["bt1"],
      status: "published",
      featured: true,
      publishedAt: now(),
      readingTimeMinutes: 3,
      seoTitle: "Building a Futuristic Portfolio",
      seoDescription: "Sample article",
      views: 0,
      authorName: "Marcus Mallari",
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const siteSettings: SiteSettings = {
    siteName: "Marcus Mallari Portfolio",
    siteDescription: "Business Informatics student and web developer portfolio",
    primaryColor: "#244C40",
    secondaryColor: "#B58B55",
    aiAssistantEnabled: true,
    aiAssistantName: "Developer Assistant",
    maintenanceMode: false,
    updatedAt: now(),
  };

  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const adminUsers = adminEmail && adminPassword
    ? [{ id: "admin-1", email: adminEmail.toLowerCase(), passwordHash: hashPassword(adminPassword), role: "admin" }]
    : [];

  return {
    profile,
    skillCategories,
    skills,
    projects,
    experiences,
    education,
    certifications,
    blogCategories,
    blogTags,
    blogPosts,
    contactMessages: [],
    siteSettings,
    analytics: [],
    aiConversations: [],
    aiMessages: [],
    adminUsers,
  };
}

const globalKey = "__PORTFOLIO_DB__";
function loadDb(): Db {
  const g = globalThis as any;
  if (g[globalKey]) return g[globalKey];
  let db: Db;
  try {
    const fs = require("fs");
    const path = require("path");
    const file = path.join(process.cwd(), ".data", "db.json");
    if (fs.existsSync(file)) {
      db = JSON.parse(fs.readFileSync(file, "utf8"));
    } else {
      db = seed();
    }
  } catch {
    db = seed();
  }
  g[globalKey] = db;
  return db;
}

export function getDb(): Db { return loadDb(); }

export function saveDb() {
  try {
    const fs = require("fs");
    const path = require("path");
    const dir = path.join(process.cwd(), ".data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "db.json"), JSON.stringify(getDb(), null, 2));
  } catch {}
}

export { id, now };

