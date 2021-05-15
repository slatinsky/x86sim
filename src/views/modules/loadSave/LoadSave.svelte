<script>
    import OpenProject from "./tabs/OpenProject.svelte";
    import Tabs from "../../components/Tabs.svelte";
    import {_} from 'svelte-i18n'

    // List of tab items with labels, values and assigned components
    $: tabs = [
        { label: $_('views.projects.tabNames.openProject'),
            id: 1,
            component: OpenProject
        }
    ];
</script>

<Tabs {tabs} title={$_('views.navigation.projects')}/>





