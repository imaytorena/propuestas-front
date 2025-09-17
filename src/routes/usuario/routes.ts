import type {RouteName} from "../../router";

export const UsuarioRoutes: RouteName[] = [
    'usuario-editar',
    'usuario-detalle',
];
export const AuthRoutes: RouteName[] = [
    'auth-login',
    'auth-registrar',
];

export const UsuarioAuthRoutes: RouteName[] = [
    ...UsuarioRoutes,
    ...AuthRoutes,
];