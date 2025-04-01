import { AppDataSource } from "../data-source";
import { Produto } from "../models/Produto";
import { Categoria } from "../models/Categoria";
import inquirer from "inquirer";
import Table from "cli-table3";

const produtoRepository = AppDataSource.getRepository(Produto);
const categoriaRepository = AppDataSource.getRepository(Categoria);

export async function adicionarProduto() {
  const categorias = await categoriaRepository.find();
  if (categorias.length === 0) {
    console.log("❌ Nenhuma categoria cadastrada. Cadastre uma antes de adicionar um produto.");
    return;
  }

  const resposta = await inquirer.prompt([
    { type: "input", name: "nome", message: "Nome do Produto:" },
    { type: "input", name: "descricao", message: "Descrição do Produto:" },
    { type: "number", name: "preco", message: "Preço do produto:" },
    { type: "number", name: "quantidade", message: "Quantidade em estoque:" },
    {
      type: "list",
      name: "categoriaId",
      message: "Escolha a categoria do produto:",
      choices: categorias.map((c) => ({ name: c.nome, value: c.id })),
    },
  ]);

  const categoria = await categoriaRepository.findOne({ where: { id: resposta.categoriaId } });

  if (!categoria) {
    console.log("❌ Categoria inválida!");
    return;
  }

  const novoProduto = produtoRepository.create({
    nome: resposta.nome,
    descricao: resposta.descricao,
    preco: resposta.preco,
    quantidade: resposta.quantidade,
    categoria: categoria,
  });

  await produtoRepository.save(novoProduto);
  console.log(`✅ Produto "${resposta.nome}" adicionado com sucesso!`);
}

export async function listarProdutos() {
  const produtos = await produtoRepository.find({ relations: ["categoria"] });

  if (produtos.length === 0) {
    console.log("❌ Nenhum produto cadastrado.");
    return;
  }

  const table = new Table({
    head: ["ID", "Nome", "Descrição", "Preço", "Qtd", "Categoria", "Criado em", "Atualizado em"],
    colWidths: [5, 20, 30, 10, 8, 15, 25, 25],
  });

  produtos.forEach((produto) => {
    table.push([
      produto.id,
      produto.nome,
      produto.descricao,
      `R$ ${produto.preco.toFixed(2)}`,
      produto.quantidade,
      produto.categoria?.nome || "Sem categoria",
      produto.dataCriacao?.toLocaleString(),
      produto.dataAtualizacao?.toLocaleString(),
    ]);
  });

  console.log(table.toString());
}

export async function buscarProduto() {
  const { id } = await inquirer.prompt({ type: "number", name: "id", message: "Digite o ID do produto:" });

  const produto = await produtoRepository.findOne({ where: { id }, relations: ["categoria"] });

  if (produto) {
    console.log("✅ Produto encontrado:", produto);
  } else {
    console.log("❌ Produto não encontrado!");
  }
}

export async function atualizarProduto() {
  const { id } = await inquirer.prompt({ type: "number", name: "id", message: "Digite o ID do produto que deseja atualizar:" });

  const produto = await produtoRepository.findOne({ where: { id }, relations: ["categoria"] });

  if (!produto) {
    console.log("❌ Produto não encontrado!");
    return;
  }

  const { nome, descricao, preco, quantidade } = await inquirer.prompt([
    { type: "input", name: "nome", message: "Novo nome:", default: produto.nome },
    { type: "input", name: "descricao", message: "Nova descrição:", default: produto.descricao },
    { type: "number", name: "preco", message: "Novo preço:", default: produto.preco },
    { type: "number", name: "quantidade", message: "Nova quantidade:", default: produto.quantidade },
  ]);

  Object.assign(produto, { nome, descricao, preco, quantidade, dataAtualizacao: new Date() });

  await produtoRepository.save(produto);
  console.log(`✅ Produto "${produto.nome}" atualizado!`);
}

export async function deletarProduto() {
  const { id } = await inquirer.prompt({ type: "number", name: "id", message: "Digite o ID do produto que deseja deletar:" });

  const produto = await produtoRepository.findOne({ where: { id } });

  if (!produto) {
    console.log("❌ Produto não encontrado!");
    return;
  }

  await produtoRepository.remove(produto);
  console.log(`✅ Produto "${produto.nome}" removido!`);
}
