<script>
    import HelpAboutSim from "./tabs/HelpAboutSim.svelte";
    import HelpTutorial from "./tabs/HelpTutorial.svelte";
    import HelpRunningProgram from "./tabs/HelpRunningProgram.svelte";
    import HelpBeginning from "./tabs/HelpBeginning.svelte";
    import HelpRegisters from "./tabs/HelpRegisters.svelte";
    import HelpScreen from "./tabs/HelpScreen.svelte";
    import HelpAvailableOpcodes from "./tabs/HelpAvailableOpcodes.svelte";
    import HelpModules from "./tabs/HelpModules.svelte";
    import HelpCodeEditor from "./tabs/HelpCodeEditor.svelte";
    import HelpMemory from "./tabs/HelpMemory.svelte";
    import HelpProjects from "./tabs/HelpProjects.svelte";
    import HelpSettings from "./tabs/HelpSettings.svelte";
    import Tabs from "../../components/Tabs.svelte";
    import {_} from 'svelte-i18n'

    // List of tab items with labels, values and assigned components
    $: tabs = [
        { label: $_('views.help.tabNames.beginning'),
            id: 1,
            level: 0,
            component: HelpBeginning
        },
        { label: $_('views.help.tabNames.tutorial'),
            id: 1.2,
            level: 0,
            component: HelpTutorial
        },
        { label: $_('views.navigation.projects'),
            id: 1.6,
            level: 0,
            component: HelpProjects
        },
        { label: $_('views.help.tabNames.runningProgram'),
            id: 1.7,
            level: 0,
            component: HelpRunningProgram
        },
        { label: $_('views.help.tabNames.modules'),
            id: 1.9,
            level: 0,
            component: HelpModules
        },
        { label: $_('views.modules.codeEditor'),
            id: 2,
            level: 1,
            component: HelpCodeEditor
        },
        { label: $_('views.help.tabNames.availableOpcodes'),
            id: 2.5,
            level: 2,
            component: HelpAvailableOpcodes
        },
        { label: $_('views.modules.registers'),
            id: 3,
            level: 1,
            component: HelpRegisters
        },
        { label: $_('views.modules.memory'),
            id: 4,
            level: 1,
            component: HelpMemory
        },
        { label: $_('views.modules.screen'),
            id: 5,
            level: 1,
            component: HelpScreen
        },
        { label: $_('views.navigation.settings'),
            id: 7,
            level: 0,
            component: HelpSettings
        },
        { label: $_('views.help.tabNames.aboutSim'),
            id: 10,
            level: 0,
            component: HelpAboutSim
        }
    ];
</script>

<Tabs bind:tabs title={$_('views.navigation.help')}/>
