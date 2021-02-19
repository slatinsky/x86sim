<script>
    import CurrentProject from "./tabs/CurrentProject.svelte";
    import OpenProject from "./tabs/OpenProject.svelte";
    import Tabs from "../../components/Tabs.svelte";

    // List of tab items with labels, values and assigned components
    let tabs = [
        { label: "Otvoriť projekt",
            id: 1,
            component: OpenProject
        },
        { label: "Aktuálny projekt",
            id: 2,
            component: CurrentProject
        }
    ];
</script>

<Tabs {tabs} title="Projekty"/>





