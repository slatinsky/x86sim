<script>
    import HelpAboutSim from "./tabs/HelpAboutSim.svelte";
    import HelpBeginning from "./tabs/HelpBeginning.svelte";
    import HelpRegisters from "./tabs/HelpRegisters.svelte";
    import HelpScreen from "./tabs/HelpScreen.svelte";
    import HelpCodeEditor from "./tabs/HelpCodeEditor.svelte";
    import Tabs from "../../components/Tabs.svelte";

    // List of tab items with labels, values and assigned components
    let items = [
        { label: "Úvod",
            value: 1,
            component: HelpBeginning
        },
        { label: "Registre",
            value: 2,
            component: HelpRegisters
        },
        { label: "Obrazovka",
            value: 3,
            component: HelpScreen
        },
        { label: "Editor kódu",
            value: 4,
            component: HelpCodeEditor
        },
        { label: "O simulátore",
            value: 5,
            component: HelpAboutSim
        },
    ];
</script>

<!--<h3>Pomocník</h3>-->
<Tabs {items} title="Pomocník"/>
