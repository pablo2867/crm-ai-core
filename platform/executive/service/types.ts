import type {
  ExecutiveDashboardDTO,
} from "@/platform/executive";

export interface ExecutiveServiceResult {

  success: boolean;

  report: ExecutiveDashboardDTO;

}