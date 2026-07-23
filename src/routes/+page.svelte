<script lang="ts">
  import Header from "$lib/components/header.svelte";
  import AlphabetIndexScroller from "$lib/alphabet-index-scroller.svelte";
  import { SaveAll } from "@lucide/svelte";
  import { setRootContext } from "./context.svelte";
  import { mockEmployees, groupEmployeesByName } from "$lib/mock-employees";

  const context = setRootContext();
  const groups = groupEmployeesByName(mockEmployees);
  const letters = groups.map((g) => g.letter);

  const sectionRefs: Record<string, HTMLElement> = {};

  function scrollToLetter(letter: string) {
    sectionRefs[letter]?.scrollIntoView({
      behavior: "instant",
      block: "start",
    });
  }
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

  <div class="relative flex-1 overflow-hidden">
    <div class="h-full overflow-y-auto p-4 pr-8">
      {#each groups as group (group.letter)}
        <div bind:this={sectionRefs[group.letter]} class="scroll-mt-2">
          <div class="flex flex-col gap-2 mb-2">
            {#each group.employees as employee (employee.id)}
              <div
                class="flex items-center gap-3 rounded-xl border border-border p-3"
              >
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium"
                >
                  {employee.name.charAt(0)}
                </div>
                <span class="text-sm">{employee.name}</span>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <AlphabetIndexScroller {letters} onselect={scrollToLetter} />
  </div>

  {#if context.offices.length}
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
  {/if}
</div>
