import postgres from 'postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

const sql = postgres(POSTGRES_URL, { ssl: 'require' });

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
  try {
    const { idea, author } = await request.json();

    if (!idea) {
      return json({ message: 'Le champ "idée" est requis.' }, { status: 400 });
    }

    await sql`
      INSERT INTO ideas (idea, author)
      VALUES (${idea}, ${author})
    `;

    return json({ message: 'Idée enregistrée avec succès !' }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'idée:', error);
    return json({ message: 'Erreur interne du serveur.' }, { status: 500 });
  }
}