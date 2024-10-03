export interface Objetives {
    cumplimiento: string;
    eficienciaProductiva: string;
    calidad: string;
    desperdicioME: string;
    desperdicioPP: string;
    tablero_id: number,
  }

  export interface Calidad {
    checklist_mes: string,
    checklist_calificacion: number,
    inspeccion_mes: string,
    inspeccion_calificacion: number,
    tablero_id: number,
  }

  export interface Accidente {
    tipo_accidente: string,
    cantidad: number,
    fecha_ingreso: Date,
    tablero_id: number,
  }

  export interface ApiPromise<T> {
    success: boolean;
    data?: T | undefined;
    error?: string;
  }