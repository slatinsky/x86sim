<script>
    import SettingsGlobal from "./tabs/SettingsGlobal.svelte";
    import SettingsProject from "./tabs/SettingsProject.svelte";
    import SettingsResetSimulator from "./tabs/SettingsResetSimulator.svelte";
    import Tabs from "../../components/Tabs.svelte";
    import {_} from 'svelte-i18n'

    // List of tab items with labels, values and assigned components
    $: tabs = [
        { label: $_('views.settings.tabNames.globalSettings'),
            id: 1,
            component: SettingsGlobal
        },
        { label: $_('views.settings.tabNames.projectSettings'),
            id: 2,
            component: SettingsProject
        },
        { label: $_('views.settings.tabNames.resetSimulatorData'),
            id: 3,
            component: SettingsResetSimulator
        }
    ];
</script>

<Tabs bind:tabs title={$_('views.navigation.settings')}/>
