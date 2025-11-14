<script lang="ts">
  interface Props {
    etiqueta: string
    variante?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'ghost' | 'neutral'
    size?: 'xs' | 'sm' | 'md' | 'lg'
  }
  let { etiqueta, variante = 'info', size = 'sm' }: Props = $props()
</script>

<span class="badge" class:badge-primary={variante==='primary'} class:badge-secondary={variante==='secondary'} class:badge-info={variante==='info'} class:badge-success={variante==='success'} class:badge-warning={variante==='warning'} class:badge-error={variante==='error'} class:badge-ghost={variante==='ghost'} class:badge-neutral={variante==='neutral'} class:badge-xs={size==='xs'} class:badge-sm={size==='sm'} class:badge-md={size==='md'} class:badge-lg={size==='lg'}>{etiqueta}</span>
