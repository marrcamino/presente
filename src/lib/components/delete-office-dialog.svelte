<script lang="ts">
  import { getDb } from "$lib/db";
  import { getOfficeContext } from "../../routes/offices/context.svelte";

  let {
    open = $bindable(false),
  }: {
    open: boolean;
  } = $props();

  const context = getOfficeContext();
  let dialogEl: HTMLDialogElement;
  let loading = $state(false);
  let error = $state("");

  $effect(() => {
    if (!dialogEl) return;
    if (open && !dialogEl.open) dialogEl.showModal();
    if (!open && dialogEl.open) dialogEl.close();
  });

  // Reset error whenever a new office is targeted
  $effect(() => {
    context.openOffice;
    error = "";
  });

  async function handleConfirm() {
    if (!context.openOffice) return;
    error = "";
    loading = true;
    try {
      const db = await getDb();
      await db.execute("DELETE FROM offices WHERE id = $1", [
        context.openOffice.id,
      ]);
      context.removeOffice(context.openOffice.id);
      context.openOffice = null
      open = false;
    } catch (e) {
      const msg = String(e);
      if (msg.includes("FOREIGN KEY") || msg.includes("constraint")) {
        error =
          "This office has employees assigned to it and cannot be deleted.";
      } else {
        error = "Failed to delete office.";
      }
      console.error(e);
    } finally {
      loading = false;
    }
  }

  function handleCancel() {
    error = "";
    open = false;
  }

  function handleClose() {
    handleCancel();
  }
</script>

<dialog
  bind:this={dialogEl}
  onclose={handleClose}
  class="w-full max-w-sm rounded-lg p-6 backdrop:bg-background/30"
>
  <h2
    class="mb-2 text-lg font-semibold"
    style="margin-top: env(safe-area-inset-top);"
  >
    Delete Office
  </h2>

  {#if context.openOffice}
    <p class="text-sm text-muted-foreground">
      Are you sure you want to delete <strong>{context.openOffice.name}</strong>
      ({context.openOffice.abbr})? This cannot be undone.
    </p>
  {/if}

  {#if error}
    <p class="mt-2 text-sm text-destructive">{error}</p>
  {/if}

  <div class="mt-4 flex justify-end gap-2">
    <button
      type="button"
      onclick={handleCancel}
      disabled={loading}
      class="rounded-md border px-4 py-2 text-sm"
    >
      Cancel
    </button>
    <button
      type="button"
      onclick={handleConfirm}
      disabled={loading}
      class="rounded-md bg-destructive px-4 py-2 text-sm disabled:opacity-50"
    >
      {loading ? "Deleting…" : "Delete"}
    </button>
  </div>
</dialog>
