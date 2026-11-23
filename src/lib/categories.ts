import { AirVent, Laptop, Refrigerator, Smartphone, Tv, WashingMachine, Zap, type LucideIcon } from "lucide-react";

export const CATEGORY_NAMES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const;
export type CategoryName = (typeof CATEGORY_NAMES)[number];

export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;
export type ServiceMode = (typeof SERVICE_MODES)[number];

export const CATEGORIES: { name: CategoryName; icon: LucideIcon; blurb: string }[] = [
  { name: "Smartphone", icon: Smartphone, blurb: "Screens, batteries, charging ports" },
  { name: "Laptop & PC", icon: Laptop, blurb: "Servicing, upgrades, software fixes" },
  { name: "AC", icon: AirVent, blurb: "Servicing, gas refill, installation" },
  { name: "Refrigerator", icon: Refrigerator, blurb: "Cooling faults and compressor repair" },
  { name: "TV", icon: Tv, blurb: "Panel, backlight and board repair" },
  { name: "Washing Machine", icon: WashingMachine, blurb: "Drum, motor and drainage faults" },
  { name: "Electrical", icon: Zap, blurb: "Wiring, switches and fittings" },
];

export function categoryHref(name: CategoryName): string {
  return `/services?category=${encodeURIComponent(name)}`;
}
