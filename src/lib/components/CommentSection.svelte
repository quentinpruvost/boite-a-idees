<script>
  // EXPLICATION : On définit la structure d'un objet Commentaire.
  /**
   * @typedef {Object} Comment
   * @property {number} id
   * @property {string} author
   * @property {string} comment
   * @property {string} created_at
   */

  /** @type {number} */
  export let ideaId;

  // EXPLICATION : On indique que "comments" sera un tableau d'objets de type "Comment".
  /** @type {Comment[]} */
  let comments = [];
  let isLoading = true;
  let author = '';
  let commentText = '';

  // La fonction fetchComments est maintenant appelée dans onMount
  import { onMount } from 'svelte';
  onMount(() => {
    fetchComments();
  });

  async function fetchComments() {
    isLoading = true;
    const response = await fetch(`/api/comments/${ideaId}`);
    if (response.ok) {
      comments = await response.json();
    }
    isLoading = false;
  }

  async function handleSubmit() {
    if (!author || !commentText) {
      alert("Veuillez remplir votre nom et votre commentaire.");
      return;
    }
    const response = await fetch('/api/comments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideaId, author, comment: commentText })
    });

    if (response.ok) {
      const newComment = await response.json();
      comments = [...comments, newComment];
      commentText = '';
    } else {
      alert("Une erreur est survenue.");
    }
  }
</script>

<div class="mt-4 pt-4 border-t border-gray-200">
  <h4 class="text-lg font-semibold text-gray-800 mb-3">Commentaires</h4>

  <form on:submit|preventDefault={handleSubmit} class="space-y-3 bg-gray-50 p-4 rounded-lg mb-4">
    <input bind:value={author} type="text" placeholder="Votre nom" class="w-full px-3 py-2 text-sm border rounded-md" required />
    <textarea bind:value={commentText} rows="2" placeholder="Écrivez un commentaire..." class="w-full px-3 py-2 text-sm border rounded-md" required></textarea>
    <button type="submit" class="px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700">Envoyer</button>
  </form>

  <div class="space-y-3">
    {#if isLoading}
      <p class="text-sm text-gray-500">Chargement...</p>
    {:else if comments.length === 0}
      <p class="text-sm text-gray-500">Aucun commentaire pour le moment.</p>
    {:else}
      {#each comments as c}
        <div class="bg-gray-100 p-3 rounded-md">
          <p class="text-sm text-gray-800">{c.comment}</p>
          <div class="text-xs text-gray-500 mt-1">
            <strong>{c.author}</strong> - {new Date(c.created_at).toLocaleDateString('fr-FR')}
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>