<script>
    import {_} from "svelte-i18n";
</script>
<p>Máme program v editore kódu, ale samotnému programu nerozumieme. Ako to vyriešime? Odsledujeme vykonávanie programu po krokoch, na ktoré použijeme rôzne ovládacie prvky z navigačnej lišty</p>
<img src="assets/help/running_program/tutorial_left_navigation.png" alt="" class="img-fluid d-block mx-auto mb-5">

<b>Rýchly prehľad:</b><br>
<table class="table">
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
        <th>{$_('views.navigation.run')}</th>
        <td>{$_('tooltips.navigation.run')}</td>
    </tr>
    <tr>
        <th>{$_('views.navigation.runBackwards')}</th>
        <td>{$_('tooltips.navigation.runBackwards')}</td>
    </tr>
    <tr>
        <th>{$_('views.navigation.pause')}</th>
        <td>{$_('tooltips.navigation.pause')}</td>
    </tr>
    <tr>
        <th>{$_('views.navigation.reset')}</th>
        <td>{$_('tooltips.navigation.reset')}</td>
    </tr>
    </tbody>
</table>
<hr>
<p>Stlačením tlačidla "Krok" je vykonaná inštrukcia, na ktorú ukazuje IP register. Inštrukcia, ktorá sa vykoná ako ďalšia je vyznačená v editore kódu zelenou farbou</p>
<img src="assets/help/running_program/step.png" alt="" class="img-fluid d-block mx-auto">
<div class="alert alert-danger mt-5" role="alert">
    <b>Počas krokovania programu nie ukladané vaše zmeny v projekte</b>: Pred vypnutím simulátora sa uistite, že ste vypli krokovací režim (stlačením tlačidla "Zresetovať"), inak môžete stratiť svoje zmeny
    <img src="assets/help/running_program/reset.png" alt="" class="img-fluid d-block mx-auto">

    <p class="mt-3">Ak aj napriek tomu sa pokúsite vypnúť simulátor s neuloženými zmenami, simulátor vás na neuložené zmeny upozorní:</p>
    <img src="assets/help/running_program/unsaved_changes.png" alt="" class="img-fluid d-block mx-auto">
</div>

<hr>
<p>Stlačením tlačidla "Krok späť" sa vrátite v histórií o jednu vykonanú inštrukciu</p>
<img src="assets/help/running_program/stepBack.png" alt="" class="img-fluid d-block mx-auto">
<hr>
<p>Tlačidlo "Spustiť" automaticky spúšťa "Krok" až pokým stlačíte tlačidlo "Pozastaviť" (alebo do ukončenia programu)</p>
<img src="assets/help/running_program/run.png" alt="" class="img-fluid d-block mx-auto">

<div class="alert alert-success mt-5" role="alert">
    <b>Tip:</b>
    Ak potrebujete automaticky pozastaviť vykonávanie programu v konkrétnej časti, môžete si v editore kódu vytvoriť breakpoint. Breakpoint vytvoríte (aj zrušíte) kliknutím vľavo vedľa adresy v editore kódu.
    <br><br>
    <img src="assets/help/running_program/breakpoint.png" alt="" class="img-fluid d-block mx-auto">
</div>

<hr>
<p>Tlačidlo "Pretočiť naspäť" automaticky spúšťa "Krok naspäť" až pokým stlačíte tlačidlo "Pozastaviť" (alebo do začiatku programu)</p>
<img src="assets/help/running_program/runBack.png" alt="" class="img-fluid d-block mx-auto">

<hr>
<p>Tlačidlo "Zresetovať" vráti stav simulátora na stav pred spustením krokovania</p>
