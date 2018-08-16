import { IBlacklistReport } from "./IBlacklistReport";

export interface IBlacklistsReportInfo {
  result: string;
  domain: string;
  ip: string;
  report: IBlacklistReport[];
}
