export interface TimeSlot {
    id: string;
    sceneId: string;
    startTime: string; // Format: "HH:mm"
    endTime: string;   // Format: "HH:mm"
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface TimeSlotFormData {
    sceneId: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
}