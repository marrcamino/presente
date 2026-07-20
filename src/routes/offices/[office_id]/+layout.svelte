<script lang="ts">
  let { data, children } = $props();
</script>

{#key data.office.id}
  {@render children()}
{/key}
