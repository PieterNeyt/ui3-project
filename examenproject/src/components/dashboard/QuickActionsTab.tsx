import { Box, Card, CardContent, Typography, Button } from '@mui/material';

interface QuickActionsTabProps {
    onQuickAction: (action: string) => void;
}

export const QuickActionsTab = ({ onQuickAction }: QuickActionsTabProps) => {
    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: { xs: 'center', md: 'flex-start' }
        }}>
            <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, maxWidth: 400 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Alle lichten uit
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Zet alle lichten in huis uit
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onQuickAction('allLightsOff')}
                        >
                            Uitvoeren
                        </Button>
                    </CardContent>
                </Card>
            </Box>
            <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, maxWidth: 400 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Vertrek modus
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Stel alle thermostaten in op 16°C en doe deuren op slot
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onQuickAction('awayMode')}
                        >
                            Activeren
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};