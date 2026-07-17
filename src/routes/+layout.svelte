<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<div class="mt-10">
  {@render children()}
</div>
