import { BookOpen, UsersRound, Users, BookText } from "lucide-react";

export const dataOptions = [
  {
    key: "chapters",
    label: "Chapitres",
    icon: BookOpen,
    export: {
      endpoint: "/api/export/chapters",
      filename: "chapters.json",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    import: {
      endpoint: "chapters",
      color: "text-amber-600 dark:text-amber-400",
    },
  },
  {
    key: "sahabas",
    label: "Compagnons",
    icon: UsersRound,
    export: {
      endpoint: "/api/export/sahabas",
      filename: "sahabas.json",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    import: {
      endpoint: "sahabas",
      color: "text-amber-600 dark:text-amber-400",
    },
  },
  {
    key: "transmitters",
    label: "Transmetteurs",
    icon: Users,
    export: {
      endpoint: "/api/export/transmitters",
      filename: "transmitters.json",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    import: {
      endpoint: "transmitters",
      color: "text-amber-600 dark:text-amber-400",
    },
  },
  {
    key: "hadiths",
    label: "Hadiths",
    icon: BookText,
    export: {
      endpoint: "/api/export/hadiths",
      filename: "hadiths.json",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    import: {
      endpoint: "hadiths",
      color: "text-amber-600 dark:text-amber-400",
    },
  },
];
