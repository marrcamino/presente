import { getDb } from "$lib/db";
import { getContext, setContext } from "svelte";

const CONTEXT_KEY = Symbol("office-context");

class OfficeContext {
  readonly office: Office
  showEmployeeDialog = $state(false)
  openEmployee: Employee | null = $state(null)
  employees: Employee[] | null = $state(null)

  constructor(office: Office) {
    this.office = office;
  }

  async loadEmployees() {
    const db = await getDb();
    this.employees = await db.select<Employee[]>(
      "SELECT * FROM employees WHERE office_id = ? ORDER BY name ASC", [this.office.id]
    );
  }

  closeEmployeeDialog() {
    this.showEmployeeDialog = false
  }

  addEmployee(employee: Employee) {
    this.employees = [employee, ...(this.employees ?? [])].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }

  updateEmployee(employee: Employee) {
    if (!this.employees?.length) return
    this.employees = this.employees.map(e => e.id === employee.id ? employee : e)
  }

  removeEmployee(id: number) {
    if (!this.employees?.length) return
    this.employees = this.employees?.filter(e => e.id !== id)
  }
}

export function setOfficeContext(office: Office) {
  return setContext(CONTEXT_KEY, new OfficeContext(office))
}

export function getOfficeContext() {
  return getContext(CONTEXT_KEY) as OfficeContext
}
