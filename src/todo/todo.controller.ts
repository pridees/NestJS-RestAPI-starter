import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiImplicitQuery, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger'
import { Todo } from './models/todo.models'
import { TodoService } from './todo.service'
import { TodoVm } from './models/veiw-models/todo-vm.model'
import { TodoParams } from './models/veiw-models/todo-params.model'
import { ApiException } from '../shared/api-exception.model'
import { GetOperationId } from '../shared/utilities/get-operation-id'
import * as _ from 'lodash'
import { TodoLevel } from './models/todo-level.enum'
import { isArray } from 'util'
import { ToBooleanPipe } from '../shared/pipes/to-boolean.pipe'
import { RolesGuard } from '../shared/guards/roles.guard'
import { Roles } from '../shared/decorators/roles.decorator'
import { UserRole } from '../user/models/user-role.enum'
import { AuthGuard } from '@nestjs/passport'

@ApiUseTags(Todo.modelName)
@ApiBearerAuth()
@Controller('todos')
export class TodoController {
  constructor(
    private readonly _todoService: TodoService,
  ) {}

  @Post()
  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({status: HttpStatus.CREATED, type: TodoVm})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
  @ApiOperation(GetOperationId(Todo.modelName, 'Create'))
  async create(@Body() params: TodoParams): Promise<TodoVm> {
    const { content } = params

    if (!content) {
      throw new HttpException('Content is required', HttpStatus.BAD_REQUEST)
    }

    try {
      const newTodo = await this._todoService.createTodo(params)
      return this._todoService.map<TodoVm>(newTodo)
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({status: HttpStatus.OK, type: TodoVm, isArray: true })
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
  @ApiOperation(GetOperationId(Todo.modelName, 'Get todos'))
  @ApiImplicitQuery({ name: 'level', required: false, isArray: true, collectionFormat: 'multi', description: 'Filter by level option' })
  @ApiImplicitQuery({ name: 'isCompleted', required: false, description: 'Filter by isCompleted option' })
  async get(
    @Query('level') level?: TodoLevel,
    @Query('isCompleted', new ToBooleanPipe()) isCompleted?: boolean,
  ): Promise<TodoVm[]> {
    let filter = {}

    if (level)
      filter['level'] = { $in: isArray(level) ? [...level] : [level]}

    if (isCompleted !== null) {
      if (filter['level']) {
        filter = { $and: [{ level: filter['level'] }, { isCompleted }] }
      } else {
        filter['isCompleted'] = isCompleted
      }
      }

    try {
      const todos = await this._todoService.findAll(filter)
      return this._todoService.map<TodoVm[]>(_.map(todos, todo => todo.toJSON()), true)
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Put()
  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({status: HttpStatus.CREATED, type: TodoVm})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
  @ApiOperation(GetOperationId(Todo.modelName, 'Update'))
  async update(@Body() todoVm: TodoVm): Promise<TodoVm> {
    const { id, content, level, isCompleted } = todoVm

    if (!todoVm || !id)
      throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST)

    const exists = await this._todoService.findById(id)

    if (!exists)
      throw new HttpException('Todo record does not exist', HttpStatus.NOT_FOUND)

    if (exists.isCompleted)
      throw new HttpException('Already completed', HttpStatus.CONFLICT)

    exists.content = content
    exists.isCompleted = isCompleted
    exists.level = level

    try {
      const updated = await this._todoService.update(id, exists)
      return this._todoService.map<TodoVm>(updated.toJSON())
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({status: HttpStatus.OK, type: TodoVm})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
  @ApiOperation(GetOperationId(Todo.modelName, 'Delete'))
  async delete(@Param('id') id: string): Promise<TodoVm> {

    const exists = await this._todoService.findById(id)

    if (!exists)
      throw new HttpException('Todo\'s id not found', HttpStatus.NOT_FOUND)

    try {
      const deleted = await this._todoService.delete(id)

      return this._todoService.map<TodoVm>(deleted.toJSON())
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
