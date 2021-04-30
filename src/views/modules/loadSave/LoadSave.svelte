<script>
    import OpenProject from "./tabs/OpenProject.svelte";
    import ProjectSettings from "./tabs/ProjectSettings.svelte";
    import Tabs from "../../components/Tabs.svelte";
    import { _} from 'svelte-i18n'

    // List of tab items with labels, values and assigned components
    let tabs = [
        { label: "Otvoriť projekt",
            id: 1,
            component: OpenProject
        },
        { label: "Nastavenia aktuálneho projektu",
            id: 2,
            component: ProjectSettings
        }
    ];
</script>

<Tabs {tabs} title={$_('views.navigation.projects')}/>





