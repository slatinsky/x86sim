<script>
    import SettingsGlobal from "./tabs/SettingsGlobal.svelte";
    import SettingsProject from "./tabs/SettingsProject.svelte";
    import SettingsResetSimulator from "./tabs/SettingsResetSimulator.svelte";
    import Tabs from "../../components/Tabs.svelte";
    import {_} from 'svelte-i18n'

    // List of tab items with labels, values and assigned components
    $: tabs = [
        { label: "Global settings",
            id: 1,
            component: SettingsGlobal
        },
        { label: "Current project settings",
            id: 2,
            component: SettingsProject
        },
        { label: "Reset simulator data",
            id: 3,
            component: SettingsResetSimulator
        }
    ];
</script>

<Tabs bind:tabs title={$_('views.navigation.settings')}/>
