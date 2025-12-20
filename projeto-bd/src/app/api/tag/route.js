import { NextResponse } from "next/server";
import pool from "@/lib/bd";

// get 

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT tag_id, nome FROM Tag ORDER BY nome"
    );

    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    console.error("Erro ao buscar tags:", error);
    return NextResponse.json(
      { erro: "Erro ao buscar tags" },
      { status: 500 }
    );
  }
}

// post

export async function POST(request) {
  try {
    const { nome } = await request.json();

    if (!nome) {
      return NextResponse.json(
        { erro: "Nome da tag é obrigatório" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO Tag (nome)
      VALUES ($1)
      RETURNING tag_id, nome
      `,
      [nome]
    );

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error("Erro ao criar tag:", error);
    return NextResponse.json(
      { erro: "Erro ao criar tag" },
      { status: 500 }
    );
  }
}

// delete

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag_id = searchParams.get("id");

    if (!tag_id) {
      return NextResponse.json(
        { erro: "ID da tag é obrigatório" },
        { status: 400 }
      );
    }

    await pool.query(
      "DELETE FROM Tag WHERE tag_id = $1",
      [tag_id]
    );

    return NextResponse.json(
      { mensagem: "Tag excluída com sucesso" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro ao excluir tag:", error);
    return NextResponse.json(
      { erro: "Erro ao excluir tag" },
      { status: 500 }
    );
  }
}
