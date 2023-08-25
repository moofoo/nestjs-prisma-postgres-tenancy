import {
    Controller,
    Get,
    ParseIntPipe,
    Param,
    Scope
} from '@nestjs/common';

import { UsersService } from './users.service';
@Controller({ path: 'users', scope: Scope.REQUEST })
export class UsersController {
    constructor(private readonly users: UsersService) { }

    @Get()
    findMany() {
        return this.users.findMany({});
    }

    @Get(':id')
    findUnique(@Param('id', ParseIntPipe) id: number) {
        return this.users.findUnique({ where: { id } });
    }
}

