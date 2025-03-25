export const chapterTitles = [
  "La Foi",
  "Purification",
  "Menstruations",
  "Prières",
  "Mosquées et lieux de prière", ,
  "Prière du voyageur",
  "Prière du vendredi",
  "Prière des deux fêtes",
  "Prière pour la pluie",
  "Prière des éclipses",
  "Prière des funérailles",
  "Zakat",
  "Jeûne",
  "Retraite spirituelle",
  "Pèlerinage",
  "Mariage",
  "Allaitement",
  "Divorce",
  "Invoquer des malédictions",
  "Affranchissement",
  "Transactions",
  "Irrigations",
  "Successions",
  "Donations",
  "Testaments",
  "Voeux",
  "Serments",
  "Serments collectifs",
  "Peines légales",
  "Jugements",
  "Objets trouvés",
  "Jihad et Expéditions",
  "Commandements",
] as const;


export type ChapterType = typeof chapterTitles[number];
