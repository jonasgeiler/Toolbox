<script>
	import { writable } from 'svelte/store';
	import Tool from './Tool.svelte';

	let size = writable(200);
	let charsetSource = writable('UTF-8');
	let charsetTarget = writable('UTF-8');
	let ecc = writable('L');
	let fgcolor = writable('#000');
	let bgcolor = writable('#fff');
	let margin = writable(8);
	let qzone = writable(0);
	let format = writable('png');

	const settings = [
		{
			type:        'number',
			name:        'Image Size (px)',
			placeholder: 'f.e. 200',
			bind:        size,
			min:         10,
			max:         1000,
		},
		{
			type:    'select',
			name:    'Source Charset',
			options: [
				{ name: 'UTF-8', value: 'UTF-8' },
				{ name: 'ISO-8859-1', value: 'ISO-8859-1' },
			],
			bind:    charsetSource,
		},
		{
			type:    'select',
			name:    'Target Charset',
			options: [
				{ name: 'UTF-8', value: 'UTF-8' },
				{ name: 'ISO-8859-1', value: 'ISO-8859-1' },
			],
			bind:    charsetTarget,
		},
		{
			type:    'select',
			name:    'Error Correction Code',
			options: [
				{ name: 'Low', value: 'L' },
				{ name: 'Middle', value: 'M' },
				{ name: 'Quality', value: 'Q' },
				{ name: 'High', value: 'H' },
			],
			bind:    ecc,
		},
		{
			type:        'text',
			name:        'Foreground Color',
			placeholder: 'f.e. #000',
			bind:        fgcolor,
		},
		{
			type:        'text',
			name:        'Background Color',
			placeholder: 'f.e. #fff',
			bind:        bgcolor,
		},
		{
			type:        'number',
			name:        'Margin (px)',
			placeholder: 'f.e. 10',
			bind:        margin,
			min:         0,
			max:         50,
		},
		{
			type:        'number',
			name:        'Quiet Zone (px)',
			placeholder: 'f.e. 5',
			bind:        qzone,
			min:         0,
			max:         100,
		},
		{
			type:    'select',
			name:    'File Format',
			options: [
				{ name: 'PNG', value: 'png' },
				{ name: 'GIF', value: 'gif' },
				{ name: 'JPG', value: 'jpg' },
				{ name: 'SVG', value: 'svg' },
				{ name: 'EPS', value: 'eps' },
			],
			bind:    format,
		},
	];

	let value = '';

	$: qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/' +
	               `?size=${$size}x${$size}` +
	               `&charset-source=${$charsetSource}` +
	               `&charset-target=${$charsetTarget}` +
	               `&ecc=${$ecc}` +
	               `&color=${$fgcolor.replace('#', '')}` +
	               `&bgcolor=${$bgcolor.replace('#', '')}` +
	               `&margin=${$margin}` +
	               `&qzone=${$qzone}` +
	               `&format=${$format}` +
	               `&data=${value}`;
</script>

<Tool title="QR-Code Generator" {settings} settingsInfo="http://goqr.me/api/doc/create-qr-code/">
	<div class="uk-grid-small" uk-grid>
		<div class="uk-width-expand@s uk-width-1-1">
			<textarea bind:value class="uk-textarea uk-margin-small-bottom" placeholder="Text, URL, etc..."></textarea>
			<a href="https://github.com/zxing/zxing/wiki/Barcode-Contents" target="_blank">List of QR-Code Content Standards</a>
		</div>

		{#if value !== ''}
			<div class="uk-width-1-4@s uk-width-1-1 uk-text-center">
				<img src={qrCodeUrl} class="uk-width-1-1 uk-margin-small-bottom" alt="QR-Code">
				<a href="{qrCodeUrl}&download=1" target="_blank" class="uk-button uk-button-primary uk-button-small uk-width-1-1">Download</a>
			</div>
		{/if}
	</div>
</Tool>
