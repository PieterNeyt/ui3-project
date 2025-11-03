import { z } from 'zod';

export const deviceSchema = z.object({
    naam: z.string().min(1, 'Naam is verplicht'),
    type: z.enum(['licht', 'verwarming', 'deurslot', 'audio']),
    upcCode: z.string().length(13, 'UPC code moet 13 cijfers zijn').regex(/^\d+$/, 'UPC code mag alleen cijfers bevatten'),
    kamerId: z.string().min(1, 'Kamer is verplicht'),
    x: z.number().min(0, 'X moet 0 of groter zijn'),
    y: z.number().min(0, 'Y moet 0 of groter zijn'),
    omschrijving: z.string().optional(),
    defaultWaarde: z.unknown(),
});

export type FormData = z.infer<typeof deviceSchema>;