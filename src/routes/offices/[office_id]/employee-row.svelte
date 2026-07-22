<script lang="ts">
  import { getOfficeContext } from "./context.svelte";
  import { resolvePhotoSrc } from "$lib/photo";

  let { employee }: { employee: Employee } = $props();
  const ctx = getOfficeContext();

  let photoSrc = $state<string | null>(null);

  $effect(() => {
    if (employee.photo_path) {
      resolvePhotoSrc(employee.photo_path).then((src) => {
        photoSrc = src;
      });
    } else {
      photoSrc = null;
    }
  });

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
    {#if photoSrc}
      <img
        src={photoSrc}
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