import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

export enum EUserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: EUserRole,
    default: EUserRole.USER,
    comment: 'Role of the user, can be ADMIN or USER',
  })
  role: EUserRole;

  @Column({
    nullable: true,
  })
  resetCode: string;

  @Column({
    nullable: true,
  })
  resetCodeExpiry: Date;
}
