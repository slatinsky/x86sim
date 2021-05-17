<script>
    import {range} from "lodash-es"
    import {intToFormattedString} from "../../../../formatConverter";
</script>

<style>
    /* colors from http://www.osdever.net/bkerndev/Docs/printing.htm */
    .color-0 {
        color: black;
    }
    .color-1 {
        color: blue;
    }
    .color-2 {
        color: #00FF00;
    }
    .color-3 {
        color: #00FFFF;
    }
    .color-4 {
        color: red;
    }
    .color-5 {
        color: #CC0099;
    }
    .color-6 {
        color: #663300;
    }
    .color-7 {
        color: #CCCCCC;
    }
    .color-8 {
        color: #444444;
    }
    .color-9 {
        color: #3399FF;
    }
    .color-10 {
        color: #99FF66;
    }
    .color-11 {
        color: #CCFFFF;
    }
    .color-12 {
        color: #FF6600;
    }
    .color-13 {
        color: #FF66FF;
    }
    .color-14 {
        color: #CC6600;
    }
    .color-15 {
        color: white;
    }

    .b-color-0 {
        background-color: black;
    }
    .b-color-1 {
        background-color: blue;
    }
    .b-color-2 {
        background-color: #00FF00;
    }
    .b-color-3 {
        background-color: #00FFFF;
    }
    .b-color-4 {
        background-color: red;
    }
    .b-color-5 {
        background-color: #CC0099;
    }
    .b-color-6 {
        background-color: #663300;
    }
    .b-color-7 {
        background-color: #CCCCCC;
    }
    .b-color-8 {
        background-color: #444444;
    }
    .b-color-9 {
        background-color: #3399FF;
    }
    .b-color-10 {
        background-color: #99FF66;
    }
    .b-color-11 {
        background-color: #CCFFFF;
    }
    .b-color-12 {
        background-color: #FF6600;
    }
    .b-color-13 {
        background-color: #FF66FF;
    }
    .b-color-14 {
        background-color: #CC6600;
    }
    .b-color-15 {
        background-color: white;
    }

    #help-colorTable {
        display: flex;
        flex-wrap: wrap;
        font-family: monospace;
        text-align: left;
    }

    #help-colorTable > div {
        padding: .5rem .3rem;
    }
</style>

<img src="assets/help/screen/screen.png" alt="" class="img-fluid d-block mx-auto mt-3">

<p>Obrazovka je výstupné zariadenie veľké 80 znakov na šírku a 25 riadkov na výšku</p>

<h4 class="mt-5">Menší problém so zápisom na adresu 0xb8000</h4>
<p>Obrazovka je priamo namapovaná na hlavnú pamäť od adresy 0xb8000 vyššie. Stačí do tejto časti pamäte zapísať a výsledok sa zobrazí na obrazovke.</p>
<p>Je tu ale nutné poznamenať na vec, že do 16-bitového registra sa vmestí maximálna hodnota 0xffff, ale my potrebujeme zapisovať od adresy 0xb8000 vyššie - Aby sme mohli zapísať na obrazovku, musíme si pomôcť so segmentovými registrami.</p>

<h4 class="mt-5">Zápis jedného znaku na obrazovku</h4>
<p>Nastavme e(xtra) s(segment) register na adresu 0xb800:</p>
<pre>
mov ax, 0xb800
mov es, ax
</pre>

<p>Teraz pomocou ES segmentového registra vieme zapisovať na obrazovku. Poďme zapísať jeden znak:</p>
<pre>
mov bx, 0
mov es:[bx], 0x5a    ; green text and purple background color
mov es:[bx+1], 0x55  ; 'U'
</pre>

<p>Na obrazovke sa zapísaný znak zobrazil takto:</p>
<img src="assets/help/screen/screen_result.png" alt="" class="img-fluid" style="max-width: 200px">

<p>Vysvetlenie zápisu:</p>
<img src="assets/help/screen/screen_write.png" alt="" class="img-fluid" style="max-width: 200px">
<div>Prvý bajt - 0x5 je farba fialového pozadia, <span class="b-color-5 color-10">0xa</span> je farba zeleného textu</div>
<div>Druhý bajt - 0x55 je ascii hodnota znaku 'U'</div>

<p>Reálna_adresa = segmentový register * 0x10 + offset</p>
<p>0xb8000 = 0xb800 * 0x10 + 0</p>
<p>0xb8001 = 0xb800 * 0x10 + 1</p>

<h4 class="mt-5">Tabuľka farieb</h4>
<p>V predchádzajúcej ukážke som použil farbu 0x5a, ale podľa nasledovnej tabuľky si viete zvoliť vlastnú farbu:</p>
<div id="help-colorTable">
    {#each range(0, 16) as background}
        {#each range(0, 16) as text}
            <div class="b-color-{background} color-{text}">0x{intToFormattedString(background, 'hex', 8) + intToFormattedString(text, 'hex', 8)}</div>
        {/each}
    {/each}
</div>

<p></p>

<div class="alert alert-info mt-5" role="alert">
    <b>Bonus:</b><br>
    Tieto rovnaké farby si viete nastaviť aj v príkazovom riadku vo Windowse :) . Zadaním "color 5a" napríklad získate podobnú <span class="b-color-5 color-10">zelenú farbu textu s fialovým pozadím</span><br>
    <img src="assets/help/screen/windows_color.png" alt="" class="img-fluid d-block mx-auto mt-3">
</div>
