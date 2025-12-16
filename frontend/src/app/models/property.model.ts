import { Lead } from "./lead.model";

export interface Property {
  id?: string;
  leadId: string;
  cultura: string;
  areaHectares: number;
  lead?: Lead;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PropertyType = Property;
