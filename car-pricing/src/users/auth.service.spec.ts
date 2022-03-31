import { Test, TestingModule } from "@nestjs/testing";
import exp from "constants";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";


describe('Auth service', () => {

    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string ) => Promise.resolve({id: 1, email, password} as User)
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ],
        }).compile();
        
        service = module.get(AuthService)
    });

    it('can create an instnce of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('signup properly and return salted & hashed password', async () => {
        const user = await service.signup('a@a.com', 'password');
        expect(user.password).not.toEqual('password');
        const[salt,hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('signup to throw error if already used email is given', async () => {
        fakeUsersService.find = () => Promise.resolve([{email: 'a@a.com', password: '1', id: 1} as User]);
        expect(service.signup('a@a.com', 'password'))
            .rejects
            .toThrow('email in use');
    });

    it('throws if singin is called an unused email', async() => {
        expect(service.signin('a@a.com', 'password'))
            .rejects
            .toThrow('invalid email or password');
    });

    it('throws if invalid password is used', async() => {
        fakeUsersService.find = () => Promise.resolve([{email: 'a@a.com', password: 'a.b', id: 1} as User]);
        expect(service.signin('a@a.com', 'password'))
            .rejects
            .toThrow('invalid email or password');
    });

    it('returns user for valid user and password', async() => {
        fakeUsersService.find = () => Promise.resolve([{email: 'a@a.com', password: 'a.b', id: 1} as User]);
        const user = service.signin('a@a.com', 'password');

        
            
    });
});

