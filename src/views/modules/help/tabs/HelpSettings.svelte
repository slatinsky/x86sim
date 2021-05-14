<script>
    import {MAX_EXECUTED_INSTRUCTION_COUNT} from "../../../../stores/config";
</script>

<p>V nastaveniach je možné nakonfigurovať rôzne nastavenia projektu aj simulátora</p>

<p>K nastaveniam sa dostanete cez navigačnú lištu - kliknutím na tlačidlo "Nastavenia"</p>
<img src="assets/help/settings/placement.png" alt="" class="img-fluid d-block mx-auto">

<p>Nastavenia sú rozdelené do troch skupín:</p>
<ul>
    <li>Globálne nastavenia</li>
    <li>Nastavenia špecifické pre konkrétny projekt</li>
    <li>Možnosť zresetovania simulátora</li>
</ul>

<hr>
<b>Globálne nastavenia:</b><br>
<p>Globálne nastavenia sa aplikujú v celom simulátore. Nezáleží na tom, aký projekt máte aktuálne spustený</p>
<p>Simulátor podporuje tmavú tému</p>
<img src="assets/help/settings/light_dark_theme.png" alt="" class="img-fluid d-block mx-auto mb-5">

<p>Taktiež je možné nastaviť, ako rýchlo funkcia "Spustiť" spúšťa inštrukcie (animácia). Ak vypnete túto animáciu, inštrukcie sa vykonajú instantne</p>

<div class="alert alert-success" role="alert">
    <b>TIP:</b> NOP inštrukcia ignoruje vypnutie animácie. Užitočné, ak chcete v nejakom mieste kódu počkať, napríklad po vykreslení na obrazovku alebo v cykle na načítanie klávesy z klávesnice.
</div>
<img src="assets/help/settings/animations.png" alt="" class="img-fluid d-block mx-auto mb-5">
<div class="alert alert-info mt-5" role="alert">
    <b>INFO: </b>Simulátor obsahuje ochranu voči nekonečnému cyklu. Ak napíšete a spustíte kód s nekonečným cyklom s vypnutou animáciou, simulátor vám ho automaticky pozastaví, ak vykonáte viac ako {MAX_EXECUTED_INSTRUCTION_COUNT} inštrukcií. Stačí počkať, simulátor "odmrzne" :)
</div>

<hr>
<b>Projektové nastavenia:</b><br>
<p>Projektové nastavenia sa aplikujú len na práve otvorený projekt</p>

<p>Ak v simulátore nepoužívate niektorý modul, ako napríklad obrazovku a klávesnicu, viete si ich jednoducho vypnúť</p>
<img src="assets/help/settings/project_settings.png" alt="" class="img-fluid d-block mx-auto mb-5">
<img src="assets/help/tutorial/hidden_modules_in_tutorial.png" alt="" class="img-fluid d-block mx-auto">

<hr>
<b>Reset simulátora:</b><br>
<p>Ak potrebujete zresetovať obsah lokálneho úložiska simulátora, je to možné cez toto nastavenie. Simulátor sa opäť načíta v predvolených nastaveniach, obsahujúci tutoriálové projekty</p>
<div class="alert alert-danger" role="alert">
    <b>POZOR: </b>Týmto spôsobom budú vymazané všetky PROJEKTY a nastavenia simulátora! Pred zresetovaním simulátora odporúčam si svoje projekty stiahnuť do počítača.
</div>

<p>Ak potrebujete zmazať len všetky projekty (bez vymazania nastavení a obnovenia tutoriálových projektov), v nastaveniach "Reset simulátora" je aj takáto možnosť</p>
