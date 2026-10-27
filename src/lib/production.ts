export type ProductionRow = {
  id: string;
  professional: string;
  plan: string;
  count: number;
  gross: number;
  retained: number;
  received: number;
};

/** Espelho de produção demonstrativo (valores ilustrativos). */
export const PRODUCTION: ProductionRow[] = [
  {
    id: "pr1",
    professional: "Rayane Gama",
    plan: "Saúde Petrobras",
    count: 42,
    gross: 7560,
    retained: 1512,
    received: 7560,
  },
  {
    id: "pr2",
    professional: "Flávia",
    plan: "SulAmérica",
    count: 36,
    gross: 6480,
    retained: 1296,
    received: 6000,
  },
  {
    id: "pr3",
    professional: "Glória",
    plan: "GEAP Saúde",
    count: 30,
    gross: 6000,
    retained: 1200,
    received: 6000,
  },
  {
    id: "pr4",
    professional: "Yasmin",
    plan: "Porto Saúde",
    count: 34,
    gross: 6120,
    retained: 1224,
    received: 6120,
  },
  {
    id: "pr5",
    professional: "Carolina",
    plan: "Particular",
    count: 22,
    gross: 4840,
    retained: 968,
    received: 4840,
  },
  {
    id: "pr6",
    professional: "Carlos",
    plan: "Saúde Caixa",
    count: 18,
    gross: 3240,
    retained: 648,
    received: 3000,
  },
  {
    id: "pr7",
    professional: "Cristiane",
    plan: "Particular",
    count: 26,
    gross: 4680,
    retained: 936,
    received: 4680,
  },
  {
    id: "pr8",
    professional: "Andrezza",
    plan: "Saúde Petrobras",
    count: 20,
    gross: 4000,
    retained: 800,
    received: 4000,
  },
  {
    id: "pr9",
    professional: "Equipe interdisciplinar",
    plan: "Particular",
    count: 6,
    gross: 5700,
    retained: 1140,
    received: 5700,
  },
];
