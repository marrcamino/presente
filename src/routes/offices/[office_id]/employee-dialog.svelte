<script lang="ts">
  import { getDb } from "$lib/db";
  import { getOfficeContext } from "./context.svelte";
  import { Camera } from "@lucide/svelte";

  const ctx = getOfficeContext();

  let dialogEl: HTMLDialogElement;
  let name = $state("");
  let submitting = $state(false);
  let error = $state("");
  let confirmingDelete = $state(false);

  const isEditing = $derived(ctx.openEmployee !== null);

  $effect(() => {
    if (ctx.showEmployeeDialog) {
      name = ctx.openEmployee?.name ?? "";
      error = "";
      confirmingDelete = false;
    }
  });

  $effect(() => {
    if (ctx.showEmployeeDialog) {
      dialogEl?.showModal();
    } else {
      dialogEl?.close();
    }
  });

  function handleClose() {
    ctx.closeEmployeeDialog();
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!name.trim()) {
      error = "Name is required.";
      return;
    }

    submitting = true;
    error = "";

    try {
      const db = await getDb();

      if (isEditing && ctx.openEmployee) {
        await db.execute("UPDATE employees SET name = ? WHERE id = ?", [
          name.trim(),
          ctx.openEmployee.id,
        ]);
        ctx.updateEmployee({ ...ctx.openEmployee, name: name.trim() });
      } else {
        const result = await db.execute(
          "INSERT INTO employees (office_id, name) VALUES (?, ?)",
          [ctx.office.id, name.trim()],
        );
        ctx.addEmployee({
          id: result.lastInsertId!,
          office_id: ctx.office.id,
          name: name.trim(),
          photo_path: null,
          created_at: new Date().toISOString(),
        });
      }

      ctx.closeEmployeeDialog();
    } catch (err) {
      console.error(err);
      error = "Something went wrong. Please try again.";
    } finally {
      submitting = false;
    }
  }

  async function handleDelete() {
    if (!ctx.openEmployee) return;

    submitting = true;
    error = "";

    try {
      const db = await getDb();
      await db.execute("DELETE FROM employees WHERE id = ?", [
        ctx.openEmployee.id,
      ]);
      ctx.removeEmployee(ctx.openEmployee.id);
      ctx.closeEmployeeDialog();
    } catch (err) {
      console.error(err);
      error = "Failed to delete employee.";
      confirmingDelete = false;
    } finally {
      submitting = false;
    }
  }
</script>

<dialog
  bind:this={dialogEl}
  class="w-full max-w-sm rounded-lg border border-border p-4 text-foreground backdrop:bg-black/50"
>
  <form onsubmit={handleSubmit} class="flex flex-col gap-3">
    <h2
      class="text-lg font-semibold"
      style="margin-top: env(safe-area-inset-top);"
    >
      {isEditing ? "Edit Employee" : "Add Employee"}
    </h2>

    <!-- Photo placeholder, no wiring yet -->
    <div class="flex justify-center">
      <button
        type="button"
        class="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted"
      >
        <Camera size={24} class="text-muted-foreground" />
      </button>
    </div>

    <label class="flex flex-col gap-1 text-sm">
      Name
      <input
        type="text"
        bind:value={name}
        class="rounded-md border aria-invalid:border-destructive focus-visible:border-primary outline-0 focus:border-primary border-input bg-background px-3 py-2 text-sm"
        placeholder="Full name"
        required
      />
    </label>

    {#if error}
      <p class="text-sm text-destructive">{error}</p>
    {/if}

    {#if confirmingDelete}
      <div
        class="mt-2 flex flex-col gap-2 rounded-md border border-destructive p-3"
      >
        <p class="text-sm">Delete this employee? This can't be undone.</p>
        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick={() => (confirmingDelete = false)}
            disabled={submitting}
            class="rounded-md border border-border px-3 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            onclick={handleDelete}
            disabled={submitting}
            class="ml-auto rounded-md bg-destructive px-3 py-2 text-sm text-destructive-foreground"
          >
            {submitting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    {:else}
      <div class="mt-2 flex items-center gap-2">
        {#if isEditing}
          <button
            type="button"
            onclick={() => (confirmingDelete = true)}
            disabled={submitting}
            class="rounded-md border border-destructive px-3 py-2 text-sm text-destructive"
          >
            Delete
          </button>
        {/if}

        <button
          type="button"
          onclick={handleClose}
          disabled={submitting}
          class="ml-auto rounded-md border border-border px-3 py-2 text-sm"
        >
          Close
        </button>

        <button
          type="submit"
          disabled={submitting}
          class="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
        >
          {isEditing ? "Save" : "Add"}
        </button>
      </div>
    {/if}
  </form>
</dialog>
