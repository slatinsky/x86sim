<script>
    import {language} from "../../../../stores/language";
</script>

{#if $language === 'sk'}
	<p>Vitajte v simulátore x86sim,</p>
{:else}
	<p>Welcome to x86sim simulator,</p>
{/if}



<img src="assets/help/beginning/snake.png" alt="" class="img-fluid">

<br>
<br>
{#if $language === 'sk'}
	<p>K tomuto pomocníkovi sa dostanete kedykoľvek stlačením tlačidla 'Pomocník' v hornej navigačnej lište</p>
{:else}
	<p>You can access this manual anytime by pressing 'Help' button in the top navigation bar</p>
{/if}

<img src="assets/help/beginning/manual_button.png" alt="" class="img-fluid d-block mx-auto">

<br>
<br>
{#if $language === 'sk'}
	<p>Medzi záložkami pomocníka prepínate v zozname naľavo</p>
{:else}
	<p>You can switch between tabs in the left menu</p>
{/if}

<img src="assets/help/beginning/manual_left_menu.png" alt="" class="img-fluid d-block mx-auto">


