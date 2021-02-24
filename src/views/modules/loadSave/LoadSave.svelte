<script>
    import OpenProject from "./tabs/OpenProject.svelte";
    import Tabs from "../../components/Tabs.svelte";

    // List of tab items with labels, values and assigned components
    let tabs = [
        { label: "Otvoriť projekt",
            id: 1,
            component: OpenProject
        }
    ];
</script>

<Tabs {tabs} title="Projekty"/>





