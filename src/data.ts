export type Status = 'Draft' | 'Form ready' | 'Failed' | 'Awaiting certificate' | 'Sent' | 'Cancelled';
export interface Req { id: string; sys: string; branch: string; type: 'New' | 'Renewal' | 'Reissue'; updated: string; status: Status; action: string }
export const requests: Req[] = [
  { id: 'REQ-1048', sys: 'B0360155CA', branch: 'Head office', type: 'New', updated: '24 Oct · 10:02', status: 'Draft', action: 'Continue' },
  { id: 'REQ-1049', sys: 'B0360155CB', branch: 'Bole branch', type: 'New', updated: '24 Oct · 10:05', status: 'Form ready', action: 'Review' },
  { id: 'REQ-1050', sys: 'B0360155CC', branch: 'Piassa branch', type: 'New', updated: '24 Oct · 10:05', status: 'Failed', action: 'Fix CSR' },
  { id: 'REQ-1047', sys: 'B0360155CC', branch: 'Piassa branch', type: 'New', updated: '15 Oct · 09:18', status: 'Awaiting certificate', action: 'View' },
  { id: 'REQ-1046', sys: 'B0360155CB', branch: 'Bole branch', type: 'New', updated: '23 Oct · 14:40', status: 'Failed', action: 'Recover' },
  { id: 'REQ-1045', sys: 'B0360155CA', branch: 'Head office', type: 'Reissue', updated: '22 Oct · 11:30', status: 'Sent', action: 'View' },
  { id: 'REQ-1044', sys: 'B0360155CC', branch: 'Piassa branch', type: 'New', updated: '21 Oct · 16:12', status: 'Cancelled', action: 'View' },
  { id: 'REQ-1043', sys: 'B0360155CB', branch: 'Bole branch', type: 'Renewal', updated: '20 Oct · 08:45', status: 'Awaiting certificate', action: 'View' },
];
export const systems: [string, string, string][] = [
  ['Head office - Addis Ababa', 'B0360155CA', 'REQ-1048'],
  ['Bole branch - Addis Ababa', 'B0360155CB', 'REQ-1049'],
  ['Piassa branch - Addis Ababa', 'B0360155CC', 'REQ-1050'],
];
