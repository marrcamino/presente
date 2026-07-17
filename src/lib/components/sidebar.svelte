<script lang="ts">
  import { page } from "$app/state";
  import { House, Building2 } from "@lucide/svelte";
  import ThemeSwitcher from "./theme-switcher.svelte";

  let { open = $bindable(false) } = $props();

  const navItems = [
    { label: "Attendance", href: "/", icon: House },
    { label: "Offices", href: "/offices", icon: Building2 },
  ];

  function close() {
    open = false;
  }

  function isActive(href: string) {
    return href === "/"
      ? page.url.pathname === "/"
      : page.url.pathname.startsWith(href);
  }
</script>

{#if open}
  <button
    class="fixed inset-0 z-40 bg-transparent"
    aria-label="Close sidebar"
    onclick={close}
  ></button>
{/if}

<aside
  class="fixed left-0 top-0 z-50 h-dvh w-3/4 max-w-xs bg-muted shadow-lg
		transform transition-transform duration-200 ease-out
		{open ? 'translate-x-0' : '-translate-x-full'}"
>
  <div
    class="flex h-full flex-col border-r"
    style="padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);"
  >
    <div class="flex h-16 shrink-0 items-center px-4 border-b border-gray-200">
      <span class="text-lg font-semibold">Presente</span>
    </div>

    <nav class="flex flex-col p-2">
      {#each navItems as item}
        <a
          href={item.href}
          onclick={close}
          class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium
						{isActive(item.href) ? 'bg-primary' : ''}"
        >
          <item.icon size={20} />
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="mt-auto px-3">
      <ThemeSwitcher />
    </div>
  </div>
</aside>
