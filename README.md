# Projeto BD – PlaneFinance — Plataforma inteligente para planejamento financeiro pessoal.

## 1. Descrição do Projeto

Este projeto tem como objetivo o desenvolvimento de uma API para acesso
a um banco de dados relacional PostgreSQL, utilizando o framework Next.js.

O sistema foi desenvolvido como uma iniciativa de projeto acadêmico (IFPB - Campus Esperança),
podendo futuramente evoluir para um Trabalho de Conclusão de Curso (TCC).


## 2. Tecnologias Utilizadas

- Node.js
- Next.js (App Router)
- PostgreSQL
- pg (node-postgres)
- DBeaver (modelagem e execução SQL)
- Git e GitHub


## 3. Modelagem do Banco de Dados

O banco de dados foi modelado utilizando o DBeaver e contém as seguintes entidades:

- Usuario  
- Projeto  
- ContaFinanceira  
- Categoria  
- Transacao  
- Tag  
- Transacao_Tag  
- AnexoTransacao  
- OrcamentoProjeto  
- AuditoriaLog  

As tabelas possuem relacionamentos definidos por chaves estrangeiras,
seguindo princípios de integridade referencial.


## 4. Entidades Expostas via API

As seguintes entidades foram expostas diretamente por meio de endpoints REST,
cada uma contendo os métodos GET, POST e DELETE:

- Usuario  
- Projeto  
- ContaFinanceira  
- Categoria  
- Transacao  
- Tag  

Essas entidades representam os recursos principais do domínio do sistema.


## 5. Entidades Não Expostas Diretamente

Nem todas as entidades do banco de dados foram expostas diretamente via API.
As entidades abaixo possuem funções auxiliares ou dependentes:

- Transacao_Tag: tabela de relacionamento N:N  
- AnexoTransacao: dependente de Transacao  
- OrcamentoProjeto: sub-recurso de Projeto  
- AuditoriaLog: entidade de controle interno  

Essa decisão segue boas práticas de arquitetura de software, evitando
a exposição desnecessária da estrutura interna do banco de dados.


## 6. Estrutura da API

A API segue a seguinte estrutura:

```text
src/app/api/
├── usuario/
├── projeto/
├── conta-financeira/
├── categoria/
├── transacao/
└── tag/
```

Cada pasta contém um arquivo `route.js` responsável por definir
os métodos HTTP da entidade correspondente(GET, POST, DELETE).


## 7. Considerações Finais

O projeto foi desenvolvido com foco em organização, clareza e boas práticas,
permitindo futura expansão, como a criação de sub-rotas ou serviços específicos,
caso necessário.