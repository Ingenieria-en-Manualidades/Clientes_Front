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
}

export interface Regex {
    regex: string,
    check: boolean,
}