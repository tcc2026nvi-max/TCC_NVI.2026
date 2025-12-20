import { NextResponse } from "next/server";
import pool from "@/lib/bd";

/* =========================
   GET → Listar projetos
   ========================= */
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        p.projeto_id,
        p.nome,
        p.descricao,
        p.codigo,
        p.data_inicio,
        p.data_fim_prevista,
        p.orcamento_atual,
        u.nome AS responsavel
      FROM Projeto p
      LEFT JOIN Usuario u ON p.responsavel_id = u.usuario_id
      ORDER BY p.projeto_id
    `);

    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar projetos" },
      { status: 500 }
    );
  }
}

/* =========================
   POST → Criar projeto
   ========================= */
export async function POST(request) {
  try {
    const {
      nome,
      descricao,
      codigo,
      data_inicio,
      data_fim_prevista,
      orcamento_atual,
      responsavel_id
    } = await request.json();

    const result = await pool.query(
      `
      INSERT INTO Projeto
      (nome, descricao, codigo, data_inicio, data_fim_prevista, orcamento_atual, responsavel_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        nome,
        descricao,
        codigo,
        data_inicio,
        data_fim_prevista,
        orcamento_atual,
        responsavel_id
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    return NextResponse.json(
      { error: "Erro ao criar projeto" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE → Excluir projeto
   ========================= */
export async function DELETE(request) {
  try {
    const { projeto_id } = await request.json();

    if (!projeto_id) {
      return NextResponse.json(
        { error: "ID do projeto é obrigatório" },
        { status: 400 }
      );
    }

    await pool.query(
      "DELETE FROM Projeto WHERE projeto_id = $1",
      [projeto_id]
    );

    return NextResponse.json(
      { message: "Projeto removido com sucesso" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro ao deletar projeto:", error);
    return NextResponse.json(
      { error: "Erro ao deletar projeto" },
      { status: 500 }
    );
  }
}
