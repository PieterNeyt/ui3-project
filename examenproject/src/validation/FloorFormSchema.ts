import { z } from 'zod';

export const floorFormSchema = z.object({
    naam: z.string().min(1, 'Naam is verplicht'),
    width: z.number().min(1, 'Breedte moet groter zijn dan 0'),
    height: z.number().min(1, 'Hoogte moet groter zijn dan 0'),
    x: z.number().min(0, 'X moet 0 of groter zijn'),
    y: z.number().min(0, 'Y moet 0 of groter zijn'),
    omschrijving: z.string().optional(),
});
