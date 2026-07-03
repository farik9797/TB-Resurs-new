import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const SETTINGS_FILE = path.join(process.cwd(), "settings.json");
const USERS_FILE = path.join(process.cwd(), "users.json");

let currentSettings = {
  phone: "+7 (800) 555-35-35",
  emailForLeads: "info@tb-resurs.ru",
  telegramForLeads: "@tbresurs_bot",
  address: "Республика Татарстан, г. Казань / Кукморский р-н, ул. Заводская, 12",
  workHours: "Пн-Пт с 08:00 до 17:00 (МСК)",
  heroTitle: "Резиновые маты для КРС от завода «ТБ-Ресурс»",
  heroSubtitle: "Снижаем заболеваемость копыт до 40% и увеличиваем надой на +2-3 литра в сутки с гарантией 5 лет.",
  heroBadge: "Завод-производитель резиновых покрытий по ГОСТ Р",
  heroImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAE2q1CPL-oks8xFDApaqPc9Y4F_aPmcYO72sX8xUNXtKHwBKj4EiUwZK3ccFIIf6S9egbDhBqflR1SpNlpDUnnYvq4aEWb2MaUPjlOGa3YlerK894XIKKLGkrQISU0QxTrOicHNGn0Av2fgACdXNnUFCyI6MfqeI0VNbDCSKjnEIDe7hauL444bRyk2il7R4D08MEVemtk8wGkKuu1wND9bK-_caSNgCMJHgjrxP2cEioVCefOc7WSuQ",
  guaranteeText: "Гарантия на износ 5 лет по ГОСТ Р",
  catalogTitle: "Складская программа покрытий для животноводства",
  catalogSubtitle: "Прямые поставки с завода в Татарстане без посредников и торговых наценок",
  yandexMetrikaId: "",
  googleAnalyticsId: "",
  yandexWebmaster: "",
  googleSearchConsole: "",
  customHeadScript: ""
};

export interface AdminUser {
  id: string;
  login: string;
  password?: string;
  name: string;
  role: "superadmin" | "manager";
  createdAt: string;
}

let adminUsers: AdminUser[] = [
  {
    id: "usr-1",
    login: "admin",
    password: "admin",
    name: "Главный Администратор",
    role: "superadmin",
    createdAt: new Date().toISOString()
  }
];

// Try to load settings and users from disk on boot
try {
  if (fs.existsSync(SETTINGS_FILE)) {
    const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
    currentSettings = { ...currentSettings, ...JSON.parse(data) };
    if (currentSettings.heroImageUrl?.includes("1516467508483")) {
      currentSettings.heroImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAE2q1CPL-oks8xFDApaqPc9Y4F_aPmcYO72sX8xUNXtKHwBKj4EiUwZK3ccFIIf6S9egbDhBqflR1SpNlpDUnnYvq4aEWb2MaUPjlOGa3YlerK894XIKKLGkrQISU0QxTrOicHNGn0Av2fgACdXNnUFCyI6MfqeI0VNbDCSKjnEIDe7hauL444bRyk2il7R4D08MEVemtk8wGkKuu1wND9bK-_caSNgCMJHgjrxP2cEioVCefOc7WSuQ";
    }
  }
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    const loaded = JSON.parse(data);
    if (Array.isArray(loaded) && loaded.length > 0) {
      adminUsers = loaded;
    }
  }
} catch (e) {
  console.log("Using default settings and users");
}


// In-memory storage for feedback leads (demonstrates Node.js persistence during server uptime)
export interface Lead {
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

const leads: Lead[] = [
  {
    id: "TBR-2026-104",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    name: "Ильдар Каримов",
    phone: "+7 (917) 245-88-12",
    farmName: "Агрохолдинг «Татарстан-Молоко»",
    comment: "Нужен расчет на 450 стойломест. Интересуют маты толщиной 24мм с шиповым протектором.",
    cowsCount: 450,
    selectedProduct: "Маты для стойломест (24мм)",
    status: "in_review"
  },
  {
    id: "TBR-2026-103",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    name: "Сергей Николаевич",
    phone: "+7 (903) 554-19-40",
    farmName: "СПК «Заря»",
    comment: "Реконструкция доильно-молочного блока и галереи прохода. Площадь около 620 кв.м.",
    cowsCount: 280,
    selectedProduct: "Маты для проходов и ДМБ",
    status: "processed"
  },
  {
    id: "TBR-2026-102",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    name: "Алексей Воронов",
    phone: "+7 (926) 811-04-23",
    farmName: "КФХ «Рассвет»",
    comment: "Хотим попробовать маты в накопитель перед дойкой для снижения травм копыт.",
    cowsCount: 150,
    selectedProduct: "Покрытия для накопителей",
    status: "processed"
  }
];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  app.use(express.json());

  // Auth & Admin Users API
  app.post("/api/auth/login", (req, res) => {
    const { login, password } = req.body;
    const user = adminUsers.find(u => u.login === login && u.password === password);
    if (!user) {
      return res.status(401).json({ success: false, message: "Неверный логин или пароль" });
    }
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  });

  app.get("/api/users", (req, res) => {
    const safeUsers = adminUsers.map(({ password, ...u }) => u);
    res.json({ success: true, users: safeUsers });
  });

  app.post("/api/users", (req, res) => {
    const { login, password, name, role } = req.body;
    if (!login || !password || !name) {
      return res.status(400).json({ success: false, message: "Заполните все обязательные поля" });
    }
    if (adminUsers.some(u => u.login === login)) {
      return res.status(400).json({ success: false, message: "Пользователь с таким логином уже существует" });
    }
    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      login,
      password,
      name,
      role: role || "manager",
      createdAt: new Date().toISOString()
    };
    adminUsers.push(newUser);
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(adminUsers, null, 2), "utf-8");
    } catch (e) {}
    const { password: _, ...safeUser } = newUser;
    res.json({ success: true, user: safeUser, users: adminUsers.map(({ password, ...u }) => u) });
  });

  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    if (adminUsers.length <= 1) {
      return res.status(400).json({ success: false, message: "Нельзя удалить единственного администратора" });
    }
    adminUsers = adminUsers.filter(u => u.id !== id);
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(adminUsers, null, 2), "utf-8");
    } catch (e) {}
    res.json({ success: true, users: adminUsers.map(({ password, ...u }) => u) });
  });

  // API Routes
  app.get("/api/settings", (req, res) => {
    res.json({
      success: true,
      settings: currentSettings
    });
  });

  app.post("/api/settings", (req, res) => {
    try {
      currentSettings = { ...currentSettings, ...req.body };
      try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(currentSettings, null, 2), "utf-8");
      } catch (err) {
        console.error("Could not write settings to disk (read-only FS environment):", err);
      }
      res.json({
        success: true,
        message: "Настройки успешно сохранены",
        settings: currentSettings
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Ошибка сохранения" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "ТБ-Ресурс Node.js Server",
      version: "2.4.0",
      nodeVersion: process.version,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    });
  });

  // GET all leads (for demo Admin / Live Monitor Drawer)
  app.get("/api/leads", (req, res) => {
    res.json({
      success: true,
      count: leads.length,
      leads: leads
    });
  });

  // GET export leads as CSV file (for easy Excel upload/download on any hosting)
  app.get("/api/leads/export", (req, res) => {
    const csvHeader = "ID,Дата,Имя,Телефон,Хозяйство,Голов,Продукт,Комментарий,Статус\n";
    const csvRows = leads.map(l => {
      const escape = (str?: string | number) => `"${String(str || "").replace(/"/g, '""')}"`;
      return [
        escape(l.id),
        escape(new Date(l.createdAt).toLocaleString("ru-RU")),
        escape(l.name),
        escape(l.phone),
        escape(l.farmName),
        escape(l.cowsCount || ""),
        escape(l.selectedProduct),
        escape(l.comment),
        escape(l.status)
      ].join(",");
    }).join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="tb_resurs_leads_${new Date().toISOString().slice(0,10)}.csv"`);
    res.send("\uFEFF" + csvHeader + csvRows);
  });

  // POST new feedback lead
  app.post("/api/feedback", (req, res) => {
    const { name, phone, farmName, comment, cowsCount, selectedProduct } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: "Имя и номер телефона являются обязательными полями"
      });
    }

    const newLead: Lead = {
      id: `TBR-${new Date().getFullYear()}-${105 + leads.length}`,
      createdAt: new Date().toISOString(),
      name,
      phone,
      farmName: farmName || "Не указано",
      comment: comment || "",
      cowsCount: cowsCount ? Number(cowsCount) : undefined,
      selectedProduct: selectedProduct || "Общий запрос",
      status: "new"
    };

    leads.unshift(newLead); // Add to beginning of array

    res.status(201).json({
      success: true,
      message: "Заявка успешно принята! Наш инженер свяжется с вами в течение 15 минут.",
      orderId: newLead.id,
      lead: newLead
    });
  });

  // POST calculate ROI endpoint
  app.post("/api/calculate", (req, res) => {
    const { cows = 200, currentYield = 25, milkPrice = 38 } = req.body;

    const numCows = Number(cows);
    const yieldPerDay = Number(currentYield);
    const price = Number(milkPrice);

    // Calculation models based on veterinary studies of comfortable rubber flooring:
    // +12% milk yield boost due to increased lying time (14 hours instead of 8-9 hours on concrete)
    const extraMilkPerDayPerCow = yieldPerDay * 0.12;
    const extraDailyRevenue = numCows * extraMilkPerDayPerCow * price;
    const extraAnnualRevenue = extraDailyRevenue * 365;

    // Savings on mastitis and hoof lameness (approx 8400 RUB per cow/year on concrete vs rubber)
    const annualVetSavings = numCows * 8400;
    
    // Estimated investment cost (average mat cost per stall ~ 4800 RUB)
    const estimatedInvestment = numCows * 4800;
    const paybackMonths = Math.max(1, Math.round((estimatedInvestment / ((extraAnnualRevenue + annualVetSavings) / 12)) * 10)) / 10;

    res.json({
      success: true,
      data: {
        cows: numCows,
        yieldBoostPercent: 12,
        extraMilkPerCowDaily: Math.round(extraMilkPerDayPerCow * 10) / 10,
        extraAnnualRevenueRub: Math.round(extraAnnualRevenue),
        annualVetSavingsRub: Math.round(annualVetSavings),
        totalAnnualBenefitRub: Math.round(extraAnnualRevenue + annualVetSavings),
        estimatedInvestmentRub: Math.round(estimatedInvestment),
        paybackPeriodMonths: paybackMonths
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ТБ-Ресурс] Node.js server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
