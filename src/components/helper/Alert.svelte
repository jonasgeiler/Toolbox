<script>
	import { onMount } from 'svelte';

	export let showAlert = msg => alert(msg); // Fallback by default

	onMount(async () => {
		const UIkit = (await import('uikit')).default;
		showAlert = UIkit.modal.alert;
	});
</script>