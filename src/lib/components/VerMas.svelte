<script lang="ts">
	const { opcion }: { opcion: 'ideas' | 'actividades' } = $props();
</script>

<!-- "Ver más" card -->
<div class="h-full w-full">
	<a
		href={opcion === 'ideas' ? '/ideas' : 'actividades'}
		class="card h-full border-2 border-solid border-base-100 bg-base-100 shadow-xl transition-shadow hover:border-2 hover:border-primary"
	>
		<div class="card-body flex h-full flex-col items-center justify-center px-2 py-4 text-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-12 w-12 text-primary"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 7l5 5m0 0l-5 5m5-5H6"
				/>
			</svg>
			<h3 class="text-xl font-semibold text-primary">
				Ver más {opcion === 'ideas' ? 'Ideas' : 'Actividades'}
			</h3>
			<span class="text-md text-base-content/70">
				Explora todas las {opcion === 'ideas' ? 'ideas' : 'actividades'}
			</span>
		</div>
	</a>
</div>
