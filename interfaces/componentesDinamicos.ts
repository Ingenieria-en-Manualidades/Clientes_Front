export interface User {
    id: string,
    name: string,
    apellido: string
}

export interface ItemTabPanel {
    route: string,
    label: string,
    icon: string,
}

export interface OptionDropdown {
    label: string | null,
    value: string | Number | null,
    permissions?: { id: number | string; name?: string }[],
}

export interface Regex {
    regex: string,
    check: boolean,
}
