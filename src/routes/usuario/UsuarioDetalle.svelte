<script lang="ts">
  import api from '../../utils/api'
  import { session, clearSession } from '../../stores/auth'
  import { onMount } from 'svelte'
  import PropuestasSuscritas from '../../lib/components/PropuestasSuscritas.svelte'

  let loading = $state(false)
  let editing = $state(false)
  let saving = $state(false)
  let error: string | null = $state(null)
  let saveError: string | null = $state(null)
  let me: any = $state(null)
  let editForm = $state({
    identificador: '',
    correo: '',
    codigo: ''
  })

  function getInitial(text?: string | null): string {
    if (!text || typeof text !== 'string' || text.length === 0) return '?'
    return text.charAt(0).toUpperCase()
  }

  async function loadMe() {
    try {
      loading = true
      error = null
      const { data } = await api.get('/usuarios/me')
      me = (data as any) ?? null
      if (me) {
        editForm = {
          identificador: me.identificador || '',
          correo: me.correo || '',
          codigo: me.codigo || ''
        }
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

  function startEdit() {
    editing = true
    saveError = null
  }

  function cancelEdit() {
    editing = false
    saveError = null
    if (me) {
      editForm = {
        identificador: me.identificador || '',
        correo: me.correo || '',
        codigo: me.codigo || ''
      }
    }
  }

  async function saveProfile() {
    if (!editForm.identificador.trim() || !editForm.correo.trim()) {
      saveError = 'Identificador y correo son obligatorios'
      return
    }
    
    try {
      saving = true
      saveError = null
      const { data } = await api.put('/usuarios/me', editForm)
      me = data
      editing = false
    } catch (e: any) {
      saveError = e?.message ?? 'No se pudo actualizar el perfil'
    } finally {
      saving = false
    }
  }

  onMount(loadMe)
</script>

<section class="mx-auto max-w-2xl px-4 py-6">
  <header class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-semibold">Mi perfil</h1>
    <button class="btn btn-error btn-outline" onclick={logout}>Cerrar sesión</button>
  </header>

  {#if loading}
    <div class="flex justify-center py-8">
      <div class="loading loading-spinner loading-lg"></div>
    </div>
  {:else if error}
    <div role="alert" class="alert alert-error">
      <span>{error}</span>
      <button class="btn btn-sm" onclick={loadMe}>Reintentar</button>
    </div>
  {:else if me}
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold">
              {getInitial(me.identificador || me.correo)}
            </div>
            <div>
              <h2 class="font-bold text-xl">{me.identificador || 'Usuario'}</h2>
              <p class="text-base-content/70">{me.correo}</p>
              <div class="flex items-center gap-4 mt-1 text-sm text-base-content/60">
                <span class="font-mono">ID: {me.id}</span>
                <span class="font-mono">UUID: {me.uuid?.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
          {#if !editing}
            <button class="btn btn-outline btn-sm" onclick={startEdit}>Editar perfil</button>
          {/if}
        </div>

        {#if editing}
          <div class="space-y-4">
            <div class="form-control">
              <label class="label" for="identificador">
                <span class="label-text">Identificador <span class="text-error">*</span></span>
              </label>
              <input
                id="identificador"
                class="input input-bordered"
                type="text"
                bind:value={editForm.identificador}
                placeholder="Tu identificador"
                disabled={saving}
                required
              />
            </div>

            <div class="form-control">
              <label class="label" for="correo">
                <span class="label-text">Correo electrónico <span class="text-error">*</span></span>
              </label>
              <input
                id="correo"
                class="input input-bordered"
                type="email"
                bind:value={editForm.correo}
                placeholder="tu@correo.com"
                disabled={saving}
                required
              />
            </div>

            <div class="form-control">
              <label class="label" for="codigo">
                <span class="label-text">Código Postál</span>
              </label>
              <input
                id="codigo"
                class="input input-bordered"
                type="text"
                bind:value={editForm.codigo}
                placeholder="Código opcional"
                disabled={saving}
              />
            </div>

            {#if saveError}
              <div role="alert" class="alert alert-error">
                <span>{saveError}</span>
              </div>
            {/if}

            <div class="flex justify-end gap-2">
              <button class="btn btn-ghost" onclick={cancelEdit} disabled={saving}>Cancelar</button>
              <button class="btn btn-primary" onclick={saveProfile} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">Identificador</div>
              <div class="stat-value text-lg">{me.identificador || 'No definido'}</div>
            </div>
            
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">Correo</div>
              <div class="stat-value text-lg">{me.correo || 'No definido'}</div>
            </div>
            
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">Código Postál</div>
              <div class="stat-value text-lg">{me.codigo || 'No asignado'}</div>
            </div>
            
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">Estado</div>
              <div class="stat-value text-lg text-success">Activo</div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div class="mt-8">
      <PropuestasSuscritas propuestas={me.propuestasSuscritas || []} />
    </div>
  {/if}
</section>
