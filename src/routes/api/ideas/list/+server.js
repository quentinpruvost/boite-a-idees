import postgres from 'postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

const sql = postgres(POSTGRES_URL, { ssl: 'require' });

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {
  try {
    // Sélectionne toutes les idées et les classe par votes (plus de votes en premier)
    const ideas = await sql`
      SELECT id, idea, author, created_at, votes FROM ideas
      ORDER BY votes DESC, created_at DESC
    `;
    return json(ideas, { status: 200 });
  } catch (error) {
    return json({ message: 'Erreur serveur' }, { status: 500 });
  }
}