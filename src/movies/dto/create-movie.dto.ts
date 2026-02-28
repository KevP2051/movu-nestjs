import { IsString, IsNumber, IsDate, IsBoolean, IsOptional, IsArray, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
    @IsNumber()
    @IsPositive()
    tmdbId: number;

    @IsString()
    title: string;

    @IsString()
    overview: string;

    @IsDate()
    @Type(() => Date)
    releaseDate: Date;

    @IsString()
    posterPath: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    popularity?: number;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @IsPositive({ each: true })
    genreIds?: number[];

    @IsOptional()
    @IsBoolean()
    adult?: boolean;
}
