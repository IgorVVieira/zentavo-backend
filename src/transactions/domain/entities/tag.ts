import { BaseEntity } from "@domain/entities/base-entity";

export class Tag extends BaseEntity {
  public userId: string;
  public name: string;
  public color: string;
}
