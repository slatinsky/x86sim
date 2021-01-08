<script>
    // https://stackoverflow.com/a/60863634/14409632
    import snarkdown from 'snarkdown'

    import tpl from "../../../../../README.md";
</script>

<div>
    <h3>Nápoveda:</h3>
    {@html snarkdown(tpl)}
</div>

