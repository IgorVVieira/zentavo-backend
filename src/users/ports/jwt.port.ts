import { JwtDto } from '@users/dtos/jwt.dto';

export interface IJwtPort {
  sign(data: JwtDto): string;
  verify(token: string): Promise<unknown>;
}
