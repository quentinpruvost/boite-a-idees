<script>
  import { onMount } from 'svelte';

  // EXPLICATION: On définit ici la "forme" d'un objet Idea.
  // Cela permet à TypeScript de comprendre la structure de nos données.
  /**
   * @typedef {Object} Idea
   * @property {number} id
   * @property {string} idea
   * @property {string} author
   * @property {string} created_at
   * @property {number} votes
   * @property {boolean} [voted] - Propriété optionnelle ajoutée côté client
   */

  // EXPLICATION: On dit à TypeScript que "ideas" sera un tableau d'objets de type "Idea".
  /** @type {Idea[]} */
  let ideas = [];
  let isLoading = true;

  onMount(async () => {
    try {
      const response = await fetch('/api/ideas/list');
      if (response.ok) {
        ideas = await response.json();
      } else {
        console.error("Erreur lors de la récupération des idées.");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    } finally {
      isLoading = false;
    }
  });

  // EXPLICATION: On spécifie que le paramètre "ideaId" doit être un nombre (number).
  /** @param {number} ideaId */
  const handleVote = async (ideaId) => {
    const ideaToUpdate = ideas.find(i => i.id === ideaId);
    if (!ideaToUpdate || ideaToUpdate.voted) return;

    try {
      const response = await fetch('/api/ideas/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId: ideaId })
      });

      const result = await response.json();
      
      if (response.ok) {
        ideaToUpdate.votes++;
        ideaToUpdate.voted = true;
        ideas = [...ideas];
      } else {
        alert(result.message);
        if (response.status === 409) {
            ideaToUpdate.voted = true;
            ideas = [...ideas];
        }
      }
    } catch (error) {
      alert('Une erreur de connexion est survenue. Veuillez réessayer.');
    }
  };
</script>

<svelte:head>
  <title>Boîte à Idées - Classement</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 sm:p-8 font-sans">
  <div class="max-w-3xl mx-auto">
    <h1 class="text-4xl font-bold text-slate-800 mb-8 text-center">Classement des Idées</h1>
    
    {#if isLoading}
      <p class="text-center text-gray-600 mt-16">Chargement des idées...</p>
    {:else if ideas.length === 0}
      <p class="text-center text-gray-600 mt-16 bg-white p-8 rounded-xl shadow">Aucune idée n'a été proposée pour le moment. Soyez le premier !</p>
    {:else}
      <div class="space-y-4">
        {#each ideas as idea, index (idea.id)}
          <div class="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between transition-transform duration-300 hover:scale-[1.02]">
            
            <div class="flex items-center">
              <div class="text-center mr-5">
                <div class="text-3xl font-bold text-blue-500">{index + 1}</div>
                <div class="text-xs text-gray-400">CLASSEMENT</div>
              </div>

              <div>
                <p class="text-lg text-gray-800 leading-tight">{idea.idea}</p>
                <span class="text-xs text-gray-500">
                  Proposé par <strong>{idea.author}</strong> le {new Date(idea.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
            
            <button 
              on:click={() => handleVote(idea.id)}
              class="flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-16 {idea.voted ? 'bg-blue-100 cursor-not-allowed' : 'hover:bg-gray-100'}"
              disabled={idea.voted}
              title={idea.voted ? 'Vous avez déjà voté' : 'Voter pour cette idée'}
            >
              <span class="text-2xl {idea.voted ? 'text-blue-600' : 'text-gray-600'}">▲</span>
              <span class="text-xl font-bold text-blue-600">{idea.votes}</span>
            </button>

          </div>
        {/each}
      </div>
    {/if}
  </div>
</main>