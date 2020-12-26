<script>
    // modified https://svelte.dev/repl/cf05bd4a4ca14fb8ace8b6cdebbb58da?version=3.17.0
    export let items = [];
    export let title = "";
    export let activeTabValue = 1;

    const handleClick = tabValue => () => (activeTabValue = tabValue);
</script>

<style>
    .tabsWrapper {
        position: relative;
        display: flex;
        height: 80vh;
        overflow-y: auto;
    }

    .tabMenu {
        overflow-y: auto;
        position: fixed;
        width: 200px;
        height: 80vh;
        background-color: var(--primary-background);

        list-style: none;
        padding-left: 0;
        margin: 0;
    }
    .tabMenu li {
        color: var(--white-text-color);
    }

    .tabMenuMainTitle {
        font-weight: bold;
        padding: .5rem 1rem 1.5rem 1rem;
    }

    .tabMenu > li.tabMenuTitle {
        padding: .5rem 1rem;
        cursor: pointer;
    }


    .tabMenu > li.tabMenuTitle.active,
    .tabMenu > li.tabMenuTitle:hover {
        background-color: dodgerblue;
    }

    .tabContent {
        width: 100%;
        padding: 1rem 1rem 1rem calc(200px + 1rem);
        background-color: var(--body-background);
    }
</style>

<div class="tabsWrapper">
    <ul class="tabMenu">
        <li class="tabMenuMainTitle">{title}</li>
        {#each items as item}
            <li class="tabMenuTitle {activeTabValue === item.value ? 'active' : ''}" on:click={handleClick(item.value)}>
                {item.label}
            </li>
        {/each}
    </ul>
    <div class="tabContent">
        {#each items as item}
            {#if activeTabValue === item.value}
                <div class="box">
                    <h3>{item.label}</h3>
                    <svelte:component this={item.component}/>
                </div>
            {/if}
        {/each}
    </div>
</div>


