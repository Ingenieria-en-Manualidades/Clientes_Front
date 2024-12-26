export interface Improductividad {
    actividad: string;
    cant_personas: number;
    cliente_id: number;
    codigo_cobro: string;
    descripcion: string;
    dispositivo:string;
    estado: string;
    fecha_gestion: string;
    fecha_ingreso: string;
    horas: number;
    horasxpersonas: number;
    improductividad_id: number;
    linea_id: number;
    minutos: number;
    motivo: string;
    nombre_area: string;
    observacion: string;
    programacion_id: string;
    turno: string;
    usuario_gestiona: string;
    usuario_reporta: string;
    allocated_time: number;
}

export interface postImproductividad {
    improductividad_id: number | undefined;
    estado: string | null | undefined;
    motivo: string | null | undefined;
    usuario_gestiona: string | null | undefined;
    usuario: string | null | undefined;
    cliente_id: string | null | undefined;
};

export interface Error {
    estadoImproductividades: boolean,
    avisoIcono: string | null,
    avisodetalles: string | null,
}

export interface Alert {
    severity: "error" | "contrast" | "info" | "secondary" | "warn" | "success",
    summary: string,
    detail: string,
    life: number,
}

export interface promiseComp {
    success: boolean;
    data?: Improductividad[] | undefined;
}