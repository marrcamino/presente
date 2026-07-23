// Temporary mock data for building the attendance UI.
// Replace with real DB queries once attendance CRUD is wired up.

function getLastName(fullName: string): string {
  const parts = fullName.trim().split(" ");
  return parts[parts.length - 1];
}

// Temporary mock data for building the attendance UI.
// Replace with real DB queries once attendance CRUD is wired up.

export const mockEmployees: Employee[] = [
  { id: 1, office_id: 1, name: "Abad, Juan D.", photo_path: null, created_at: "" },
  { id: 2, office_id: 1, name: "Bautista, Maria S.", photo_path: null, created_at: "" },
  { id: 3, office_id: 1, name: "Cruz, Jose R.", photo_path: null, created_at: "" },
  { id: 4, office_id: 1, name: "Dela Cruz, Ana P.", photo_path: null, created_at: "" },
  { id: 5, office_id: 1, name: "Estrada, Pedro L.", photo_path: null, created_at: "" },
  { id: 6, office_id: 1, name: "Flores, Carmen T.", photo_path: null, created_at: "" },
  { id: 7, office_id: 1, name: "Garcia, Ramon V.", photo_path: null, created_at: "" },
  { id: 8, office_id: 1, name: "Hernandez, Liza M.", photo_path: null, created_at: "" },
  { id: 9, office_id: 1, name: "Ignacio, Ricky B.", photo_path: null, created_at: "" },
  { id: 10, office_id: 1, name: "Javier, Grace N.", photo_path: null, created_at: "" },
  { id: 11, office_id: 1, name: "Lopez, Tomas C.", photo_path: null, created_at: "" },
  { id: 12, office_id: 1, name: "Mendoza, Nina F.", photo_path: null, created_at: "" },
  { id: 13, office_id: 1, name: "Navarro, Boy A.", photo_path: null, created_at: "" },
  { id: 14, office_id: 1, name: "Ortega, Cristina G.", photo_path: null, created_at: "" },
  { id: 15, office_id: 1, name: "Perez, Danilo H.", photo_path: null, created_at: "" },
  { id: 16, office_id: 1, name: "Reyes, Elena K.", photo_path: null, created_at: "" },
  { id: 17, office_id: 1, name: "Santos, Fernando Q.", photo_path: null, created_at: "" },
  { id: 18, office_id: 1, name: "Torres, Gina W.", photo_path: null, created_at: "" },
  { id: 19, office_id: 1, name: "Uy, Henry X.", photo_path: null, created_at: "" },
  { id: 20, office_id: 1, name: "Villanueva, Irene Y.", photo_path: null, created_at: "" }
];

export type EmployeeGroup = {
  letter: string;
  employees: Employee[];
};

export function groupEmployeesByName(employees: Employee[]): EmployeeGroup[] {
  const map = new Map<string, Employee[]>();

  const sorted = [...employees].sort((a, b) => a.name.localeCompare(b.name));

  for (const emp of sorted) {
    const letter = emp.name.charAt(0).toUpperCase();
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(emp);
  }

  return Array.from(map.entries()).map(([letter, employees]) => ({ letter, employees }));
}