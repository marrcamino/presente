declare global {
  interface Office {
    id: number
    name: string
    abbr: string
    created_at: string
  }

  interface Employee {
    id: number
    office_id: Office["id"]
    name: string
    photo_path: string | null
    created_at: string
  }

  interface AttendanceStatus {
    id: number;
    code: string;
    label: string;
    is_system: 0 | 1
  }
}

export { };
