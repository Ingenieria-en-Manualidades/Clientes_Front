export interface Improductividad {
    actividad: string;
    cant_personas: number;
    cliente_id: number;
    descripcion: string;
    dispositivo:string;
    estado: string;
    fecha_gestion: string;
    fecha_ingreso: string;
    horas: number;
    improductividad_id: number;
    linea_id: number;
    minutos: number;
    motivo: string;
    nombre_area: string;
    observacion: string;
    programacion_id: string;
    usuario_gestiona: string;
    usuario_reporta: string;
}

export interface postImproductividad {
    improductividad_id: number | undefined;
    estado: string | null | undefined;
    motivo: string | null | undefined;
    usuario_gestiona: string;
    cliente_id: string;
};