<script>
    import { page } from '$app/stores';
	import { onMount } from 'svelte';

    let h = [];
    let es

    onMount(() => {
        // es = new EventSource(`/test`);
        es = new EventSource(`/${$page.params.slug}/s`);

        es.onmessage = function(event) {
            console.log('!!')
            h = [...h, JSON.parse(event.data)]
        }
        es.onerror = function(...e) {
            console.log(e)
        }
        es.onopen = function(...e) {
            console.log(e)
        }
        console.log(es)
    })
</script>

<p>{$page.params.slug}</p>
<pre>{JSON.stringify(h, null, 2)}</pre>