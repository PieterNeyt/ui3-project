import {
    Box,
    Card,
    CardContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import type { Room } from '../../types/room.ts';
import type {Floor} from "../../types/floor.ts";

interface SearchFiltersProps {
    searchTerm: string;
    selectedType: string;
    selectedRoom: string;
    selectedFloor: string;
    rooms: Room[];
    floors: Floor[];
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onRoomChange: (value: string) => void;
    onFloorChange: (value: string) => void;
}

export const SearchFilters = ({
                                  searchTerm,
                                  selectedType,
                                  selectedRoom,
                                  selectedFloor,
                                  rooms,
                                  floors,
                                  onSearchChange,
                                  onTypeChange,
                                  onRoomChange,
                                  onFloorChange,
                              }: SearchFiltersProps) => {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    alignItems: { xs: 'stretch', md: 'center' }
                }}>
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            fullWidth
                            label="Zoeken..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                            placeholder="Zoek op naam, omschrijving of UPC..."
                        />
                    </Box>
                    <Box sx={{ width: { xs: '100%', md: 200 } }}>
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={selectedType}
                                label="Type"
                                onChange={(e) => onTypeChange(e.target.value)}
                            >
                                <MenuItem value="all">Alle types</MenuItem>
                                <MenuItem value="licht">Licht</MenuItem>
                                <MenuItem value="verwarming">Verwarming</MenuItem>
                                <MenuItem value="deurslot">Deurslot</MenuItem>
                                <MenuItem value="audio">Audio</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ width: { xs: '100%', md: 200 } }}>
                        <FormControl fullWidth>
                            <InputLabel>Kamer</InputLabel>
                            <Select
                                value={selectedRoom}
                                label="Kamer"
                                onChange={(e) => onRoomChange(e.target.value)}
                            >
                                <MenuItem value="all">Alle kamers</MenuItem>
                                {rooms.map(room => (
                                    <MenuItem key={room.id} value={room.id}>
                                        {room.naam}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ width: { xs: '100%', md: 200 } }}>
                        <FormControl fullWidth>
                            <InputLabel>Verdieping</InputLabel>
                            <Select
                                value={selectedFloor}
                                label="Verdieping"
                                onChange={(e) => onFloorChange(e.target.value)}
                            >
                                <MenuItem value="all">Alle verdiepingen</MenuItem>
                                {floors.map(floor => (
                                    <MenuItem key={floor.id} value={floor.id}>
                                        {floor.naam}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};