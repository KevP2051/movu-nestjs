import { BadRequestException, createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";


export const GetUser = createParamDecorator(
    (data:string, ctx: ExecutionContext) => {

        
        const req = ctx.switchToHttp().getRequest();
        const user:User = req.user;

        return (!data) ? user: user[data];
    }

);