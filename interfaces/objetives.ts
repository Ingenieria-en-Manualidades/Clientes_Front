export interface Objetives {
    cumplimiento: string;
    eficienciaProductiva: string;
    calidad: string;
    desperdicioME: string;
    desperdicioPP: string;
  }

  export interface ApiPromise<T> {
    success: boolean;
    data?: T | undefined;
    error?: string;
  }