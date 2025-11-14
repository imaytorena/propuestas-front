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
    nombre: '',
    apellido: '',
    correo: '',
    codigo: ''
  })
  let checkingUsername = $state(false)
  let usernameError = $state('')
  let usernameTimeout: number
  let originalUsername = ''
  let showComunidadesModal = $state(false)

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
          nombre: me.nombre || '',
          apellido: me.apellido || '',
          correo: me.correo || '',
          codigo: me.codigo || ''
        }
        originalUsername = me.identificador || ''
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

  async function checkUsername(username: string) {
    if (!username || username.length < 2 || username === originalUsername) {
      usernameError = ''
      return
    }
    
    try {
      checkingUsername = true
      const { data } = await api.get(`usuarios/validate/identificador?identificador=${encodeURIComponent(username)}`)
      usernameError = data.available ? '' : 'Este username ya está en uso'
    } catch (e: any) {
      usernameError = 'Error verificando username'
    } finally {
      checkingUsername = false
    }
  }

  function onUsernameChange() {
    clearTimeout(usernameTimeout)
    usernameError = ''
    if (editForm.identificador.trim().length >= 2 && editForm.identificador !== originalUsername) {
      usernameTimeout = setTimeout(() => checkUsername(editForm.identificador), 500)
    }
  }

  function startEdit() {
    editing = true
    saveError = null
    usernameError = ''
  }

  function cancelEdit() {
    editing = false
    saveError = null
    if (me) {
      editForm = {
        identificador: me.identificador || '',
        nombre: me.nombre || '',
        apellido: me.apellido || '',
        correo: me.correo || '',
        codigo: me.codigo || ''
      }
      usernameError = ''
    }
  }

  async function saveProfile() {
    if (!editForm.identificador.trim() || !editForm.correo.trim()) {
      saveError = 'Identificador y correo son obligatorios'
      return
    }
    if (usernameError) {
      saveError = usernameError
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
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold">
              {getInitial(me.identificador || me.correo)}
            </div>
            <div>
              <h2 class="font-bold text-xl">{me.nombre && me.apellido ? `${me.nombre} ${me.apellido}` : me.identificador || 'Usuario'}</h2>
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
                <span class="label-text">Username <span class="text-error">*</span></span>
              </label>
              <div class="relative">
                <input
                  id="identificador"
                  class="input input-bordered"
                  class:input-error={usernameError}
                  class:input-success={editForm.identificador.length >= 2 && !usernameError && !checkingUsername && editForm.identificador !== originalUsername}
                  type="text"
                  bind:value={editForm.identificador}
                  oninput={onUsernameChange}
                  placeholder="Tu identificador"
                  disabled={saving}
                  required
                />
                {#if checkingUsername}
                  <div class="absolute right-3 top-1/2 -translate-y-1/2">
                    <div class="loading loading-spinner loading-sm"></div>
                  </div>
                {/if}
              </div>
              {#if usernameError}
                <div class="label">
                  <span class="label-text-alt text-error">{usernameError}</span>
                </div>
              {:else if editForm.identificador.length >= 2 && !checkingUsername && editForm.identificador !== originalUsername}
                <div class="label">
                  <span class="label-text-alt text-success">Username disponible</span>
                </div>
              {/if}
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label" for="nombre">
                  <span class="label-text">Nombre</span>
                </label>
                <input
                  id="nombre"
                  class="input input-bordered"
                  type="text"
                  bind:value={editForm.nombre}
                  placeholder="Tu nombre"
                  disabled={saving}
                />
              </div>

              <div class="form-control">
                <label class="label" for="apellido">
                  <span class="label-text">Apellido</span>
                </label>
                <input
                  id="apellido"
                  class="input input-bordered"
                  type="text"
                  bind:value={editForm.apellido}
                  placeholder="Tu apellido"
                  disabled={saving}
                />
              </div>
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
              <div class="stat-title">Username</div>
              <div class="stat-value text-lg">{me.identificador || 'No definido'}</div>
            </div>
            
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">Nombre completo</div>
              <div class="stat-value text-lg">{me.nombre && me.apellido ? `${me.nombre} ${me.apellido}` : 'No definido'}</div>
            </div>
            
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">Correo</div>
              <div class="stat-value text-lg">{me.correo || 'No definido'}</div>
            </div>
            
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">Estado</div>
              <div class="stat-value text-lg text-success">Activo</div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    {#if me.comunidadesMiembro && me.comunidadesMiembro.length > 0}
      <div class="mt-8">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h3 class="text-xl font-semibold mb-4">Mis comunidades</h3>
            <div class="flex flex-wrap gap-2">
              {#each me.comunidadesMiembro.slice(0, 6) as comunidad}
                <a href={`/comunidades/${comunidad.comunidadId}`} class="badge badge-primary badge-lg hover:badge-primary-focus cursor-pointer">{comunidad?.comunidad?.nombre || `Comunidad ${comunidad.id}`}</a>
              {/each}
              {#if me.comunidadesMiembro.length > 6}
                <button class="btn btn-sm btn-outline" onclick={() => showComunidadesModal = true}>Ver más ({me.comunidadesMiembro.length - 6})</button>
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/if}

    <div class="mt-8">
      <PropuestasSuscritas
        propuestaIdsAsistire={me.propuestasAsistire || []}
        propuestasInteres={me.propuestasInteres || []}
      />
    </div>
  {/if}
</section>

{#if showComunidadesModal}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Todas mis comunidades</h3>
      <div class="space-y-2 max-h-96 overflow-y-auto">
        {#each me.comunidadesMiembro as comunidad}
          <a href={`/comunidades/${comunidad.comunidadId}`} class="block p-3 rounded-lg hover:bg-base-200 transition-colors">
            <div class="font-medium">{comunidad?.comunidad?.nombre || `Comunidad ${comunidad.comunidadId}`}</div>
            {#if comunidad?.comunidad?.descripcion}
              <div class="text-sm text-base-content/70 mt-1">{comunidad.comunidad.descripcion}</div>
            {/if}
          </a>
        {/each}
      </div>
      <div class="modal-action">
        <button class="btn" onclick={() => showComunidadesModal = false}>Cerrar</button>
      </div>
    </div>
  </div>
{/if}
