import { 
    Controller,
    Post,
    Get,
    Patch,
    Body,
    Param,
    Query,
    Delete,
    NotFoundException,
    Session,
    UseGuards
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { createUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {

    constructor(private usersService: UsersService, private authService: AuthService){}

    @Post('/signup')
    async createUser(@Body() body: createUserDto, @Session() session: any){
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signIn(@Body() body: createUserDto, @Session() session: any){
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    async signOut(@Session() session: any){
        session.userId = null;
    }

    @UseGuards(AuthGuard)
    @Get('/whoami')
    whoAmI(@CurrentUser() currentUser: User){
        return currentUser;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string){
        const user = this.usersService.findOne(parseInt(id));
        if(!user) {
            throw new NotFoundException('user not found');
        }

        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string){
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id, @Body() body: UpdateUserDto){
        console.log(body);
        return this.usersService.update(parseInt(id), body);
    }
}
