import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from 'src/models/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserType } from 'src/entity/enum/userType.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwt: JwtService,         // Serviço para geração de tokens JWT
  ) { }

  // Criação de um novo usuário
  async create(createUserDto: CreateUserDTO) {
    const { name, email, address, type, password, passwordConfirmation } = createUserDto;

    if (type && type.toUpperCase() === "ADMIN") throw new ConflictException("Você não tem permissão para criar usuario do tipo ADMIN.");

    // Verifica se já existe usuário com o mesmo email
    const existUser = await this.checkUserEmail(email);
    if (existUser) throw new ConflictException("Esse usuario já existe");

    // Verifica se as senhas coincidem
    if (password !== passwordConfirmation) throw new ConflictException("As senhas precisam ser iguais");

    // Gera hash da senha
    const hashPassword = await hash(password, 8);

    // Cria objeto para inserção
    const newUser = {
      name,
      email,
      address,
      type: UserType[type as keyof typeof UserType],
      provider: 'local' as const,
      password: hashPassword
    };

    // Cria o usuário no banco
    return await this.userRepository.save(newUser);
  }

  // Login via OAuth (Google, etc.)
  async oauthLogin(profile: { email: string; name: string }) {
    // Verifica se o usuário já existe
    const existUser = await this.checkUserEmail(profile.email);

    if (!existUser) {
      // Cria novo usuário caso não exista
      const userData = {
        email: profile.email,
        name: profile.name,
        provider: 'google' as const,
      };

      const user = await this.userRepository.save(userData);

      // Gera token de acesso
      const accessToken = this.jwt.sign({ sub: user.id });
      return { token: accessToken, user, newUser: true };
    }

    // Usuário já existe: retorna token
    const accessToken = this.jwt.sign({ sub: existUser.id });
    return { token: accessToken };
  }

  // Finaliza o registro de um usuário autenticado via OAuth
  async finishregisterOAuthUser(userId: { sub: string }, user: CreateUserDTO) {
    const { address, type } = user;

    // Busca usuário pelo email
    const existUser = await this.checkUserId(userId.sub);

    const newUser = {
      address,
      type: UserType[type as keyof typeof UserType],
    };

    // Atualiza os dados do usuário com informações complementares
    await this.userRepository.update(
      { id: existUser?.id },
      newUser
    );

    // Gera token JWT
    const accessToken = this.jwt.sign({ sub: existUser?.id.toString() });
    return { token: accessToken };
  }

  // Login tradicional com email e senha
  async login(user: LoginUserDTO) {
    const { email, password } = user;

    // Busca usuário pelo email
    const existUser = await this.checkUserEmail(email);
    if (!existUser || !existUser.password) throw new UnauthorizedException("Senha ou email incorretos");

    // Compara senhas
    const checkPassword = await compare(password, existUser.password);
    if (!checkPassword) throw new UnauthorizedException("Senha ou email incorretos");

    // Gera token de acesso
    const accessToken = this.jwt.sign({ sub: existUser.id.toString() });
    return { token: accessToken };
  }

  // Retorna dados do usuário logado
  async findOne(user: { sub: string }) {
    const userId = user.sub;

    const existUser = await this.userRepository.findOne({
      where: { id: userId }, select: {
        name: true,
        email: true,
        address: true,
        type: true
      },
    });

    if (!existUser) throw new ConflictException("Usuário não encontrado");


    return existUser;
  }

  async updateUser(userId: { sub: string }, user: UpdateUserDTO) {
    const { name, email, address, type, password, passwordConfirmation } = user;

    const existUser = await this.userRepository.findOne({ where: { id: userId.sub } });

    if (!existUser) throw new ConflictException("Usuário não encontrado");

    if (type && type.toUpperCase() === "ADMIN") throw new ConflictException("Você não tem permissão para alterar o tipo para ADMIN.");

    const updateData: Partial<User> = {
      name,
      email,
      address,
      type: UserType[type as keyof typeof UserType],
    };

    if (password) {
      if (password !== passwordConfirmation) {
        throw new ConflictException("As senhas precisam ser iguais");
      }
      const hashPassword = await hash(password, 8);
      updateData.password = hashPassword;
    }

    await this.userRepository.update(
      { id: existUser.id },
      updateData
    );
  }

  // Remove o usuário do sistema
  async removeUser(user: { sub: string }) {
    const existUser = await this.userRepository.findOne({
      where: { id: user.sub },
      relations: ['ads', 'orders'],
    });

    if (!existUser) throw new NotFoundException("Usuário não encontrado");

    await this.userRepository.remove(existUser);
  }

  private async checkUserEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'type']
    });
    return user;
  }

  private async checkUserId(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'password', 'type']
    });
    return user;
  }

}
