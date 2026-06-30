import { IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
    @IsUUID()
    id: string;


}
