<script>
    // modified https://svelte.dev/repl/cf05bd4a4ca14fb8ace8b6cdebbb58da?version=3.17.0
    export let tabs = [];
    export let title = "";
    export let activeTabId = 1;

    const handleClick = tabId => () => (activeTabId = tabId);
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
        background-color: var(--active-primary-background);
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
        {#each tabs as tab}
            <li class="tabMenuTitle {activeTabId === tab.id ? 'active' : ''}" on:click={handleClick(tab.id)}>
                {tab.label}
            </li>
        {/each}
    </ul>
    <div class="tabContent">
        {#each tabs as tab}
            {#if activeTabId === tab.id}
                <div class="box">
                    <h3>{tab.label}</h3>
                    <svelte:component this={tab.component}/>
                </div>
            {/if}
        {/each}
    </div>
</div>


