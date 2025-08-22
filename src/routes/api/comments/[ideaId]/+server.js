import postgres from 'postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

const sql = postgres(POSTGRES_URL, { ssl: 'require' });

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  try {
    const { ideaId } = params;
    const comments = await sql`
      SELECT id, author, comment, created_at FROM comments
      WHERE idea_id = ${ideaId}
      ORDER BY created_at ASC
    `;
    return json(comments);
  } catch (error) {
    console.error("Erreur de récupération des commentaires:", error);
    return json({ message: "Erreur serveur" }, { status: 500 });
  }
}