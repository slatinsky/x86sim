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

<h4 class="mt-5">Globálne nastavenia</h4>
<p>Globálne nastavenia sa aplikujú v celom simulátore. Nezáleží na tom, aký projekt máte aktuálne spustený</p>
<h5 class="mt-3">Tmavá téma</h5>
<p>Simulátor podporuje tmavú tému</p>
<img src="assets/help/settings/checkbox_dark_theme.png" alt="" class="img-fluid d-block mx-auto mb-1">
<img src="assets/help/settings/light_dark_theme.png" alt="" class="img-fluid d-block mx-auto mb-5">

<h5 class="mt-3">Aktivovanie histórie vykonania inštrukcií</h5>
<p>Zapnutím tejto možnosti:</p>
<ul>
    <li>Simulátor nebude používať veľké množstvo pamäte RAM pre dlhšie bežiace programy</li>
    <li>Programy teoreticky budú môcť bežať nekonečne dlho</li>
    <li>V kombinácií s vypnutými animáciami bude vykonanie inštrukcií veľmi rýchle, až "instantné"</li>
</ul>
<p>Deaktivovaním histórie sa vypne nasledovná funkcionalita:</p>
<ul>
    <li>Nebudete môcť sa vrátiť vo vykonaní programu po krokoch späť (tlačidlá "Krok späť" a "Pretočiť naspäť"), ale bude možné simulátor vrátiť do stavu pred zapnutím krokovacieho režimu stlačením tlačidla "Reset"</li>
    <li>Simulátor nebude zobrazovať červenou farbou zmenené hodnoty v registroch a pamäti</li>
</ul>

<h5 class="mt-3">Sledovať IP register v editore kódu</h5>
<p>IP register vždy ukazuje na adresu inštrukcie, ktorá sa vykoná ako ďalšia. Zapnutím tejto možnosti pri krokovaní editor kódu automaticky posunie obrazovku tak, aby bola ďalšia vykonávaná inštrukcia vždy viditeľná</p>

<h5 class="mt-3">Rýchlosť / vypnutie animácie</h5>
<p>Taktiež je možné nastaviť, ako rýchlo funkcia "Spustiť" spúšťa inštrukcie (animácia). Ak vypnete túto animáciu, inštrukcie sa vykonajú instantne</p>

<div class="alert alert-success" role="alert">
    <b>TIP:</b> NOP inštrukcia ignoruje vypnutie animácie. Užitočné, ak chcete v nejakom mieste kódu počkať, napríklad po vykreslení na obrazovku alebo v cykle na načítanie klávesy z klávesnice.
</div>
<img src="assets/help/settings/animations.png" alt="" class="img-fluid d-block mx-auto mb-5">
<div class="alert alert-info mt-5" role="alert">
    <b>INFO: </b>Simulátor obsahuje ochranu voči nekonečnému cyklu. Ak napíšete a spustíte kód s nekonečným cyklom s vypnutou animáciou, simulátor vykonávanie kódu automaticky pozastaví, ak sa vykoná viac ako {MAX_EXECUTED_INSTRUCTION_COUNT} inštrukcií. Stačí počkať, simulátor "odmrzne" :)
</div>

<h4 class="mt-5">Projektové nastavenia</h4>
<p>Projektové nastavenia sa aplikujú len na práve otvorený projekt</p>

<p>Ak v simulátore nepoužívate niektorý modul, ako napríklad obrazovku a klávesnicu, viete si ich jednoducho vypnúť</p>
<img src="assets/help/settings/project_settings.png" alt="" class="img-fluid d-block mx-auto mb-5">
<img src="assets/help/tutorial/hidden_modules_in_tutorial.png" alt="" class="img-fluid d-block mx-auto">

<h4 class="mt-5">Reset simulátora</h4>
<h5 class="mt-3">Reset všetkých nastavení</h5>
<p>Ak potrebujete zresetovať obsah lokálneho úložiska simulátora, je to možné cez toto nastavenie. Simulátor sa opäť načíta v predvolených nastaveniach, obsahujúci tutoriálové projekty</p>
<div class="alert alert-danger" role="alert">
    <b>POZOR: </b>Týmto spôsobom budú vymazané všetky PROJEKTY a nastavenia simulátora! Pred zresetovaním simulátora odporúčam si svoje projekty stiahnuť do počítača.
</div>
<p>Reset simulátora vyzerá takto:</p>
<img src="assets/help/settings/reset_all.png" alt="" class="img-fluid d-block mx-auto mb-5">

<h5 class="mt-3">Zmazanie všetkých projektov</h5>
<p>Ak potrebujete zmazať len všetky projekty (bez vymazania nastavení a obnovenia tutoriálových projektov), v nastaveniach "Reset simulátora" je aj takáto možnosť</p>
<p>Reset projektov vyzerá takto:</p>
<img src="assets/help/settings/reset_projects.png" alt="" class="img-fluid d-block mx-auto mb-5">
