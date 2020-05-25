<script>
	import { writable } from 'svelte/store';
	import Compressor from 'compressorjs';
	import Tool from './Tool.svelte';
	import ImageComparisonSlider from '../misc/ImageComparisonSlider.svelte';

	let quality = writable(0.8);
	let checkOrientation = writable(true);
	let mimeType = writable('auto');
	let convertSize = writable(5000000);

	const settings = [
		{
			type:    'select',
			name:    'Quality',
			options: [
				{ name: '0', value: '0' },
				{ name: '0.1', value: '0.1' },
				{ name: '0.2', value: '0.2' },
				{ name: '0.3', value: '0.3' },
				{ name: '0.4', value: '0.4' },
				{ name: '0.5', value: '0.5' },
				{ name: '0.6 (Recommend)', value: '0.6' },
				{ name: '0.7 (Recommend)', value: '0.7' },
				{ name: '0.8 (Recommend)', value: '0.8' },
				{ name: '0.9 (Recommend)', value: '0.9' },
				{ name: '1 (Not Recommend)', value: '1' },
			],
			bind:    quality,
		},
		{
			type: 'checkbox',
			name: 'Rotate or Flip the Image automatically, according to the Exif Orientation Value (JPEG image only)',
			bind: checkOrientation,
		},
		{
			type:        'text',
			name:        'Mime Type of the Output Image',
			placeholder: 'f.e. image/png',
			bind:        mimeType,
		},
		{
			type:        'number',
			name:        'File Size in bytes from which PNGs are converted to JPEGs (to disable, set to -1)',
			placeholder: 'f.e. 5000000',
			bind:        convertSize,
		},
	];

	let loading = false;
	let isDropping = false;

	let inputURL = '';
	let inputFile;
	let outputURL = '';
	let outputFile;

	export let showAlert;

	// Some hacky way to remount the image compare (and update the file size)
	let showImageCompare = true;
	$: {
		((_) => {
			showImageCompare = false;
			setTimeout(() => showImageCompare = true, 0);
		})(outputURL);
	}

	function drop(event) {
		const transfer = event.dataTransfer;

		if (!transfer || !transfer.files) return;

		isDropping = false;

		compress(transfer.files[0]);
	}

	function select(event) {
		if (event.target.files) compress(event.target.files[0]);
	}

	function compress(file) {
		loading = true;

		if (URL || webkitURL) inputURL = (URL || webkitURL).createObjectURL(file);
		inputFile = file;

		new Compressor(file, {
			quality:          parseFloat($quality),
			checkOrientation: $checkOrientation,
			mimeType:         $mimeType,
			convertSize:      $convertSize == -1 ? Infinity : $convertSize,
			success:          compressCompleted,
			error:            compressFailed,
		});
	}

	function compressCompleted(result) {
		if (URL || webkitURL) outputURL = (URL || webkitURL).createObjectURL(result);

		outputFile = result;
		loading = false;
	}

	function compressFailed(error) {
		console.error(error.message);
		outputURL = '';
		showAlert(error.message);
		loading = false;
	}

	function prettySize(size) {
		const kilobyte = 1024;
		const megabyte = kilobyte * kilobyte;
		const gigabyte = kilobyte * megabyte;

		if (size > gigabyte) {
			return (size / gigabyte).toFixed(2) + ' GB';
		} else if (size > megabyte) {
			return (size / megabyte).toFixed(2) + ' MB';
		} else if (size > kilobyte) {
			return (size / kilobyte).toFixed(2) + ' KB';
		} else if (size >= 0) {
			return size + ' B';
		}

		return 'N/A';
	}

	[
		quality,
		checkOrientation,
		mimeType,
		convertSize,
	].forEach(store => store.subscribe(() => inputFile ? compress(inputFile) : {}));
</script>

<Tool title="Image Compressor" size="medium" {settings} settingsInfo="https://github.com/fengyuanchen/compressorjs/blob/master/README.md">
	<div on:drop|preventDefault|stopPropagation={drop}
	     on:dragover|preventDefault|stopPropagation="{() => isDropping = true}"
	     on:dragleave|preventDefault|stopPropagation="{() => isDropping = false}"
	     on:dragenter|preventDefault|stopPropagation="{() => {}}"
	     class:uk-dragover={isDropping} class="uk-placeholder uk-text-center">
		{#if loading}
			<div uk-spinner="ratio: 1.66666666667"></div>
		{:else}
			<span uk-icon="cloud-upload"></span>
			<br>
			<span class="uk-text-middle">Drop image here or</span>
			<div uk-form-custom>
				<input on:change|preventDefault|self={select} type="file" accept="image/*">
				<span class="uk-link">browse...</span>
			</div>
		{/if}
	</div>

	{#if outputURL !== ''}
		{#if showImageCompare}
			<ImageComparisonSlider leftText="Uncompressed ({prettySize(inputFile.size)})" rightText="Compressed ({prettySize(outputFile.size)} | {((1 - outputFile.size / inputFile.size) * 100).toFixed(2)}% less)">
				<img slot="leftImage" src={inputURL} alt="Uncompressed">
				<img slot="rightImage" src={outputURL} alt="Compressed">
			</ImageComparisonSlider>
		{/if}

		<a href={outputURL} download={outputFile.name} class="uk-button uk-button-primary uk-width-1-1 uk-margin-top">Download</a>
	{/if}
</Tool>

<style lang="scss">
	@media only screen and (max-width: 640px) {
		:global(.icv__label-before) {
			top: 1rem !important;
			bottom: unset !important;
		}
	}
</style>