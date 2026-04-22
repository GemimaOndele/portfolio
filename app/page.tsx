"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Lang = "fr" | "en";
type Theme = "dark" | "light";
type Track = "data-scientist" | "ai-engineer" | "data-engineer";
type ChatMsg = { role: "bot" | "user"; text: string };
type ChatMode = "standard" | "recruiter";
type PitchDuration = 30 | 60;
type Preset = "interview" | "showcase";
type VoiceStyle = "natural" | "interview";
type AssistantTone = "pro" | "fun";
type ActionEmoji = { id: number; emoji: string; left: number; delay: number };
type ProjectCategory = "all" | "ai" | "devops" | "cyber" | "web" | "data";
type SpeechRecognitionResultLike = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognizer = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous?: boolean;
  onresult: ((event: SpeechRecognitionResultLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionCtor = new () => SpeechRecognizer;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

const copy = {
  fr: {
    nav: ["A propos", "Formation", "Experience", "Projets", "Achievements", "Competences", "Vision", "Contact"],
    availability: "Disponible pour stage en IA (avril-septembre 2026)",
    title: "Data & AI Engineer",
    subtitle:
      "Role principal: Data & AI Engineer | S1 (sept-dec 2025) en MSc 1 Data Engineering, puis S2 (janv-avr 2026) en MSc 1 Artificial Intelligence - International English.",
    hero: "Je conçois des solutions IA/Data orientées impact métier: ETL/ELT, modélisation, automatisation intelligente, dashboards KPI, avec une base solide en réseaux/systèmes et développement web.",
    ctaProjects: "Voir mes projets",
    ctaContact: "Me contacter",
    aboutTitle: "A propos 🤖",
    about:
      "Passionnee par l'IA et la robotique, je combine rigueur technique et créativité pour transformer les données en decisions actionnables.",
    educationTitle: "Formation",
    experienceTitle: "Experience",
    projectsTitle: "Projets 🚀",
    achievementsTitle: "Achievements mesurables 📊",
    skillsTitle: "Competences (par niveau)",
    visionTitle: "Vision - IA, robotique et impact multi-secteurs ✨",
    galleryTitle: "Galerie projets (visuels Wix) 🖼️",
    wixContentTitle: "Contenu recupere depuis Wix (données détaillees)",
    contactTitle: "Contact",
    contactText:
      "Ouverte en priorite aux opportunites de stage en IA, puis IA/Data, tous secteurs confondus en Ile-de-France.",
    langBtn: "EN",
    langFr: "FR",
    langEn: "EN",
    themeLight: "Mode clair",
    themeDark: "Mode sombre",
    trackData: "Positionnement: Data Scientist",
    trackAi: "Positionnement: AI Engineer",
    trackDe: "Positionnement: Data Engineer",
    soundOn: "Activer le son video",
    soundOff: "Couper le son video",
    cvDownload: "Telecharger le CV",
    letterAiDownload: "Lettre de motivation IA",
    letterNeutralDownload: "Lettre de motivation neutre",
    chatTitle: "Assistant IA GemiBot",
    chatOpen: "Ouvrir le chatbot",
    micStart: "Parler",
    micStop: "Stop",
    tonePro: "Ton Pro",
    toneFun: "Ton Fun",
    chatRecruiterOn: "Mode recruteur ON",
    chatRecruiterOff: "Mode recruteur OFF",
    typing: "GemiBot est en train d'ecrire...",
    wowBadge: "IA immersive active",
    presentationOn: "Mode presentation ON",
    presentationOff: "Mode presentation OFF",
    autoScrollOn: "Auto-scroll ON",
    autoScrollOff: "Auto-scroll OFF",
    presetInterview: "Preset Entretien",
    presetShowcase: "Preset Showcase",
    pitchTimer: "Timer pitch",
    startDemo: "Start demo script",
    oneClickDemo: "One-click recruiter demo",
    stopDemo: "Stop demo script",
    testVoice: "Tester la voix IA",
    voiceOn: "Voix IA ON",
    voiceOff: "Voix IA OFF",
    voiceStyleNatural: "Voix naturelle",
    voiceStyleInterview: "Voix posee entretien",
    voiceDebug: "Voix active",
    voiceFrSelect: "Voix FR",
    voiceAuto: "Auto (meilleure)",
    bgMusicOn: "Musique IA ON",
    bgMusicOff: "Musique IA OFF",
    projectFilter: "Filtrer les projets",
    galleryFilter: "Filtrer les demos",
    robotMoodLabel: "Humeur",
  },
  en: {
    nav: ["About", "Education", "Experience", "Projects", "Achievements", "Skills", "Vision", "Contact"],
    availability: "Open to AI internships (Apr-Sep 2026)",
    title: "Data & AI Engineer",
    subtitle:
      "Main role: Data & AI Engineer | Sem1 (Sep-Dec 2025) in MSc 1 Data Engineering, then Sem2 (Jan-Apr 2026) in MSc 1 Artificial Intelligence - International English.",
    hero: "I design AI/Data solutions with business impact: ETL/ELT, modeling, intelligent automation, KPI dashboards, backed by networking/systems and web development foundations.",
    ctaProjects: "View projects",
    ctaContact: "Contact me",
    aboutTitle: "About 🤖",
    about:
      "Passionate about AI and robotics, I combine technical rigor and creativity to turn data into actionable decisions.",
    educationTitle: "Education",
    experienceTitle: "Experience",
    projectsTitle: "Projects 🚀",
    achievementsTitle: "Measurable achievements 📊",
    skillsTitle: "Skills (by level)",
    visionTitle: "Vision - AI, robotics, and multi-sector impact ✨",
    galleryTitle: "Project gallery (Wix visuals) 🖼️",
    wixContentTitle: "Content recovered from Wix (detailed data)",
    contactTitle: "Contact",
    contactText:
      "Primarily open to AI internship opportunities, then AI/Data roles, across sectors in Ile-de-France.",
    langBtn: "FR",
    langFr: "FR",
    langEn: "EN",
    themeLight: "Light mode",
    themeDark: "Dark mode",
    trackData: "Positioning: Data Scientist",
    trackAi: "Positioning: AI Engineer",
    trackDe: "Positioning: Data Engineer",
    soundOn: "Enable video sound",
    soundOff: "Mute video sound",
    cvDownload: "Download CV",
    letterAiDownload: "AI cover letter",
    letterNeutralDownload: "Neutral cover letter",
    chatTitle: "GemiBot AI Assistant",
    chatOpen: "Open chatbot",
    micStart: "Speak",
    micStop: "Stop",
    tonePro: "Pro tone",
    toneFun: "Fun tone",
    chatRecruiterOn: "Recruiter mode ON",
    chatRecruiterOff: "Recruiter mode OFF",
    typing: "GemiBot is typing...",
    wowBadge: "Immersive AI mode on",
    presentationOn: "Presentation mode ON",
    presentationOff: "Presentation mode OFF",
    autoScrollOn: "Auto-scroll ON",
    autoScrollOff: "Auto-scroll OFF",
    presetInterview: "Interview preset",
    presetShowcase: "Showcase preset",
    pitchTimer: "Pitch timer",
    startDemo: "Start demo script",
    oneClickDemo: "One-click recruiter demo",
    stopDemo: "Stop demo script",
    testVoice: "Test AI voice",
    voiceOn: "AI voice ON",
    voiceOff: "AI voice OFF",
    voiceStyleNatural: "Natural voice",
    voiceStyleInterview: "Interview calm voice",
    voiceDebug: "Active voice",
    voiceFrSelect: "FR voice",
    voiceAuto: "Auto (best)",
    bgMusicOn: "AI music ON",
    bgMusicOff: "AI music OFF",
    projectFilter: "Filter projects",
    galleryFilter: "Filter demos",
    robotMoodLabel: "Mood",
  },
} as const;

const education = [
  { period: "09/2025 - 12/2025", fr: "MSc 1 Data Engineering (S1)", en: "MSc 1 Data Engineering (Sem1)", school: "ECE Paris" },
  { period: "01/2026 - 04/2026", fr: "MSc 1 Artificial Intelligence - International English (S2)", en: "MSc 1 Artificial Intelligence - International English (Sem2)", school: "ECE Paris" },
  { period: "09/2022 - 06/2025", fr: "Bachelor Ingenierie Data & IA", en: "Bachelor Data & AI Engineering", school: "ECE Paris" },
  { period: "09/2021 - 06/2022", fr: "Ingenierie generaliste", en: "General Engineering", school: "EPF Troyes" },
  { period: "Baccalaureat obtenu", fr: "Baccalaureat scientifique", en: "Scientific baccalaureate", school: "France" },
];

const experiences = [
  {
    period: "10/2024 - 09/2025",
    company: "ENGIE Solutions",
    roleFr: "Apprentie Ingenieure Outils & Methodes Data/IA",
    roleEn: "Data/AI Tools & Methods Engineering Apprentice",
    detailsFr: [
      "ETL/ELT sur donnees operationnelles (energie, interventions).",
      "Automatisation via Python, VBA, PowerShell et Power Automate.",
      "Dashboards de pilotage Power BI/Excel et structuration GED SharePoint.",
      "Lien constant entre analyse data et besoin metier concret.",
    ],
    detailsEn: [
      "ETL/ELT on operational data (energy, interventions).",
      "Automation with Python, VBA, PowerShell, and Power Automate.",
      "Power BI/Excel reporting dashboards and SharePoint document structuring.",
      "Strong link between data analysis and business needs.",
    ],
  },
  {
    period: "05/2024 - 11/2024",
    company: "Datasoft Consulting",
    roleFr: "Stagiaire consultante informatique",
    roleEn: "IT consulting intern",
    detailsFr: [
      "Conception et tests de modules GED en environnement TMA.",
      "Developpement Java et deploiement sur serveurs internes.",
      "Support sur digitalisation, outillage et suivi operationnel.",
    ],
    detailsEn: [
      "Designed and tested DMS modules in TMA environment.",
      "Java development and deployment on internal servers.",
      "Support on digitization, tooling, and operational follow-up.",
    ],
  },
  {
    period: "07/2023 - 05/2024",
    company: "Datasoft Consulting",
    roleFr: "Stagiaire ingenierie informatique",
    roleEn: "Software engineering intern",
    detailsFr: [
      "Conception applicative, base de donnees, configuration logicielle.",
      "Participation a la maintenance applicative et au suivi des tickets.",
    ],
    detailsEn: [
      "Application design, database work, and software configuration.",
      "Contributed to application maintenance and ticket tracking.",
    ],
  },
  {
    period: "12/2022 - 04/2023",
    company: "Association Cop1, Paris",
    roleFr: "Engagement citoyen (benevolat)",
    roleEn: "Community engagement volunteer",
    detailsFr: [
      "Accueil des beneficiaires, gestion de stocks et distribution de produits essentiels.",
      "Interaction quotidienne avec des publics majoritairement anglophones.",
      "Renforcement des competences humaines: empathie, organisation, communication.",
    ],
    detailsEn: [
      "Welcomed beneficiaries, managed stock, and distributed essential products.",
      "Daily interaction with mostly English-speaking audiences.",
      "Strengthened soft skills: empathy, organization, and communication.",
    ],
  },
];

const projects = [
  {
    title: "HealthPredict AI",
    fr: "Prediction d'incidents medicaux (NLP, OCR, ML/DL) et visualisations Streamlit.",
    en: "Medical incident prediction (NLP, OCR, ML/DL) with Streamlit visualizations.",
    tags: ["Python", "NLP", "OCR", "ML/DL"],
    link: "https://github.com/GemimaOndele/Healthpredict-AI",
    category: "ai" as ProjectCategory,
  },
  {
    title: "Fake News Detection",
    fr: "Application FastAPI + Streamlit avec BERT, XGBoost, Random Forest et boucle de reentrainement.",
    en: "FastAPI + Streamlit app with BERT, XGBoost, Random Forest, and retraining loop.",
    tags: ["FastAPI", "Transformers", "BERT", "MLOps"],
    link: "https://github.com/GemimaOndele/Projet-Integration-des-modeles-IA",
    category: "ai" as ProjectCategory,
  },
  {
    title: "Multi-sector Data Strategy",
    fr: "Cas orienté KPI et pilotage décisionnel applicable à l'energie, la sante, la finance et les services.",
    en: "KPI and decision-support data case applicable to energy, healthcare, finance, and services.",
    tags: ["KPI", "Analytics", "Data Strategy", "Business"],
    link: "https://github.com/GemimaOndele/",
    category: "data" as ProjectCategory,
  },
  {
    title: "CATIA V5 Mechanical Design Project",
    fr: "Modélisation et conception de pièces mécaniques sous CATIA V5 avec contraintes d'ingénierie et logique de validation.",
    en: "Mechanical part modeling and design in CATIA V5 with engineering constraints and validation logic.",
    tags: ["CATIA V5", "Mechanical Design", "Engineering"],
    link: "https://gemimaondelepourou.wixsite.com/portfolio-de-gemima/about-9",
    category: "data" as ProjectCategory,
  },
  {
    title: "Network & Systems Engineering Labs",
    fr: "Travaux reseaux/systems: couches OSI, protocoles Ethernet/IP, haute disponibilite, Linux et administration environnement.",
    en: "Network/systems labs: OSI layers, Ethernet/IP protocols, high availability, Linux and environment administration.",
    tags: ["Network", "Systems", "Linux", "Engineering"],
    link: "https://gemimaondelepourou.wixsite.com/portfolio-de-gemima/about-9",
    category: "cyber" as ProjectCategory,
  },
  {
    title: "Web Development Foundation",
    fr: "Projets web en HTML/CSS/JavaScript/PHP (site musee, mini-apps) issus du tronc commun ingenierie numerique.",
    en: "Web foundation projects in HTML/CSS/JavaScript/PHP (museum site, mini apps) from digital engineering core curriculum.",
    tags: ["Web Dev", "HTML/CSS", "JavaScript", "PHP"],
    link: "https://gemimaondelepourou.wixsite.com/portfolio-de-gemima/about-9",
    category: "web" as ProjectCategory,
  },
];

const achievements = [
  { kpi: "27", fr: "documents CV/lettres consolides", en: "CV/cover-letter documents consolidated" },
  { kpi: "28+", fr: "repositories GitHub publics structures", en: "public GitHub repositories structured" },
  { kpi: "3", fr: "axes techniques: IA, GenAI, Robotique", en: "technical axes: AI, GenAI, Robotics" },
  { kpi: "4+", fr: "secteurs cibles en Ile-de-France: energie, sante, finance, services", en: "target sectors in Ile-de-France: energy, healthcare, finance, services" },
];

const skillLevels = [
  { labelFr: "Avance", labelEn: "Advanced", items: ["Python", "Power BI", "ETL/ELT", "Data Cleaning", "NLP", "FastAPI", "Streamlit", "SharePoint GED"] },
  { labelFr: "Intermediaire", labelEn: "Intermediate", items: ["SQL", "TensorFlow", "scikit-learn", "Power Automate", "Power Apps", "Docker", "GitHub Actions", "Prompt Engineering", "RAG", "Linux"] },
  { labelFr: "Operationnel", labelEn: "Operational", items: ["Java", "VBA", "PowerShell", "JavaScript", "C", "R", "Jira", "Agile/Scrum", "GMAO", "Reseaux & Systemes", "Web Dev"] },
  { labelFr: "Background Ingenierie EPF", labelEn: "EPF Engineering Background", items: ["CATIA V5", "Citrix Workspace", "Matlab", "Simulink", "Blender", "Modelisation mecanique"] },
];

const wixVisuals = [
  {
    url: "https://static.wixstatic.com/media/adefea_60ba72e90c914555bc9eed04f01a9ca8~mv2.png/v1/fill/w_1074,h_504,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Projet%20site%20de%20mus%C3%A9e.png",
    titleFr: "Projet site web Musee",
    titleEn: "Museum website project",
    descFr:
      "Conception d'un site web musee (HTML/CSS/JavaScript/PHP) avec logique front-end et structuration des contenus.",
    descEn:
      "Museum website built with HTML/CSS/JavaScript/PHP, including front-end logic and content structuring.",
  },
  {
    url: "https://static.wixstatic.com/media/adefea_9fa60da9c29a447c9533c9cc8a97ed23~mv2.png/v1/fill/w_1074,h_504,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Projet%20sur%20la%20gestion%20de%20Stock%20en%20C.png",
    titleFr: "Gestion de stock en C",
    titleEn: "C stock management project",
    descFr:
      "Application en langage C pour gerer des flux de stock avec logique algorithmique et manipulations de structures de donnees.",
    descEn:
      "C-language application to manage stock flows using algorithmic logic and data-structure operations.",
  },
  {
    url: "https://static.wixstatic.com/media/adefea_d636579efe6c43eda4ee571f7b5dac0c~mv2.png/v1/crop/x_0,y_29,w_1825,h_856/fill/w_1074,h_504,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Projet%20Transverse%20Python.png",
    titleFr: "Projet transverse Python",
    titleEn: "Cross-functional Python project",
    descFr:
      "Projet Python multi-themes mobilisant analyse, modelisation et implementation autour de cas d'usage d'ingenierie numerique.",
    descEn:
      "Multi-theme Python project covering analysis, modeling, and implementation for digital engineering use cases.",
  },
];

const galleryVideos = [
  {
    src: "/greenit-demo-linkedin.mp4",
    titleFr: "GreenDC Audit Platform - video de demonstration",
    titleEn: "GreenDC Audit Platform - demo video",
    descFr:
      "Projet Green IT d'audit datacenter: calcul PUE/DCiE/CO2, recommandations IA explicables, simulation avant/apres et objectif de reduction de 25% du CO2.",
    descEn:
      "Green IT data center audit project: PUE/DCiE/CO2 metrics, explainable AI recommendations, before/after simulation, and a 25% CO2 reduction target.",
    github: "https://github.com/GemimaOndele/Green-it-AI-audit-platform",
    linkedin:
      "https://www.linkedin.com/posts/g%C3%A9mima-ondele-pourou-1515251a7_greenit-sustainableenergy-ai-activity-7446980264335036416-wciW?utm_source=share&utm_medium=member_desktop&rcm=ACoAADBPMI0BHfxYtY5d7Mhi3YegOZzcBIkXEaE",
    category: "ai" as ProjectCategory,
  },
  {
    src: "/cyber-attack-simulation-compressed.mp4",
    titleFr: "2ASICYA - video de demonstration",
    titleEn: "2ASICYA - demo video",
    descFr:
      "Recap video d'un projet MSc de cybersécurité Smart Grid: simulation pandapower des scénarios S1-S5, analyse de risques cyber-physiques, dashboard analytique et visualisation 3D temps réel de type digital twin.",
    descEn:
      "Video recap of an MSc Smart Grid cybersecurity project: pandapower simulation of S1-S5 scenarios, cyber-physical risk analysis, analytics dashboard, and real-time 3D digital-twin style visualization.",
    github: "https://github.com/Dauemi/inverter-cyberattack-simulation",
    linkedin:
      "https://www.linkedin.com/posts/g%C3%A9mima-ondele-pourou-1515251a7_cybersecurity-smartgrid-powersystems-activity-7450617998295535616-onLg?utm_source=share&utm_medium=member_desktop&rcm=ACoAADBPMI0BHfxYtY5d7Mhi3YegOZzcBIkXEaE",
    category: "cyber" as ProjectCategory,
  },
  {
    src: "/Projet%20Devops%20d%C3%A9mo%20vid%C3%A9o.mp4",
    titleFr: "Projet DevOps - video de demonstration",
    titleEn: "DevOps project - demo video",
    descFr:
      "Demonstration d'une plateforme de tickets IT construite en approche DevOps (Docker, Docker Compose, Jenkins, CI/CD), avec une architecture complete backend/frontend/infrastructure et des roles employes, techniciens et admins.",
    descEn:
      "Demo of an IT ticketing platform built with a full DevOps approach (Docker, Docker Compose, Jenkins, CI/CD), including a complete backend/frontend/infrastructure architecture and employee, technician, and admin roles.",
    github: "https://github.com/GemimaOndele/Projet-DEVOPS",
    category: "devops" as ProjectCategory,
  },
] as const;

const wixPages = [
  {
    title: "Accueil",
    url: "https://gemimaondelepourou.wixsite.com/portfolio-de-gemima",
    fr: "Message de bienvenue, présentation de personnalité, invitation à explorer le portfolio.",
    en: "Welcome message, personality introduction, and invitation to explore the portfolio.",
    detailsFr: [
      "Bloc BIENVENUE avec positionnement personnel.",
      "Promesse de découverte de plusieurs facettes professionnelles.",
    ],
    detailsEn: [
      "BIENVENUE block with personal positioning.",
      "Promise to discover several professional facets.",
    ],
  },
  {
    title: "Presentation",
    url: "https://gemimaondelepourou.wixsite.com/portfolio-de-gemima/blank",
    fr: "Section Qui suis-je ? avec citation d'Edison et positionnement personnel.",
    en: "Who am I section with Edison quote and personal positioning.",
    detailsFr: [
      "Citation sur l'itération: 10 000 solutions testées.",
      "Mise en avant curiosité, détermination et capacité à proposer des solutions.",
    ],
    detailsEn: [
      "Iteration quote: 10,000 tested solutions.",
      "Highlights curiosity, determination, and solution mindset.",
    ],
  },
  {
    title: "Parcours de formation",
    url: "https://gemimaondelepourou.wixsite.com/portfolio-de-gemima/about-9",
    fr: "Parcours académique détaillé, projets scolaires (C, web, réseau, Python, CATIA, Matlab).",
    en: "Detailed academic path and school projects (C, web, networking, Python, CATIA, Matlab).",
    detailsFr: [
      "Formations: ECE, EPF, bac scientifique, certification Design Thinking.",
      "Projets: gestion de stock en C, site web musée, OSI/protocoles, haute disponibilité.",
      "Mention explicite CATIA V5, Matlab/Simulink et projet Maglev.",
    ],
    detailsEn: [
      "Education: ECE, EPF, scientific baccalaureate, Design Thinking certification.",
      "Projects: C stock management, museum website, OSI/protocols, high availability.",
      "Explicit CATIA V5, Matlab/Simulink, and Maglev project mention.",
    ],
  },
  {
    title: "Stage et experiences",
    url: "https://gemimaondelepourou.wixsite.com/portfolio-de-gemima/stage-et-exp%C3%A9riences",
    fr: "Missions Datasoft Consulting (TMA, Java, CI/CD, serveurs, GED) et engagement citoyen Cop1.",
    en: "Datasoft Consulting missions (TMA, Java, CI/CD, servers, DMS) and Cop1 community engagement.",
    detailsFr: [
      "Outils mentionnés: Jenkins, Ansible, Jira, JUnit, ELK, JBoss, Tomcat, PostgreSQL.",
      "Responsabilités: développement, base de données, déploiement et support.",
      "Expérience associative Cop1: logistique, relationnel, communication anglophone.",
    ],
    detailsEn: [
      "Mentioned tools: Jenkins, Ansible, Jira, JUnit, ELK, JBoss, Tomcat, PostgreSQL.",
      "Responsibilities: development, database, deployment, and support.",
      "Cop1 volunteering: logistics, communication, and English-speaking support.",
    ],
  },
  {
    title: "Competences",
    url: "https://gemimaondelepourou.wixsite.com/portfolio-de-gemima/general-5",
    fr: "Compétences outils/langages + soft skills développées via stage, associatif et sport.",
    en: "Tools/language skills plus soft skills developed through internship, volunteering, and sports.",
    detailsFr: [
      "Niveaux déclarés par outil/langage (office, dev, data, cloud, réseau).",
      "Compétences transverses: leadership, gestion d'équipe, communication, résilience.",
    ],
    detailsEn: [
      "Self-declared levels by tool/language (office, dev, data, cloud, networking).",
      "Transversal skills: leadership, team management, communication, resilience.",
    ],
  },
  {
    title: "Centres d'interets",
    url: "https://gemimaondelepourou.wixsite.com/portfolio-de-gemima/projects-6-1",
    fr: "Intérêts personnels: sport, programmation, entrepreneuriat, mode, voyages, jeux.",
    en: "Personal interests: sports, programming, entrepreneurship, fashion, travel, gaming.",
    detailsFr: [
      "Liste complète d'intérêts montrant polyvalence et créativité.",
      "Dimension entrepreneuriale explicitement mentionnée.",
    ],
    detailsEn: [
      "Full interest list showing versatility and creativity.",
      "Explicit entrepreneurial mindset mention.",
    ],
  },
  {
    title: "Veilles technologiques",
    url: "https://gemimaondelepourou.wixsite.com/portfolio-de-gemima/general-clean",
    fr: "Veille IA/métaverse, robotique, spatial (SpaceX), et réflexion éthique sur l'automatisation.",
    en: "AI/metaverse monitoring, robotics, space tech (SpaceX), and ethical automation perspective.",
    detailsFr: [
      "Thèmes: IA, VR/AR, blockchain, tourisme spatial, Ariane 5.",
      "Réflexion sur impacts emploi/automatisation et responsabilité technologique.",
    ],
    detailsEn: [
      "Themes: AI, VR/AR, blockchain, space tourism, Ariane 5.",
      "Reflection on jobs/automation impact and responsible technology.",
    ],
  },
  {
    title: "Projets futurs",
    url: "https://gemimaondelepourou.wixsite.com/portfolio-de-gemima/projects-6",
    fr: "Vision long terme: data, IA, cybersécurité, aéronautique et création d'entreprises tech.",
    en: "Long-term vision: data, AI, cybersecurity, and building tech companies across sectors.",
    detailsFr: [
      "Objectif long terme: carrière tech + création d'entreprises.",
      "Aéronautique clairement citée comme secteur visé.",
    ],
    detailsEn: [
      "Long-term goal: tech career plus entrepreneurship.",
      "Aerospace explicitly listed as a target sector.",
    ],
  },
];

const trackBlurb = {
  "data-scientist": {
    fr: ["Focus modelisation statistique", "Experimentation et validation", "KPI business et recommandations"],
    en: ["Focus on statistical modeling", "Experimentation and validation", "Business KPIs and recommendations"],
  },
  "ai-engineer": {
    fr: ["Focus industrialisation IA", "API et pipelines intelligents", "MLOps et automatisation robuste"],
    en: ["Focus on AI productionization", "APIs and intelligent pipelines", "MLOps and robust automation"],
  },
  "data-engineer": {
    fr: ["Focus pipelines data & qualite", "Architecture, ingestion, transformation", "Performance, fiabilite, gouvernance data"],
    en: ["Focus on data pipelines & quality", "Architecture, ingestion, transformation", "Performance, reliability, data governance"],
  },
} as const;

const interviewEvidence = {
  fr: [
    "Experience terrain: ENGIE Solutions + Datasoft Consulting.",
    "Execution technique: ETL/ELT, automation Python/VBA/PowerShell, dashboards KPI.",
    "Polyvalence: AI Engineering, Data Engineering, Data Science.",
    "Ouverture multi-secteurs en Ile-de-France.",
  ],
  en: [
    "Field experience: ENGIE Solutions + Datasoft Consulting.",
    "Technical execution: ETL/ELT, Python/VBA/PowerShell automation, KPI dashboards.",
    "Versatility: AI Engineering, Data Engineering, Data Science.",
    "Open to multi-sector opportunities in Ile-de-France.",
  ],
} as const;

export default function Home() {
  const [lang, setLang] = useState<Lang>("fr");
  const [theme, setTheme] = useState<Theme>("dark");
  const [track] = useState<Track>("ai-engineer");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>("standard");
  const [assistantTone, setAssistantTone] = useState<AssistantTone>("pro");
  const [micListening, setMicListening] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [botSpeaking, setBotSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const voiceStyle: VoiceStyle = "interview";
  const [speechReady, setSpeechReady] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [manualFrVoiceUri, setManualFrVoiceUri] = useState("auto");
  const [preset] = useState<Preset>("showcase");
  const [actionEmojis, setActionEmojis] = useState<ActionEmoji[]>([]);
  const [robotMood, setRobotMood] = useState("🙂");
  const [ambientMusicOn, setAmbientMusicOn] = useState(false);
  const [selectedProjectCategory, setSelectedProjectCategory] = useState<ProjectCategory>("all");
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<ProjectCategory>("all");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>(() => {
    return [
      {
        role: "bot",
        text:
          "Salut, je suis GemiBot 🤖✨ Je peux te présenter le profil de Gemima en mode Data Scientist ou AI Engineer.",
      },
    ];
  });
  const recognitionRef = useRef<SpeechRecognizer | null>(null);
  const orbitLargeRef = useRef<HTMLDivElement>(null);
  const orbitSmallRef = useRef<HTMLDivElement>(null);
  const ambientCtxRef = useRef<AudioContext | null>(null);
  const ambientNodesRef = useRef<{
    oscA: OscillatorNode;
    oscB: OscillatorNode;
    lfo: OscillatorNode;
    lfoGain: GainNode;
    mix: GainNode;
  } | null>(null);
  const emojiSeqRef = useRef(1);
  const t = copy[lang];
  const isLight = theme === "light";
  const isInterview = false;
  const sessionKey = "gemibot-chat-history-v1";
  const toneStorageKey = "gemibot-tone-v1";
  const frVoiceStorageKey = "gemibot-fr-voice-v1";
  const frVoiceChoices = useMemo(
    () => availableVoices.filter((voice) => voice.lang.toLowerCase().startsWith("fr")),
    [availableVoices]
  );
  const card = useMemo(
    () =>
      preset === "interview"
        ? isLight
          ? "border-slate-300 bg-slate-100/95 text-slate-700"
          : "border-zinc-700 bg-zinc-900/85 text-zinc-100"
        : isLight
          ? "border-slate-300 bg-slate-50/88 text-slate-700"
          : "border-white/10 bg-black/35 text-zinc-100",
    [isLight, preset]
  );
  const categoryLabels = {
    fr: {
      all: "Tous",
      ai: "IA",
      devops: "DevOps",
      cyber: "Cybersécurité",
      web: "Web",
      data: "Data",
    },
    en: {
      all: "All",
      ai: "AI",
      devops: "DevOps",
      cyber: "Cybersecurity",
      web: "Web",
      data: "Data",
    },
  } as const;
  const projectCategoryOptions = useMemo(
    () => ["all", ...Array.from(new Set(projects.map((p) => p.category)))] as ProjectCategory[],
    []
  );
  const galleryCategoryOptions = useMemo(
    () => ["all", ...Array.from(new Set(galleryVideos.map((p) => p.category)))] as ProjectCategory[],
    []
  );
  const filteredProjects = useMemo(
    () =>
      selectedProjectCategory === "all"
        ? projects
        : projects.filter((project) => project.category === selectedProjectCategory),
    [selectedProjectCategory]
  );
  const filteredGalleryVideos = useMemo(
    () =>
      selectedGalleryCategory === "all"
        ? galleryVideos
        : galleryVideos.filter((item) => item.category === selectedGalleryCategory),
    [selectedGalleryCategory]
  );
  const launchEmojiBurst = (emojiSet: string[]) => {
    const burst: ActionEmoji[] = Array.from({ length: 8 }).map((_, i) => ({
      id: emojiSeqRef.current++,
      emoji: emojiSet[i % emojiSet.length],
      left: 10 + Math.random() * 80,
      delay: i * 0.06,
    }));
    setActionEmojis((prev) => [...prev, ...burst]);
    window.setTimeout(() => {
      setActionEmojis((prev) => prev.filter((e) => !burst.some((b) => b.id === e.id)));
    }, 1700);
  };
  const inferRobotMood = (text: string) => {
    const q = text.toLowerCase();
    if (/(blague|joke|funny|lol|haha)/.test(q)) return "😄";
    if (/(merci|thanks|great|bravo|super)/.test(q)) return "😊";
    if (/(stage|internship|job|projet|project)/.test(q)) return "🤓";
    if (/(robot|ia|ai|cyber|devops)/.test(q)) return "🤖";
    return "🙂";
  };
  const startAmbientMusic = async () => {
    if (typeof window === "undefined") return;
    if (!ambientCtxRef.current) {
      ambientCtxRef.current = new window.AudioContext();
    }
    const ctx = ambientCtxRef.current;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    if (!ambientNodesRef.current) {
      const oscA = ctx.createOscillator();
      const oscB = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const mix = ctx.createGain();

      oscA.type = "sine";
      oscA.frequency.value = 96;
      oscB.type = "triangle";
      oscB.frequency.value = 144;
      lfo.type = "sine";
      lfo.frequency.value = 0.18;
      lfoGain.gain.value = 16;
      mix.gain.value = 0.018;

      lfo.connect(lfoGain);
      lfoGain.connect(oscA.frequency);
      lfoGain.connect(oscB.frequency);
      oscA.connect(mix);
      oscB.connect(mix);
      mix.connect(ctx.destination);

      oscA.start();
      oscB.start();
      lfo.start();
      ambientNodesRef.current = { oscA, oscB, lfo, lfoGain, mix };
    }
  };
  const stopAmbientMusic = async () => {
    const nodes = ambientNodesRef.current;
    if (!nodes) return;
    const { oscA, oscB, lfo, lfoGain, mix } = nodes;
    try {
      oscA.stop();
      oscB.stop();
      lfo.stop();
    } catch {
      // no-op when already stopped
    }
    oscA.disconnect();
    oscB.disconnect();
    lfo.disconnect();
    lfoGain.disconnect();
    mix.disconnect();
    ambientNodesRef.current = null;
    if (ambientCtxRef.current && ambientCtxRef.current.state !== "closed") {
      await ambientCtxRef.current.suspend();
    }
  };

  const pickOne = (options: string[]) => options[Math.floor(Math.random() * options.length)];

  const detectTopic = (text: string) => {
    const q = text.toLowerCase();
    if (q.includes("stage") || q.includes("internship")) return "stage";
    if (q.includes("robot") || q.includes("robotique")) return "robotics";
    if (q.includes("formation") || q.includes("education")) return "education";
    if (q.includes("experience") || q.includes("expérience")) return "experience";
    if (q.includes("cv") || q.includes("resume")) return "cv";
    if (q.includes("competence") || q.includes("skill")) return "skills";
    if (q.includes("projet") || q.includes("project")) return "projects";
    return "general";
  };

  const generateAssistantReply = (input: string, recentHistory: ChatMsg[]) => {
    const q = input.toLowerCase();
    const lastUserMessages = recentHistory
      .filter((m) => m.role === "user")
      .slice(-5)
      .map((m) => m.text);
    const previousTopic = lastUserMessages.length > 0
      ? detectTopic(lastUserMessages[lastUserMessages.length - 1])
      : "general";
    const isFollowUp =
      /\bet\b|\band\b|encore|more|continue|details|détails|precise|précise|et aussi|also/.test(q);
    const recentTopics = Array.from(
      new Set(lastUserMessages.slice(-5).map((msg) => detectTopic(msg)))
    );
    const contextHint =
      recentTopics.length >= 2
        ? lang === "fr"
          ? `Contexte recent: ${recentTopics.join(", ")}. `
          : `Recent context: ${recentTopics.join(", ")}. `
        : "";

    if (isFollowUp && previousTopic === "projects") {
      return lang === "fr"
        ? "Suite sur les projets: HealthPredict AI, Fake News NLP et Fraude Bancaire montrent mon execution de bout en bout (data, modelisation, API et visualisation)."
        : "Project follow-up: HealthPredict AI, Fake News NLP, and Banking Fraud show my end-to-end execution (data, modeling, API, and visualization).";
    }
    if (isFollowUp && previousTopic === "skills") {
      return lang === "fr"
        ? "Sur les competences, mes points forts sont Python, NLP, ETL/ELT, FastAPI, Streamlit, Docker et GitHub Actions, avec un axe IA appliquee."
        : "On skills, my strongest areas are Python, NLP, ETL/ELT, FastAPI, Streamlit, Docker, and GitHub Actions, with an applied AI focus.";
    }
    if (isFollowUp && previousTopic === "experience") {
      return lang === "fr"
        ? "Pour completer l'experience: ENGIE pour l'industrialisation data, Datasoft Consulting pour le developpement applicatif, et Cop1 pour les soft skills terrain."
        : "To complete experience: ENGIE for data industrialization, Datasoft Consulting for application development, and Cop1 for strong field soft skills.";
    }

    if (q.includes("bonjour") || q.includes("hello") || q.includes("salut")) {
      return lang === "fr"
        ? pickOne([
          `${contextHint}Bonjour 👋 Ravie d'echanger avec toi. Je peux te parler de mon profil IA, mes projets et mes experiences.`,
          `${contextHint}Salut ✨ Je suis GemiBot. Dis-moi ce que tu veux explorer: competences, projets, stage ou parcours.`,
          `${contextHint}Hello ! Je suis prete pour une conversation complete sur mon profil Data & IA.`,
        ])
        : pickOne([
          `${contextHint}Hello 👋 Happy to chat with you. I can talk about my AI profile, projects, and experiences.`,
          `${contextHint}Hi ✨ I am GemiBot. Tell me what you want to explore: skills, projects, internship, or education.`,
          `${contextHint}Hey! I am ready for a full conversation about my Data & AI profile.`,
        ]);
    }
    if (q.includes("stage") || q.includes("internship")) {
      return lang === "fr"
        ? pickOne([
          "Je recherche prioritairement un stage en IA a partir d'avril 2026, en Ile-de-France.",
          "Objectif principal: stage IA (avril-septembre 2026), avec ouverture multi-secteurs.",
          "Je cible un stage IA avec des sujets concrets: modeles, automatisation et impact metier.",
        ])
        : pickOne([
          "I am primarily looking for an AI internship starting April 2026 in Ile-de-France.",
          "Main goal: AI internship (Apr-Sep 2026), with multi-sector openness.",
          "I target an AI internship with concrete topics: models, automation, and business impact.",
        ]);
    }
    if (q.includes("robot") || q.includes("robotique")) {
      return lang === "fr"
        ? "La robotique est au coeur de ma vision: IA embarquee, automatisation intelligente et systemes autonomes."
        : "Robotics is central to my vision: embedded AI, intelligent automation, and autonomous systems.";
    }
    if (q.includes("cop1")) {
      return lang === "fr"
        ? "Chez Cop1, j'ai gere l'accueil, les stocks et la distribution. Cette experience a renforce mon sens de l'organisation et de l'humain."
        : "At Cop1, I handled reception, stock management, and distribution. This strengthened my organization and human-oriented skills.";
    }
    if (q.includes("formation") || q.includes("education")) {
      return lang === "fr"
        ? "Mon parcours: MSc 1 Data Engineering (sept-dec 2025), puis MSc 1 Artificial Intelligence - International English (janv-avr 2026), Bachelor Data & IA, et baccalaureat scientifique obtenu."
        : "My path: MSc 1 Data Engineering (Sep-Dec 2025), then MSc 1 Artificial Intelligence - International English (Jan-Apr 2026), Bachelor Data & AI, and a completed scientific baccalaureate.";
    }
    if (q.includes("experience") || q.includes("expérience")) {
      return lang === "fr"
        ? "Mes experiences principales sont ENGIE Solutions et Datasoft Consulting, avec ETL/ELT, automatisation et dashboards KPI."
        : "My key experiences are at ENGIE Solutions and Datasoft Consulting, with ETL/ELT, automation, and KPI dashboards.";
    }
    if (q.includes("cv") || q.includes("resume")) {
      return lang === "fr"
        ? "Tu peux telecharger mon CV et mes lettres directement dans la section Contact, en bas de page."
        : "You can download my CV and cover letters directly in the Contact section at the bottom of the page.";
    }
    if (q.includes("blague") || q.includes("joke") || q.includes("funny")) {
      return lang === "fr"
        ? pickOne([
          "Blague IA: pourquoi le modele etait zen ? Parce qu'il etait bien regularise 😄",
          "Mode fun active 😎 Je peux etre serieuse sur le fond, mais je garde toujours le sourire.",
          "Blague data: je ne fais jamais de drama, je fais du data-cleaning 😄",
        ])
        : pickOne([
          "AI joke: why was the model calm? Because it was well-regularized 😄",
          "Fun mode on 😎 I stay serious on outcomes, but with a smile.",
          "Data joke: I do not do drama, I do data cleaning 😄",
        ]);
    }
    const baseReply = lang === "fr"
      ? pickOne([
        "Je peux te repondre sur mon parcours IA, mes projets, mes competences, mes experiences et mon objectif de stage.",
        "Pose-moi une question precise sur l'IA, la robotique, les projets ou le stage et je te reponds clairement.",
        "Dis-moi ce que tu veux approfondir et je te donne une reponse detaillee.",
      ])
      : pickOne([
        "I can answer about my AI journey, projects, skills, experiences, and internship goal.",
        "Ask me a specific question about AI, robotics, projects, or internship and I will answer clearly.",
        "Tell me what you want to explore and I will provide a detailed answer.",
      ]);

    if (assistantTone === "fun") {
      return lang === "fr"
        ? `${contextHint}${baseReply} Et promis, je garde aussi une touche fun 😄`
        : `${contextHint}${baseReply} And yes, I keep it fun too 😄`;
    }
    return `${contextHint}${baseReply}`;
  };

  const processUserQuestion = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;
    setRobotMood(inferRobotMood(text));
    const recentContext = chatMessages.slice(-10);
    setChatMessages((prev) => [...prev, { role: "user", text }]);
    setIsTyping(true);
    const answer = generateAssistantReply(text, recentContext);
    window.setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: "bot", text: answer }]);
      setRobotMood(inferRobotMood(answer));
      setIsTyping(false);
      speakText(answer);
    }, 450);
  };

  const handleVoicePrompt = (spokenText: string) => {
    processUserQuestion(spokenText);
  };

  const startVoiceInput = () => {
    if (typeof window === "undefined") return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = lang === "fr" ? "fr-FR" : "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: SpeechRecognitionResultLike) => {
      const transcript = event?.results?.[0]?.[0]?.transcript ?? "";
      handleVoicePrompt(transcript);
      launchEmojiBurst(["🎤", "🗣️", "✨"]);
    };
    recognition.onerror = () => setMicListening(false);
    recognition.onend = () => setMicListening(false);
    recognitionRef.current = recognition;
    setMicListening(true);
    recognition.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setMicListening(false);
  };

  const pickVoiceForLang = (voices: SpeechSynthesisVoice[], targetLang: Lang, forcedFrVoiceUri?: string) => {
    const baseCode = targetLang === "fr" ? "fr" : "en";
    const strictLangVoices = voices.filter((v) => {
      const normalizedLang = v.lang.toLowerCase().replace("_", "-");
      return normalizedLang === baseCode || normalizedLang.startsWith(`${baseCode}-`);
    });
    if (targetLang === "fr" && forcedFrVoiceUri && forcedFrVoiceUri !== "auto") {
      const forcedVoice = strictLangVoices.find((voice) => voice.voiceURI === forcedFrVoiceUri);
      if (forcedVoice) return forcedVoice;
    }
    const namedLangVoices = voices.filter((v) => {
      const signature = `${v.name} ${v.lang}`;
      return baseCode === "fr"
        ? /french|francais|français|fr-fr|fr_ca/i.test(signature)
        : /english|anglais|en-us|en-gb/i.test(signature);
    });
    const uniqueCandidates = Array.from(
      new Map([...strictLangVoices, ...namedLangVoices].map((voice) => [`${voice.name}|${voice.lang}`, voice])).values()
    );
    const scoreVoice = (voice: SpeechSynthesisVoice) => {
      const id = `${voice.name} ${voice.lang}`.toLowerCase();
      let score = 0;
      if (/microsoft|google|siri|natural|neural|premium/.test(id)) score += 100;
      if (targetLang === "fr" && /hortense|denise|audrey|amelie|france|fr-fr|paul/.test(id)) score += 60;
      if (targetLang === "en" && /zira|aria|jenny|en-us|en-gb|samantha/.test(id)) score += 60;
      if (/compact|legacy|espeak|old/.test(id)) score -= 80;
      return score;
    };
    return uniqueCandidates.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
  };

  const speakText = (text: string, retryCount = 0) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!speechReady || voices.length === 0) {
      // Some browsers load voices asynchronously on first interaction.
      if (retryCount >= 4) return;
      window.setTimeout(() => {
        const lateVoices = window.speechSynthesis.getVoices();
        if (lateVoices.length > 0) {
          setSpeechReady(true);
          speakText(text, retryCount + 1);
        }
      }, 180);
      return;
    }
    const normalized = text
      .replace(/\bDatasift\b/gi, "Datasoft")
      .replace(/\bData Soft\b/gi, "Datasoft")
      .replace(/\bDatasoft\b/gi, "Datasoft")
      .replace(/\bDatassoft\b/gi, "Datasoft")
      .replace(/\bDatazoft\b/gi, "Datasoft")
      .replace(/\bIA\b/g, "I A")
      .replace(/\bAI\b/g, "A I")
      .replace(/\bETL\/ELT\b/g, "E T L, E L T")
      .replace(/\bKPI\b/g, "K P I")
      .replace(/\bNLP\b/g, "N L P")
      .replace(/\bMLOps\b/g, "M L Ops");
    const pausedText =
      lang === "fr"
        ? normalized
          .replace(/([,;:])/g, "$1 ... ")
          .replace(/([.!?])\s+/g, "$1 ... ")
        : normalized;
    const spokenText =
      lang === "fr"
        ? pausedText
          .replace(/\bj'ai\b/gi, "j ai")
          .replace(/\bplus\b/gi, "plu")
        : pausedText;
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = lang === "fr" ? "fr-FR" : "en-US";
    const interviewVoice = voiceStyle === "interview";
    utterance.rate = lang === "fr" ? (interviewVoice ? 0.92 : 0.98) : (interviewVoice ? 0.94 : 1);
    utterance.pitch = lang === "fr" ? 1 : (interviewVoice ? 0.98 : 1.03);
    utterance.volume = 1;
    const preferred = pickVoiceForLang(voices, lang, manualFrVoiceUri);
    if (preferred) {
      utterance.voice = preferred;
      utterance.lang = preferred.lang;
    }
    utterance.onstart = () => {
      setBotSpeaking(true);
    };
    utterance.onend = () => {
      setBotSpeaking(false);
    };
    utterance.onerror = () => {
      setBotSpeaking(false);
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const askBot = (
    topic:
      | "track"
      | "robotics"
      | "sectors"
      | "catia"
      | "recruiter-why"
      | "recruiter-impact"
      | "recruiter-team"
  ) => {
    const prompts = {
      track:
        lang === "fr"
          ? "Quel est son positionnement principal ?"
          : "What is her main positioning?",
      robotics:
        lang === "fr"
          ? "Quelle place prend la robotique dans son profil ?"
          : "How does robotics fit her profile?",
      sectors:
        lang === "fr"
          ? "Sur quels secteurs est-elle ouverte en Ile-de-France ?"
          : "Which sectors is she open to in Ile-de-France?",
      catia:
        lang === "fr"
          ? "Parle-moi du projet CATIA V5."
          : "Tell me about the CATIA V5 project.",
      "recruiter-why":
        lang === "fr"
          ? "Pourquoi la recruter maintenant ?"
          : "Why hire her now?",
      "recruiter-impact":
        lang === "fr"
          ? "Quel impact business peut-elle produire rapidement ?"
          : "What business impact can she deliver quickly?",
      "recruiter-team":
        lang === "fr"
          ? "Comment s'intègre-t-elle dans une équipe Data/IA ?"
          : "How does she integrate in a Data/AI team?",
    };
    const answers = {
      track:
        lang === "fr"
          ? "Son rôle principal est Data & AI Engineer, avec trois postures complémentaires: Data Scientist, AI Engineer et Data Engineer."
          : "Her main role is Data & AI Engineer, with three complementary positions: Data Scientist, AI Engineer, and Data Engineer.",
      robotics:
        lang === "fr"
          ? "La robotique est au coeur de sa vision IA: systèmes intelligents, automatisation, et IA embarquée."
          : "Robotics is central to her AI vision: intelligent systems, automation, and embedded AI.",
      sectors:
        lang === "fr"
          ? "Elle est ouverte a plusieurs secteurs: energie, sante, finance, services, industrie et innovation IA en Ile-de-France."
          : "She is open to multiple sectors: energy, healthcare, finance, services, industry, and AI innovation in Ile-de-France.",
      catia:
        lang === "fr"
          ? "Projet CATIA V5: modélisation de pièces mécaniques avec contraintes d'ingénierie, dans un parcours orienté IA + ingénierie."
          : "CATIA V5 project: mechanical part modeling with engineering constraints in an AI + engineering path.",
      "recruiter-why":
        lang === "fr"
            ? "Parce qu'elle combine déjà expérience terrain (ENGIE, Datasoft Consulting), bagage IA/Data actuel, et forte capacité d'exécution sur des sujets concrets."
            : "Because she combines real field experience (ENGIE, Datasoft Consulting), current AI/Data training, and strong execution on concrete use cases.",
      "recruiter-impact":
        lang === "fr"
          ? "Court terme: automatiser des flux data, fiabiliser des KPI, améliorer le pilotage opérationnel via dashboards et analyses prédictives."
          : "Short-term: automate data flows, improve KPI reliability, and strengthen operational steering with dashboards and predictive analytics.",
      "recruiter-team":
        lang === "fr"
          ? "Elle est habituée aux environnements collaboratifs (TMA, GED, projets académiques), communique bien et relie technique et enjeux métier."
          : "She is used to collaborative environments (TMA, DMS, academic projects), communicates clearly, and bridges technical and business needs.",
    };

    setRobotMood("🤖");
    setChatMessages((prev) => [...prev, { role: "user", text: prompts[topic] }]);
    launchEmojiBurst(["💬", "🤖"]);
    setIsTyping(true);
    window.setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: "bot", text: answers[topic] }]);
      setRobotMood(inferRobotMood(answers[topic]));
      setIsTyping(false);
      speakText(answers[topic]);
    }, 900);
  };

  useEffect(() => {
    const stored = sessionStorage.getItem(sessionKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as ChatMsg[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        window.setTimeout(() => setChatMessages(parsed), 0);
      }
    } catch {
      // Ignore malformed storage entries.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTone = window.localStorage.getItem(toneStorageKey);
    if (storedTone === "pro" || storedTone === "fun") {
      window.setTimeout(() => setAssistantTone(storedTone), 0);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(toneStorageKey, assistantTone);
  }, [assistantTone]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedFrVoice = window.localStorage.getItem(frVoiceStorageKey);
    if (storedFrVoice) {
      window.setTimeout(() => setManualFrVoiceUri(storedFrVoice), 0);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(frVoiceStorageKey, manualFrVoiceUri);
  }, [manualFrVoiceUri]);

  useEffect(() => {
    sessionStorage.setItem(sessionKey, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    if (orbitLargeRef.current) {
      orbitLargeRef.current.style.transform = `translate(${cx - 80}px, ${cy - 80}px)`;
    }
    if (orbitSmallRef.current) {
      orbitSmallRef.current.style.transform = `translate(${cx - 48}px, ${cy - 48}px)`;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const markReady = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        setSpeechReady(true);
      }
    };
    markReady();
    window.speechSynthesis.addEventListener("voiceschanged", markReady);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", markReady);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    // Clear any utterance queued in previous language.
    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      window.setTimeout(() => setMicListening(false), 0);
    }
  }, [lang]);
  useEffect(() => {
    if (ambientMusicOn) {
      startAmbientMusic();
    } else {
      stopAmbientMusic();
    }
  }, [ambientMusicOn]);
  useEffect(() => {
    return () => {
      stopAmbientMusic();
    };
  }, []);

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${isLight ? "bg-slate-100" : "bg-[#05070d]"} transition-colors duration-500`}
      onMouseMove={(e) => {
        if (window.innerWidth < 1024) return;
        const x = e.clientX;
        const y = e.clientY;
        if (orbitLargeRef.current) {
          orbitLargeRef.current.style.transform = `translate(${x - 80}px, ${y - 80}px)`;
        }
        if (orbitSmallRef.current) {
          orbitSmallRef.current.style.transform = `translate(${x - 48}px, ${y - 48}px)`;
        }
      }}
    >
      <video
        className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/bg-ai.mp4" type="video/mp4" />
      </video>
      <div className={`fixed inset-0 z-[1] ${isLight ? "bg-slate-100/84" : "bg-[#05070d]/80"}`} />
      {preset === "showcase" ? (
        <div className="pointer-events-none fixed inset-0 z-[1]">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={`particle-${i}`} className={`ai-particle ai-particle-${i + 1}`} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={`agent-${i}`}
              className={`ai-agent ai-agent-${i + 1}`}
              aria-hidden="true"
            >
              {i % 3 === 0 ? "🤖" : i % 3 === 1 ? "🧠" : "⚙️"}
            </span>
          ))}
          <div className="robot-stage">
            <div className="robot-full robot-left">
              <div className={`robot-actor ${botSpeaking || isTyping || micListening ? "robot-speaking" : ""}`}>
                <Image
                  src="/agent-full.svg"
                  alt="Robot IA entier gauche"
                  width={330}
                  height={487}
                  className="robot-body robot-walk"
                  loading="eager"
                  priority
                />
                <span className="robot-mouth" aria-hidden="true" />
                <span className="robot-expression" aria-hidden="true">{robotMood}</span>
              </div>
              <p className="robot-bubble">
                {lang === "fr" ? `Bonjour, je suis GemiBot ${robotMood}` : `Hello, I am GemiBot ${robotMood}`}
              </p>
            </div>
            <div className="robot-full robot-center">
              <div className={`robot-actor ${botSpeaking || isTyping || micListening ? "robot-speaking" : ""}`}>
                <Image
                  src="/agent-full.svg"
                  alt="Robot IA entier centre"
                  width={350}
                  height={517}
                  className="robot-body robot-talk"
                  loading="eager"
                />
                <span className="robot-mouth" aria-hidden="true" />
                <span className="robot-expression" aria-hidden="true">{robotMood}</span>
              </div>
              <p className="robot-bubble">
                {lang === "fr" ? `Data et IA, version premium ${robotMood}` : `Data and AI, premium edition ${robotMood}`}
              </p>
            </div>
            <div className="robot-full robot-right">
              <div className={`robot-actor ${botSpeaking || isTyping || micListening ? "robot-speaking" : ""}`}>
                <Image
                  src="/agent-full.svg"
                  alt="Robot IA entier droite"
                  width={330}
                  height={487}
                  className="robot-body robot-dance"
                  loading="eager"
                />
                <span className="robot-mouth" aria-hidden="true" />
                <span className="robot-expression" aria-hidden="true">{robotMood}</span>
              </div>
              <p className="robot-bubble">
                {lang === "fr" ? `Je marche, je danse, je parle ${robotMood}` : `I walk, dance, and speak ${robotMood}`}
              </p>
            </div>
          </div>
        </div>
      ) : null}
      <div
        ref={orbitLargeRef}
        className={`orbit-cursor orbit-cursor-large pointer-events-none fixed z-[3] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/40 ${preset === "showcase" ? "" : "hidden"}`}
      />
      <div
        ref={orbitSmallRef}
        className={`orbit-cursor orbit-cursor-small pointer-events-none fixed z-[3] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-300/40 ${preset === "showcase" ? "" : "hidden"}`}
      />
      <div className={`pointer-events-none fixed inset-0 z-[2] flex items-center justify-center ${preset === "showcase" ? "" : "hidden"}`}>
        <p className="animate-name-dance bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300 bg-clip-text text-center text-3xl font-bold text-transparent drop-shadow-[0_0_18px_rgba(34,211,238,0.45)] md:text-6xl">
          Gemima Ondele 🤖✨
        </p>
      </div>
      <div className="pointer-events-none fixed inset-0 z-[60]">
        {actionEmojis.map((item) => (
          <span
            key={item.id}
            className="action-emoji"
            style={{ left: `${item.left}%`, animationDelay: `${item.delay}s` }}
            aria-hidden="true"
          >
            {item.emoji}
          </span>
        ))}
      </div>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 py-8 md:px-10">
        <header className={`sticky top-4 z-20 mb-10 rounded-2xl border px-4 py-3 backdrop-blur ${card}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <nav className="flex flex-wrap gap-4">
              <a href="#about">{t.nav[0]}</a>
              <a href="#education">{t.nav[1]}</a>
              <a href="#experience">{t.nav[2]}</a>
              <a href="#projects">{t.nav[3]}</a>
              <a href="#achievements">{t.nav[4]}</a>
              <a href="#skills">{t.nav[5]}</a>
              <a href="#vision">{t.nav[6]}</a>
              <a href="#contact">{t.nav[7]}</a>
            </nav>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center overflow-hidden rounded-full border border-white/30">
                <button
                  type="button"
                  onClick={() => {
                    setLang("fr");
                    launchEmojiBurst(["🇫🇷", "🗣️", "✨"]);
                  }}
                  className={`px-3 py-1 font-semibold ${lang === "fr" ? "bg-cyan-400/20 text-cyan-200" : ""}`}
                >
                  {t.langFr}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLang("en");
                    launchEmojiBurst(["🇬🇧", "🗣️", "✨"]);
                  }}
                  className={`px-3 py-1 font-semibold ${lang === "en" ? "bg-cyan-400/20 text-cyan-200" : ""}`}
                >
                  {t.langEn}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTheme((p) => (p === "dark" ? "light" : "dark"));
                  launchEmojiBurst(["🌗", "✨", "💫"]);
                }}
                className="rounded-full border border-white/30 px-3 py-1 font-semibold"
              >
                {isLight ? t.themeDark : t.themeLight}
              </button>
              <button
                type="button"
                onClick={() => {
                  setVoiceEnabled((p) => !p);
                  launchEmojiBurst(["🎙️", "🤖"]);
                }}
                className="rounded-full border border-violet-300/60 px-3 py-1 font-semibold text-violet-200"
              >
                {voiceEnabled ? t.voiceOn : t.voiceOff}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAmbientMusicOn((p) => !p);
                  launchEmojiBurst(["🎵", "✨", "🤖"]);
                }}
                className="rounded-full border border-emerald-300/60 px-3 py-1 font-semibold text-emerald-200"
              >
                {ambientMusicOn ? t.bgMusicOn : t.bgMusicOff}
              </button>
            </div>
          </div>
        </header>

        <section className={`mb-14 rounded-3xl border p-8 shadow-2xl ring-1 ring-cyan-400/20 backdrop-blur-sm ${card}`}>
          <p className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">{t.availability}</p>
          <p className="mt-3 inline-flex rounded-full border border-violet-300/40 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">
            Role principal: Data & AI Engineer
          </p>
          <h1 className="mt-5 bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-4xl font-semibold text-transparent md:text-6xl">
            Gemima Ondele ✨
          </h1>
          <p className="mt-2 text-xl text-cyan-300">{t.title}</p>
          <p className="mt-2 text-sm">{t.subtitle}</p>
          <p className="mt-5 max-w-3xl text-sm md:text-base">{t.hero}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#projects" className="rounded-full bg-cyan-300 px-5 py-2 text-sm font-semibold text-[#052029]">{t.ctaProjects}</a>
            <a href="#contact" className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold">{t.ctaContact}</a>
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 p-4 text-sm">
            {(lang === "fr" ? trackBlurb[track].fr : trackBlurb[track].en).map((line) => (
              <p key={line}>• {line}</p>
            ))}
          </div>
        </section>

        {isInterview ? (
          <section className={`mb-14 rounded-3xl border p-8 ${card}`}>
            <h2 className="text-2xl font-semibold md:text-3xl">
              {lang === "fr" ? "Profil one-page RH" : "Recruiter one-page profile"}
            </h2>
            <ul className="mt-4 space-y-2 text-sm md:text-base">
              {(lang === "fr" ? interviewEvidence.fr : interviewEvidence.en).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section id="about" className="mb-14">
          <h2 className="text-2xl font-semibold md:text-3xl">{t.aboutTitle}</h2>
          <p className="mt-4 max-w-4xl text-sm md:text-base">{t.about}</p>
          <div className="mt-5 flex items-center gap-3 text-sm">
            <Image src="/robot-ai.svg" alt="Robot assistant" width={36} height={36} className="animate-float" />
            <p>GemiBot: IA, robotique, data engineering et innovation continue.</p>
          </div>
        </section>

        <section id="education" className="mb-14">
          <h2 className="text-2xl font-semibold md:text-3xl">{t.educationTitle}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {education.map((item) => (
              <article key={item.period + item.school} className={`rounded-2xl border p-5 ${card}`}>
                <p className="text-sm text-cyan-300">{item.period}</p>
                <h3 className="mt-1 font-semibold">{lang === "fr" ? item.fr : item.en}</h3>
                <p className="text-sm">{item.school}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="mb-14">
          <h2 className="text-2xl font-semibold md:text-3xl">{t.experienceTitle}</h2>
          <div className="mt-5 space-y-4">
            {experiences.map((item) => (
              <article key={item.company + item.period} className={`rounded-2xl border p-6 ${card}`}>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-semibold">{lang === "fr" ? item.roleFr : item.roleEn}</h3>
                  <span className="text-sm text-cyan-300">{item.period}</span>
                </div>
                <p className="mt-1 text-sm">{item.company}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {(lang === "fr" ? item.detailsFr : item.detailsEn).map((d) => (
                    <li key={d}>• {d}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="mb-14">
          <h2 className="text-2xl font-semibold md:text-3xl">{t.projectsTitle}</h2>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-white/20 px-3 py-1">{t.projectFilter}</span>
            {projectCategoryOptions.map((cat) => (
              <button
                key={`project-filter-${cat}`}
                type="button"
                onClick={() => setSelectedProjectCategory(cat)}
                className={`rounded-full border px-3 py-1 ${selectedProjectCategory === cat ? "border-cyan-300 bg-cyan-300/20 text-cyan-200" : "border-white/20"}`}
              >
                {categoryLabels[lang][cat]}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <article key={project.title} className={`rounded-2xl border p-6 ${card}`}>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm">{lang === "fr" ? project.fr : project.en}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/20 px-2 py-1 text-xs">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex font-semibold text-cyan-300">
                    GitHub ↗
                  </a>
                  {"linkedin" in project && typeof project.linkedin === "string" ? (
                    <a
                      href={project.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex font-semibold text-violet-300"
                    >
                      LinkedIn ↗
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="achievements" className="mb-14">
          <h2 className="text-2xl font-semibold md:text-3xl">{t.achievementsTitle}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((a) => (
              <article key={a.kpi + a.fr} className={`rounded-2xl border p-5 ${card}`}>
                <p className="text-3xl font-bold text-cyan-300">{a.kpi}</p>
                <p className="mt-2 text-sm">{lang === "fr" ? a.fr : a.en}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="mb-14">
          <h2 className="text-2xl font-semibold md:text-3xl">{t.skillsTitle}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {skillLevels.map((group) => (
              <article key={group.labelFr} className={`rounded-2xl border p-5 ${card}`}>
                <h3 className="mb-3 font-semibold">{lang === "fr" ? group.labelFr : group.labelEn}</h3>
                <ul className="space-y-1 text-sm">
                  {group.items.map((s) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="vision" className={`mb-14 ${isInterview ? "hidden" : ""}`}>
          <h2 className="text-2xl font-semibold md:text-3xl">{t.visionTitle}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className={`rounded-2xl border p-6 ${card}`}>
              <h3 className="font-semibold">Robotique</h3>
              <p className="mt-2 text-sm">
                {lang === "fr"
                  ? "Je m'interesse a l'IA embarquee, l'automatisation intelligente et les systemes autonomes."
                  : "I am interested in embedded AI, intelligent automation, and autonomous systems."}
              </p>
            </article>
            <article className={`rounded-2xl border p-6 ${card}`}>
              <h3 className="font-semibold">Impact multi-secteurs</h3>
              <p className="mt-2 text-sm">
                {lang === "fr"
                  ? "Je suis ouverte aux opportunites IA/Data dans plusieurs secteurs en Ile-de-France: energie, sante, finance, services, industrie et innovation."
                  : "I am open to AI/Data opportunities across multiple sectors in Ile-de-France: energy, healthcare, finance, services, industry, and innovation."}
              </p>
            </article>
          </div>

          <h3 className="mt-8 text-xl font-semibold">{t.galleryTitle}</h3>
          <h4 className="mt-4 text-sm font-semibold text-cyan-300">
            {lang === "fr" ? "Videos de demonstration" : "Demo videos"}
          </h4>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-white/20 px-3 py-1">{t.galleryFilter}</span>
            {galleryCategoryOptions.map((cat) => (
              <button
                key={`gallery-filter-${cat}`}
                type="button"
                onClick={() => setSelectedGalleryCategory(cat)}
                className={`rounded-full border px-3 py-1 ${selectedGalleryCategory === cat ? "border-violet-300 bg-violet-300/20 text-violet-200" : "border-white/20"}`}
              >
                {categoryLabels[lang][cat]}
              </button>
            ))}
          </div>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {filteredGalleryVideos.map((item) => (
              <article key={item.titleFr} className={`overflow-hidden rounded-2xl border p-4 ${card}`}>
                <video
                  controls
                  preload="metadata"
                  className="aspect-video h-64 w-full rounded-xl bg-black object-contain md:h-72"
                >
                  <source src={item.src} type="video/mp4" />
                </video>
                <h5 className="mt-3 text-sm font-semibold">
                  {lang === "fr" ? item.titleFr : item.titleEn}
                </h5>
                <p className="mt-2 text-xs leading-5">
                  {lang === "fr" ? item.descFr : item.descEn}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                  <a
                    href={item.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex font-semibold text-cyan-300"
                  >
                    GitHub ↗
                  </a>
                  {"linkedin" in item && typeof item.linkedin === "string" ? (
                    <a
                      href={item.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex font-semibold text-violet-300"
                    >
                      LinkedIn ↗
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          <h4 className="mt-8 text-sm font-semibold text-cyan-300">
            {lang === "fr" ? "Images de projets" : "Project images"}
          </h4>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {wixVisuals.map((item) => (
              <div key={item.url} className={`overflow-hidden rounded-2xl border p-4 ${card}`}>
                <Image
                  src={item.url}
                  alt="Projet issu du portfolio Wix"
                  width={1074}
                  height={504}
                  className="h-auto w-full rounded-xl border border-white/10 bg-black/20 object-contain"
                  unoptimized
                />
                <div className="p-4">
                  <h4 className="text-sm font-semibold">
                    {lang === "fr" ? item.titleFr : item.titleEn}
                  </h4>
                  <p className="mt-2 text-xs leading-5">
                    {lang === "fr" ? item.descFr : item.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-8 text-xl font-semibold">{t.wixContentTitle}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {wixPages.map((page) => (
              <article key={page.url} className={`rounded-2xl border p-5 ${card}`}>
                <h4 className="font-semibold">{page.title}</h4>
                <p className="mt-2 text-sm">{lang === "fr" ? page.fr : page.en}</p>
                <ul className="mt-3 space-y-1 text-xs">
                  {(lang === "fr" ? page.detailsFr : page.detailsEn).map((d) => (
                    <li key={d}>• {d}</li>
                  ))}
                </ul>
                <a
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-sm font-semibold text-cyan-300"
                >
                  Ouvrir la page Wix ↗
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className={`mb-6 rounded-3xl border p-8 text-center ${card}`}>
          <h2 className="text-2xl font-semibold md:text-3xl">{t.contactTitle}</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm">{t.contactText}</p>
          <p className="mt-3 text-sm">gemimakerenondelepourou@gmail.com</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a href="mailto:gemimakerenondelepourou@gmail.com" className="rounded-full bg-cyan-300 px-4 py-2 font-semibold text-[#052029]">Email</a>
            <a href="https://github.com/GemimaOndele/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 px-4 py-2 font-semibold">GitHub</a>
            <a href="https://www.linkedin.com/in/g%C3%A9mima-ondele-pourou-1515251a7" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 px-4 py-2 font-semibold">LinkedIn</a>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a href="/documents/CV_Gemima_Ondele_Data_AI_Robotique_2026.pdf" download className="rounded-full border border-cyan-300/60 px-4 py-2 font-semibold text-cyan-200">
              {t.cvDownload}
            </a>
            <a href="/documents/Lettre_Motivation_IA_Gemima_ONDELE.pdf" download className="rounded-full border border-emerald-300/60 px-4 py-2 font-semibold text-emerald-200">
              {t.letterAiDownload}
            </a>
            <a href="/documents/Lettre_Motivation_Neutre_Gemima_ONDELE.pdf" download className="rounded-full border border-violet-300/60 px-4 py-2 font-semibold text-violet-200">
              {t.letterNeutralDownload}
            </a>
          </div>
        </section>
      </main>

      {!isInterview ? <div className="fixed bottom-5 right-5 z-30">
        {chatOpen ? (
          <div className={`w-[320px] rounded-2xl border p-4 shadow-2xl ${card}`}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`robot-mini ${botSpeaking || isTyping || micListening ? "robot-mini-speaking" : ""}`}>
                  <Image src="/robot-ai.svg" alt="Avatar GemiBot" width={42} height={42} className="animate-float" />
                  <span className="robot-mini-mouth" aria-hidden="true" />
                  <span className="robot-mini-expression" aria-hidden="true">{robotMood}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.chatTitle} 💬</p>
                  <p className="text-[10px] text-cyan-300">Online • AI Agent • {t.robotMoodLabel}: {robotMood}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAssistantTone((prev) => (prev === "pro" ? "fun" : "pro"));
                    launchEmojiBurst(["😄", "🧠", "✨"]);
                  }}
                  className="text-[10px] text-violet-200"
                >
                  {assistantTone === "pro" ? t.tonePro : t.toneFun}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChatMode((prev) =>
                      prev === "standard" ? "recruiter" : "standard"
                    );
                    launchEmojiBurst(["💼", "✨"]);
                  }}
                  className="text-[10px] text-cyan-300"
                >
                  {chatMode === "recruiter" ? t.chatRecruiterOn : t.chatRecruiterOff}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopVoiceInput();
                    setChatOpen(false);
                  }}
                  className="text-xs text-cyan-300"
                >
                  Fermer
                </button>
              </div>
            </div>
            <div className="mb-2 flex items-end gap-1">
              {Array.from({ length: 8 }).map((_, idx) => (
                <span
                  key={`wave-${idx}`}
                  className={`chat-wave ${botSpeaking ? "chat-wave-active" : ""}`}
                />
              ))}
            </div>
            <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-3 text-xs">
              {chatMessages.map((m, idx) => (
                <p key={`${m.role}-${idx}`} className={m.role === "bot" ? "text-cyan-200" : "text-violet-200"}>
                  {m.role === "bot" ? "🤖 " : "🙋‍♀️ "}
                  {m.text}
                </p>
              ))}
              {isTyping ? <p className="text-cyan-200">🤖 {t.typing}</p> : null}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <button type="button" onClick={() => { askBot("track"); launchEmojiBurst(["🧭", "✨"]); }} className="rounded-lg border border-white/20 px-2 py-1">Track IA/Data</button>
              <button type="button" onClick={() => { askBot("robotics"); launchEmojiBurst(["🤖", "⚙️"]); }} className="rounded-lg border border-white/20 px-2 py-1">Robotique 🤖</button>
              <button type="button" onClick={() => { askBot("sectors"); launchEmojiBurst(["🌍", "📊"]); }} className="rounded-lg border border-white/20 px-2 py-1">Secteurs IDF 🌍</button>
              <button type="button" onClick={() => { askBot("catia"); launchEmojiBurst(["🛠️", "📐"]); }} className="rounded-lg border border-white/20 px-2 py-1">Projet CATIA</button>
            </div>
            <form
              className="mt-2 flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                processUserQuestion(chatInput);
                setChatInput("");
                launchEmojiBurst(["💬", "✨"]);
              }}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={lang === "fr" ? "Pose ta question..." : "Ask your question..."}
                className="flex-1 rounded-lg border border-white/20 bg-black/30 px-2 py-1 text-[11px] outline-none"
              />
              <button type="submit" className="rounded-lg border border-cyan-300/40 px-2 py-1 text-[11px] text-cyan-200">
                {lang === "fr" ? "Envoyer" : "Send"}
              </button>
            </form>
            <div className="mt-2 flex items-center gap-2 text-[11px]">
              <button
                type="button"
                onClick={micListening ? stopVoiceInput : startVoiceInput}
                className="rounded-lg border border-emerald-300/40 px-2 py-1 text-emerald-200"
              >
                {micListening ? t.micStop : t.micStart}
              </button>
              <button
                type="button"
                onClick={() => {
                  speakText(
                    lang === "fr"
                      ? "Test de voix GemiBot. Je suis bien audible."
                      : "GemiBot voice test. I am clearly audible."
                  );
                }}
                className="rounded-lg border border-violet-300/40 px-2 py-1 text-violet-200"
              >
                {t.testVoice}
              </button>
            </div>
            {lang === "fr" ? (
              <div className="mt-2 flex items-center gap-2 text-[11px]">
                <span className="text-cyan-200">{t.voiceFrSelect}</span>
                <select
                  value={manualFrVoiceUri}
                  onChange={(e) => setManualFrVoiceUri(e.target.value)}
                  aria-label={lang === "fr" ? "Selection de la voix francaise" : "French voice selection"}
                  title={lang === "fr" ? "Selection de la voix francaise" : "French voice selection"}
                  className="max-w-[190px] rounded-lg border border-cyan-300/30 bg-black/35 px-2 py-1 text-[11px] text-cyan-100 outline-none"
                >
                  <option value="auto">{t.voiceAuto}</option>
                  {frVoiceChoices.map((voice) => (
                    <option key={`${voice.voiceURI}-${voice.lang}`} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {chatMode === "recruiter" ? (
              <div className="mt-2 grid grid-cols-1 gap-2 text-[11px]">
                <button type="button" onClick={() => askBot("recruiter-why")} className="rounded-lg border border-cyan-300/40 px-2 py-1">
                  Question RH: Pourquoi elle ?
                </button>
                <button type="button" onClick={() => askBot("recruiter-impact")} className="rounded-lg border border-cyan-300/40 px-2 py-1">
                  Question RH: Impact business
                </button>
                <button type="button" onClick={() => askBot("recruiter-team")} className="rounded-lg border border-cyan-300/40 px-2 py-1">
                  Question RH: Collaboration equipe
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setChatOpen(true);
              launchEmojiBurst(["🤖", "💬", "✨"]);
            }}
            className="animate-pulse rounded-full border border-cyan-300/60 bg-black/70 px-4 py-2 text-sm font-semibold text-cyan-200 shadow-xl backdrop-blur"
          >
            {t.chatOpen} 🤖
          </button>
        )}
      </div> : null}
    </div>
  );
}
