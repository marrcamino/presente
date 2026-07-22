<script lang="ts">
  import { setAppContext } from "$lib/app.context.svelte";
  import Sidebar from "$lib/components/sidebar.svelte";
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";

  let { children } = $props();

  const appContext = setAppContext();
</script>

<ModeWatcher defaultMode="system" />
<Sidebar bind:open={appContext.sidebarOpen} />

<div
  class="flex h-dvh flex-col overflow-hidden"
  style="padding-top: env(safe-area-inset-top);"
>
  <div class="min-h-0 flex-1 overflow-hidden">
    {@render children()}
  </div>
</div>
