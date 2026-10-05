export const technologies = {
  python: {
    id: "python",
    label: "Python",
  },
  django: {
    id: "django",
    label: "Django",
  },
  "django-rest-framework": {
    id: "django-rest-framework",
    label: "Django REST Framework",
  },
  fastapi: {
    id: "fastapi",
    label: "FastAPI",
  },

  react: {
    id: "react",
    label: "React",
  },
  javascript: {
    id: "javascript",
    label: "JavaScript",
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
  },
  html: {
    id: "html",
    label: "HTML",
  },
  css: {
    id: "css",
    label: "CSS",
  },
  vite: {
    id: "vite",
    label: "Vite",
  },

  flutter: {
    id: "flutter",
    label: "Flutter",
  },
  dart: {
    id: "dart",
    label: "Dart",
  },
  drift: {
    id: "drift",
    label: "Drift",
  },
  dio: {
    id: "dio",
    label: "Dio",
  },
  provider: {
    id: "provider",
    label: "Provider",
  },

  git: {
    id: "git",
    label: "Git",
  },
  github: {
    id: "github",
    label: "GitHub",
  },
  docker: {
    id: "docker",
    label: "Docker",
  },
  linux: {
    id: "linux",
    label: "Linux",
  },

  postgresql: {
    id: "postgresql",
    label: "PostgreSQL",
  },
  mysql: {
    id: "mysql",
    label: "MySQL",
  },
  sqlite: {
    id: "sqlite",
    label: "SQLite",
  },
  redis: {
    id: "redis",
    label: "Redis",
  },

  tkinter: {
    id: "tkinter",
    label: "Tkinter",
  },
  gitpython: {
    id: "gitpython",
    label: "GitPython",
  },
  pytorch: {
    id: "pytorch",
    label: "PyTorch",
  },
  "coqui-tts": {
    id: "coqui-tts",
    label: "Coqui TTS",
  },
  speechrecognition: {
    id: "speechrecognition",
    label: "SpeechRecognition",
  },
  kivy: {
    id: "kivy",
    label: "Kivy",
  },
  kivymd: {
    id: "kivymd",
    label: "KivyMD",
  },
  peewee: {
    id: "peewee",
    label: "Peewee",
  },
};

export const technologyGroups = [
  {
    key: "backend",
    technologies: [
      "python",
      "django",
      "django-rest-framework",
      "fastapi",
    ],
  },
  {
    key: "frontend",
    technologies: [
      "react",
      "javascript",
      "html",
      "css",
      "vite",
    ],
  },
  {
    key: "mobile",
    technologies: [
      "flutter",
      "dart",
    ],
  },
  {
    key: "tools",
    technologies: [
      "git",
      "github",
      "docker",
      "postgresql",
      "linux",
    ],
  },
];

export function getTechnology(id) {
  return technologies[id] ?? null;
}
