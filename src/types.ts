export interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    specs: string[];
  }
  
  export enum ProductCategory {
    SEMICONDUCTORS = "Semiconductors",
    PASSIVE = "Passive Components",
    SENSORS = "Sensors",
    CONNECTORS = "Connectors",
    IOT = "IoT Modules",
    POWER = "Power Management"
  }
  
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