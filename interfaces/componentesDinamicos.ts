export interface tablaDinamica {
    styleTable: string,
    caption: { label: string, style: string } | null,
    headers: { labels: String[], style: string },
    tbodyStyle: string | null,
    rowStyle: string,
    tfootStyle: string | null,
}

export interface User {
    id: string,
    name: string,
    apellido: string
}