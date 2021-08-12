import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredDto } from './dto/auth-cred.dto';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './dto/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from './auth.entity';

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

    async login(authCredDto: AuthCredDto): Promise<{ accessToken: string }> {
        const { email, password } = authCredDto

        const user = await this.userRepository.findOne({ email })


        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { email }
            const accessToken: string = await this.jwtService.sign(payload)
            return { accessToken }
        } else {
            throw new UnauthorizedException('please check your login credentials')
        }
    }

    GetAllUsers(): Promise<User[]> {
        const user = this.userRepository.find()
        return user
    }


    async searchByUsername(authCredDto: AuthCredDto, page): Promise<any> {
        const { user_name } = authCredDto

        const user = await this.userRepository.find({ user_name })

        console.log(user.length)

        if (user.length > 1) {
            let page_size = 2;

            let temp;

            function paginate(array, page_size, page_number) {

                return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            temp = paginate(user, page_size, page);

            console.log(user.length)
            return temp
        } else {
            throw new UnauthorizedException(`couldn't found the username ${user_name}`)
        }
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
