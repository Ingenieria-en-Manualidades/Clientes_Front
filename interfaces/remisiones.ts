//Modelo para recibir remisiones y crear arrays del mismo.
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
    motivo: string | undefined;
    estado: string | null;
  }

  //Modelo para recibir todos los detalles de una remisión y crear arrays del mismo.
  export interface PreviewRemision {
    programacion_id: string,
    nombre: string,
    codigo_cobro: number,
    unidades: number,
    precio: number,
    documento_material: string | null,
    documento_orden: string | null,
    fecha: string,
    orden_compra: string,
    numero_pedido: string,
    observacion: string,
    valor: number,
    round: number,
    totalredondeado: number
  }

//Modelo para hacer una inserción en la tabla 'remisiones_conciliacionxcliente'.
export interface RemisionPost {
  accion: string,
  motivo: string | null,
  cliente_id: string | null | undefined;
  usuario: string | null | undefined;
  remision_id: number | undefined,
  usuario_gestiona: string | null | undefined;
}

//Modelo hecha para retornar una data, el estado del proceso y el error de una función.
export interface ApiPromise<T> {
  success: boolean;
  data?: T | undefined;
  error?: string;
}