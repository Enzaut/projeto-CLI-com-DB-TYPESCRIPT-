import inquirer from "inquirer";
import "reflect-metadata";
import { limparTerminal } from "./utils/terminal";
import { 
  adicionarCategoria, listarCategorias, buscarCategoria, 
  atualizarCategoria, deletarCategoria 
} from "./services/categoriaService";
import { 
  adicionarProduto, listarProdutos, buscarProduto, 
  atualizarProduto, deletarProduto 
} from "./services/produtoService";
import { AppDataSource } from "./data-source";

async function iniciarBanco() {
  try {
    await AppDataSource.initialize();
    console.log(" Banco de dados conectado!");
  } catch (error) {
    console.error("Erro ao conectar no banco:", error);
    return; // Apenas retorna em vez de encerrar o processo
  }
}

async function menu() {
  limparTerminal(); // Limpa o terminal antes de mostrar o menu
  while (true) {
    const { opcao } = await inquirer.prompt({
      type: "list",
      name: "opcao",
      message: "Escolha uma opção:",
      choices: [
        "Adicionar Categoria",
        "Listar Categoria",
        "Buscar Categoria",
        "Atualizar Categoria",
        "Deletar Categoria",
        "Adicionar Produto",
        "Listar Produto",
        "Buscar Produto",
        "Atualizar Produto",
        "Deletar Produto",
        "Sair",
      ],
    });

    try {
      if (opcao === "Adicionar Categoria") await adicionarCategoria();
      else if (opcao === "Listar Categoria") await listarCategorias();
      else if (opcao === "Buscar Categoria") await buscarCategoria();
      else if (opcao === "Atualizar Categoria") await atualizarCategoria();
      else if (opcao === "Deletar Categoria") await deletarCategoria();
      else if (opcao === "Adicionar Produto") await adicionarProduto();
      else if (opcao === "Listar Produto") await listarProdutos();
      else if (opcao === "Buscar Produto") await buscarProduto();
      else if (opcao === "Atualizar Produto") await atualizarProduto();
      else if (opcao === "Deletar Produto") await deletarProduto();
      else if (opcao === "Sair") {
        console.log("Encerrando o sistema...");
        await AppDataSource.destroy(); // Fecha conexão com o banco
        limparTerminal();
        process.exit(0);
      }
    } catch (error) {
      console.error("❌ Ocorreu um erro:", error);
    }
  }
}

(async () => {
  await iniciarBanco();
  await menu();
})();
