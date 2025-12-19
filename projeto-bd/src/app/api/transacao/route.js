import { NextResponse } from 'next/server';
import pool from '@/lib/bd';

export async function GET() {
  const result = await pool.query(`
    SELECT t.transacao_id, t.descricao, t.valor, t.data_transacao,
           u.nome AS usuario, c.nome AS conta, cat.nome AS categoria
    FROM Transacao t
    JOIN Usuario u ON u.usuario_id = t.usuario_id
    JOIN ContaFinanceira c ON c.conta_id = t.conta_id
    JOIN Categoria cat ON cat.categoria_id = t.categoria_id
  `);
  return NextResponse.json(result.rows);
}

export async function POST(req) {
  const {
    usuario_id,
    conta_id,
    categoria_id,
    projeto_id,
    descricao,
    valor,
    status,
    referencia_externa,
    data_transacao
  } = await req.json();

  const result = await pool.query(
    `
    INSERT INTO Transacao
    (usuario_id, conta_id, categoria_id, projeto_id, descricao, valor, status, referencia_externa, data_transacao)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
    `,
    [usuario_id, conta_id, categoria_id, projeto_id, descricao, valor, status, referencia_externa, data_transacao]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}

export async function DELETE(req) {
  const { transacao_id } = await req.json();

  await pool.query(
    'DELETE FROM Transacao WHERE transacao_id = $1',
    [transacao_id]
  );

  return NextResponse.json({ message: 'Transação removida' });
}
