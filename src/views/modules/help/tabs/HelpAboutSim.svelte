<script>
    import {language} from "../../../../stores/language";

	let version = '2022-12-07';
</script>

{#if $language === 'sk'}
	<p>Verzia {version}</p>
	<p>Vytvoril Adam Slatinský</p>
	<p><i class="fab fa-github"></i> <a href="https://github.com/slatinsky/x86sim" target="_blank">Zdrojový kód na Githube</a>. Pull requesty sú vítané :)</p>
	<p>Ak nájdete v simulátore chybu, vytvorte prosím "issue" na Githube s postupom na jej zreprodukovanie. Ďakujem</p>

	<h4 class="mt-5">Poďakovania</h4>
	<p>Týmto by som chcel poďakovať hlavne doc. Ing. Tiborovi Krajčovičovi, PhD. za usmerňovanie počas práce na tomto projekte.</p>
	<div><a href="https://www.flaticon.com/packs/countrys-flags" target="_blank">Flag icons</a> vytvorené autorom Freepik</div>
{:else}
	<p>Version {version}</p>
	<p>Created by Adam Slatinský</p>
	<p><i class="fab fa-github"></i> <a href="https://github.com/slatinsky/x86sim" target="_blank">Source code on Github</a>. Pull requests are welcome :)</p>
	<p>If you find a bug in the simulator, please create an "issue" on Github with a step-by-step guide on how to reproduce it. Thank you</p>

	<h4 class="mt-5">Acknowledgements</h4>
	<p>I would like to thank doc. Ing. Tibor Krajčovič, PhD. for guiding me through this project.</p>
	<div><a href="https://www.flaticon.com/packs/countrys-flags" target="_blank">Flag icons</a> created by Freepik</div>
{/if}
