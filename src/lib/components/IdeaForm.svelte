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
      alert("Veuillez décrire votre idée avant de l'envoyer.");
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

      // On ne réinitialise pas le formulaire pour que l'utilisateur voie le message de succès
      // L'état `formSubmitted` gère l'affichage.

    } catch (error) {
      console.error("Erreur lors de l'envoi de l'idée :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  onMount(() => {
    // Animation d'entrée pour le formulaire
    gsap.from('form', { opacity: 0, y: 50, duration: 0.8, ease: 'power3.out' });
  });
</script>

{#if !formSubmitted}
  <form on:submit|preventDefault={handleSubmit} class="w-full max-w-lg space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden">
    
    <div class="bg-hospital-blue text-white p-6">
       <h2 class="text-2xl font-bold text-center">Proposer une Idée</h2>
    </div>

    <div class="p-6 sm:p-8 space-y-6">
        <div>
          <label for="idea" class="block mb-2 text-sm font-semibold text-gray-700">Votre idée d'amélioration :</label>
          <textarea 
            id="idea" 
            bind:value={idea} 
            rows="4" 
            class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-hospital-blue/20 focus:border-hospital-blue transition-all duration-300" 
            placeholder="Décrivez votre proposition..."
            required
          ></textarea>
        </div>

        {#if !isAnonymous}
          <div>
            <label for="author" class="block mb-2 text-sm font-semibold text-gray-700">Votre nom (ou service) :</label>
            <input 
              type="text" 
              id="author" 
              bind:value={author}
              placeholder="Ex: Jean Dupont, Service Radiologie"
              class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-hospital-blue/20 focus:border-hospital-blue transition-all duration-300"
            />
          </div>
        {/if}

        <div class="flex items-center pt-2">
          <input 
            id="anonymous" 
            type="checkbox" 
            bind:checked={isAnonymous} 
            class="w-5 h-5 text-hospital-blue bg-gray-100 border-gray-300 rounded focus:ring-hospital-blue focus:ring-2"
          />
          <label for="anonymous" class="ml-3 text-sm font-medium text-gray-900">Soumettre en anonyme</label>
        </div>

        <button 
          type="submit" 
          class="w-full px-4 py-3 font-bold text-white bg-hospital-green rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-hospital-green/50 transition-all duration-300"
        >
          Envoyer mon Idée
        </button>
    </div>
  </form>
{:else}
  <div bind:this={successMessage} class="w-full max-w-lg p-8 text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl">
    <h2 class="text-2xl font-bold text-hospital-green">Merci pour votre contribution !</h2>
    <p class="mt-2 text-slate-700">Votre idée a bien été enregistrée et sera étudiée.</p>
    <a href="/idees" class="inline-block mt-6 font-semibold text-hospital-blue hover:underline">
      Voir toutes les idées →
    </a>
  </div>
{/if}