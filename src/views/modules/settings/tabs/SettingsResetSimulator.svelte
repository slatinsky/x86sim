<script>
    import {programs} from "../../../../stores/stores"
</script>

<style>
    div {
        color: var(--text-color);
    }

    strong {
        color: red;
    }
</style>

<div>Use button below to reset simulator data. Simulator will reload again in tutorial mode</div>
<div>
    <strong>This will delete all your PROJECTS and settings!</strong>
</div>

<button class="my-3 btn btn-outline-danger" on:click={() => {
        localStorage.clear()
        location.reload()
    }}>kompletne zresetovať celý obsah simulátora</button>



<div class="mt-5">Use button below delete currently saved projects inside simulator without clearing settings. Tutorial projects won't be restored. Useful if you want to load .zip file containing all your projects</div>
<div>
    <strong>This will delete all your PROJECTS!</strong>
</div>
<button class="my-3 btn btn-outline-danger" on:click={() => {
    programs.deleteAllProjects()
    location.reload()
}}>vymazať všetky projekty</button> <!-- location.reload() may not be needed, but simulator sometimes freezes without it -->
