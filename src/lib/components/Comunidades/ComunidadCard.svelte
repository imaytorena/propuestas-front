<script lang="ts">
	import type { Comunidad } from '$lib/types';

	const { comunidad }: { comunidad: Comunidad } = $props();
</script>

<div class="overflow-hidden rounded-lg bg-base-100 shadow-md transition-shadow hover:shadow-lg">
	<div class="h-48 overflow-hidden">
		<img src={comunidad.imagen} alt={comunidad.nombre} class="h-full w-full object-cover" />
	</div>
	<div class="p-6">
		<div class="mb-2 flex items-start justify-between">
			<h2 class="text-xl font-semibold">
				<a href="/comunidades/{comunidad.id}" class="text-gray-900 hover:text-primary">
					{comunidad.nombre}
				</a>
			</h2>
		</div>
		<p class="mb-4 line-clamp-2 text-gray-600">
			{comunidad.descripcion}
		</p>
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center text-sm text-gray-500">
					<svg class="mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
						/>
					</svg>
					{comunidad.miembros} miembros
				</div>
				<div class="text-sm text-gray-500">
					Min. {comunidad.minColaboradores} colaboradores
				</div>
			</div>
			<div class="flex items-center gap-1 text-sm text-gray-500">
				<span>Representantes:</span>
				<div class="flex items-center">
					{#each comunidad.representantes as representante, i}
						{#if i < 2}
							<span class="text-gray-900">{representante.nombre}</span>
							{#if i < comunidad.representantes.length - 1 && i < 1}
								<span class="mx-1">,</span>
							{/if}
						{:else if i === 2}
							<span class="ml-1 text-gray-500">y {comunidad.representantes.length - 2} más</span>
						{/if}
					{/each}
					<span class="ml-1 text-gray-400">
						({comunidad.representantes.length}/{comunidad.maxRepresentantes})
					</span>
				</div>
			</div>
		</div>
	</div>
</div>
