<script lang="ts">
  export let evaluacion: { buena: number; regular: number; mala: number };
  
  $: total = evaluacion.buena + evaluacion.regular + evaluacion.mala || 1; // avoid division by zero
  $: porcentajeBuena = (evaluacion.buena / total) * 100;
  $: porcentajeRegular = (evaluacion.regular / total) * 100;
  $: porcentajeMala = (evaluacion.mala / total) * 100;
</script>

<div class="flex h-2 w-24 rounded-full overflow-hidden">
  {#if total > 0}
    {#if porcentajeBuena > 0}
      <div 
        class="bg-success" 
        style="width: {porcentajeBuena}%"
      />
    {/if}
    {#if porcentajeRegular > 0}
      <div 
        class="bg-warning" 
        style="width: {porcentajeRegular}%"
      />
    {/if}
    {#if porcentajeMala > 0}
      <div 
        class="bg-error" 
        style="width: {porcentajeMala}%"
      />
    {/if}
  {:else}
    <div class="bg-neutral/20 w-full"/>
  {/if}
</div>
