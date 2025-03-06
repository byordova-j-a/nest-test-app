import { Column, Model, Table } from "sequelize-typescript";

@Table({ timestamps: false })
export class User extends Model {
  @Column
  login: string;

  @Column
  tabel: string;

  @Column
  password: string;
}
