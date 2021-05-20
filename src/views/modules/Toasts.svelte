<script>
    import Toast from "../components/toast";
    const toast = new Toast()
    import {toastQueue} from "../../stores/toastQueue";
    import {onDestroy, onMount} from "svelte";

    $: console.log("toastQueue", $toastQueue)

    let unsubscribe
    let animating = false

    /**
     * Shows multiple toasts one by one, not all at the same time
     */
    function showToast() {
        if ($toastQueue.length > 0) {
            animating = true
            let toastObj = toastQueue.dequeue()
            if (toastObj !== null) {  // queue was not empty
                if (toastObj.type === 'success') {
                    toast.success(toastObj.msg)
                }
                else if (toastObj.type === 'error') {
                    toast.error(toastObj.msg)
                }
                else {
                    toast.error("unrecognized toast type: " + toastObj.type)
                }
            }
            setTimeout(showToast, 5)  // don't show all at the same time
        }
        else {
            animating = false
        }
    }


    onMount(async () => {
        unsubscribe = toastQueue.subscribe(value => {
            if (!animating) {
                showToast()
            }
        })
    });
    onDestroy(() => unsubscribe());
</script>
