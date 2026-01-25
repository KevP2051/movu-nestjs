
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { Strategy, ExtractJwt } from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService
    ) {


        super({
            secretOrKey:configService.get('app.jwtSecret')!,
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
        });


    }


    //Esto se ejecuta cuando la firma es válida y el token no ha expirado
    async validate(payload: JwtPayload): Promise<User> {

        const { id } = payload;

        const user = await this.userRepository.findOneBy({id});

        if(!user)  throw new UnauthorizedException('Token not valid');

        if(!user.isActive) throw new UnauthorizedException('User is not active, please contact support for further information');

        return user;
    }

}