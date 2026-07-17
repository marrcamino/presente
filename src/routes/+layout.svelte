<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  let { children } = $props();
</script>

<ModeWatcher defaultMode="system" />
<div
  style="padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);"
>
  {@render children()}
</div>
