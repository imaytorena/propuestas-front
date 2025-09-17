<script lang="ts">
    import {onMount} from 'svelte'
    import {route} from '../router'
    import {goto} from '../utils/nav'

    let ideaId: string = ''
    ideaId = $route.params.ideaId

    const API_BASE: string = (import.meta as any).env?.VITE_API_BASE ?? 'http://localhost:3000'
    let loading = true
    let error: string | null = null
    let idea: any = null

    async function loadIdea() {
        if (!ideaId) return
        loading = true
        error = null
        try {
            const res = await fetch(`${API_BASE}/ideas/${ideaId}`)
            if (!res.ok) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(`Error ${res.status}`)
            }
            idea = await res.json()
        } catch (e: any) {
            error = e?.message ?? 'Error cargando idea'
        } finally {
            loading = false
        }
    }

    onMount(loadIdea)
</script>

{#if loading}
    <p>Cargando...</p>
{:else if error}
    <p style="color:crimson">{error}</p>
{:else if !idea}
    <p>No encontrada.</p>
{:else}
    <h2>{idea.title ?? `Idea ${ideaId}`}</h2>
    {#if idea.description}
        <p>{idea.description}</p>
    {/if}
    <p><a href={`/ideas/${ideaId}/editar`} onclick={goto}>Editar</a></p>
    <p><a href="/ideas" onclick={goto}>Volver a la lista</a></p>
{/if}
