import { IsIn, isNumber, IsNumber, IsOptional, IsPositive } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination-dto";


export class FindMovieDto extends PaginationDto {

    @IsOptional()
    @IsNumber()
    @IsPositive()
    genreId?: number;

    @IsOptional()
    @IsIn(['popularity', 'releaseDate'])
    sortBy?: 'popularity' | 'releaseDate';

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC';
}