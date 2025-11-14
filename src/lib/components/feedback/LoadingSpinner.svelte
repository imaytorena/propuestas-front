<script lang="ts">
  interface Props {
    etiqueta?: string
    size?: 'xs' | 'sm' | 'md' | 'lg'
  }
  let { etiqueta = 'Cargando...', size = 'md' }: Props = $props()
</script>

<div class="flex items-center gap-2 text-base-content/70">
  <span class="loading" class:loading-xs={size==='xs'} class:loading-sm={size==='sm'} class:loading-md={size==='md'} class:loading-lg={size==='lg'}></span>
  <span>{etiqueta}</span>
</div>
