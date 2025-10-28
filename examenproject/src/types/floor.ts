export interface Floor {
    id: string;
    naam: string;
    width: number;
    height: number;
    x: number;
    y: number;
    omschrijving?: string;
}

export interface FloorFormData {
    naam: string;
    width: number;
    height: number;
    x: number;
    y: number;
    omschrijving?: string;
}