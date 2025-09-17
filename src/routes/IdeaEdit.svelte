<script lang="ts">
  import { route } from '../router'
  let ideaId: string = ''
  $: ideaId = $route.params.ideaId
  import { goto } from '../utils/nav'

  function save() {
    alert(`Guardado cambios de la idea ${ideaId}`)
  }
</script>

<h2>Editar idea {ideaId}</h2>
<p>Formulario de edición (demo).</p>
<button onclick={save}>Guardar</button>
<p><a href={`/ideas/${ideaId}`} onclick={goto}>Volver al detalle</a></p>
<p><a href="/ideas" onclick={goto}>Volver a la lista</a></p>
