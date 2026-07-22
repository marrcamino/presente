<script lang="ts">
  import { getDb } from "$lib/db";
  import { slide } from "svelte/transition";
  import { getAllOfficeContext } from "../../routes/offices/context.svelte";
  import { tick, untrack } from "svelte";

  let { open = $bindable(false) }: { open: boolean } = $props();

  const context = getAllOfficeContext();

  let dialogEl: HTMLDialogElement;
  let name = $state("");
  let abbr = $state("");
  let baseError = $state("");
  let nameError = $state("");
  let abbrError = $state("");
  let loading = $state(false);
  let isEditMode = $derived(!!context.openOffice);
  let dialogTitleState = $derived(isEditMode ? "Update Office" : "Add Office");
  let submitLabel = $derived(
    loading ? (isEditMode ? "Updating…" : "Adding…") : dialogTitleState,
  );

  $effect(() => {
    if (!dialogEl) return;
    if (open && !dialogEl.open) dialogEl.showModal();
    if (!open && dialogEl.open) dialogEl.close();
  });

  function validate() {
    nameError = "";
    abbrError = "";
    baseError = "";

    const trimmedName = name.trim();
    const trimmedAbbr = abbr.trim();

    if (!trimmedName) nameError = "Office name is required";
    if (!trimmedAbbr) abbrError = "Office abbreviation is required";

    if (!trimmedName || !trimmedAbbr) return null;
    return { trimmedName, trimmedAbbr };
  }

  async function addOffice() {
    const values = validate();
    if (!values) return;

    loading = true;
    try {
      const db = await getDb();
      const res = await db.select<Office[]>(
        "INSERT INTO offices (name, abbr) VALUES ($1, $2) RETURNING *",
        [values.trimmedName, values.trimmedAbbr],
      );
      context.addOffice(res[0]);
      open = false;
    } catch (e) {
      baseError = "Failed to add office";
      console.error(e);
    } finally {
      loading = false;
    }
  }

  async function updateOffice() {
    if (!context.openOffice) return;
    const values = validate();
    if (!values) return;

    loading = true;
    try {
      const db = await getDb();
      await db.execute(
        "UPDATE offices SET name = $1, abbr = $2 WHERE id = $3",
        [values.trimmedName, values.trimmedAbbr, context.openOffice.id],
      );
      context.updateOffice({
        id: context.openOffice.id,
        name: values.trimmedName,
        abbr: values.trimmedAbbr,
        created_at: context.openOffice.created_at,
      });
      open = false;
    } catch (e) {
      baseError = "Failed to update office";
      console.error(e);
    } finally {
      loading = false;
    }
  }

  function handleSubmit() {
    isEditMode ? updateOffice() : addOffice();
  }

  function resetValues() {
    name = "";
    abbr = "";
    abbrError = "";
    nameError = "";
    baseError = "";
    open = false;
  }

  $effect(() => {
    context.openEditDialog;

    untrack(async () => {
      if (!context.openEditDialog) {
        await tick();
        context.openOffice = null;
        resetValues();
      }

      if (context.openEditDialog && context.openOffice) {
        name = context.openOffice.name;
        abbr = context.openOffice.abbr;
      }
    });
  });
</script>

<dialog
  bind:this={dialogEl}
  onclose={resetValues}
  aria-labelledby="office-dialog-title"
  class="w-full max-w-sm rounded-b-xl pt-safe p-4 text-foreground backdrop:bg-black/50"
>
  <h2
    id="office-dialog-title"
    class="mb-4 text-lg font-semibold mt-2"
  >
    {dialogTitleState}
  </h2>

  {#if baseError}
    <div class="mt-1 px-2 text-destructive" transition:slide={{ axis: "y" }}>
      {baseError}
    </div>
  {/if}
  <div class="gap-2 flex flex-col">
    <div>
      <input
        type="text"
        bind:value={name}
        placeholder="Office name"
        disabled={loading}
        aria-invalid={nameError === "" ? null : "true"}
        class="w-full rounded-md aria-invalid:border-destructive focus-visible:border-primary outline-0 focus:border-primary border px-3 py-2 text-sm"
      />

      {#if nameError}
        <p
          class="mt-1 px-2 text-xs text-destructive"
          transition:slide={{ axis: "y" }}
        >
          {nameError}
        </p>
      {/if}
    </div>

    <div>
      <input
        type="text"
        bind:value={abbr}
        placeholder="Office Abbreviation"
        disabled={loading}
        aria-invalid={abbrError === "" ? null : "true"}
        class="w-full rounded-md aria-invalid:border-destructive focus-visible:border-primary outline-0 focus:border-primary border px-3 py-2 text-sm"
      />
      {#if abbrError}
        <p
          class="mt-1 px-2 text-xs text-destructive"
          transition:slide={{ axis: "y" }}
        >
          {abbrError}
        </p>
      {/if}
    </div>
  </div>

  <div class="mt-4 flex justify-end gap-2">
    <button
      type="button"
      onclick={resetValues}
      disabled={loading}
      class="rounded-md border px-4 gap-1 py-2 text-sm"
    >
      Cancel
    </button>
    <button
      type="button"
      onclick={handleSubmit}
      disabled={loading}
      class="flex items-center text-sm border rounded-md bg-primary px-3 gap-1 py-2 disabled:opacity-50"
    >
      {submitLabel}
    </button>
  </div>
</dialog>
