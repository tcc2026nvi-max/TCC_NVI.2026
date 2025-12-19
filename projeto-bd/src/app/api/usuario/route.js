import { NextResponse } from 'next/server';
import pool from '@/lib/bd';

export async function GET() {
  const result = await pool.query(
    'SELECT usuario_id, nome, email, role FROM Usuario'
  );
  return NextResponse.json(result.rows);
}

export async function POST(req) {
  const { nome, email, senha_hash, role } = await req.json();

  const result = await pool.query(
    `
    INSERT INTO Usuario (nome, email, senha_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING usuario_id, nome, email, role
    `,
    [nome, email, senha_hash, role]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}

export async function DELETE(req) {
  const { usuario_id } = await req.json();

  await pool.query(
    'DELETE FROM Usuario WHERE usuario_id = $1',
    [usuario_id]
  );

  return NextResponse.json({ message: 'Usuário removido' });
}
