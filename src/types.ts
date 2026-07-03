export interface Product {
  id: string;
  title: string;
  subtitle: string;
  thickness: string;
  relief: string;
  jointType: string;
  warranty: string;
  description: string;
  imageUrl: string;
  images?: string[];
  features: string[];
  specs: { label: string; value: string }[];
}

export interface FarmZone {
  id: string;
  title: string;
  icon: string;
  description: string;
  recommendedProduct: string;
  recommendedThickness: string;
  injuryReductionPercent: number;
  details: string;
}

export interface RoiCalculationResult {
  cows: number;
  yieldBoostPercent: number;
  extraMilkPerCowDaily: number;
  extraAnnualRevenueRub: number;
  annualVetSavingsRub: number;
  totalAnnualBenefitRub: number;
  estimatedInvestmentRub: number;
  paybackPeriodMonths: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  format: string;
  size: string;
  summary: string;
  icon: string;
}

export interface LeadItem {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  farmName?: string;
  comment?: string;
  cowsCount?: number;
  selectedProduct?: string;
  status: "new" | "in_review" | "processed";
}

export interface TestimonialItem {
  id: string;
  farmName: string;
  region: string;
  directorName: string;
  role: string;
  cowsCount: number;
  productUsed: string;
  yearInstalled: number;
  quote: string;
  metricsResult: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "монтаж" | "эксплуатация" | "долговечность";
}

export interface SiteSettings {
  // Контакты и прием заявок
  phone: string;
  emailForLeads: string;
  telegramForLeads?: string;
  address: string;
  workHours: string;

  // Логотип и брендинг
  logoUrl?: string;
  logoText?: string;
  logoSubtitle?: string;

  // Тексты и картинки
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroImageUrl: string;
  guaranteeText: string;
  catalogTitle: string;
  catalogSubtitle: string;

  // Редактирование остальных разделов сайта
  mapTitle?: string;
  mapSubtitle?: string;
  calcTitle?: string;
  calcSubtitle?: string;
  aboutTitle?: string;
  aboutText?: string;
  faqTitle?: string;
  faqSubtitle?: string;
  footerDescription?: string;

  // Аналитика и SEO
  yandexMetrikaId?: string;
  googleAnalyticsId?: string;
  yandexWebmaster?: string;
  googleSearchConsole?: string;
  customHeadScript?: string;
}

export interface AdminUser {
  id: string;
  login: string;
  password?: string;
  name: string;
  role: "superadmin" | "manager";
  createdAt: string;
}

