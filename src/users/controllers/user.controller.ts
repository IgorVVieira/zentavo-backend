import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';
import { Injections } from '@shared/types/injections';

import { CreateUserUseCase } from '@users/use-cases/create-user/create-user.use-case';
import { GetMeUseCase } from '@users/use-cases/get-me/get-me.use-case';

import { Request, Response } from 'express';

@injectable()
export class UserController {
  constructor(
    @inject(Injections.CREATE_USER_USE_CASE)
    private readonly createUserUseCase: CreateUserUseCase,
    @inject(Injections.GET_ME_USE_CASE)
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  // @OpenAPI({
  //   summary: 'Create a new user',
  //   description: 'Creates a new user with the provided email, password, and name',
  //   responses: {
  //     '201': {
  //       description: 'User created successfully',
  //     },
  //     '400': {
  //       description: 'Bad request - Invalid input data',
  //     },
  //     '409': {
  //       description: 'Conflict - User with this email already exists',
  //     },
  //   },
  // })
  // @ResponseSchema(UserDto)
  async create(request: Request, response: Response): Promise<Response> {
    const userDto = request.body;
    const user = await this.createUserUseCase.execute(userDto);

    return response.status(HttpStatus.CREATED).json(user);
  }

  // @OpenAPI({
  //   summary: 'Get current user profile',
  //   description: 'Returns the profile of the currently authenticated user',
  //   security: [{ bearerAuth: [] }],
  //   responses: {
  //     '200': {
  //       description: 'User profile retrieved successfully',
  //     },
  //     '401': {
  //       description: 'Unauthorized - Missing or invalid authentication',
  //     },
  //     '404': {
  //       description: 'Not found - User not found',
  //     },
  //   },
  // })
  // @ResponseSchema(UserDto)
  async getMe(request: Request, response: Response): Promise<Response> {
    const user = await this.getMeUseCase.execute(request.userId);

    return response.status(HttpStatus.OK).json(user);
  }
}
