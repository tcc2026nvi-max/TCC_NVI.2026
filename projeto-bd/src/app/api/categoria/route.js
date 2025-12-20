import { NextResponse } from "next/server";
import pool from "@/lib/bd";

/* =========================
   GET – listar categorias
========================= */
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        c.categoria_id,
        c.nome,
        c.tipo,
        cp.nome AS categoria_pai
      FROM Categoria c
      LEFT JOIN Categoria cp ON c.categoria_pai_id = cp.categoria_id
      ORDER BY c.nome
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json(
      { erro: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
}

/* =========================
   POST – criar categoria
========================= */
export async function POST(request) {
  try {
    const body = await request.json();
    const { nome, tipo, categoria_pai_id } = body;

    if (!nome || !tipo) {
      return NextResponse.json(
        { erro: "Nome e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    if (tipo !== "receita" && tipo !== "despesa") {
      return NextResponse.json(
        { erro: "Tipo deve ser 'receita' ou 'despesa'" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO Categoria (nome, tipo, categoria_pai_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [nome, tipo, categoria_pai_id || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return NextResponse.json(
      { erro: "Erro ao criar categoria" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE – excluir categoria
========================= */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { erro: "ID da categoria é obrigatório" },
        { status: 400 }
      );
    }

    await pool.query(
      "DELETE FROM Categoria WHERE categoria_id = $1",
      [id]
    );

    return NextResponse.json({ mensagem: "Categoria excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return NextResponse.json(
      { erro: "Erro ao excluir categoria" },
      { status: 500 }
    );
  }
}
