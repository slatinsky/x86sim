<script>
    import {language} from "../../../../stores/language";


</script>
{#if $language !== 'sk'}
    <div class="alert alert-danger" role="alert">
        I am sorry, help isn't fully localized to English yet :(
    </div>
{/if}

<p>Vitajte v simulátore x86sim,</p>

<img src="assets/help/snake.png" alt="" class="img-fluid">
<!--<p class="text-center fw-light">Ukážka všetkých funkcionalít simulátora v projekte "game - snake"</p>-->


<br>
<br>
<p>K tomuto pomocníkovi sa dostanete kedykoľvek stlačením tlačidla 'Pomocník' v hornej navičnej lište</p>
<img src="assets/help/manual_button.png" alt="" class="img-fluid d-block mx-auto">

<br>
<br>
<p>Medzi záložkami pomocníka prepínate v zozname naľavo</p>
<img src="assets/help/manual_left_menu.png" alt="" class="img-fluid d-block mx-auto">


