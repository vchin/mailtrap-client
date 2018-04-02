import { AxiosInstance } from "axios";

export class Inbox {
  public id: number;
  public company_id: number;
  public name: string;
  public domain: string;
  public username: string;
  public password: string;
  public status: string;
  public max_size: number;
  public emails_count: number;
  public emails_unread_count: number;
  public email_username: string;
  public email_username_enabled: string;
  public email_domain: string;
  public last_message_sent_at_timestamp: number;
  public smtp_ports: number[];
  public pop3_ports: number[];
  public has_inbox_address: boolean;

  constructor(inbox: object) {
    Object.assign(this, inbox);
  }
}
