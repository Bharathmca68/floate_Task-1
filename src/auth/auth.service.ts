import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredDto, AuthCredDtoLogin } from './dto/auth-cred.dto';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './dto/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }

    async signup(authCredDto: AuthCredDto): Promise<void> {
        return await this.userRepository.cretaUser(authCredDto)
    }

    async login(authCredDtoLogin: AuthCredDtoLogin): Promise<{ accessToken: string }> {
        const { email, password } = authCredDtoLogin

        const user = await this.userRepository.findOne({ email })


        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { email }
            const accessToken: string = await this.jwtService.sign(payload)
            return { accessToken }
        } else {
            throw new UnauthorizedException('please check your login credentials')
        }
    }

    async GetAllUsers(page, size): Promise<any> {

        const user = await this.userRepository.find({
            take: size,
            skip: size * (page - 1)
        })
        return user
    }


    async searchByUsername(authCredDto: AuthCredDto, page, page_size): Promise<any> {
        const { user_name } = authCredDto

        const user = await this.userRepository.find(
            {
                where: {
                    user_name: user_name,
                },
                take: page_size,
                skip: page_size * (page - 1)
            }
        )
        return user
    }

    async remove(id: string): Promise<void> {
        const DeletionId = await this.userRepository.findOne({ id })

        if (DeletionId) {
            await this.userRepository.delete(id);
        } else {
            throw new NotFoundException(`could not delete || not found ${id}`)
        }
    }
}
