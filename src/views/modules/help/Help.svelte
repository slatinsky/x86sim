<script>
    import HelpAboutSim from "./tabs/HelpAboutSim.svelte";
    import HelpBeginning from "./tabs/HelpBeginning.svelte";
    import HelpRegisters from "./tabs/HelpRegisters.svelte";
    import HelpScreen from "./tabs/HelpScreen.svelte";
    import HelpCodeEditor from "./tabs/HelpCodeEditor.svelte";
    import HelpMemory from "./tabs/HelpMemory.svelte";
    import Tabs from "../../components/Tabs.svelte";
    import { _} from 'svelte-i18n'

    // List of tab items with labels, values and assigned components
    $: tabs = [
        { label: "Úvod",
            id: 1,
            component: HelpBeginning
        },
        { label: $_('views.modules.codeEditor'),
            id: 2,
            component: HelpCodeEditor
        },
        { label: $_('views.modules.registers'),
            id: 3,
            component: HelpRegisters
        },
        { label: $_('views.modules.memory'),
            id: 4,
            component: HelpMemory
        },
        { label: $_('views.modules.screen'),
            id: 5,
            component: HelpScreen
        },
        { label: "O simulátore",
            id: 6,
            component: HelpAboutSim
        }
    ];
</script>

<Tabs bind:tabs title={$_('views.navigation.help')}/>
