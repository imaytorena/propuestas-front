<script>
    import Footer from "./Footer.svelte";
    import Navbar from "./Navbar.svelte";
    import LoadingBar from "./LoadingBar.svelte";

    let loading;
</script>

<div class="qci-layout-bg mx-auto flex min-h-screen max-w-6xl flex-col">
    <div class="flex flex-col w-full">
        {#if loading}
            <LoadingBar/>
        {/if}
        <Navbar/>
        <slot></slot>
        <Footer/>
    </div>
</div>

<style>
    body {
        background-color: #F7F6F0;
    }
</style>