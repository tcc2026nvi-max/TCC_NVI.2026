import { NextResponse } from "next/server";
import pool from "@/lib/bd";

/* =========================
   GET → Listar transações
   ========================= */
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        t.transacao_id,
        t.descricao,
        t.valor,
        t.status,
        t.data_transacao,
        u.nome AS usuario,
        cf.nome AS conta,
        c.nome AS categoria,
        c.tipo AS tipo_categoria
        FROM Transacao t
        JOIN Usuario u ON t.usuario_id = u.usuario_id
        JOIN ContaFinanceira cf ON t.conta_id = cf.conta_id
        JOIN Categoria c ON t.categoria_id = c.categoria_id
        ORDER BY t.data_transacao DESC
    `);

    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar transações" },
      { status: 500 }
    );
  }
}

/* =========================
   POST → Criar transação
   ========================= */
export async function POST(request) {
  try {
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
    } = await request.json();

    if (!usuario_id || !conta_id || !categoria_id || !valor || !data_transacao) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO Transacao
      (usuario_id, conta_id, categoria_id, projeto_id, descricao, valor, status, referencia_externa, data_transacao)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
      `,
      [
        usuario_id,
        conta_id,
        categoria_id,
        projeto_id,
        descricao,
        valor,
        status,
        referencia_externa,
        data_transacao
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return NextResponse.json(
      { error: "Erro ao criar transação" },
      { status: 500 }
    );
  }
}


/* =========================
   DELETE → Excluir transação
   ========================= */
export async function DELETE(request) {
  try {
    const { transacao_id } = await request.json();

    if (!transacao_id) {
      return NextResponse.json(
        { error: "ID da transação é obrigatório" },
        { status: 400 }
      );
    }

    await pool.query(
      "DELETE FROM Transacao WHERE transacao_id = $1",
      [transacao_id]
    );

    return NextResponse.json(
      { message: "Transação removida com sucesso" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return NextResponse.json(
      { error: "Erro ao deletar transação" },
      { status: 500 }
    );
  }
}
