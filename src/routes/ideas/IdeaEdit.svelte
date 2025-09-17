<script lang="ts">
    import {onMount} from 'svelte'
    import {route} from '../../router'
    import {goto} from '../../utils/nav'

    let ideaId: string = ''
    $: ideaId = $route.params.ideaId

    const API_BASE: string = (import.meta as any).env?.VITE_API_BASE ?? 'http://localhost:3000'

    // Form state
    let title: string = ''
    let contenido: string = ''
    let loading = true
    let saving = false
    let error: string | null = null
    let saveError: string | null = null
    let loaded = false

    async function loadIdea() {
        if (!ideaId) return
        loading = true
        error = null
        try {
            const res = await fetch(`${API_BASE}/ideas/${ideaId}`)
            if (!res.ok) throw new Error(`Error ${res.status}`)
            const idea = await res.json()
            title = idea?.title ?? ''
            contenido = idea?.contenido ?? ''
            loaded = true
        } catch (e: any) {
            error = e?.message ?? 'Error cargando idea'
        } finally {
            loading = false
        }
    }

    async function save(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
        event.preventDefault();
        if (!ideaId) return
        saveError = null
        if (!title.trim()) {
            saveError = 'El título es obligatorio'
            return
        }
        saving = true
        try {
            const res = await fetch(`${API_BASE}/ideas/${ideaId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({title, contenido})
            })
            if (!res.ok) throw new Error(`Error ${res.status}`)
            // Volver al detalle
            const href = `/ideas/${ideaId}`
            // programmatic navigation with page.js helper
            const fakeEvent = {
                preventDefault() {
                }, defaultPrevented: true
            } as any
            goto(Object.assign(fakeEvent, {currentTarget: {getAttribute: () => href}}))
        } catch (e: any) {
            saveError = e?.message ?? 'No se pudo guardar'
        } finally {
            saving = false
        }
    }

    onMount(loadIdea)
</script>

{#if loading}
    <p>Cargando...</p>
{:else if error}
    <p style="color:crimson">{error}</p>
{:else if !loaded}
    <p>No encontrado.</p>
{:else}
    <h2>Editar idea {ideaId}</h2>
    <form onsubmit={save}>
        <div style="margin-bottom: 0.5rem">
            <label>
                Título<br/>
                <input class="input input-primary" type="text" bind:value={title} placeholder="Título"/>
            </label>
        </div>
        <div style="margin-bottom: 0.5rem">
            <label>
                Contenido<br/>
                <textarea class="textarea textarea-primary" rows="5" bind:value={contenido} placeholder="Contenido"></textarea>
            </label>
        </div>
        {#if saveError}
            <p style="color:crimson">{saveError}</p>
        {/if}
        <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
    </form>
    <p><a href={`/ideas/${ideaId}`} onclick={goto}>Volver al detalle</a></p>
    <p><a href="/ideas" onclick={goto}>Volver a la lista</a></p>
{/if}
