import pool from '@/lib/bd';

// get

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT usuario_id, nome, email, telefone, role, criado_em FROM Usuario'
    );

    return Response.json(result.rows, { status: 200 });

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}

// post

export async function POST(request) {
  try {
    const { nome, email, telefone, senha_hash, role } = await request.json();

    if (!nome || !email || !senha_hash || !role) {
      return Response.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO Usuario (nome, email, telefone, senha_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING usuario_id, nome, email, role`,
      [nome, email, telefone, senha_hash, role]
    );

    return Response.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}

// delete

export async function DELETE(request) {
  try {
    const { usuario_id } = await request.json();

    if (!usuario_id) {
      return Response.json(
        { error: 'usuario_id é obrigatório' },
        { status: 400 }
      );
    }

    await pool.query(
      'DELETE FROM Usuario WHERE usuario_id = $1',
      [usuario_id]
    );

    return Response.json(
      { message: 'Usuário removido com sucesso' },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Erro ao deletar usuário' },
      { status: 500 }
    );
  }
}
