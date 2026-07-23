<script lang="ts">
  import { Moon, Sun } from "@lucide/svelte";
  import { mode, toggleMode } from "mode-watcher";
</script>

<button
  class="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium"
  onclick={toggleMode}
>
  <div class="size-4 relative inline-flex leading-7 -translate-y-0.5">
    <Sun
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all! dark:-rotate-90 dark:scale-0"
    />
    <Moon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all! dark:rotate-0 dark:scale-100"
    />
  </div>
  <div class="font-medium capitalize overflow-hidden text-nowrap leading-7">
    {mode.current} Theme
  </div>
</button>
