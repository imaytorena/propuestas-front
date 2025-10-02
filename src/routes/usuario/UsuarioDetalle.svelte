<script lang="ts">
  import api from '../../utils/api'
  import { session, clearSession } from '../../stores/auth'
  import { onMount } from 'svelte'

  let loading = $state(false)
  let error: string | null = $state(null)
  let me: any = $state(null)

  function getInitial(text?: string | null): string {
    if (!text || typeof text !== 'string' || text.length === 0) return '?'
    return text.charAt(0).toUpperCase()
  }

  async function loadMe() {
    try {
      loading = true
      error = null
      // Try to use store user first
      me = $session?.user
      if (!me) {
        const { data } = await api.get('/me')
        me = (data as any) ?? null
      }
    } catch (e: any) {
      error = e?.message ?? 'No se pudo cargar el perfil'
    } finally {
      loading = false
    }
  }

  function logout() {
    clearSession()
    window.location.href = '/'
  }

  onMount(loadMe)
</script>

<section class="mx-auto max-w-2xl px-4 py-6">
  <header class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-semibold">Mi perfil</h1>
    <button class="btn btn-ghost" onclick={logout}>Cerrar sesión</button>
  </header>

  {#if loading}
    <div class="loading loading-spinner loading-lg"></div>
  {:else if error}
    <div role="alert" class="alert alert-error">
      <span>{error}</span>
    </div>
  {:else}
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="flex items-center gap-4">
          {#if me?.avatarUrl}
            <img src={me.avatarUrl} alt="avatar" class="w-16 h-16 rounded-full" />
          {:else}
            <div class="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center text-xl">
              {getInitial(me?.name || me?.email)}
            </div>
          {/if}
          <div>
            <div class="font-semibold text-lg">{me?.name ?? 'Usuario'}</div>
            <div class="text-base-content/70">{me?.email ?? ''}</div>
            {#if me?.id}
              <div class="text-xs opacity-70">ID: {me.id}</div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</section>
