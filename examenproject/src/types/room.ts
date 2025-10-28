
export interface Room {
    id: string;
    naam: string;
    verdiepingId: string;
    width: number;
    height: number;
    x: number;
    y: number;
    omschrijving?: string;
}

export interface RoomFormData {
    naam: string;
    verdiepingId: string;
    width: number;
    height: number;
    x: number;
    y: number;
    omschrijving?: string;
}