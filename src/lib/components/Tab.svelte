<script lang="ts">
    // import { goto } from "$app/navigation";
    import page from "page";

    let {group, label, value = $bindable(), id, children, isLink = false} = $props();
</script>

<div class="hidden md:block">
    <input
            type="radio"
            name={group}
            role="tab"
            class="tab text-lg rounded-box {value === id ? 'font-bold text-primary' : ''}"
            aria-label={label}
            bind:group={value}
            value={id}
            onclick={() => isLink && page.show(`/${id}`)}
    />
</div>

{#if value === id}
    <div role="tabpanel" class="flex-wrap tab-content flex rounded-box">
        {@render children()}
    </div>
{/if}

<style>
    /*@reference "tailwindcss";*/
    /*.tab:is(input[type="radio"]) {*/
    /*    @apply w-max border-2 border-b-0 border-base-200 mx-[1px];*/
    /*}*/
</style>
