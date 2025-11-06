import page from 'page'
import {writable} from 'svelte/store'
import {isAuthenticated} from './stores/auth'
import toast from "./lib/toast";

export type RouteName = 'inicio' | 'participacion' |
    'usuario-detalle' | 'usuario-editar' |
    'auth-login' | 'auth-registrar' |
    'ideas' | 'idea-crear' | 'idea-detalle' | 'idea-editar' |
    'propuestas' | 'propuesta-crear' | 'propuesta-detalle' | 'propuesta-editar' |
    'actividades' | 'actividad-crear' | 'actividad-detalle' | 'actividad-editar' |
    'comunidades' | 'comunidad-crear' | 'comunidad-detalle' | 'comunidad-editar' | 'comunidad-recomendar';

export interface RouteState {
    name: RouteName
    params: Record<string, string>
    path: string
}

export const route = writable<RouteState>({name: 'inicio', params: {}, path: '/'})

// Helpers to update route store
function setRoute(name: RouteName, ctx: any) {
    route.set({name, params: (ctx.params as Record<string, string>) ?? {}, path: ctx.path})
}

export async function initRouter() {
    const {isAuthenticated} = await import('./stores/auth')

    function requireAuth(ctx: any, next: any) {
        if (!isAuthenticated()) {
            const returnTo = encodeURIComponent(ctx.path + (ctx.querystring ? `?${ctx.querystring}` : ''))
            toast.push(`<strong>No hay usuario autenticado</strong><br>
                <a class=\"link\" href=\"/auth/login?returnTo=${returnTo}\">Iniciar sesión/Registrarse</a>`)
        } else {
            next()
        }
    }

    // Ideas
    page('/ideas', (ctx: any) => setRoute('ideas', ctx))
    page('/ideas/crear', (ctx: any) => setRoute('idea-crear', ctx))
    page('/ideas/:ideaId', (ctx: any) => setRoute('idea-detalle', ctx))
    page('/ideas/:ideaId/editar', (ctx: any) => setRoute('idea-editar', ctx))
    // Propuestas
    page('/propuestas', (ctx: any) => setRoute('propuestas', ctx))
    page('/propuestas/crear', requireAuth, (ctx: any) => setRoute('propuesta-crear', ctx))
    page('/propuestas/:propuestaId', (ctx: any) => setRoute('propuesta-detalle', ctx))
    page('/propuestas/:propuestaId/editar', (ctx: any) => setRoute('propuesta-editar', ctx))
    // Actividades
    page('/actividades', (ctx: any) => setRoute('actividades', ctx))
    page('/actividades/crear', requireAuth, (ctx: any) => setRoute('actividad-crear', ctx))
    page('/actividades/:actividadId', (ctx: any) => setRoute('actividad-detalle', ctx))
    page('/actividades/:actividadId/editar', (ctx: any) => setRoute('actividad-editar', ctx))
    // Comunidades
    page('/comunidades', (ctx: any) => setRoute('comunidades', ctx))
    page('/comunidades/crear', (ctx: any) => setRoute('comunidad-crear', ctx))
    page('/comunidades/:comunidadId', (ctx: any) => setRoute('comunidad-detalle', ctx))
    page('/comunidades/:comunidadId/editar', (ctx: any) => setRoute('comunidad-editar', ctx))
    page('/comunidades/:comunidadId/recomendar', (ctx: any) => setRoute('comunidad-recomendar', ctx))
    // Auth
    page('/auth/login', (ctx: any) => setRoute('auth-login', ctx))
    page('/auth/registrar', (ctx: any) => setRoute('auth-registrar', ctx))
    // Usuario
    page('/usuario', (ctx: any) => setRoute('usuario-detalle', ctx))
    page('/usuario/editar', (ctx: any) => setRoute('usuario-editar', ctx))
    // Default
    page('/participacion', (ctx: any) => setRoute('participacion', ctx))
    page('/', (ctx: any) => setRoute('inicio', ctx))
    // Start the router
    page()
}
