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

  export interface PreviewRemision {
    programacion_id: string,
    nombre: string,
    codigo_cobro: number,
    unidades: number,
    precio: number,
    documento_material: null,
    documento_orden: null,
    fecha: string,
    orden_compra: "-",
    numero_pedido: "-",
    observacion: "-",
    valor: "12490.00",
    round: "79.00",
    totalredondeado: "2370.00"
  }

export interface RemisionPost {
  accion: string,
  motivo: string | null,
  cliente_id: string | null | undefined;
  usuario: string | null | undefined;
  remision_id: number | undefined,
}

export interface ApiPromise<T> {
  success: boolean;
  remisiones?: T;
  error?: string;
}