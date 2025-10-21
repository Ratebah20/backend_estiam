import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput, LoginInput, AuthResponse } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponse)
  async register(@Args('input') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Public()
  @Mutation(() => AuthResponse)
  async login(@Args('input') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }
}
