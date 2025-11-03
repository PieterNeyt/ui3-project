import {
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
} from '@mui/material';
import type { Scene, SceneFormData } from '../../../types/scene.ts';

interface SceneFormHeaderProps {
    formData: SceneFormData;
    onFormDataChange: (data: SceneFormData) => void;
    canModifyGlobal: boolean;
    scene?: Scene | null;
}

export const SceneFormHeader = ({
                                    formData,
                                    onFormDataChange,
                                    canModifyGlobal,
                                    scene,
                                }: SceneFormHeaderProps) => {
    const handleFieldChange = (field: keyof SceneFormData, value: string | boolean) => {
        onFormDataChange({ ...formData, [field]: value });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Scene Naam"
                value={formData.naam}
                onChange={(e) => handleFieldChange('naam', e.target.value)}
                fullWidth
                required
            />

            <TextField
                label="Omschrijving"
                value={formData.omschrijving}
                onChange={(e) => handleFieldChange('omschrijving', e.target.value)}
                fullWidth
                multiline
                rows={2}
            />

            <TextField
                label="Afbeelding URL"
                value={formData.image}
                onChange={(e) => handleFieldChange('image', e.target.value)}
                fullWidth
                placeholder="https://example.com/image.jpg"
            />

            {canModifyGlobal && (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.isGlobal}
                            onChange={(e) => handleFieldChange('isGlobal', e.target.checked)}
                            disabled={scene ? scene.isGlobal : false}
                        />
                    }
                    label="Globale Scene (zichtbaar voor alle gebruikers)"
                />
            )}
        </Box>
    );
};