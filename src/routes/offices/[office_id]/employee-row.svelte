<script lang="ts">
  import { getOfficeContext } from "./context.svelte";

  let { employee }: { employee: Employee } = $props();
  const ctx = getOfficeContext();

  function openDialog() {
    ctx.openEmployee = employee;
    ctx.showEmployeeDialog = true;
  }
</script>

<button
  type="button"
  onclick={openDialog}
  class="flex w-full items-center gap-3 rounded-md border border-border bg-card p-3 text-left transition-colors hover:bg-accent"
>
  <div class="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
    {#if employee.photo_path}
      <img
        src={employee.photo_path}
        alt={employee.name}
        class="h-full w-full object-cover"
      />
    {:else}
      <div
        class="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground"
      >
        {employee.name.charAt(0).toUpperCase()}
      </div>
    {/if}
  </div>
  <span class="truncate font-medium text-foreground">{employee.name}</span>
</button>