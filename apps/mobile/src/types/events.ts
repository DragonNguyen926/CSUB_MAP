export type EventStatus = "scheduled" | "canceled";

export type EventRow = {
  id: string;
  title: string;
  category: string;
  description: string | null;

  building_id: string | null;
  room_detail: string | null;
  latitude: number | null;
  longitude: number | null;

  start_at: string; // ISO (UTC)
  end_at: string;   // ISO (UTC)
  timezone: string; // "America/Los_Angeles"

  flyer_url: string | null;
  status: EventStatus;

  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateEventInput = {
  title: string;
  category?: string;
  description?: string;

  // Use building_id for CSUB (recommended), coords optional
  buildingId?: string;
  roomDetail?: string;
  latitude?: number;
  longitude?: number;

  // UI input (local date/time)
  startDate: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endDate: string;   // "YYYY-MM-DD"
  endTime: string;   // "HH:mm"

  timezone?: string; // default "America/Los_Angeles"
  createdBy?: string;
};
