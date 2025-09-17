<script lang="ts">
  import { onMount } from 'svelte'
  import { initRouter } from './router'
  import RouteView from './lib/RouteView.svelte'
  import { goto } from './utils/nav'
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'

  onMount(() => {
    initRouter()
  })
</script>

<main>
  <header>
    <div>
      <a href="https://vite.dev" target="_blank" rel="noreferrer">
        <img src={viteLogo} class="logo" alt="Vite Logo" />
      </a>
      <a href="https://svelte.dev" target="_blank" rel="noreferrer">
        <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
      </a>
    </div>
    <nav>
      <a href="/ideas" onclick={goto}>Ideas</a>
      <a href="/ideas/1" onclick={goto}>Detalle ejemplo</a>
      <a href="/ideas/1/editar" onclick={goto}>Editar ejemplo</a>
    </nav>
  </header>

  <section class="card">
    <RouteView />
  </section>
</main>

<style>
  header nav {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1rem;
  }
  .logo {
    height: 3.5em;
    padding: 0.5em 1em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
