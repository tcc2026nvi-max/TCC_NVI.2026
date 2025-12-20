import { NextResponse } from "next/server";
import pool from "@/lib/bd";

// get

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        c.conta_id,
        c.nome,
        c.tipo,
        c.saldo_inicial,
        c.moeda,
        u.nome AS usuario
      FROM ContaFinanceira c
      JOIN Usuario u ON c.usuario_id = u.usuario_id
      ORDER BY c.nome
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
    return NextResponse.json(
      { erro: "Erro ao buscar contas financeiras" },
      { status: 500 }
    );
  }
}

// post

export async function POST(request) {
  try {
    const body = await request.json();
    const { nome, tipo, saldo_inicial, moeda, usuario_id } = body;

    if (!nome || !usuario_id) {
      return NextResponse.json(
        { erro: "Nome e usuário são obrigatórios" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO ContaFinanceira
      (nome, tipo, saldo_inicial, moeda, usuario_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [nome, tipo, saldo_inicial, moeda, usuario_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    return NextResponse.json(
      { erro: "Erro ao criar conta financeira" },
      { status: 500 }
    );
  }
}

// delete
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { erro: "ID da conta é obrigatório" },
        { status: 400 }
      );
    }

    await pool.query(
      "DELETE FROM ContaFinanceira WHERE conta_id = $1",
      [id]
    );

    return NextResponse.json({ mensagem: "Conta excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    return NextResponse.json(
      { erro: "Erro ao excluir conta financeira" },
      { status: 500 }
    );
  }
}
