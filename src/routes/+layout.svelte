<script>
  import "../app.css";
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="{favicon}" />
</svelte:head>

<div
  class="fixed inset-0 z-[-1] bg-cover bg-center blur"
  style="background-image: url('/images/background-hopital.jpg');"
></div>

<div class="fixed inset-0 z-[-1] bg-white/80"></div>

{@render children?.()}