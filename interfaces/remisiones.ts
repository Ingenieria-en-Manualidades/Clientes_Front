export interface Remision {
    remision_id: number;
    no_remision: string;
    estado_remision: string;
    fecha: string;
    orden_compra: string;
    numero_pedido: string;
    valor: number;
    observacion: string;
    iva: number;
    nombre: string;
    apellido: string;
    nombre_cliente: string;
    motivo: string | null;
    estado: string | null;
  }

export interface RemisionPost {
  accion: string,
  motivo: string,
  cliente_id: string | null;
  usuario: string | null;
  remision_id: number | undefined,
}

export interface ApiPromise<T> {
  success: boolean;
  remisiones?: T;
  error?: string;
}