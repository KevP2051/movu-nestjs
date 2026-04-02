import { IsNumber, IsPositive, IsString } from "class-validator";


export class CreateGenreDto {

    @IsPositive()
    @IsNumber()
    tmdbId: number;

    @IsString()
    name: string;

}
