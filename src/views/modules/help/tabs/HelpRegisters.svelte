<script>
    import {_} from "svelte-i18n";
    import {registers} from "../../../../config";
</script>

<img src="assets/help/registers/registers.png" alt="">
<h4 class="mt-5">Programové počítadlo</h4>
<p>ukazuje vždy na ďalšiu inštrukciu, ktorá sa v ďalšom takte procesora (kroku) vykoná</p>
<table class="table">
    <thead>
    <tr>
        <th scope="col">Názov</th>
        <th scope="col">Popis</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th scope="row">ip</th>
        <td>{$_('tooltips.registers.ip')}</td>
    </tr>
    </tbody>
</table>


<h4 class="mt-5">Všeobecné registre</h4>
<p>Je možné ich využiť na vlastný účel, ale v niektorých činnostiach je možné použiť iba niektoré z nich</p>
<p>Iba všeobecné registre majú špeciálnu vlastnosť - je možné pristupovať k ich dolným alebo horným 8-bitom osobitne. Ukážka je len pre register AX, ale podobne to funguje aj pre registre BX, CX a DX</p>

<table class="table table-bordered ">
    <tbody>
    <tr>
        <th scope="row" colspan="2" class="text-center">AX</th>
    </tr>
    <tr>
        <th scope="row" class="text-center">AL</th>
        <th scope="row" class="text-center">AH</th>
    </tr>
    </tbody>
</table>

<table class="table">
    <thead>
    <tr>
        <th scope="col">Názov</th>
        <th scope="col">Popis</th>
        <th scope="col">Poznámka</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th scope="row">ax</th>
        <td>{$_('tooltips.registers.ax')}</td>
        <td>Akumulátor pre niektoré inštrukcie, napríklad MUL</td>
    </tr>
    <tr>
        <th scope="row">bx</th>
        <td>{$_('tooltips.registers.bx')}</td>
        <td>Je ho možné použiť na výpočet "offsetu" v operande na prístup do pamäte. Napríklad "MOV AX, [BX+2]". Okrem BX registra je možné ako offset použiť registre IP, DI, SI, SP, BP </td>
    </tr>
    <tr>
        <th scope="row">cx</th>
        <td>{$_('tooltips.registers.cx')}</td>
        <td>Často používané ako počítadlo. (Ako premenná "i" v iných programovacích jazykoch)</td>
    </tr>
    <tr>
        <th scope="row">dx</th>
        <td>{$_('tooltips.registers.dx')}</td>
        <td></td>
    </tr>
    </tbody>
</table>



<h4 class="mt-5">Segmentové registre</h4>
<p>Pomocou segmentových registrov je možné pristupovať až k 1 MB pamäte. Bez nich by sme mohli adresovať iba 64 KB pamäte (pretože maximálna hodnota 16-bitového registra je 0xFFFF)</p>

<p>Výpočet reálnej adresy:</p>
<pre>Reálna adresa = Segmentová adresa ∗ 2<sup>4</sup> + offset</pre>

<table class="table">
    <thead>
    <tr>
        <th scope="col">Názov</th>
        <th scope="col">Popis</th>
        <th scope="col">Implicitné offset registre</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th scope="row">cs</th>
        <td>{$_('tooltips.registers.cs')}</td>
        <td>IP</td>
    </tr>
    <tr>
        <th scope="row">ds</th>
        <td>{$_('tooltips.registers.ds')}</td>
        <td>BX, DI, SI</td>
    </tr>
    <tr>
        <th scope="row">ss</th>
        <td>{$_('tooltips.registers.ss')}</td>
        <td>SP, BP</td>
    </tr>
    <tr>
        <th scope="row">es</th>
        <td>{$_('tooltips.registers.es')}</td>
        <td>-</td>
    </tr>
    </tbody>
</table>




<h4 class="mt-5">Príznakový register (flag)</h4>
<p>Po vykonaní aritmetických alebo logických operácií sú automaticky nastavené príznaky vo flag registri</p>

<div class="alert alert-info mt-3" role="alert">
    <b>INFO:</b>
    Simulátor ukazuje tieto príznaky samostatne (PF, ZF, ...), ale v skutočnosti sa jedná o jeden 16-bitový (FLAG) register - príznaky sú jednobitové časti tohto registra
</div>

<table class="table">
    <thead>
    <tr>
        <th scope="col">Názov</th>
        <th scope="col">Popis</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th scope="row">pf</th>
        <td>{$_('tooltips.registers.pf')}</td>
    </tr>
    <tr>
        <th scope="row">zf</th>
        <td>{$_('tooltips.registers.zf')}</td>
    </tr>
    <tr>
        <th scope="row">sf</th>
        <td>{$_('tooltips.registers.sf')}</td>
    </tr>
    <tr>
        <th scope="row">of</th>
        <td>{$_('tooltips.registers.of')}</td>
    </tr>
    </tbody>
</table>



<h4 class="mt-5">Registre pre prácu so zásobníkom</h4>

<table class="table">
    <thead>
    <tr>
        <th scope="col">Názov</th>
        <th scope="col">Popis</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th scope="row">sp</th>
        <td>{$_('tooltips.registers.sp')}</td>
    </tr>
    <tr>
        <th scope="row">bp</th>
        <td>{$_('tooltips.registers.bp')}</td>
    </tr>
    </tbody>
</table>



<h4 class="mt-5">Reťazcové registre</h4>
<p>Tieto registre sú pripravené pre budúce rozšírenie simulátora o inštrukcie pracujúce s reťazcami</p>

<table class="table">
    <thead>
    <tr>
        <th scope="col">Názov</th>
        <th scope="col">Popis</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th scope="row">si</th>
        <td>{$_('tooltips.registers.si')}</td>
    </tr>
    <tr>
        <th scope="row">di</th>
        <td>{$_('tooltips.registers.di')}</td>
    </tr>
    </tbody>
</table>
