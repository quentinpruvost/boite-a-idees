import postgres from 'postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

const sql = postgres(POSTGRES_URL, { ssl: 'require' });

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const { ideaId, author, comment } = await request.json();

    if (!ideaId || !author || !comment) {
      return json({ message: "Tous les champs sont requis." }, { status: 400 });
    }

    const [newComment] = await sql`
      INSERT INTO comments (idea_id, author, comment)
      VALUES (${ideaId}, ${author}, ${comment})
      RETURNING id, author, comment, created_at
    `;

    return json(newComment, { status: 201 });
  } catch (error) {
    console.error("Erreur de création de commentaire:", error);
    return json({ message: "Erreur serveur" }, { status: 500 });
  }
}