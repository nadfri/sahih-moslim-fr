export const sahabas = [
  'Abu Bakr As-Siddiq',
  'Umar ibn al-Khattab',
  'Uthman ibn Affan',
  'Ali ibn Abi Talib',
  'Abu Huraira',
  'Abdallah ibn Abbas',
  'Abu Dharr Al-Ghifari',
  'Bilal ibn Rabah',
  'Salman Al-Farsi',
  'Zayd ibn Harithah',
  'Hassan ibn Ali',
  'Fatimah bint Muhammad',
  'Anas ibn Malik',
  'Abu Talib',
  'Abdullah ibn Umar',
  'Abu Ayyub Al-Ansari',
  'Abu Muslim Al-Khawlani',
  "Ma'bad Al Jouhani",
  "Houmayd ibn Abder Rahman Al Houmayri",
  'Abdallah ibn Omar',
] as const;

export type SahabaType = (typeof sahabas)[number];
