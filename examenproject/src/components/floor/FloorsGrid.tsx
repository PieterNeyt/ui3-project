import {
    Alert,
    Box,
    Card,
    CardContent,
    CardActions,
    IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { FloorPreview } from './display/FloorPreview.tsx';
import type { Floor } from '../../types/floor.ts';

interface FloorsGridProps {
    floors?: Floor[];
    isAdmin: boolean;
    onEditFloor: (floor: Floor) => void;
    onDeleteFloor: (id: string) => void;
    isSubmitting: boolean;
}

export const FloorsGrid = ({
                               floors,
                               isAdmin,
                               onEditFloor,
                               onDeleteFloor,
                               isSubmitting
                           }: FloorsGridProps) => {
    if (!floors || floors.length === 0) {
        return (
            <Alert severity="info">
                Er zijn nog geen verdiepingen. Maak er een aan om te beginnen.
            </Alert>
        );
    }

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)'
                },
                gap: 3,
                width: '100%',
                maxWidth: 1200
            }}
        >
            {floors.map((floor) => (
                <FloorCard
                    key={floor.id}
                    floor={floor}
                    isAdmin={isAdmin}
                    onEditFloor={onEditFloor}
                    onDeleteFloor={onDeleteFloor}
                    isSubmitting={isSubmitting}
                />
            ))}
        </Box>
    );
};

interface FloorCardProps {
    floor: Floor;
    isAdmin: boolean;
    onEditFloor: (floor: Floor) => void;
    onDeleteFloor: (id: string) => void;
    isSubmitting: boolean;
}

const FloorCard = ({ floor, isAdmin, onEditFloor, onDeleteFloor, isSubmitting }: FloorCardProps) => {
    return (
        <Card>
            <CardContent>
                <FloorPreview floor={floor} />
            </CardContent>
            {isAdmin && (
                <CardActions>
                    <IconButton
                        color="primary"
                        onClick={() => onEditFloor(floor)}
                        disabled={isSubmitting}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => onDeleteFloor(floor.id)}
                        disabled={isSubmitting}
                    >
                        <Delete />
                    </IconButton>
                </CardActions>
            )}
        </Card>
    );
};