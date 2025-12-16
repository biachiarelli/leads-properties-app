import { Lead } from '../../core/models/lead.model';

const mainArea = 100;

export function isPriorityLead(lead: Lead): boolean {
  if (!lead.properties || lead.properties.length === 0) {
    return false;
  }
  
  const totalArea = getTotalArea(lead);
  
  return totalArea > mainArea;
}

export function isPriorityArea(areaHectares: number): boolean {
  return areaHectares > mainArea;
}

export function getTotalArea(lead: Lead): number {
  if (!lead.properties || lead.properties.length === 0) {
    return 0;
  }
  
  return lead.properties.reduce(
    (sum, property) => sum + ( Number(property.areaHectares) || 0),
    0
  );
}

