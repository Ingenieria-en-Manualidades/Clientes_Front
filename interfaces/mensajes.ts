//Modelo para que typeScript pueda identificar que algunos composables o funciones retornan estos objetos para mensajes Toast.
export interface mensajeSencillo {
    status: string | undefined,
    tittle: string | undefined,
    detail: string | null | undefined,
  }