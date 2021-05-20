<script>
    export let msg = ''
    export let type = ''
    export let position = 'bottom-center'
    $: _position = position.split('-').join(' ')
    export let Nth = 1
</script>

<style>
    .toastContainer {
        position: fixed;
        z-index: 999;
    }
    .top {
        top: 15px;
    }
    .bottom {
        bottom: 15px;
    }
    .left {
        left: 15px;
    }
    .right {
        right: 15px;
    }
    .center {
        left: 50%;
        transform: translateX(-50%);
    }
    .toastItem {
        min-height: 38px;
        padding: 15px 20px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24);
        color: #FFF;
        opacity: 0;
        transition: opacity 0.2s, transform 0.2s;
        max-width: 500px;
        width: 100%;
    }
    .info {
        background-color: #0091EA;
    }
    .success {
        background-color: #4CAF50;
    }
    .error {
        background-color: #F44336;
    }
    .default {
        background-color: #353535;
    }
    .anim {
        opacity: 1;
        transform: translateY(0);
    }
</style>

<div class="toastContainer {_position}">
    <div class="toastItem {type}" style="transform: translateY({- Nth * 60 + 70}px)">{msg}</div>
</div>
