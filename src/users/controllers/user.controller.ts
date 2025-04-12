import { Authorized, Body, CurrentUser, Get, JsonController, Post } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { inject, injectable } from 'tsyringe';

import { CreateUserDto, UserDto } from '@users/dtos';
import { CreateUserUseCase } from '@users/use-cases/create-user/create-user.use-case';
import { GetMeUseCase } from '@users/use-cases/get-me/get-me.use-case';

@injectable()
@JsonController('/users')
export class UserController {
  constructor(
    @inject('CreateUserUseCase')
    private readonly createUserUseCase: CreateUserUseCase,
    @inject('GetMeUseCase')
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @Post('/create')
  @OpenAPI({
    summary: 'Create a new user',
    description: 'Creates a new user with the provided email, password, and name',
    responses: {
      '201': {
        description: 'User created successfully',
      },
      '400': {
        description: 'Bad request - Invalid input data',
      },
      '409': {
        description: 'Conflict - User with this email already exists',
      },
    },
  })
  @ResponseSchema(UserDto)
  async create(@Body() userDto: CreateUserDto): Promise<UserDto> {
    return this.createUserUseCase.execute(userDto);
  }

  @Get('/me')
  @Authorized()
  @OpenAPI({
    summary: 'Get current user profile',
    description: 'Returns the profile of the currently authenticated user',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': {
        description: 'User profile retrieved successfully',
      },
      '401': {
        description: 'Unauthorized - Missing or invalid authentication',
      },
      '404': {
        description: 'Not found - User not found',
      },
    },
  })
  @ResponseSchema(UserDto)
  async getMe(@CurrentUser() userId: string): Promise<UserDto> {
    return this.getMeUseCase.execute(userId);
  }
}
