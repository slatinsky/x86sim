<script>
    import {_} from "svelte-i18n";
</script>
<p>Program je spúštaný cez navigačnú lištu v ľavom hornom rohu</p>
<img src="assets/help/tutorial_left_navigation.png" alt="" class="img-fluid d-block mx-auto">

<table class="table mt-5">
    <thead>
    <tr>
        <th scope="col">Názov tlačidla</th>
        <th scope="col">Popis</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th>{$_('views.navigation.step')}</th>
        <td>{$_('tooltips.navigation.step')}</td>
    </tr>
    <tr>
        <th>{$_('views.navigation.stepBack')}</th>
        <td>{$_('tooltips.navigation.stepBack')}</td>
    </tr>
    <tr>
        <th>{$_('views.navigation.pause')}</th>
        <td>{$_('tooltips.navigation.pause')}</td>
    </tr>
    <tr>
        <th>{$_('views.navigation.run')}</th>
        <td>{$_('tooltips.navigation.run')}</td>
    </tr>
    <tr>
        <th>{$_('views.navigation.runBackwards')}</th>
        <td>{$_('tooltips.navigation.runBackwards')}</td>
    </tr>
    <tr>
        <th>{$_('views.navigation.reset')}</th>
        <td>{$_('tooltips.navigation.reset')}</td>
    </tr>
    </tbody>
</table>


<div class="alert alert-danger" role="alert">
    <b>Počas krokovania programu nie je automaticky ukladaný aktuálny projekt</b>: Pred vypnutím simulátora sa uistite, že ste vypli ladiaci režim (stlačením tlačidla "Zresetovať"), inak môžete stratiť svoje zmeny
    <img src="assets/help/running_program/reset.png" alt="" class="img-fluid d-block mx-auto">



    <p class="mt-3">Ak aj napriek tomu sa pokúsite vypnúť simulátor s neuloženými zmenami, simulátor vás na neuložené zmeny upozorní:</p>
    <img src="assets/help/running_program/unsaved_changes.png" alt="" class="img-fluid d-block mx-auto">
</div>
