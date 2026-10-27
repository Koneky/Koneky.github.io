import { getSocialLinksFor } from "./socialLinks.js";
import { getHomeSectionTarget } from "../utils/navigation.js";
import { routePaths } from "../router/routeConfig.js";

const githubLink = getSocialLinksFor("commands").find(
  (link) => link.id === "github",
);

export const commands = [
  {
    id: "about",
    labelKey: "commands.about",
    keywords: ["about", "me", "о себе", "обо мне"],
    action: {
      type: "navigate",
      to: getHomeSectionTarget("about"),
    },
    visibility: "public",
  },
  {
    id: "projects",
    labelKey: "commands.projects",
    keywords: ["projects", "portfolio", "проекты", "работы"],
    action: {
      type: "navigate",
      to: getHomeSectionTarget("projects"),
    },
    visibility: "public",
  },
  ...(githubLink
    ? [
        {
          id: "github",
          labelKey: "commands.github",
          keywords: ["github", "git", "repositories", "репозитории"],
          action: {
            type: "openExternal",
            url: githubLink.href,
          },
          visibility: "public",
        },
      ]
    : []),
  {
    id: "contact",
    labelKey: "commands.contact",
    keywords: ["contact", "email", "связь", "контакты"],
    action: {
      type: "navigate",
      to: getHomeSectionTarget("contact"),
    },
    visibility: "public",
  },
  {
    id: "qrumix",
    labelKey: "commands.qrumix",
    keywords: [
      "qrumix",
      "qr code",
      "qr codes",
      "flutter",
      "case study",
      "кейс",
      "история проекта",
      "проект qrumix"
    ],
    action: {
      type: "navigate",
      to: routePaths.project("qrumix"),
    },
    visibility: "public",
  },
  {
    id: "language-ru",
    labelKey: "commands.languageRu",
    keywords: ["ru", "russian", "русский", "язык"],
    action: {
      type: "setLanguage",
      language: "ru",
    },
    visibility: "public",
  },
  {
    id: "language-en",
    labelKey: "commands.languageEn",
    keywords: ["en", "english", "английский", "language"],
    action: {
      type: "setLanguage",
      language: "en",
    },
    visibility: "public",
  },
];
