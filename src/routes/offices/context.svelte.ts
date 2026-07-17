import { getContext, setContext } from "svelte";
import { getDb } from "$lib/db";

const CONTEXT_KEY = Symbol("app-context");

class OfficeContext {
  openEditDialog = $state(false)
  deleteDialog = $state(false)
  openOffice: Office | null = $state(null)
  offices: Office[] | null = $state(null)

  async loadOffices() {
    const db = await getDb();
    this.offices = await db.select<Office[]>(
      "SELECT * FROM offices ORDER BY name ASC",
    );
  }

  addOffice(office: Office) {
    this.offices = [office, ...(this.offices ?? [])]
  }

  updateOffice(office: Office) {
    if (!this.offices?.length) return
    this.offices = this.offices.map(o => o.id === office.id ? office : o)
  }

  removeOffice(id: number) {
    if (!this.offices?.length) return
    this.offices = this.offices?.filter(o => o.id !== id)
  }
}

export function setOfficeContext() {
  return setContext(CONTEXT_KEY, new OfficeContext)
}

export function getOfficeContext() {
  return getContext(CONTEXT_KEY) as OfficeContext
}
