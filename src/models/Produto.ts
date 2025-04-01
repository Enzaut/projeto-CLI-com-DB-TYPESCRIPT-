import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Categoria } from "./Categoria";

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  nome!: string;

  @Column({ length: 120 })
  descricao!: string;

  @Column("float")
  preco!: number;

  @Column("int")
  quantidade!: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos, { onDelete: "CASCADE" })
  categoria!: Categoria;
  

  @CreateDateColumn()
  dataCriacao!: Date;

  @UpdateDateColumn()
  dataAtualizacao!: Date;
}
