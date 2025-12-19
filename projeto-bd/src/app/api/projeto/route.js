import { NextResponse } from 'next/server';
import pool from '@/lib/bd';

export async function GET() {
  const result = await pool.query(`
    SELECT p.projeto_id, p.nome, p.orcamento_atual, u.nome AS responsavel
    FROM Projeto p
    LEFT JOIN Usuario u ON u.usuario_id = p.responsavel_id
  `);
  return NextResponse.json(result.rows);
}

export async function POST(req) {
  const {
    nome,
    descricao,
    codigo,
    data_inicio,
    data_fim_prevista,
    responsavel_id,
    orcamento_atual
  } = await req.json();

  const result = await pool.query(
    `
    INSERT INTO Projeto
    (nome, descricao, codigo, data_inicio, data_fim_prevista, responsavel_id, orcamento_atual)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [nome, descricao, codigo, data_inicio, data_fim_prevista, responsavel_id, orcamento_atual]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}

export async function DELETE(req) {
  const { projeto_id } = await req.json();

  await pool.query(
    'DELETE FROM Projeto WHERE projeto_id = $1',
    [projeto_id]
  );

  return NextResponse.json({ message: 'Projeto removido' });
}
