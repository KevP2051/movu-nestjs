import { IsString, IsNumber, IsDate, IsBoolean, IsOptional, IsArray, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
    @IsNumber()
    @IsPositive()
    id: number;



}
