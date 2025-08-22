<script>
  import IdeaForm from '$lib/components/IdeaForm.svelte';
</script>

<svelte:head>
  <title>Proposer une Idée - Hôpital de Bagnols-sur-Cèze</title>
</svelte:head>

<main class="container p-4 mx-auto flex flex-col items-center">
  <header class="text-center mb-6">
      <a href="/idees">
        <img src="/images/logo-hopital.png" alt="Logo Hôpital de Bagnols-sur-Cèze" class="h-16 mx-auto mb-4"/>
      </a>
  </header>
  
  <IdeaForm />

  <div class="mt-8 text-center">
    <a href="/idees" class="font-semibold text-hospital-blue hover:underline transition-colors duration-300">
      Voir toutes les idées et voter →
    </a>
  </div>
</main>