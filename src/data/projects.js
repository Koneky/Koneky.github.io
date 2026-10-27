export const projects = [
  {
    id: "qrumix",
    title: "QRumiX",
    type: "featured",
    technologies: [
      "flutter",
      "dart",
      "drift",
      "sqlite",
      "dio",
      "provider",
    ],
    repository: null,
    isPrivate: true,
    caseStudySlug: "qrumix",
  },

  {
    id: "productConfigurator",
    title: "Product Configurator Platform",
    type: "commercial",
    technologies: [
      "python",
      "django",
      "django-rest-framework",
      "react",
      "mysql",
      "redis",
    ],
    repository: null,
    isPrivate: true,
  },
  {
    id: "legacyModernization",
    title: "Legacy Business System Modernization",
    type: "commercial",
    technologies: [
      "python",
      "django",
      "react",
      "typescript",
      "postgresql",
      "redis",
      "docker",
    ],
    repository: null,
    isPrivate: true,
  },

  {
    id: "djangoDebugAssistant",
    title: "Django Debug Assistant",
    type: "open-source",
    technologies: [
      "python",
      "tkinter",
      "gitpython",
    ],
    repository: "https://github.com/Koneky/Django-Debug-Assistant",
    isPrivate: false,
  },
  {
    id: "voiceAssistant",
    title: "Voice Assistant",
    type: "open-source",
    technologies: [
      "python",
      "pytorch",
      "coqui-tts",
      "speechrecognition",
    ],
    repository: "https://github.com/Koneky/voice_assistant",
    isPrivate: false,
  },
  {
    id: "qrAppPrototype",
    title: "QR App Prototype",
    type: "open-source",
    technologies: [
      "python",
      "kivy",
      "kivymd",
      "peewee",
    ],
    repository: "https://github.com/Koneky/qr_app",
    isPrivate: false,
  },
];

export function getProjectById(id) {
  return projects.find((project) => project.id === id) ?? null;
}

export function getProjectsByType(type) {
  return projects.filter((project) => project.type === type);
}

// Temporary compatibility exports for the current Projects UI.
// They are derived from the canonical projects array, so project data
// still has a single source of truth.
export const featuredProjects = getProjectsByType("featured");
export const commercialProjects = getProjectsByType("commercial");
export const openSourceProjects = getProjectsByType("open-source");
