import postgres from 'postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

const sql = postgres(POSTGRES_URL, { ssl: 'require' });

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
  try {
    const { ideaId } = await request.json();

    if (!ideaId) {
      return json({ message: 'ID de l\'idée manquant.' }, { status: 400 });
    }

    // On incrémente simplement le compteur de votes pour l'idée demandée.
    await sql`
      UPDATE ideas SET votes = votes + 1 WHERE id = ${ideaId}
    `;

    return json({ message: 'Vote enregistré !' }, { status: 200 });

  } catch (error) {
    console.error('Erreur lors du vote:', error);
    return json({ message: 'Erreur interne du serveur.' }, { status: 500 });
  }
}