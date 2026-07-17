<script lang="ts">
  import AddEditOfficeDialog from "$lib/components/add-edit-office-dialog.svelte";
  import DeleteOfficeDialog from "$lib/components/delete-office-dialog.svelte";
  
  import Header from "$lib/components/header.svelte";
  import OfficesTable from "$lib/components/offices-table.svelte";
  import { Plus } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { setOfficeContext } from "./context.svelte";

  let context = setOfficeContext();
  onMount(async () => await context.loadOffices());
</script>

<AddEditOfficeDialog bind:open={context.openEditDialog} />
<DeleteOfficeDialog bind:open={context.deleteDialog}/>

<Header>
  <div>List of Offices</div>

  <button
    onclick={() => (context.openEditDialog = true)}
    class="flex items-center ml-auto text-sm border rounded-md bg-primary px-2 gap-1 py-2"
  >
    <Plus size={20} />
    <span>Add Office</span>
  </button>
</Header>

<OfficesTable />
