<script>
    import IconUnitedKingdom from "../../assets/icons/united-kingdom.svg";
    import IconSlovakia from "../../assets/icons/slovakia.svg";
    import {language} from "../../stores/language";

    function setLocale(chosenLocale) {
        $language = chosenLocale
    }
</script>
<style>
    #chooseLanguage-container {
        background-color: #333333;
        display: grid;
        place-items: center;
        width: 100vw;
        height: 100vh;
    }

    .chooseLanguage-flex {
        display: flex;
    }


    .chooseLanguage-language {
        padding: 2rem;
        background-color: #4c4c4c;
        cursor: pointer;
        text-align: center;
    }

    h1, .chooseLanguage-languageName {
        text-align: center;
        font-size: 2rem;
        margin-top: 2rem;
        color: white;
    }

    .chooseLanguage-language:hover {
        background-color: #656565;
    }

    :global(.chooseLanguage-icon svg) {
        width: min(20vw, 30vh);
    }
</style>

<div id="chooseLanguage-container">
    <div>
        <img src="assets/128.png" alt="" class="img-fluid" width="128" height="128">
        <h1>x86sim</h1>
    </div>
    <div class="chooseLanguage-flex">
        <div class="chooseLanguage-language" on:click={() => setLocale('en')}>
            <span class="chooseLanguage-icon"><IconUnitedKingdom /></span>
            <div class="chooseLanguage-languageName"> English</div>
        </div>

        <div class="chooseLanguage-language" on:click={() => setLocale('sk')}>
            <span class="chooseLanguage-icon"><IconSlovakia /></span>
            <div class="chooseLanguage-languageName">Slovensky</div>
        </div>
    </div>
</div>

