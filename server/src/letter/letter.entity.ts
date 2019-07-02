import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Letter {
  @PrimaryGeneratedColumn() id: number;
  @Column() name: string;
  @Column() created: Date;
  @Column() updated: Date;
  @Column() isFrozen: boolean;
}
