<script>
  import "../app.css";
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="{favicon}" />
</svelte:head>

<main class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
  {@render children?.()}
</main>