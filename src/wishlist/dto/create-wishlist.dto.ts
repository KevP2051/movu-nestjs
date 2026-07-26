import { IsUUID } from "class-validator";

export class CreateWishlistDto {

    @IsUUID()
    contentId: string;


}
