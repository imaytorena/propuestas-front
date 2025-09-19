<script lang="ts">
  import page from 'page'
  import { goto } from '../../utils/nav'
  import api from '../../utils/api'

  let title: string = ''
  let descripcion: string = ''
  let saving = false
  let saveError: string | null = null

  async function create(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
    event.preventDefault()
    saveError = null
    if (!title.trim()) {
      saveError = 'El título es obligatorio'
      return
    }
    saving = true
    try {
      const { data } = await api.post(`/propuestas`, { title, description: descripcion })
      const id = data?.id ?? data?.data?.id
      // Navegar al detalle recién creado si tenemos id; si no, volver a la lista
      page.show(id ? `/propuestas/${id}` : '/propuestas')
    } catch (e: any) {
      saveError = e?.message ?? 'No se pudo crear la propuesta'
    } finally {
      saving = false
    }
  }
</script>

<section aria-labelledby="create-propuesta-heading" class="mx-auto max-w-3xl px-4 py-4 sm:py-6">
  <header class="mb-4 flex items-center justify-between gap-3">
    <h1 id="create-propuesta-heading" class="text-2xl font-semibold tracking-tight">Nueva propuesta</h1>
    <a class="btn btn-ghost btn-sm" href="/propuestas" onclick={goto}>Cancelar</a>
  </header>

  <form class="space-y-4" onsubmit={create}>
    <div class="form-control">
      <label class="label" for="title">
        <span class="label-text">Título</span>
      </label>
      <input
        id="title"
        class="input input-bordered w-full"
        type="text"
        bind:value={title}
        placeholder="Título"
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
        placeholder="Describe tu propuesta"
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
      <a class="btn btn-ghost" href="/propuestas" onclick={goto} type="button">Cancelar</a>
      <button class="btn btn-primary text-white" type="submit" disabled={saving}>
        {saving ? 'Creando…' : 'Crear'}
      </button>
    </div>
  </form>
</section>
