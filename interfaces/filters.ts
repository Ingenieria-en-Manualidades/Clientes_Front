export interface HeaderWithFilters {
    label: string,
    options: Option | null | undefined,
}

interface Option {
    atribute: string,
    labels: string[],
}

export interface WarningTable {
    success: boolean,
    label: string,
}