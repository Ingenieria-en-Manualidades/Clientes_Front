import { useRuntimeConfig } from "nuxt/app";

export interface DetailedAssemblyPreviewRow {
  start_date: string;
  end_date: string;
  nombre_cliente: string;
  client_id: number;
  sku: string;
  producto: string;
  activity_id: string;
  value: number;
}

export interface DetailedAssemblyPreviewData {
  year: number;
  week: number;
  username: string;
  values: DetailedAssemblyPreviewRow[];
}

export interface DetailedAssemblySaveRow {
  client_id: number;
  sku: string;
  producto: string;
  value: number;
}

export interface DetailedAssemblySaveRequest {
  year: number;
  week: number;
  username: string;
  values: DetailedAssemblySaveRow[];
  replace_existing?: boolean;
}

export interface DetailedAssemblySaveData {
  detailed_assembly_id: number;
  details_count?: number;
  year?: number;
  week?: number;
  username?: string;
}

export type DetailedAssemblyValidationError =
  | string[]
  | Record<string, string[]>;

export type DetailedAssemblyValidationErrors = Record<
  string,
  DetailedAssemblyValidationError
>;

export interface DetailedAssemblyPreviewRequest {
  file: File;
  year: number;
  week: number;
  username: string;
}

export interface DetailedAssemblyApiResponse<TData = unknown> {
  success: boolean;
  title: string;
  message: string;
  data?: TData;
  errors?: DetailedAssemblyValidationErrors;
}

export interface DetailedAssemblySaveResponse
  extends DetailedAssemblyApiResponse<DetailedAssemblySaveData> {
  requiresConfirmation?: boolean;
}

export interface WeeklyDetailedAssemblyListRow {
  weekly_detailed_assembly_id: number;
  client_name: string | null;
  sku: string | null;
  product: string | null;
  weekly_total: number;
  username: string;
}

export interface DetailedAssemblyListRow {
  detailed_assembly_id: number;
  year: number;
  week_number: number;
  week_start_date: string;
  week_end_date: string;
  username: string;
  weekly_detailed_assembly: WeeklyDetailedAssemblyListRow[];
}

export const useDetailedAssemblyApi = () => {
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;

  const previewExcel = async (
    previewData: DetailedAssemblyPreviewRequest,
  ): Promise<DetailedAssemblyApiResponse<DetailedAssemblyPreviewData>> => {
    try {
      const formData = new FormData();
      formData.append("archivo", previewData.file);
      formData.append("year", previewData.year.toString());
      formData.append("week", previewData.week.toString());
      formData.append("username", previewData.username);

      const response = await fetch(`${url}api/detailed-assembly/preview`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
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
      console.error("Error al previsualizar el armado detallado:", error);

      return {
        success: false,
        title: "Error de conexión",
        message: "No fue posible conectar con el servidor.",
      };
    }
  };

  const saveDetailedAssemblies = async (
    data: DetailedAssemblySaveRequest,
  ): Promise<DetailedAssemblySaveResponse> => {
    try {
      const response = await fetch(`${url}api/detailed-assembly/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      return {
        success: response.ok && result.success,
        title: response.ok ? "Armado guardado" : "No fue posible guardar",
        message: result.message || "No fue posible guardar el armado detallado.",
        data: result.data,
        errors: result.errors,
        requiresConfirmation: result.requires_confirmation === true,
      };
    } catch (error) {
      console.error("Error al guardar el armado detallado:", error);

      return {
        success: false,
        title: "Error de conexión",
        message: "No fue posible conectar con el servidor.",
      };
    }
  };

  const listDetailedAssemblies = async (): Promise<
    DetailedAssemblyApiResponse<DetailedAssemblyListRow[]>
  > => {
    try {
      const response = await fetch(`${url}api/detailed-assembly`, {
        headers: {
          Accept: "application/json",
        },
      });
      const result = await response.json();

      return {
        success: response.ok && result.success,
        title: response.ok && result.success
          ? "Consulta exitosa"
          : "No fue posible consultar",
        message: result.message || "No fue posible consultar el armado detallado.",
        data: result.data,
        errors: result.errors,
      };
    } catch (error) {
      console.error("Error al listar el armado detallado:", error);

      return {
        success: false,
        title: "Error de conexión",
        message: "No fue posible conectar con el servidor.",
      };
    }
  };

  return {
    previewExcel,
    saveDetailedAssemblies,
    listDetailedAssemblies,
  };
};
