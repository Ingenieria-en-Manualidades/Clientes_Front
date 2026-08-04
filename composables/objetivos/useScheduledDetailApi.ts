import { useRuntimeConfig } from "nuxt/app";

export interface ScheduledDetailPreviewRow {
  start_date: string;
  end_date: string;
  nombre_cliente: string;
  client_id: number;
  sku: string;
  producto: string;
  activity_id: string;
  value: number;
}

export interface ScheduledDetailPreviewData {
  year: number;
  week: number;
  username: string;
  values: ScheduledDetailPreviewRow[];
}

export interface ScheduledDetailSaveRow extends ScheduledDetailPreviewRow {
  year: number;
  week: number;
  username: string;
}

export interface ScheduledDetailSaveRequest extends ScheduledDetailPreviewData {
  replace_existing?: boolean;
}

export interface ScheduledDetailSaveData {
  scheduled_detail_id: number;
  details_count?: number;
  year?: number;
  week?: number;
  username?: string;
}

export type ScheduledDetailValidationError =
  | string[]
  | Record<string, string[]>;

export type ScheduledDetailValidationErrors = Record<
  string,
  ScheduledDetailValidationError
>;

interface ScheduledDetailPreviewRequest {
  file: File;
  year: number;
  week: number;
  username: string;
}

export interface ScheduledDetailApiResponse<TData = unknown> {
  success: boolean;
  title: string;
  message: string;
  data?: TData;
  errors?: ScheduledDetailValidationErrors;
}

export interface ScheduledDetailSaveResponse
  extends ScheduledDetailApiResponse<ScheduledDetailSaveData> {
  requiresConfirmation?: boolean;
}

export interface WeeklyScheduledDetailListRow {
  weekly_scheduled_detail_id: number;
  client_name: string | null;
  sku: string;
  product: string;
  activity_id: string | null;
  weekly_total: number;
  username: string;
}

export interface ScheduledDetailListRow {
  scheduled_detail_id: number;
  year: number;
  week_number: number;
  week_start_date: string;
  week_end_date: string;
  username: string;
  weekly_scheduled_detail: WeeklyScheduledDetailListRow[];
}

export const useScheduledDetailApi = () => {
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;

  const previewExcel = async (
    previewData: ScheduledDetailPreviewRequest,
  ): Promise<ScheduledDetailApiResponse<ScheduledDetailPreviewData>> => {
    try {
      const formData = new FormData();
      formData.append("archivo", previewData.file);
      formData.append("year", previewData.year.toString());
      formData.append("week", previewData.week.toString());
      formData.append("username", previewData.username);

      const response = await fetch(`${url}api/scheduled-detail/preview`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return {
          success: true,
          title: "Archivo válido",
          message: result.message,
          data: result.data,
        };
      }

      return {
        success: false,
        title: "No fue posible previsualizar",
        message: result.message || "El archivo Excel no cumple con la plantilla requerida.",
        errors: result.errors,
      };
    } catch (error) {
      console.error("Error al previsualizar la programación detallada:", error);

      return {
        success: false,
        title: "Error de conexión",
        message: "No fue posible conectar con el servidor.",
      };
    }
  };

  const saveScheduledDetails = async (
    data: ScheduledDetailSaveRequest,
  ): Promise<ScheduledDetailSaveResponse> => {
    try {
      const response = await fetch(`${url}api/scheduled-detail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      return {
        success: response.ok && result.success,
        title: response.ok ? "Programación guardada" : "No fue posible guardar",
        message: result.message || "No fue posible guardar la programación detallada.",
        data: result.data,
        errors: result.errors,
        requiresConfirmation: result.requires_confirmation === true,
      };
    } catch (error) {
      console.error("Error al guardar la programación detallada:", error);

      return {
        success: false,
        title: "Error de conexión",
        message: "No fue posible conectar con el servidor.",
      };
    }
  };

  const listScheduledDetails = async (): Promise<ScheduledDetailApiResponse<ScheduledDetailListRow[]>> => {
    try {
      const response = await fetch(`${url}api/scheduled-detail`);
      const result = await response.json();

      return {
        success: response.ok && result.success,
        title: response.ok ? "Consulta exitosa" : "No fue posible consultar",
        message: result.message || "No fue posible consultar la programación detallada.",
        data: result.data,
        errors: result.errors,
      };
    } catch (error) {
      console.error("Error al listar la programación detallada:", error);

      return {
        success: false,
        title: "Error de conexión",
        message: "No fue posible conectar con el servidor.",
      };
    }
  };

  return {
    previewExcel,
    saveScheduledDetails,
    listScheduledDetails,
  };
};
