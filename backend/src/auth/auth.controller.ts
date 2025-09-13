import {
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
    ConflictException
} from '@nestjs/common';
import { omit } from 'lodash';
import { Controller, Post, Body, Param } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-dto';
import { ResponseUtil } from 'src/common/response/response.util';

// ====== Controller ======
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

   
    // Signup left without ApiProperty as requested
    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        const existingUser = await this.usersService.findOneWithSelect({ email : createUserDto.email }, ['email'])
        if (existingUser) {
            throw new ConflictException('User already exists with this email');
        }
        let user = await this.usersService.create(createUserDto);
        user = omit(user.toObject(), ['password']);
        const { access_token, refresh_token } = await this.authService.login(user);

        return ResponseUtil.success('User created successfully',{ user, access_token, refresh_token });
    }

    @Post('admin/login')
    async login(@Body() loginDto: LoginUserDto) {
        const user = await this.usersService.findOneWithSelect({ email : loginDto.email }, ['email','role','password'])
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        if(user.role != 'admin'){
            throw new UnauthorizedException('You are not authorized.');
        }

        const isPasswordValid = await this.authService.validateUser(loginDto.password,user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
   
        const { access_token, refresh_token } = await this.authService.login(user);
        const filteredUser = omit(user.toObject(), ['password']);
        return ResponseUtil.success('User logged in successfully', { user: filteredUser, access_token, refresh_token });
    }



    @Post('login')
    async loginClient(@Body() loginDto: LoginUserDto) {
        const user = await this.usersService.findOneWithSelect({ email : loginDto.email }, ['email','role','password'])
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
       
        const isPasswordValid = await this.authService.validateUser(loginDto.password,user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
   
        const { access_token, refresh_token } = await this.authService.login(user);
        const filteredUser = omit(user.toObject(), ['password']);
        return ResponseUtil.success('User logged in successfully', { user: filteredUser, access_token, refresh_token });
    }
}
