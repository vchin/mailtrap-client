import { AxiosInstance } from "axios";
import { BlacklistsReportInfo } from "./BlacklistsReportInfo";

export class Message {
  public id: number;
  public inbox_id: number;
  public subject: string;
  public sent_at: string;
  public from_email: string;
  public from_name: string;
  public to_email: string;
  public to_name: string;
  public html_body: string;
  public text_body: string;
  public email_size: number;
  public is_read: boolean;
  public created_at: string;
  public updated_at: string;
  public sent_at_timestamp: number;
  public human_size: number;
  public html_path: string;
  public txt_path: string;
  public raw_path: string;
  public download_path: string;
  public viruses_report_info: boolean;
  public blacklists_report_info: BlacklistsReportInfo;

  constructor(message: object) {
    Object.assign(this, message);
  }
}
