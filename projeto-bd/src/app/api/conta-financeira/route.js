import { NextResponse } from 'next/server';
import pool from '@/lib/bd';

export async function GET() {
  const result = await pool.query(`
    SELECT c.conta_id, c.nome, c.tipo, c.saldo_inicial, u.nome AS usuario
    FROM ContaFinanceira c
    JOIN Usuario u ON u.usuario_id = c.usuario_id
  `);
  return NextResponse.json(result.rows);
}

export async function POST(req) {
  const { nome, tipo, saldo_inicial, moeda, usuario_id } = await req.json();

  const result = await pool.query(
    `
    INSERT INTO ContaFinanceira (nome, tipo, saldo_inicial, moeda, usuario_id)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [nome, tipo, saldo_inicial, moeda, usuario_id]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}

export async function DELETE(req) {
  const { conta_id } = await req.json();

  await pool.query(
    'DELETE FROM ContaFinanceira WHERE conta_id = $1',
    [conta_id]
  );

  return NextResponse.json({ message: 'Conta removida' });
}
