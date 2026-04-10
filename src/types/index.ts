export type ReportStatus = 'pending' | 'in-progress' | 'resolved';

export interface Report {
  id: string;
  created_at: string;
  reporter_name?: string;
  victim_name: string;
  incident_date: string;
  location: string;
  description: string;
  status: ReportStatus;
  response?: string;
  user_id?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'student' | 'admin';
  full_name: string;
}
