<script>
  import IdeaForm from '$lib/components/IdeaForm.svelte';
</script>

<svelte:head>
  <title>Boîte à Idées - Proposer une idée</title>
</svelte:head>

<div class="container p-4 mx-auto flex flex-col items-center">
  
  <IdeaForm />

  <div class="mt-8 text-center">
    <a href="/idees" class="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300">
      Voir toutes les idées et voter →
    </a>
  </div>

</div>