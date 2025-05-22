export interface Meta {
    fecha: string;
    cumplimiento: number;
    eficienciaProductiva: number;
    calidad: number;
    desperdicioME: number;
    desperdicioPP: number;
    cliente_endpoint_id: string | null | undefined;
  }

  export interface Calidad {
    fecha: Date | string | null,
    cliente_endpoint_id: number,
    checklist: number | null | undefined,
    inspeccion: number | null | undefined,
    archivo: File | null,
    tipo_formulario: string,
    yearFile: string,
  }

  export interface Accidente {
    tipo_accidente: string,
    cantidad: number,
    objetivos_id: number,
  }

  export interface Objetivos {
    fecha: Date | null | undefined,
    cliente_id: number | null,
    planificada: number | null,
    modificada: number | null,
    plan_armado: number | null,
    calidad: number | null,
    desperfecto_me: number | null,
    desperfecto_pp: number | null,
  }

  export interface ApiPromise<T> {
    success: boolean;
    data?: T | undefined;
    error?: string;
    status?: number;
  }

  export interface Archivo {
    archivo: File | null,
    cliente_endpoint_id: number,
    tipo_formulario: string,
    tablero_sae_id: number,
    year_file: string,
  }

  export interface DataArchivos {
    nombre: string | null,
    tipo_calidad: string | null,
    tablero_sae_id: number | null,
    meta: string | null,
    url: string | null,
    id: number | null,
  }

  export interface UpdateArchivo {
    archivo: File | null,
    cliente_endpoint_id: number,
    tipo_formulario: string,
    tablero_sae_id: number,
    year_file: string,
    url: string,
    id: number,
  }

  export interface Units {
    valor: Number | null,
    fecha_meta: Date | null,
    cliente_endpoint_id: Number | null,
    area_id: Number | null,
    usuario: String | null | undefined,
    motivo_actualizacion: String | null | undefined,
  }

  export interface UnitsDaily {
    valor: Number | null,
    fecha_programacion: Date | null,
    cliente_endpoint_id: Number | null,
    area_id: Number | null,
    usuario: String | null | undefined,
  }

  export interface Area {
    activo: string | null,
    area_id: Number | null,
    cliente_id: Number | null,
    created_at: Date | string | null,
    deleted_at: Date | string | null,
    nombre_area: string | null,
    updated_at: Date | string | null,
    usuario: string | null,
  }

  export interface ApiPromiseStandard<T> {
    success: boolean;
    title: string,
    message: string,
    data?: T | undefined;
  }
  