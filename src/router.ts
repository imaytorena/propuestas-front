import page from 'page'
import {writable} from 'svelte/store'

export type RouteName = 'ideas-list' | 'idea-detail' | 'idea-edit' | 'home'

export interface RouteState {
    name: RouteName
    params: Record<string, string>
    path: string
}

export const route = writable<RouteState>({name: 'home', params: {}, path: '/'})

// Helpers to update route store
function setRoute(name: RouteName, ctx: any) {
    route.set({name, params: (ctx.params as Record<string, string>) ?? {}, path: ctx.path})
}

export function initRouter() {
    // Ideas list
    page('/ideas', (ctx: any) => setRoute('ideas-list', ctx))

    // Idea detail
    page('/ideas/:ideaId', (ctx: any) => setRoute('idea-detail', ctx))

    // Idea edit
    page('/ideas/:ideaId/editar', (ctx: any) => setRoute('idea-edit', ctx))

    // Default to ideas for now
    page('/', (ctx: any) => setRoute('ideas-list', ctx))

    // Start the router
    page()
}
