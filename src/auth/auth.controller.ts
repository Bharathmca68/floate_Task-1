import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { User } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthCredDto } from './dto/auth-cred.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    async signup(@Body() authCredDto: AuthCredDto): Promise<void> {
        return await this.authService.signup(authCredDto);
    }

    @Post('/login')
    async login(@Body() authCredDto: AuthCredDto): Promise<{ accessToken: string }> {
        return await this.authService.login(authCredDto);
    }

    @Get('/getalluser')
    async fetchUser(@Query('page') page: number = 1, @Query('size') size: number = 2): Promise<any> {
        return await this.authService.GetAllUsers(page, size);
    }

    @Get('/searchUser')
    async searchUser(@Body() authCredDto: AuthCredDto, @Query('page') page: number = 1, @Query('size') page_size: number = 2): Promise<any> {
        return await this.authService.searchByUsername(authCredDto, page, page_size);
    }

    @Delete('deleteuser/:id')
    async DeleteUser(@Param('id') id: string): Promise<void> {
        return await this.authService.remove(id)
    }

}
