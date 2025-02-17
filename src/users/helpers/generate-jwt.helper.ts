import { JWTPayLoadType } from '@/utils/type';
import { JwtService } from '@nestjs/jwt';

export class GenerateJwtHelper {
  constructor(public readonly jwtService: JwtService) {}

  public generateJWT(payload: JWTPayLoadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
