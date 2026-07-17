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
  style="padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);"
>
  {@render children()}
</div>
