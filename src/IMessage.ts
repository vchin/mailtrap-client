import { IBlacklistsReportInfo } from "./IBlacklistsReportInfo";

export interface IMessage {
  id: number;
  inbox_id: number;
  subject: string;
  sent_at: string;
  from_email: string;
  from_name: string;
  to_email: string;
  to_name: string;
  html_body: string;
  text_body: string;
  email_size: number;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sent_at_timestamp: number;
  human_size: string;
  html_path: string;
  txt_path: string;
  raw_path: string;
  download_path: string;
  viruses_report_info: boolean;
  blacklists_report_info: IBlacklistsReportInfo;
}
