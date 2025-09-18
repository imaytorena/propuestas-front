<script lang="ts">
    import logo from '../../../assets/images/logo.png';
    import Routes from "./Routes.svelte";
</script>

<nav class="navbar w-full z-[1001] gap-4 container text-black p-4 md:pb-4 w-full flex flex-col lg:flex-row justify-center lg:flex-grow m-auto items-center lg:justify-between">
    <div class="flex items-center gap-2">
        <img src={logo} alt="Logo" class="md:w-20 w-12"/>
        <span class="text-[1.7rem]">ColectividApp</span>
    </div>
    <div class="fixed bottom-8 right-8 flex flex-col items-center gap-1">
        <label class="toggle  toggle-lg text-primary">
            <input value="dim" class="theme-controller" type="checkbox"/>
            <svg aria-label="enabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m3 3l18 18m-5-9a4 4 0 0 0-4-4M9.166 9.177a4 4 0 0 0 5.66 5.654M3 12h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"/>
            </svg>

            <svg aria-label="disabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7.962 3.949A9 9 0 0 1 12 2.992V3h.393a7.5 7.5 0 0 0-2.07 3.308m-.141 3.84c.186.823.514 1.626.989 2.373a7.5 7.5 0 0 0 4.586 3.268m3.893-.11q.334-.1.663-.233a9 9 0 0 1-.274.597m-1.695 2.337A9 9 0 0 1 5.634 5.631M3 3l18 18"/>
            </svg>
        </label>
    </div>
    <div class="flex-none max-w-[70vw] md:max-w-full  md:overflow-x-hidden overflow-hidden overflow-x-scroll snap-x snap-mandatory">
        <ul class="flex gap-6 text-lg md:text-3xl">
            <Routes/>
        </ul>
    </div>
</nav>