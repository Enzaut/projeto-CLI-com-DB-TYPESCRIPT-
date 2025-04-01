import "reflect-metadata";
import { DataSource } from "typeorm";
import { Categoria } from "./models/Categoria";
import { Produto } from "./models/Produto";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "Amaregolas775",
  database: "parte2",
  synchronize: true, // True apenas para desenvolvimento (cria tabelas automaticamente)
  logging: true,
  entities: [Categoria, Produto], // Agora as entidades estão corretamente importadas
});
