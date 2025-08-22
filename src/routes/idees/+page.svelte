<script>
  import { onMount } from 'svelte';
  import CommentSection from '$lib/components/CommentSection.svelte';

  /**
   * @typedef {Object} Idea
   * @property {number} id
   * @property {string} idea
   * @property {string} author
   * @property {string} created_at
   * @property {number} votes
   * @property {boolean} [voted] - Propriété optionnelle ajoutée côté client
   */

  /** @type {Idea[]} */
  let ideas = [];
  let isLoading = true;
  /** @type {number | null} */
  let activeIdeaId = null;

  onMount(async () => {
    try {
      const response = await fetch('/api/ideas/list');
      if (response.ok) {
        ideas = await response.json();
        const now = new Date().getTime();
        
        ideas.forEach(idea => {
          const voteTimestamp = localStorage.getItem(`vote_idea_${idea.id}`);
          if (voteTimestamp) {
            const timeSinceVote = now - parseInt(voteTimestamp, 10);
            if (timeSinceVote < 900000) { // 15 minutes = 900000 ms
              idea.voted = true;
            }
          }
        });
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    } finally {
      isLoading = false;
    }
  });

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

      if (response.ok) {
        localStorage.setItem(`vote_idea_${ideaId}`, new Date().getTime().toString());
        ideaToUpdate.votes++;
        ideaToUpdate.voted = true;
        ideas = [...ideas];
      } else {
        alert("Une erreur est survenue lors du vote.");
      }
    } catch (error) {
      alert('Une erreur de connexion est survenue.');
    }
  };

  /** @param {number} ideaId */
  function toggleComments(ideaId) {
    activeIdeaId = activeIdeaId === ideaId ? null : ideaId;
  }
</script>

<svelte:head>
  <title>Boîte à Idées - Classement</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 sm:p-8 font-sans">
  <div class="max-w-3xl mx-auto">
    
    <div class="flex flex-col items-center gap-4 mb-8 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:w-full">
      <h1 class="text-3xl sm:text-4xl font-bold text-slate-800 text-center order-1">
        Classement des Idées
      </h1>
      <div class="flex justify-center sm:justify-start order-2 sm:order-none sm:col-start-1">
        <a href="/" class="bg-white px-4 py-2 rounded-lg shadow-md text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap">
          ← Proposer une idée
        </a>
      </div>
    </div>
    
    {#if isLoading}
      <p class="text-center text-gray-600 mt-16">Chargement...</p>
    {:else if ideas.length === 0}
      <div class="text-center text-gray-600 mt-16 bg-white p-8 rounded-xl shadow-lg">
        <p>Aucune idée n'a été proposée pour le moment.</p>
        <a href="/" class="text-blue-600 hover:underline mt-4 inline-block">Soyez le premier !</a>
      </div>
    {:else}
      <div class="space-y-4">
        {#each ideas as idea, index (idea.id)}
          <div class="bg-white p-5 rounded-xl shadow-lg">
            <div class="flex items-start justify-between">
              <div class="flex items-start flex-grow min-w-0 mr-2 sm:mr-4">
                <div class="text-center mr-3 sm:mr-5 flex-shrink-0 pt-1">
                  <div class="text-2xl sm:text-3xl font-bold text-blue-500">{index + 1}</div>
                  <div class="text-xs text-gray-400 hidden sm:block">CLASSEMENT</div>
                </div>

                <div class="min-w-0">
                  <p class="text-base sm:text-lg text-gray-800 leading-tight">{idea.idea}</p>
                  <span class="text-xs text-gray-500">
                    Proposé par <strong>{idea.author}</strong>
                    <span class="hidden sm:inline">le {new Date(idea.created_at).toLocaleDateString('fr-FR')}</span>
                  </span>
                </div>
              </div>
              
              <button 
                on:click={() => handleVote(idea.id)}
                class="flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-14 sm:w-16 flex-shrink-0 {idea.voted ? 'bg-blue-100 cursor-not-allowed' : 'hover:bg-gray-100'}"
                disabled={idea.voted}
                title={idea.voted ? 'Vous pourrez voter à nouveau dans 15 minutes' : 'Voter pour cette idée'}
              >
                <span class="text-xl sm:text-2xl {idea.voted ? 'text-blue-600' : 'text-gray-600'}">▲</span>
                <span class="text-lg sm:text-xl font-bold text-blue-600">{idea.votes}</span>
              </button>
            </div>

            <div class="border-t border-gray-100 mt-4 pt-2 text-center">
              <button on:click={() => toggleComments(idea.id)} class="text-xs text-blue-600 font-semibold hover:underline">
                {activeIdeaId === idea.id ? 'Fermer les commentaires' : `Voir les commentaires`}
              </button>
            </div>
            
            {#if activeIdeaId === idea.id}
              <CommentSection ideaId={idea.id} />
            {/if}

          </div>
        {/each}
      </div>
    {/if}
  </div>
</main>