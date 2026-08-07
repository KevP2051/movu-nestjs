import { IsEnum, IsNumber, IsPositive, IsString } from "class-validator";
import { ContentTypeEnum } from "src/common/enums/content-type.enum";


export class CreateGenreDto {

    @IsPositive()
    @IsNumber()
    tmdbId: number;

    @IsString()
    name: string;

    // The same tmdbId means a different genre depending on the content type.
    @IsEnum(ContentTypeEnum)
    contentType: ContentTypeEnum;

}
