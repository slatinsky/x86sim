<style>
    div {
        color: var(--text-color);
    }

    strong {
        color: red;
    }
</style>

<div>Use button below to reset simulator data.</div>
<div>
    <strong>This will delete all your PROJECTS and settings!</strong>
</div>

<button class="my-3 btn btn-outline-danger" on:click={() => {
        localStorage.clear()
        location.reload()
    }}>zresetovať celý obsah simulátora</button>
