<script lang="ts">
  import { getDb } from "$lib/db";

  let offices = $state<{ id: number; name: string; created_at: string }[]>([]);
  let newOfficeName = $state("");
  let log = $state("");

  async function loadOffices() {
    const db = await getDb();
    offices = await db.select("SELECT * FROM offices ORDER BY id");
    log = `Loaded ${offices.length} offices`;
  }

  async function createOffice() {
    if (!newOfficeName.trim()) return;
    const db = await getDb();
    await db.execute("INSERT INTO offices (name) VALUES ($1)", [newOfficeName]);
    log = `Created office: ${newOfficeName}`;
    newOfficeName = "";
    await loadOffices();
  }

  async function renameOffice(id: number, currentName: string) {
    const newName = prompt("New name:", currentName);
    if (!newName) return;
    const db = await getDb();
    await db.execute("UPDATE offices SET name = $1 WHERE id = $2", [
      newName,
      id,
    ]);
    log = `Updated office #${id}`;
    await loadOffices();
  }

  async function deleteOffice(id: number) {
    const db = await getDb();
    try {
      await db.execute("DELETE FROM offices WHERE id = $1", [id]);
      log = `Deleted office #${id}`;
      await loadOffices();
    } catch (e) {
      log = `Delete failed (probably has employees): ${e}`;
    }
  }

  loadOffices();
</script>

<h1>Offices CRUD Test</h1>
<p>{log}</p>

<input
  bind:value={newOfficeName}
  placeholder="Office name"
  class="border rounded px-2"
/>
<button onclick={createOffice} class="border rounded px-2"
  >Add Office</button
>

<ul class="border-t mt-4">
  {#each offices as office (office.id)}
    <li>
      {office.name}
      <button
        onclick={() => renameOffice(office.id, office.name)}
        class="underline text-slate-700">Rename</button
      >
      <button
        onclick={() => deleteOffice(office.id)}
        class="underline text-slate-700">Delete</button
      >
    </li>
  {/each}
</ul>
