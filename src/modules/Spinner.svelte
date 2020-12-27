<script>
    import {loadingReason} from "../store/store";
</script>

<style>
    /*Simple circle loader*/
    /*https://www.w3schools.com/howto/howto_css_loader.asp*/
    .aplicationLoaderSpinner {
        border: 16px solid lightgray;
        border-radius: 50%;
        border-top: 16px solid midnightblue;
        width: 120px;
        height: 120px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;

    }

    /* Safari */
    @-webkit-keyframes spin {
        0% { -webkit-transform: rotate(0deg); }
        100% { -webkit-transform: rotate(360deg); }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    #aplicationLoaderContainer {
        position: fixed;
        opacity: .7;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        background-color: #333333;
        color: lightgray;
    }
</style>


{#if $loadingReason !== ""}
    <div id="aplicationLoaderContainer">
        <div class="aplicationLoaderSpinner"></div>
        <h1>{$loadingReason}</h1>
    </div>
{/if}

