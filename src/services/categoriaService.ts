import { Categoria } from "../models/Categoria";
import { AppDataSource } from "../data-source";
import inquirer from "inquirer";
import Table from "cli-table3";

const categoriaRepository = AppDataSource.getRepository(Categoria);

export async function adicionarCategoria() {
  const { nome, descricao } = await inquirer.prompt([
    { type: "input", name: "nome", message: "Nome da categoria:" },
    { type: "input", name: "descricao", message: "Descrição da categoria:" },
  ]);

  const categoria = categoriaRepository.create({ nome, descricao });
  await categoriaRepository.save(categoria);

  console.log(`✅ Categoria "${nome}" adicionada ao banco de dados!`);
}

export async function listarCategorias() {
  const categorias = await categoriaRepository.find();

  if (categorias.length === 0) {
    console.log("❌ Nenhuma categoria cadastrada.");
    return;
  }

  const table = new Table({
    head: ["ID", "Nome", "Descrição", "Criada em", "Alterada em"],
    colWidths: [5, 20, 30, 25, 25],
  });

  categorias.forEach((categoria) => {
    table.push([
      categoria.id,
      categoria.nome,
      categoria.descricao,
      categoria.dataCriacao?.toLocaleString(),
      categoria.dataAtualizacao?.toLocaleString(),
    ]);
  });

  console.log(table.toString());
}

export async function buscarCategoria() {
  const { id } = await inquirer.prompt({
    type: "number",
    name: "id",
    message: "Digite o ID da categoria:",
  });

  const categoria = await categoriaRepository.findOne({ where: { id } });

  if (categoria) {
    console.log("✅ Categoria encontrada:", categoria);
  } else {
    console.log("❌ Categoria não encontrada!");
  }
}

export async function atualizarCategoria() {
  const { id } = await inquirer.prompt({
    type: "number",
    name: "id",
    message: "Digite o ID da categoria que deseja atualizar:",
  });

  const categoria = await categoriaRepository.findOne({ where: { id } });

  if (!categoria) {
    console.log("❌ Categoria não encontrada!");
    return;
  }

  const { nome, descricao } = await inquirer.prompt([
    { type: "input", name: "nome", message: "Novo nome:", default: categoria.nome },
    { type: "input", name: "descricao", message: "Nova descrição:", default: categoria.descricao },
  ]);

  categoria.nome = nome;
  categoria.descricao = descricao;
  categoria.dataAtualizacao = new Date();
  await categoriaRepository.save(categoria);

  console.log(`✅ Categoria "${categoria.nome}" atualizada!`);
}

export async function deletarCategoria() {
  const { id } = await inquirer.prompt({
    type: "number",
    name: "id",
    message: "Digite o ID da categoria que deseja deletar:",
  });

  const categoria = await categoriaRepository.findOne({ where: { id } });

  if (!categoria) {
    console.log("❌ Categoria não encontrada!");
    return;
  }

  await categoriaRepository.remove(categoria);
  console.log(`✅ Categoria "${categoria.nome}" removida do banco de dados!`);
}
