export interface Meta {
    cumplimiento: number;
    eficienciaProductiva: number;
    calidad: number;
    desperdicioME: number;
    desperdicioPP: number;
    cliente_endpoint_id: string | null | undefined;
  }

  export interface Calidad {
    checklist: number,
    inspeccion: number,
    meta_id: number,
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