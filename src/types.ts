export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  specs: string[];
}

// FIX: Replacing Enum with 'as const' object to fix TS1294
export const ProductCategory = {
  SEMICONDUCTORS: "Semiconductors",
  PASSIVE: "Passive Components",
  SENSORS: "Sensors",
  CONNECTORS: "Connectors",
  IOT: "IoT Modules",
  POWER: "Power Management"
} as const;

// Creating a type from the object values
export type ProductCategoryType = typeof ProductCategory[keyof typeof ProductCategory];

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface NavLink {
  label: string;
  path: string;
}