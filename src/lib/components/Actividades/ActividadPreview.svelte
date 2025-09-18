<script lang="ts">
	import type { Actividad } from '$lib/types';
	let { actividad }: { actividad: Actividad } = $props();
	let { id, nombre, descripcion, estado, fechaEntrega, categorias, comunidades } =
		$derived(actividad);
</script>

<div class="container flex w-full flex-col gap-4 rounded-lg bg-base-100 p-8 px-4 py-8 shadow-lg">
	<div class="sm:flex-reverse flex flex-wrap items-center justify-between">
		<h4 class="text-xl font-bold">{nombre}</h4>
		<div class="mx-4 rounded-md bg-primary/50 px-4 py-2"><b>Estado:</b> {estado}</div>
	</div>
	<div>{descripcion}</div>
	{#if categorias?.length}
		<div class="flex gap-2">
			{#each categorias as categoria}
				<div class="rounded-md bg-secondary/50 px-4 py-2">{categoria.nombre}</div>
			{/each}
		</div>
	{/if}
	<div class="flex flex-wrap justify-between">
		{#if comunidades?.length}
			<div>
				<b>Comunidades involucradas:</b>
				{comunidades.map((c) => c.nombre).join(', ')}
			</div>
		{/if}

		{#if fechaEntrega}
			<div class="flex flex-wrap gap-1">
				<b>Fecha:</b>{new Date(fechaEntrega ?? '').toLocaleDateString('es-MX')}
			</div>
		{/if}
	</div>
</div>
