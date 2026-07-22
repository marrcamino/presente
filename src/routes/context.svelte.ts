import { getDb } from "$lib/db";
import { getContext, setContext } from "svelte";

const CONTEXT_KEY = Symbol("root-context");

class RootContext {
  offices: Office[] = $state([])
  selectedOffice: Office | null = $state(null)
  constructor() {
    this.loadOffices()
  }

  private async loadOffices() {
    const db = await getDb();
    this.offices = await db.select<Office[]>(
      "SELECT * FROM offices ORDER BY name ASC",
    );
    if (this.offices.length) {
      this.selectedOffice = this.offices[0]
    }
  }
}


export function setRootContext() {
  return setContext(CONTEXT_KEY, new RootContext)
}

export function getRootContext() {
  return getContext(CONTEXT_KEY) as RootContext
}
