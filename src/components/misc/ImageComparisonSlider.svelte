<script>
	import { onMount } from 'svelte';
	import ImageCompare from '../../../node_modules/image-compare-viewer';

	export let leftText = 'Before';
	export let rightText = 'After';

	let imageCompare;

	onMount(() => {
		new ImageCompare(imageCompare, {
			addCircle:     true,
			addCircleBlur: false,
			showLabels:    true,
			labelOptions:  {
				before:  leftText,
				after:   rightText,
				onHover: false,
			},
			smoothing:     false,
			hoverStart:    true,
		}).mount();
	});
</script>

<div bind:this={imageCompare}>
	<slot name="leftImage"></slot>
	<slot name="rightImage"></slot>
</div>