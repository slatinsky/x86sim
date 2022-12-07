<script>
    import {_} from "svelte-i18n";
    import {registers} from "../../../../config";
	import {language} from "../../../../stores/language";
</script>

{#if $language === 'sk'}
	<img src="assets/help/registers/registers.png" alt="">
	<h4 class="mt-5">Programové počítadlo</h4>
	<p>ukazuje vždy na ďalšiu inštrukciu, ktorá sa v ďalšom takte procesora (kroku) vykoná</p>
{:else}
	<img src="assets/help/registers/registers.png" alt="">
	<h4 class="mt-5">Program counter</h4>
	<p>it always points to the next instruction that will be executed in the next clock cycle</p>
{/if}
<table class="table">
	<thead>
	<tr>
		<th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
		<th scope="col">{$_('views.help.tabs.availableOpcodes.description')}</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<th scope="row">ip</th>
		<td>{$_('tooltips.registers.ip')}</td>
	</tr>
	</tbody>
</table>

{#if $language === 'sk'}
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
			<th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
			<th scope="col">{$_('views.help.tabs.availableOpcodes.description')}</th>
			<th scope="col">{$_('views.help.tabs.availableOpcodes.note')}</th>
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
{:else}
	<h4 class="mt-5">General purpose registers</h4>
	<p>They can be used for your own purposes, but in some operations you can only use some of them</p>
	<p>Only general purpose registers have a special feature - you can access their lower or upper 8 bits separately. The example is only for the AX register, but it works the same way for the BX, CX and DX registers</p>

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
			<th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
			<th scope="col">{$_('views.help.tabs.availableOpcodes.description')}</th>
			<th scope="col">{$_('views.help.tabs.availableOpcodes.note')}</th>
		</tr>
		</thead>
		<tbody>
		<tr>
			<th scope="row">ax</th>
			<td>{$_('tooltips.registers.ax')}</td>
			<td>Accumulator for some instructions, for example MUL</td>
		</tr>
		<tr>
			<th scope="row">bx</th>
			<td>{$_('tooltips.registers.bx')}</td>
			<td>It can be used to calculate the "offset" in the operand to access memory. For example "MOV AX, [BX+2]". In addition to the BX register, you can use the IP, DI, SI, SP, BP registers as an offset</td>
		</tr>
		<tr>
			<th scope="row">cx</th>
			<td>{$_('tooltips.registers.cx')}</td>
			<td>Often used as a counter. (Like the "i" variable in other programming languages)</td>
		</tr>
		<tr>
			<th scope="row">dx</th>
			<td>{$_('tooltips.registers.dx')}</td>
			<td></td>
		</tr>
		</tbody>
	</table>
{/if}


{#if $language === 'sk'}
	<h4 class="mt-5">Segmentové registre</h4>
	<p>Pomocou segmentových registrov je možné pristupovať až k 1 MB pamäte. Bez nich by sme mohli adresovať iba 64 KB pamäte (pretože maximálna hodnota 16-bitového registra je 0xFFFF)</p>

	<p>Výpočet reálnej adresy:</p>
	<pre>Reálna adresa = Segmentová adresa ∗ 2<sup>4</sup> + offset</pre>

	<table class="table">
		<thead>
		<tr>
			<th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
			<th scope="col">{$_('views.help.tabs.availableOpcodes.description')}</th>
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
{:else}
	<h4 class="mt-5">Segment registers</h4>
	<p>Using segment registers, you can access up to 1 MB of memory. Without them, we could only address 64 KB of memory (because the maximum value of a 16-bit register is 0xFFFF)</p>

	<p>Calculation of the real address:</p>
	<pre>Real address = Segment address ∗ 2<sup>4</sup> + offset</pre>

	<table class="table">
		<thead>
		<tr>
			<th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
			<th scope="col">{$_('views.help.tabs.availableOpcodes.description')}</th>
			<th scope="col">Implicit offset registers</th>
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
{/if}


{#if $language === 'sk'}
	<h4 class="mt-5">Príznakový register (flag)</h4>
	<p>Po vykonaní aritmetických alebo logických operácií sú automaticky nastavené príznaky vo flag registri</p>

	<div class="alert alert-info mt-3" role="alert">
		<b>INFO:</b>
		Simulátor ukazuje tieto príznaky samostatne (PF, ZF, ...), ale v skutočnosti sa jedná o jeden 16-bitový (FLAG) register - príznaky sú jednobitové časti tohto registra
	</div>
{:else}
	<h4 class="mt-5">Flag register</h4>
	<p>After performing arithmetic or logical operations, the flags are automatically set in the flag register</p>

	<div class="alert alert-info mt-3" role="alert">
		<b>INFO:</b>
		The simulator shows these flags separately (PF, ZF, ...), but in fact it is one 16-bit (FLAG) register - the flags are single-bit parts of this register
	</div>
{/if}
<table class="table">
	<thead>
	<tr>
		<th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
		<th scope="col">{$_('views.help.tabs.availableOpcodes.description')}</th>
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

{#if $language === 'sk'}
	<h4 class="mt-5">Registre pre prácu so zásobníkom</h4>
{:else}
	<h4 class="mt-5">Stack registers</h4>
{/if}

<table class="table">
    <thead>
    <tr>
        <th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
        <th scope="col">{$_('views.help.tabs.availableOpcodes.description')}</th>
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


{#if $language === 'sk'}
	<h4 class="mt-5">Reťazcové registre</h4>
	<p>Tieto registre sú pripravené pre budúce rozšírenie simulátora o inštrukcie pracujúce s reťazcami</p>
{:else}
	<h4 class="mt-5">String registers</h4>
	<p>These registers are ready for future extension of the simulator with instructions working with strings</p>
{/if}
<table class="table">
    <thead>
    <tr>
        <th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
        <th scope="col">{$_('views.help.tabs.availableOpcodes.description')}</th>
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
