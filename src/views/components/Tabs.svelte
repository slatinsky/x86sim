<script>
    // modified https://svelte.dev/repl/cf05bd4a4ca14fb8ace8b6cdebbb58da?version=3.17.0
    export let tabs = [];
    export let title = "";
    export let activeTabId = 1;

    const handleClick = tabId => () => (activeTabId = tabId);

    // export let onClose = null
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

    .box {
        position: relative;
    }

    .box .fa-times {
        position: absolute;
        top: 0;
        right: .5rem;
        font-size: 2rem;
        cursor: pointer;
    }
</style>

<div class="tabsWrapper">
    <ul class="tabMenu">
        <li class="tabMenuMainTitle">{title}</li>
        {#each tabs as tab}
            <li class="tabMenuTitle {activeTabId === tab.id ? 'active' : ''}" style="padding-left: {(tab?.level ?? 0) + 1}rem" on:click={handleClick(tab.id)}>
                {tab.label}
            </li>
        {/each}
    </ul>
    <div class="tabContent">
        {#each tabs as tab}
            {#if activeTabId === tab.id}
                <div class="box">
                    <h3>{tab.label}</h3>
                    <!--{#if onClose != null}-->
                    <!--    <i class="fas fa-times" on:click={()=>onClose()}></i>-->
                    <!--{/if}-->
                    <svelte:component this={tab.component}/>
                </div>
            {/if}
        {/each}
    </div>
</div>


