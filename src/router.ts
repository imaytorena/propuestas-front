import page from 'page'
import {writable} from 'svelte/store'

export type RouteName = 'inicio' | 'participacion' |
    'usuario-detalle' | 'usuario-editar' |
    'auth-login' | 'auth-registrar' |
    'ideas' | 'idea-crear' | 'idea-detalle' | 'idea-editar' |
    'propuestas' | 'propuesta-crear' | 'propuesta-detalle' | 'propuesta-editar' |
    'actividades' | 'actividad-crear' | 'actividad-detalle' | 'actividad-editar' |
    'comunidades' | 'comunidad-crear' | 'comunidad-detalle' | 'comunidad-editar';

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

export function initRouter() {
    // Ideas
    page('/ideas', (ctx: any) => setRoute('ideas', ctx))
    page('/ideas/crear', (ctx: any) => setRoute('idea-crear', ctx))
    page('/ideas/:ideaId', (ctx: any) => setRoute('idea-detalle', ctx))
    page('/ideas/:ideaId/editar', (ctx: any) => setRoute('idea-editar', ctx))
    // Ideas
    page('/propuestas', (ctx: any) => setRoute('propuestas', ctx))
    page('/propuestas/crear', (ctx: any) => setRoute('propuesta-crear', ctx))
    page('/propuestas/:propuestaId', (ctx: any) => setRoute('propuesta-detalle', ctx))
    page('/propuestas/:propuestaId/editar', (ctx: any) => setRoute('propuesta-editar', ctx))
    // Ideas
    page('/actividades', (ctx: any) => setRoute('actividades', ctx))
    page('/actividades/crear', (ctx: any) => setRoute('actividad-crear', ctx))
    page('/actividades/:actividadId', (ctx: any) => setRoute('actividad-detalle', ctx))
    page('/actividades/:actividadId/editar', (ctx: any) => setRoute('actividad-editar', ctx))
    // Ideas
    page('/comunidades', (ctx: any) => setRoute('comunidades', ctx))
    page('/comunidades/crear', (ctx: any) => setRoute('comunidad-crear', ctx))
    page('/comunidades/:comunidadId', (ctx: any) => setRoute('comunidad-detalle', ctx))
    page('/comunidades/:comunidadId/editar', (ctx: any) => setRoute('comunidad-editar', ctx))
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
