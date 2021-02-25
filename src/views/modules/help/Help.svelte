<script>
    import HelpAboutSim from "./tabs/HelpAboutSim.svelte";
    import HelpBeginning from "./tabs/HelpBeginning.svelte";
    import HelpRegisters from "./tabs/HelpRegisters.svelte";
    import HelpScreen from "./tabs/HelpScreen.svelte";
    import HelpCodeEditor from "./tabs/HelpCodeEditor.svelte";
    import HelpReadme from "./tabs/HelpReadme.svelte";
    import Tabs from "../../components/Tabs.svelte";
    import { _} from 'svelte-i18n'

    // List of tab items with labels, values and assigned components
    let tabs = [
        { label: "Úvod",
            id: 1,
            component: HelpBeginning
        },
        { label: "Registre",
            id: 2,
            component: HelpRegisters
        },
        { label: "Obrazovka",
            id: 3,
            component: HelpScreen
        },
        { label: "Editor kódu",
            id: 4,
            component: HelpCodeEditor
        },
        { label: "O simulátore",
            id: 5,
            component: HelpAboutSim
        },
        { label: "Readme",
            id: 6,
            component: HelpReadme
        },
    ];
</script>

<Tabs {tabs} title={$_('views.navigation.help')}/>
