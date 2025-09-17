<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '../utils/nav'

  type Idea = {
    id: number | string
    title?: string
    description?: string
  }

  let ideas: Idea[] = []
  let loading = true
  let error: string | null = null

  const API_BASE: string = (import.meta as any).env?.VITE_API_BASE ?? 'http://localhost:3000'

  async function loadIdeas() {
    loading = true
    error = null
    try {
      const res = await fetch(`${API_BASE}/ideas`)
      if (!res.ok) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(`Error ${res.status}`)
      }
      const data = await res.json()
      // Allow either array of items or wrapped payload like {items: []}
      ideas = Array.isArray(data) ? data : (data.items ?? data.ideas ?? [])
    } catch (e: any) {
      error = e?.message ?? 'Error cargando ideas'
    } finally {
      loading = false
    }
  }

  onMount(loadIdeas)
</script>

<h2>Ideas</h2>
{#if loading}
  <p>Cargando...</p>
{:else if error}
  <p style="color:crimson">{error}</p>
{:else if ideas.length === 0}
  <p>No hay ideas.</p>
{:else}
  <ul>
    {#each ideas as idea}
      <li>
        <a href={`/ideas/${idea.id}`} onclick={goto}>
          {idea.title ?? `Idea ${idea.id}`}
        </a>
      </li>
    {/each}
  </ul>
{/if}
