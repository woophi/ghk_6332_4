export type StockItem = {
  ticker: string;
  price_yesterday: number;
  price_today: number;
  delta: string;
  potentialYieldPeriod: string;
  potentialYield: string;
  description: string;
  lot: number;
  name: string;
  link: string;
  img: string;
};

export type BotItem = {
  name: string;
  description: string;
  variant: number;
  riskLevels: {
    level: string;
    profit: string;
  }[];
};
