export interface IInbox {
  id: number;
  company_id: number;
  name: string;
  domain: string;
  username: string;
  password: string;
  status: string;
  max_size: number;
  emails_count: number;
  emails_unread_count: number;
  email_username: string;
  email_username_enabled: boolean;
  email_domain: string;
  last_message_sent_at_timestamp: number;
  smtp_ports: number[];
  pop3_ports: number[];
  has_inbox_address: boolean;
}
