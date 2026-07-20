<script lang="ts">
  import { getAppContext } from "$lib/app.context.svelte";
  import { Menu, ArrowLeft } from "@lucide/svelte";
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    withGoBack?: boolean;
  }
  let { children, withGoBack }: Props = $props();
  const appContext = getAppContext();
</script>

<header
  class="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-muted px-2 w-full"
>
  <button
    onclick={() => {
      appContext.sidebarOpen = true;
    }}
    class="flex h-10 w-10 items-center justify-center rounded-lg"
  >
    <Menu size={22} />
  </button>

  <div class="text-lg font-semibold flex items-center gap-4 w-full">
    {#if withGoBack}
      <button
        onclick={() => {
          history.back();
        }}
      >
        <ArrowLeft size={22} />
      </button>

      {@render children()}
    {:else}
      {@render children()}
    {/if}
  </div>
</header>
