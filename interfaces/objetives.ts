export interface Meta {
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
  }

  export interface Archivo {
    archivo: File | null,
    cliente_endpoint_id: number,
    tipo_formulario: string,
    tablero_sae_id: number
  }