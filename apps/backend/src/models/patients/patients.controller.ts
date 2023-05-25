import {
    Controller,
    Get,
    ParseIntPipe,
    Param,
    Scope
} from '@nestjs/common';

import { PatientsService } from './patients.service';
@Controller({ path: 'patients', scope: Scope.REQUEST })
export class PatientsController {
    constructor(private readonly patients: PatientsService) { }

    @Get()
    findMany() {
        return this.patients.findMany({});
    }

    @Get(':id')
    findUnique(@Param('id', ParseIntPipe) id: number) {
        return this.patients.findUnique({ where: { id } });
    }
}