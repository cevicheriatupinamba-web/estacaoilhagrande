export type AppRole =
  | "super_admin"
  | "admin"
  | "financial_manager"
  | "content_manager"
  | "support_agent"
  | "user";

export const ROLE_LABEL: Record<AppRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  financial_manager: "Financeiro",
  content_manager: "Conteúdo",
  support_agent: "Suporte",
  user: "Usuário",
};

export const ROLE_COLOR: Record<AppRole, string> = {
  super_admin: "bg-gradient-to-r from-amber-500 to-rose-500 text-white",
  admin: "bg-primary text-primary-foreground",
  financial_manager: "bg-emerald-600 text-white",
  content_manager: "bg-sky-600 text-white",
  support_agent: "bg-violet-600 text-white",
  user: "bg-secondary text-foreground",
};

// Modules
export type Module =
  | "dashboard"
  | "crm"
  | "subscriptions"
  | "financial"
  | "leads"
  | "reviews"
  | "content"
  | "map"
  | "seo"
  | "bi"
  | "support"
  | "marketing"
  | "growth"
  | "roles"
  | "settings"
  | "activity";

export const MODULE_ACCESS: Record<Module, AppRole[]> = {
  dashboard:     ["super_admin", "admin", "financial_manager", "content_manager", "support_agent"],
  crm:           ["super_admin", "admin", "support_agent"],
  subscriptions: ["super_admin", "admin", "financial_manager"],
  financial:     ["super_admin", "admin", "financial_manager"],
  leads:         ["super_admin", "admin", "support_agent"],
  reviews:       ["super_admin", "admin", "content_manager", "support_agent"],
  content:       ["super_admin", "admin", "content_manager"],
  map:           ["super_admin", "admin", "financial_manager", "content_manager", "support_agent"],
  seo:           ["super_admin", "admin", "content_manager"],
  bi:            ["super_admin", "admin", "financial_manager"],
  support:       ["super_admin", "admin", "support_agent"],
  marketing:     ["super_admin", "admin", "content_manager"],
  growth:        ["super_admin", "admin", "financial_manager"],
  roles:         ["super_admin"],
  settings:      ["super_admin", "admin"],
  activity:      ["super_admin", "admin"],
};

export const canAccess = (roles: AppRole[], mod: Module) =>
  roles.some(r => MODULE_ACCESS[mod].includes(r));

export const STAFF_ROLES: AppRole[] = [
  "super_admin", "admin", "financial_manager", "content_manager", "support_agent",
];

export const isStaffRole = (r: string): r is AppRole =>
  (STAFF_ROLES as string[]).includes(r);
