export const socialLinks = [
  {
    id: "github",
    label: "GitHub",
    value: "@Koneky",
    href: "https://github.com/Koneky",
    kind: "external",
    showInContact: true,
    showInFooter: true,
    showInResume: true,
    showInCommands: true,
  },
  {
    id: "telegram",
    label: "Telegram",
    value: "@qarumik",
    href: "https://t.me/qarumik",
    kind: "external",
    showInContact: true,
    showInFooter: true,
    showInResume: true,
    showInCommands: true,
  },
  {
    id: "telegram-channel",
    label: "Telegram Channel",
    value: "@qarumidev",
    href: "https://t.me/qarumidev",
    kind: "external",
    showInContact: true,
    showInFooter: true,
    showInResume: false,
    showInCommands: true,
  },
  {
    id: "vk",
    label: "VK",
    value: "@qarumi",
    href: "https://vk.com/qarumi",
    kind: "external",
    showInContact: true,
    showInFooter: false,
    showInResume: false,
    showInCommands: false,
  },
  {
    id: "vk-channel",
    label: "VK Channel",
    value: "@qarumidev",
    href: "https://vk.com/qarumidev",
    kind: "external",
    showInContact: true,
    showInFooter: false,
    showInResume: false,
    showInCommands: false,
  },
  {
    id: "instagram",
    label: "Instagram",
    value: "@qarumii",
    href: "https://www.instagram.com/qarumii",
    kind: "external",
    showInContact: true,
    showInFooter: false,
    showInResume: false,
    showInCommands: false,
  },
  {
    id: "email",
    label: "Email",
    value: "qarumik@gmail.com",
    href: "mailto:qarumik@gmail.com",
    kind: "email",
    showInContact: true,
    showInFooter: true,
    showInResume: true,
    showInCommands: true,
  },
];

const surfaceFlags = {
  contact: "showInContact",
  footer: "showInFooter",
  resume: "showInResume",
  commands: "showInCommands",
};

export function getSocialLinksFor(surface) {
  const flag = surfaceFlags[surface];

  if (!flag) {
    return [];
  }

  return socialLinks.filter((link) => link[flag]);
}
