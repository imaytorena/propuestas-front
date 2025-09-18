<script lang="ts">
	import type { Actividad } from '$lib/types';
	let { id, nombre, descripcion, estado, fechaEntrega, categorias, comunidades }: Actividad =
		$props();
</script>

<div class="container max-w-[29rem] px-4 py-8">
	<div class="rounded-lg bg-base-100 p-8 shadow-lg">
		<div class="prose mb-8 max-w-none">
			<p class="text-gray-600">{descripcion}</p>
		</div>
		<div class="mb-8 flex flex-col gap-6">
			<div class="flex flex-col gap-4 rounded-lg bg-base-200 bg-opacity-50 p-4">
				<div class="flex flex-col items-start">
					<h3 class="mb-2 font-semibold text-gray-700">Participantes</h3>
					<div class="flex flex-col items-start">
						20 personas
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-base-200 bg-opacity-50 p-4">
				<h3 class="mb-2 font-semibold text-gray-700">Categorías</h3>
				<div class="flex items-start gap-3">
					{#each categorias as categoria}
						<div class="flex gap-1">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
								<g fill="none" stroke="currentColor" stroke-width="1.5">
									<path
										d="M4.728 16.137c-1.545-1.546-2.318-2.318-2.605-3.321c-.288-1.003-.042-2.068.45-4.197l.283-1.228c.413-1.792.62-2.688 1.233-3.302s1.51-.82 3.302-1.233l1.228-.284c2.13-.491 3.194-.737 4.197-.45c1.003.288 1.775 1.061 3.32 2.606l1.83 1.83C20.657 9.248 22 10.592 22 12.262c0 1.671-1.344 3.015-4.033 5.704c-2.69 2.69-4.034 4.034-5.705 4.034c-1.67 0-3.015-1.344-5.704-4.033z"
									/>
									<circle cx="8.607" cy="8.879" r="2" transform="rotate(-45 8.607 8.879)" />
									<path stroke-linecap="round" d="m11.542 18.5l6.979-6.98" />
								</g>
							</svg>
							<span class="text-gray-600">{categoria.nombre}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="border-t pt-6">
			<div class="flex items-center justify-between">
				<div class="flex items-center text-gray-500">
					<svg
						class="mr-2 h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<span>Fecha de entrega: {fechaEntrega}</span>
				</div>

				<div class="space-x-3">
					<button class="btn btn-primary rounded-md text-white transition-colors"> Unirme </button>
				</div>
			</div>
		</div>
	</div>
</div>
