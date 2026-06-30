import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { ContentTypeEnum } from "src/common/enums/content-type.enum";

export class CreateContentDto {

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

    @IsArray()
    @IsNumber({}, { each: true })
    @IsPositive({ each: true })
    genreIds?: number[];

    @IsOptional()
    @IsBoolean()
    adult?: boolean;

    @IsEnum(ContentTypeEnum)
    type?: ContentTypeEnum;


}
