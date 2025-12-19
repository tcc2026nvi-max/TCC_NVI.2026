import { NextResponse } from 'next/server';
import pool from '@/lib/bd';

export async function GET() {
  const result = await pool.query(
    'SELECT categoria_id, nome, tipo, categoria_pai_id FROM Categoria'
  );
  return NextResponse.json(result.rows);
}

export async function POST(req) {
  const { nome, tipo, categoria_pai_id } = await req.json();

  const result = await pool.query(
    `
    INSERT INTO Categoria (nome, tipo, categoria_pai_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [nome, tipo, categoria_pai_id || null]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}

export async function DELETE(req) {
  const { categoria_id } = await req.json();

  await pool.query(
    'DELETE FROM Categoria WHERE categoria_id = $1',
    [categoria_id]
  );

  return NextResponse.json({ message: 'Categoria removida' });
}
