<script lang="ts">
  import Header from "$lib/components/header.svelte";
  import { Plus } from "@lucide/svelte";
  import { onMount, untrack } from "svelte";
  import { setOfficeContext } from "./context.svelte";
  import EmployeeDialog from "./employee-dialog.svelte";
  import EmployeeRow from "./employee-row.svelte";

  let { data } = $props();
  const context = setOfficeContext(untrack(() => data.office));

  onMount(() => {
    context.loadEmployees();
  });
</script>

<Header withGoBack>
  <div class="flex items-center w-full">
    <div>{context.office.abbr}</div>

    <button
      onclick={() => {
        context.openEmployee = null;
        context.showEmployeeDialog = true;
      }}
      class="flex items-center ml-auto text-sm border rounded-md bg-primary px-2 gap-1 py-2"
    >
      <Plus size={20} />
      <span>Add Employee</span>
    </button>
  </div>
</Header>

<div class="flex flex-col gap-2 p-4">
  {#if context.employees === null}
    <p class="text-sm text-muted-foreground">Loading...</p>
  {:else if context.employees.length === 0}
    <p class="text-sm text-muted-foreground">No employees yet.</p>
  {:else}
    {#each context.employees as employee (employee.id)}
      <EmployeeRow {employee} />
    {/each}
  {/if}
</div>

<EmployeeDialog />
