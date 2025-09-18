<script lang="ts">
	export let evaluaciones = {
		buena: 0,
		regular: 0,
		no_tan_buena: 0
	};
	export let userVote: 'buena' | 'regular' | 'no_tan_buena' | null = null;
	export let onVote: (rating: 'buena' | 'regular' | 'no_tan_buena') => void;

	$: total = evaluaciones.buena + evaluaciones.regular + evaluaciones.no_tan_buena;
	$: porcentajes = {
		buena: total > 0 ? (evaluaciones.buena / total) * 100 : 0,
		regular: total > 0 ? (evaluaciones.regular / total) * 100 : 0,
		no_tan_buena: total > 0 ? (evaluaciones.no_tan_buena / total) * 100 : 0
	};

	const getBarClass = (tipo: 'buena' | 'regular' | 'no_tan_buena', isSelected: boolean) => {
		const baseClasses = 'h-8 transition-all duration-200 flex items-center justify-center cursor-pointer hover:opacity-90';
		const colorClasses = {
			buena: 'bg-[#74946C] text-white ',
			regular: 'bg-[#FFD075] text-black',
			no_tan_buena: 'bg-[#D33C5B] text-white'
		};
		return `${baseClasses} ${colorClasses[tipo]} ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`;
	};
</script>

<div class="bg-base-200 bg-opacity-50  rounded-lg p-4 shadow-sm">
	<h3 class="text-lg font-semibold mb-3">¿Qué opinas de la plataforma?</h3>
	<div class="space-y-2">
		<div class="flex items-center gap-2">
			<div class="flex-grow flex gap-1 h-8">
				{#if total > 0}
					<div
						class={getBarClass('buena', userVote === 'buena')}
						style="width: {porcentajes.buena}%"
						on:click={() => onVote('buena')}
						on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onVote('buena');
              }
            }}
						role="button"
						tabindex="0"
					>
						{#if porcentajes.buena > 15}
							{evaluaciones.buena}
						{/if}
					</div>
					<div
						class={getBarClass('regular', userVote === 'regular')}
						style="width: {porcentajes.regular}%"
						on:click={() => onVote('regular')}
						on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onVote('regular');
              }
            }}
						role="button"
						tabindex="0"
					>
						{#if porcentajes.regular > 15}
							{evaluaciones.regular}
						{/if}
					</div>
					<div
						class={getBarClass('no_tan_buena', userVote === 'no_tan_buena')}
						style="width: {porcentajes.no_tan_buena}%"
						on:click={() => onVote('no_tan_buena')}
						on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onVote('no_tan_buena');
              }
            }}
						role="button"
						tabindex="0"
					>
						{#if porcentajes.no_tan_buena > 15}
							{evaluaciones.no_tan_buena}
						{/if}
					</div>
				{:else}
					<div class="w-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
						Sin evaluaciones
					</div>
				{/if}
			</div>
			<div class="text-sm text-gray-500 w-16 text-right">
				{total} votos
			</div>
		</div>

		<div class="hidden md:flex justify-between text-sm text-gray-600">
			<button
				class="flex items-center gap-1 hover:text-[#688561] transition-colors"
				class:text-[#688561]={userVote === 'buena'}
				on:click={() => onVote('buena')}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M6 7h11a2 2 0 0 1 2 2v.5a.5.5 0 0 0 .5.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5a.5.5 0 0 0-.5.5v.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2m1 3v4m3-4v4m3-4v4m3-4v4" />
				</svg>
				<div class="hidden md:block">Muy Buena</div>
			</button>
			<button
				class="flex items-center gap-1 hover:text-[#B79554] transition-colors"
				class:text-[#B79554]={userVote === 'regular'}
				on:click={() => onVote('regular')}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M6 7h11a2 2 0 0 1 2 2v.5a.5.5 0 0 0 .5.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5a.5.5 0 0 0-.5.5v.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2m1 3v4m3-4v4m3-4v4" />
				</svg>
				<div class="hidden md:block">Regular</div>
			</button>
			<button
				class="flex items-center gap-1 hover:text-[#D33C5B] transition-colors"
				class:text-[#D33C5B]={userVote === 'no_tan_buena'}
				on:click={() => onVote('no_tan_buena')}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M6 7h11a2 2 0 0 1 2 2v.5a.5.5 0 0 0 .5.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5a.5.5 0 0 0-.5.5v.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2m1 3v4" />
				</svg>
				<div class="hidden md:block">No tan buena</div>
			</button>
		</div>
	</div>
</div>
