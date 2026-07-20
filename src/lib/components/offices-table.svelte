<script lang="ts">
  import { formatDate } from "$lib/utils";
  import { ExternalLink } from "@lucide/svelte";
  import { getAllOfficeContext } from "../../routes/offices/context.svelte";
  import { tick } from "svelte";

  let context = getAllOfficeContext();
</script>

<div class="overflow-x-auto rounded-lg border mt-2">
  <table class="w-full text-left text-sm">
    <thead class="bg-muted text-xs uppercase text-muted-foreground">
      <tr>
        <th class="px-4 py-3">Office Name</th>
      </tr>
    </thead>
    <tbody>
      {#if !context.offices}
        <tr>
          <td class="px-4 py-6 text-center text-muted-foreground">Loading…</td>
        </tr>
      {:else if context.offices?.length === 0}
        <tr>
          <td class="px-4 py-6 text-center text-muted-foreground">
            No offices yet
          </td>
        </tr>
      {:else}
        {#each context.offices as office (office.id)}
          <tr class="border-t active:opacity-50 transition-colors">
            <td class="px-4 py-3">
              <a href="/offices/{office.id}" class="flex ">
                <div class="w-full">
                  <div class="font-bold">
                    {office.abbr}
                  </div>
                  <div class="text-muted-foreground text-xs leading-3.5">
                    <div>
                      {office.name}
                    </div>
                    <div>
                      <span>Created:</span>
                      {formatDate(office.created_at)}
                    </div>
                  </div>
                </div>
                <div class="pr-1 text-muted-foreground">
                  <ExternalLink />
                </div>
              </a>

              <div class="space-x-2 mt-1">
                <button
                  class="text-destructive"
                  onclick={async () => {
                    context.openOffice = office;
                    await tick();
                    context.deleteDialog = true;
                  }}>Delete</button
                >
                <button
                  onclick={async () => {
                    context.openOffice = office;
                    await tick();
                    context.openEditDialog = true;
                  }}>Edit</button
                >
              </div>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
