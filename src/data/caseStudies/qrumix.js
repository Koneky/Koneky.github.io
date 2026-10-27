
export const qrumixCaseStudy = {
  slug: "qrumix",

  title: {
    ru: "QRumiX",
    en: "QRumiX",
  },

  summary: {
    ru:
      "QRumiX — независимое Android-приложение для создания " +
      "и работы с QR-кодами. Изначально созданное как личный " +
      "инструмент, оно развивается без обязательной " +
      "премиум-подписки и находится на стадии Alpha.",

    en:
      "QRumiX is an independent Android application for " +
      "creating and working with QR codes. Originally built " +
      "as a personal tool, it is being developed without " +
      "mandatory premium subscriptions and remains in alpha.",
  },

  technologies: [
    "flutter",
    "dart",
    "drift",
    "sqlite",
    "dio",
    "provider",
  ],

  role: {
    ru:
      "Я самостоятельно разрабатываю QRumiX: от концепции " +
      "и интерфейса до архитектуры, программной реализации, " +
      "локального хранения данных и инфраструктуры обновлений. " +
      "В процессе разработки использую ChatGPT как " +
      "AI-ассистента для обсуждения решений и работы с кодом.",

    en:
      "I independently design, develop, and maintain QRumiX, " +
      "covering the product concept, UI, architecture, " +
      "implementation, local data storage, and update " +
      "infrastructure. I use ChatGPT as an AI development " +
      "assistant to explore technical decisions and work " +
      "on the codebase.",
  },

  challenge: {
    ru:
      "Идея проекта появилась из желания создать собственное " +
      "приложение для генерации и распознавания QR-кодов " +
      "без обязательных платных подписок. Сначала QRumiX " +
      "предназначался только для личного использования, " +
      "но позже возникла идея поделиться им с другими людьми. " +
      "При этом публикация в магазинах приложений " +
      "не является целью проекта.",

    en:
      "The project began with a desire to build a personal " +
      "QR-code generation and scanning tool without mandatory " +
      "paid subscriptions. QRumiX was initially intended " +
      "for personal use, but the idea later expanded toward " +
      "sharing it with other people. Publishing through " +
      "traditional app stores is not a project goal.",
  },

  solution: {
    ru:
      "QRumiX развивается как модульное Flutter-приложение " +
      "с генератором QR-кодов, интерфейсом сканирования, " +
      "историей операций и настройками. Реализованы генерация " +
      "QR-кода с предпросмотром, инфраструктура локального " +
      "хранения истории, персонализация оформления и " +
      "русская и английская локализации. Сканер пока использует " +
      "демонстрационную логику, а сохранение и отправка " +
      "сгенерированных QR-кодов требуют доработки.",

    en:
      "QRumiX is being developed as a modular Flutter " +
      "application with QR-code generation, a scanning " +
      "interface, history, and settings. It includes " +
      "QR-code generation with a preview, local history " +
      "storage infrastructure, appearance customization, " +
      "and Russian and English localization. The scanner " +
      "currently uses mock logic, while saving and sharing " +
      "generated QR codes still require further work.",
  },

  architecture: {
    ru:
      "Приложение организовано по функциональным модулям. " +
      "Для управления состоянием используется Provider, " +
      "для внедрения зависимостей — GetIt и Injectable. " +
      "Работа с локальными данными построена на Drift " +
      "и SQLite с выделенными репозиториями и сервисами. " +
      "Отдельной инженерной задачей стала система обновлений " +
      "вне магазинов приложений: публичный GitHub-репозиторий " +
      "хранит метаданные версий и APK-файлы, а приложение " +
      "содержит механизмы проверки версий, загрузки через " +
      "Dio и запуска Android-установщика. Система обновлений " +
      "пока не завершена.",

    en:
      "The application uses a feature-based modular structure. " +
      "Provider manages application state, while GetIt and " +
      "Injectable handle dependency injection. Local data " +
      "is managed with Drift and SQLite through dedicated " +
      "repositories and services. A key engineering challenge " +
      "has been implementing updates outside app stores: " +
      "a separate public GitHub repository contains version " +
      "metadata and APK files, while the application includes " +
      "version checking, downloads through Dio, and integration " +
      "with the Android package installer. The update system " +
      "is still a work in progress.",
  },

  gallery: [
    {
      src: "/projects/qrumix/home.jpg",
      alt: {
        ru: "Главный экран QRumiX с быстрыми действиями и демонстрационными данными",
        en: "QRumiX home screen with quick actions and demonstration data",
      },
    },
    {
      src: "/projects/qrumix/generator.jpg",
      alt: {
        ru: "Экран генератора QR-кодов с вводом данных и предпросмотром",
        en: "QR-code generator screen with data input and preview",
      },
    },
    {
      src: "/projects/qrumix/scanner.jpg",
      alt: {
        ru: "Прототип экрана сканирования QR-кодов",
        en: "Prototype QR-code scanner screen",
      },
    },
    {
      src: "/projects/qrumix/history.jpg",
      alt: {
        ru: "Экран истории QRumiX с поиском и пустым состоянием",
        en: "QRumiX history screen with search and empty state",
      },
    },
    {
      src: "/projects/qrumix/settings.jpg",
      alt: {
        ru: "Настройки QRumiX с выбором темы, языка и параметрами приложения",
        en: "QRumiX settings with theme, language, and application preferences",
      },
    },
    {
      src: "/projects/qrumix/settings-updates.jpg",
      alt: {
        ru: "Раздел настроек QRumiX с ручной проверкой обновлений",
        en: "QRumiX settings section with manual update checking",
      },
    },
  ],

  results: {
    ru:
      "QRumiX остаётся проектом в активной Alpha-разработке. " +
      "С ранних этапов я проверяю приложение на реальных " +
      "Android-устройствах. Работа над ним дала практический " +
      "опыт проектирования модульного Flutter-приложения, " +
      "локального хранения данных и независимой системы " +
      "распространения обновлений. Следующие задачи — " +
      "завершение ключевых функций, уведомления о новых " +
      "версиях, улучшение интерфейса загрузки обновлений, " +
      "обработка сетевых ошибок и восстановление после " +
      "потери соединения.",

    en:
      "QRumiX remains in active alpha development. I have " +
      "tested the application on physical Android devices " +
      "since its early development stages. The project has " +
      "provided practical experience with modular Flutter " +
      "architecture, local data storage, and independent " +
      "update distribution. The next priorities include " +
      "completing core features, update notifications, " +
      "improving the download progress interface, stronger " +
      "network error handling, and recovery after connection " +
      "interruptions.",
  },

  links: [
    {
      label: {
        ru: "Публичный репозиторий обновлений",
        en: "Public Updates Repository",
      },
      url: "https://github.com/Koneky/qrumix-app-updates",
    },
  ],
};
