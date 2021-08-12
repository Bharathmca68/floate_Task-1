import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { User } from "./auth.entity";
import { AuthCredDto } from "./dto/auth-cred.dto";
import * as bcrypt from 'bcrypt'

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async cretaUser(authCredDto: AuthCredDto): Promise<void> {
        const { email, user_name, password } = authCredDto;

        //Hasing  password
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password, salt)


        const newUser = this.create({ email, user_name: user_name, password: hash })
        // console.log(newUser)
        try {
            await this.save(newUser)
        } catch (error) {
            if (error.errno === 1062) {
                throw new ConflictException('username already exists')
            } else {
                throw new InternalServerErrorException();
            }
            // console.log(error.errno)
        }
    }
}

