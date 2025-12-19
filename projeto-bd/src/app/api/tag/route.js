import { NextResponse } from 'next/server';
import pool from '@/lib/bd';

export async function GET() {
  const result = await pool.query('SELECT * FROM Tag');
  return NextResponse.json(result.rows);
}

export async function POST(req) {
  const { nome } = await req.json();

  const result = await pool.query(
    'INSERT INTO Tag (nome) VALUES ($1) RETURNING *',
    [nome]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}

export async function DELETE(req) {
  const { tag_id } = await req.json();

  await pool.query(
    'DELETE FROM Tag WHERE tag_id = $1',
    [tag_id]
  );

  return NextResponse.json({ message: 'Tag removida' });
}
