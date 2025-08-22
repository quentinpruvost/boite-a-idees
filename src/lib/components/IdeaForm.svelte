<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  // Variables pour stocker les données du formulaire
  let idea = '';
  let author = '';
  let isAnonymous = false;
  let formSubmitted = false;

  // Élément pour l'animation du message de succès
  /** @type {HTMLElement} */
let successMessage;

  // Fonction appelée à la soumission du formulaire
  const handleSubmit = async () => {
    if (!idea) {
      alert('Veuillez entrer une idée !');
      return;
    }

    const submission = {
      idea: idea,
      author: isAnonymous ? 'Anonyme' : (author || 'Anonyme'),
    };

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      if (!response.ok) throw new Error('La soumission a échoué.');

      // Le reste s'exécute si tout va bien
      formSubmitted = true;
      gsap.fromTo(successMessage, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });

      setTimeout(() => {
        idea = '';
        author = '';
        isAnonymous = false;
        formSubmitted = false;
      }, 3000);

    } catch (error) {
      console.error("Erreur lors de l'envoi de l'idée :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  onMount(() => {
    gsap.from('form', { opacity: 0, y: 50, duration: 0.8, ease: 'power3.out' });
  });
</script>

{#if !formSubmitted}
  <form on:submit|preventDefault={handleSubmit} class="w-full max-w-lg p-10 space-y-6 bg-white rounded-2xl shadow-2xl transition-all duration-300">
    
    <h2 class="text-3xl font-bold text-center text-slate-800 mb-8">Votre Idée Compte ! ✨</h2>

    <div>
      <label for="idea" class="block mb-2 text-sm font-semibold text-gray-700">Décrivez votre idée :</label>
      <textarea
        id="idea"
        bind:value={idea}
        rows="4"
        class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
        placeholder="Proposez une amélioration, un événement..."
      ></textarea>
    </div>

    {#if !isAnonymous}
      <div>
        <label for="author" class="block mb-2 text-sm font-semibold text-gray-700">Votre nom (optionnel) :</label>
        <input
          type="text"
          id="author"
          bind:value={author}
          class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
          placeholder="Jean Dupont"
        />
      </div>
    {/if}

    <div class="flex items-center pt-2">
      <input
        id="anonymous"
        type="checkbox"
        bind:checked={isAnonymous}
        class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
      />
      <label for="anonymous" class="ml-3 text-sm font-medium text-gray-900">Soumettre en anonyme</label>
    </div>

    <button type="submit" class="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      Proposer mon Idée
    </button>
  </form>
{:else}
  <div bind:this={successMessage} class="w-full max-w-lg p-8 text-center bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-green-600">Merci ! 🙏</h2>
    <p class="mt-2 text-gray-700">Votre idée a bien été envoyée.</p>
  </div>
{/if}