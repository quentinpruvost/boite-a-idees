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
   * @property {boolean} [voted]
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
  <title>Boîte à Idées - Hôpital de Bagnols-sur-Cèze</title>
</svelte:head>

<main class="min-h-screen p-4 sm:p-8 font-sans">
  <div class="max-w-3xl mx-auto">
    
    <header class="text-center mb-10">
      <img src="/src/lib/assets/logo-hopital.png" alt="Logo Hôpital de Bagnols-sur-Cèze" class="h-16 mx-auto mb-4"/>
      <h1 class="text-3xl sm:text-4xl font-bold text-hospital-blue">
        Boîte à Idées du Personnel
      </h1>
      <p class="text-slate-600 mt-2">Vos propositions pour améliorer notre hôpital</p>
    </header>
    
    <div class="text-center mb-8">
       <a href="/" class="inline-block bg-hospital-green text-white font-bold py-2 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity">
         Proposer une nouvelle idée
       </a>
    </div>

    {#if isLoading}
      <p class="text-center text-slate-500 mt-16">Chargement des idées...</p>
    {:else if ideas.length === 0}
      <div class="text-center text-slate-600 mt-16 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
        <p>Aucune idée n'a été proposée. Soyez le premier !</p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each ideas as idea, index (idea.id)}
          <div class="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-lg">
            <div class="flex items-start justify-between">
              <div class="flex items-start flex-grow min-w-0 mr-2 sm:mr-4">
                <div class="text-center mr-4 flex-shrink-0 pt-1">
                  <div class="text-3xl font-bold text-hospital-blue">{index + 1}</div>
                </div>
                <div class="min-w-0">
                  <p class="text-lg font-semibold text-slate-800 leading-tight">{idea.idea}</p>
                  <span class="text-xs text-slate-500">
                    Par <strong>{idea.author}</strong>
                  </span>
                </div>
              </div>
              
              <button 
                on:click={() => handleVote(idea.id)}
                class="flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-16 flex-shrink-0 {idea.voted ? 'bg-hospital-blue-light cursor-not-allowed' : 'hover:bg-gray-100'}"
                disabled={idea.voted}
                title={idea.voted ? 'Vous pourrez voter dans 15min' : 'Soutenir cette idée'}
              >
                <span class="text-2xl {idea.voted ? 'text-hospital-blue' : 'text-gray-600'}">▲</span>
                <span class="text-xl font-bold text-hospital-blue">{idea.votes}</span>
              </button>
            </div>

            <div class="border-t border-gray-200/80 mt-4 pt-3 text-center">
              <button on:click={() => toggleComments(idea.id)} class="text-sm text-hospital-blue font-semibold hover:underline">
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