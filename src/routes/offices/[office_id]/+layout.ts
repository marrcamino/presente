import { error } from '@sveltejs/kit';
import { getDb } from '$lib/db';

export async function load({ params }) {
  const db = await getDb();
  const offices = await db.select<Office[]>(
    'SELECT * FROM offices WHERE id = ?',
    [params.office_id]
  );

  if (offices.length === 0) throw error(404, 'Office not found');

  return { office: offices[0] };
}