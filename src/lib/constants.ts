import { House, Building2 } from "@lucide/svelte";

export const PAGES = [
  { label: "Attendance", href: "/", icon: House },
  { label: "Offices", href: "/offices", icon: Building2 },
] as const

export type PageHref = (typeof PAGES)[number]["href"]