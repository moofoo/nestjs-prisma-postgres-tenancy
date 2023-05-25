import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';

@Module({
    controllers: [PatientsController],
    providers: [PatientsService],
    exports: [PatientsService]
})
export class PatientsModule { }
