<script lang="ts">
    import logo from '../../assets/images/logo.png';
    import Routes from "./Routes.svelte";
</script>

<nav class="navbar w-full z-[1001] gap-4 container text-black p-4 md:pb-4 w-full flex flex-col lg:flex-row justify-center lg:flex-grow m-auto items-center lg:justify-between">
    <div class="flex items-center gap-2">
        <img src={logo} alt="Logo" class="md:w-20 w-12"/>
        <span class="font-['Delius'] text-[1.7rem]">ColectividApp</span>
    </div>
    <div>
        <input type="checkbox" value="dark" class="toggle theme-controller" />
    </div>
    <div class="flex-none max-w-[70vw] md:max-w-full  md:overflow-x-hidden overflow-hidden overflow-x-scroll snap-x snap-mandatory">
        <ul class="flex gap-6 text-lg md:text-3xl">
            <Routes/>
        </ul>
    </div>
</nav>