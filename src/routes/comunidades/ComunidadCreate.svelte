<script lang="ts">
  import page from 'page'
  import { goto } from '../../utils/nav'
  import api from '../../utils/api'
  import toast from 'svelte-french-toast'

  // Form state
  let nombre: string = ''
  let descripcion: string = ''
  let saving = false
  let saveError: string | null = null

  function validate(): string | null {
    if (!nombre.trim()) return 'El nombre es obligatorio'
    return null
  }

  async function create(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
    event.preventDefault()
    saveError = null
    const err = validate()
    if (err) {
      toast.error(err)
      return
    }
    saving = true
    try {
      const { data } = await api.post(`/comunidades`, { nombre, descripcion })
      const created = data?.data ?? data
      const id = created?.id
      toast.success('Comunidad creada')
      if (id) {
        page.show(`/comunidades/${id}`)
      } else {
        page.show('/comunidades')
      }
    } catch (e: any) {
      saveError = e?.message ?? 'No se pudo crear la comunidad'
      toast.error(saveError)
    } finally {
      saving = false
    }
  }
</script>

<section aria-labelledby="create-comunidad-heading" class="mx-auto max-w-3xl px-4 py-4 sm:py-6">
  <header class="mb-4 flex items-center justify-between gap-3">
    <h1 id="create-comunidad-heading" class="text-2xl font-semibold tracking-tight">Crear comunidad</h1>
    <a class="btn btn-ghost btn-sm" href="/comunidades" onclick={goto}>Cancelar</a>
  </header>

  <form class="space-y-4" onsubmit={create}>
    <div class="form-control">
      <label class="label" for="nombre">
        <span class="label-text">Nombre</span>
      </label>
      <input
        id="nombre"
        class="input input-bordered w-full"
        type="text"
        bind:value={nombre}
        placeholder="Nombre de la comunidad"
        required
        disabled={saving}
      />
    </div>

    <div class="form-control">
      <label class="label" for="descripcion">
        <span class="label-text">Descripción</span>
      </label>
      <textarea
        id="descripcion"
        class="textarea textarea-bordered w-full"
        rows="6"
        bind:value={descripcion}
        placeholder="Describe la comunidad"
        disabled={saving}
      ></textarea>
      <div class="label">
        <span class="label-text-alt">Puedes usar texto libre.</span>
      </div>
    </div>

    {#if saveError}
      <div role="alert" class="alert alert-error" aria-live="polite">
        <span>{saveError}</span>
      </div>
    {/if}

    <div class="flex items-center justify-end gap-2">
      <a class="btn btn-ghost" href="/comunidades" onclick={goto} type="button">Cancelar</a>
      <button class="btn btn-primary text-white" type="submit" disabled={saving}>
        {saving ? 'Creando…' : 'Crear'}
      </button>
    </div>
  </form>
</section>
