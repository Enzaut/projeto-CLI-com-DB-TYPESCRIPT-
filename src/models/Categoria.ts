import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Produto } from "./Produto";

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 60 })
  nome!: string;

  @Column({ length: 120 })
  descricao!: string;

  @CreateDateColumn()
  dataCriacao!: Date;

  @UpdateDateColumn()
  dataAtualizacao!: Date;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  produtos!: Produto[];
}
