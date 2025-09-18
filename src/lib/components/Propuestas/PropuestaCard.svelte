<script lang="ts">
	import { onMount } from 'svelte';
	import EvaluacionGrafico from '$lib/components/EvaluacionGrafico.svelte';

	let propuesta = {
		id: '1',
		nombre: 'Pero...¿como puedo contribuir?',
		descripcion: 'En realidad, de cualquier manera... este espacio para encontrar a ese grupo de personas para participar en proyectos con impacto ambiental.',
		estado: null,
		fechaEntrega: '2024-03-01',
		creador: {
			nombre: 'Ken Takakura',
			id: '1'
		},
		categoria: [{ nombre: 'Ingeniería', id: 1 }, { nombre: 'Medicina', id: 2 }, { nombre: 'Sustentabilidad', id: 3 }],
		evaluaciones: {
			buena: 15,
			regular: 2,
			no_tan_buena: 1
		}
	};
	let error = '';
	let userVote: 'buena' | 'regular' | 'no_tan_buena' | null = null;

	onMount(async () => {
		// try {
		//   const response = await get(`/api/propuestas/${$page.params.id}`);
		//   propuesta = response.propuesta;
		//   userVote = response.userVote;
		// } catch (e) {
		//   error = 'Error al cargar la propuesta';
		// }
	});

	async function handleVote(rating: 'buena' | 'regular' | 'no_tan_buena') {
		try {
			// Optimistic update
			const oldVote = userVote;
			const oldEvaluaciones = { ...propuesta.evaluaciones };

			// Remove old vote if exists
			if (userVote) {
				propuesta.evaluaciones[userVote]--;
			}

			// Add new vote
			if (userVote !== rating) {
				propuesta.evaluaciones[rating]++;
				userVote = rating;
			} else {
				userVote = null;
			}

			// Send to server
			// try {
			//   await post(`/api/propuestas/${propuesta.id}/votar`, { rating });
			// } catch (e) {
			//   // Revert changes on error
			//   propuesta.evaluaciones = oldEvaluaciones;
			//   userVote = oldVote;
			//   throw e;
			// }
		} catch (e) {
			error = 'Error al registrar el voto';
		}
	}

	function getEstadoClass(estado: string) {
		switch (estado) {
			case 'Iniciando':
				return 'bg-yellow-100 text-yellow-800';
			case 'en_progreso':
				return 'bg-blue-100 text-blue-800';
			case 'finalizado':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getEstadoText(estado: string) {
		switch (estado) {
			case 'Iniciando':
				return 'Pendiente';
			case 'en_progreso':
				return 'En Progreso';
			case 'finalizado':
				return 'Finalizado';
			default:
				return estado;
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-4xl mx-auto">
		{#if error}
			<p class="text-red-500 mb-4">{error}</p>
		{:else}
			<div class="bg-base-100 rounded-lg shadow-lg p-8">
				<div class="flex justify-between items-start mb-6">
					<h1 class="text-3xl font-bold text-gray-900">{propuesta.nombre}</h1>
					{#if propuesta.estado}
						<span class="px-3 py-1 rounded-full text-sm font-medium {getEstadoClass(propuesta.estado)}">
							{getEstadoText(propuesta.estado)}
						</span>
					{/if}
				</div>

				<div class="prose max-w-none mb-8">
					<p class="text-gray-600">{propuesta.descripcion}</p>
				</div>

				<div class="mb-8">
					<EvaluacionGrafico
						evaluaciones={propuesta.evaluaciones}
						userVote={userVote}
						onVote={handleVote}
					/>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					<div class="bg-base-200 bg-opacity-50 rounded-lg p-4 flex flex-col gap-4">

						<div class="flex flex-col items-start">
							<h3 class="font-semibold text-gray-700 mb-2">Creador</h3>
							<div class="flex items-center">
								<svg
									class="w-5 h-5 mr-2 text-gray-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								<a href="/usuarios/{propuesta.creador.id}" class="text-indigo-600 hover:text-indigo-500">
									{propuesta.creador.nombre}
								</a>
							</div>
						</div>

						<div class="flex flex-col items-start">
							<h3 class="font-semibold text-gray-700 mb-2">Miembros</h3>
							<div class="flex flex-col items-start">
								20 miembros
								<!--{#each propuesta.categoria as categoria}-->
							</div>
						</div>
					</div>

					<div class="bg-base-200 bg-opacity-50  rounded-lg p-4">
						<h3 class="font-semibold text-gray-700 mb-2">Categorías</h3>
						<div class="flex flex-col items-start gap-3">
							{#each propuesta.categoria as categoria}
								<div class="flex gap-1">
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
										<g fill="none" stroke="currentColor" stroke-width="1.5">
											<path
												d="M4.728 16.137c-1.545-1.546-2.318-2.318-2.605-3.321c-.288-1.003-.042-2.068.45-4.197l.283-1.228c.413-1.792.62-2.688 1.233-3.302s1.51-.82 3.302-1.233l1.228-.284c2.13-.491 3.194-.737 4.197-.45c1.003.288 1.775 1.061 3.32 2.606l1.83 1.83C20.657 9.248 22 10.592 22 12.262c0 1.671-1.344 3.015-4.033 5.704c-2.69 2.69-4.034 4.034-5.705 4.034c-1.67 0-3.015-1.344-5.704-4.033z" />
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
					<div class="flex flex-col md:flex-row items-center justify-center md:justify-between gap-2">
						<div class="flex items-center text-gray-500">
							<svg
								class="w-5 h-5 mr-2"
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
							<span><span class="hidden md:block">Fecha de entrega:</span><span class="inline md:hidden">Entrega: </span> {propuesta.fechaEntrega}</span>
						</div>

						<div class="space-x-3">
							<button
								class="btn btn-primary text-white rounded-md  transition-colors"
							>
								Enviar mi opinión
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>