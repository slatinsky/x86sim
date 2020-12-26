<script>
    import { fade } from 'svelte/transition';
    //TODO: this module is unfinished
    export let shown = false

</script>

<style>
    .smodal {
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(51, 51, 51, 0.7);
    }


    .smodal.hidden {
        display: none;
    }

    .smodalContent {
        z-index: 101;
        background-color: var(--body-background);
        width: 90%;
        max-width: 1000px;
        /*padding: 2rem;*/
    }

</style>
<div class="smodal {shown ? '' : 'hidden'}" on:click={() => shown = false} transition:fade>
    <div class="smodalContent" on:click|stopPropagation transition:fade>
        <slot>
            <div>[Insert modal content inside modal component]</div>
        </slot>
    </div>
</div>
