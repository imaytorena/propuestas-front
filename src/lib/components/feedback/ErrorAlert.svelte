<script lang="ts">
  interface Props {
    mensaje: string
    onRetry?: () => void
  }
  let { mensaje, onRetry = undefined }: Props = $props()
</script>

<div role="alert" class="alert alert-error">
  <span>{mensaje}</span>
  {#if onRetry}
    <div class="ml-auto">
      <button class="btn btn-sm" onclick={onRetry}>Reintentar</button>
    </div>
  {/if}
</div>
