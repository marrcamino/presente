<script lang="ts">
  import Header from "$lib/components/header.svelte";
  import { SaveAll } from "@lucide/svelte";
  import { setRootContext } from "./context.svelte";

  const context = setRootContext();
</script>

<div class="flex h-full flex-col">
  <Header>
    <div>{context.selectedOffice?.abbr}</div>

    <button
      class="flex items-center ml-auto text-sm border rounded-md bg-primary px-2 gap-1 py-2"
    >
      <SaveAll size={20} />
      <span>Save All</span>
    </button>
  </Header>

  <div class="flex-1 overflow-y-auto p-4">
    <!-- Content here -->
  </div>

  <div
    class="border-t border-border bg-card py-3 mt-auto"
    style="padding-bottom: calc(env(safe-area-inset-bottom) + 0.75rem);"
  >
    <div class="flex gap-2 overflow-x-auto scrollbar-hide">
      {#each context.offices as office (office.id)}
        <button
          type="button"
          onclick={() => (context.selectedOffice = office)}
          class="shrink-0 first:ml-3 last:mr-3 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors {context
            .selectedOffice?.id === office.id
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-background text-foreground'}"
        >
          {office.abbr}
        </button>
      {/each}
    </div>
  </div>
</div>
