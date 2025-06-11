import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorator/roles.decorator";
import { UserService } from "src/service/user.service";
import { UserType } from "src/entity/enum/userType.enum";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private userService: UserService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) throw new ForbiddenException("Usuário não autenticado");

        const existUser = await this.userService.findOne(user);

        if (!existUser) throw new ForbiddenException("Usuário não encontrado");

        const hasPermission = requiredRoles.includes(existUser.type);

        if (!hasPermission) throw new ForbiddenException("Você não tem permissão para acessar essa rota");

        return true;
    }
}
