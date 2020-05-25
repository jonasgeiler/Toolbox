<script>
	import { writable } from 'svelte/store';
	import Tool from './Tool.svelte';

	let name = writable('My App');
	let shortName = writable('App');
	let language = writable('en-US');
	let startUrl = writable('/');
	let themeColor = writable('#333');
	let bgColor = writable('#fff');
	let display = writable('minimal-ui');
	let generate48ico = writable(true);
	let generate64ico = writable(true);
	let generateAndroid = writable(true);
	let generateApple = writable(false);
	let generateMS = writable(false);

	const settings = [
		{
			type:        'text',
			name:        'Application Name',
			placeholder: 'f.e. My App',
			bind:        name,
		},
		{
			type:        'text',
			name:        'Short Application Name',
			placeholder: 'f.e. App',
			bind:        shortName,
		},
		{
			type:        'text',
			name:        'Language',
			placeholder: 'f.e. en-US',
			bind:        language,
		},
		{
			type:        'text',
			name:        'Start URL',
			placeholder: 'f.e. /',
			bind:        startUrl,
		},
		{
			type:        'text',
			name:        'Theme Color',
			placeholder: 'f.e. #333',
			bind:        themeColor,
		},
		{
			type:        'text',
			name:        'Background Color',
			placeholder: 'f.e. #fff',
			bind:        bgColor,
		},
		{
			type:    'select',
			name:    'Display',
			options: [
				{ name: 'Fullscreen', value: 'fullscreen' },
				{ name: 'Standalone application', value: 'standalone' },
				{ name: 'Minimal set of UI elements', value: 'minimal-ui' },
				{ name: 'Browser', value: 'browser' },
			],
			bind:    display,
		},
		{
			type: 'checkbox',
			name: 'Include a 48x48 version in the .ico file',
			bind: generate48ico,
		},
		{
			type: 'checkbox',
			name: 'Include a 64x64 version in the .ico file',
			bind: generate64ico,
		},
		{
			type: 'checkbox',
			name: 'Generate manifest.json and Android images',
			bind: generateAndroid,
		},
		{
			type: 'checkbox',
			name: 'Generate old apple touch images',
			bind: generateApple,
		},
		{
			type: 'checkbox',
			name: 'Generate Windows and IE tile images (WIP)',
			bind: generateMS,
		},
	];

	let file;

	let previewURL = '';
	let downloadURL = '';
	let uploaded = false;
	let generated = false;
	let loading = false;
	let generating = false;
	let isDropping = false;

	export let showAlert;

	function drop(event) {
		const transfer = event.dataTransfer;

		if (!transfer || !transfer.files) return;

		loading = true;
		isDropping = false;

		file = transfer.files[0];

		if (URL || webkitURL) previewURL = (URL || webkitURL).createObjectURL(file);

		uploaded = true;
		loading = false;
	}

	function select(event) {
		if (event.target.files) {
			loading = true;

			file = event.target.files[0];

			if (URL || webkitURL) previewURL = (URL || webkitURL).createObjectURL(file);

			uploaded = true;
			loading = false;
		}
	}

	function generate() {
		if (!file.type.match(/image\/(png|gif|jpeg)/g)) {
			return showAlert('Invalid File Type: ' + file.type);
		}

		generating = true;

		const formData = new FormData();

		formData.append('image', file);
		formData.append('name', $name);
		formData.append('short_name', $shortName);
		formData.append('language', $language);
		formData.append('start_url', $startUrl);
		formData.append('theme_color', $themeColor);
		formData.append('bg_color', $bgColor);
		formData.append('display', $display);
		formData.append('generate_48ico', $generate48ico);
		formData.append('generate_64ico', $generate64ico);
		formData.append('generate_android', $generateAndroid);
		formData.append('generate_apple', $generateApple);
		formData.append('generate_ms', $generateMS);

		const request = new XMLHttpRequest();

		request.open('POST', 'https://skayo.dev/favicon/?key=1e3439be8cde13483b5db4304cf01140', true);
		request.responseType = 'json';

		request.onload = function () {
			generating = false;

			if (this.status === 0 || this.status >= 200 && this.status < 300 || this.status === 304) {
				const data = this.response;

				if (!data) return showAlert('Got invalid Response');
				if (data.error) return showAlert(data.error);

				downloadURL = 'https://skayo.dev/favicon/download/?id=' + data.id;
				window.open(downloadURL, '_blank');

				generated = true;
			} else {
				showAlert(this.statusText);
			}
		};

		request.onerror = () => {
			showAlert('Network Error');
			generating = false;
		};

		request.ontimeout = () => {
			showAlert('Network Timeout');
			generating = false;
		};

		request.send(formData);
	}
</script>

<Tool title="Favicon Generator" size="small" {settings} settingsInfo="https://github.com/joffreydemetz/favicon/blob/master/src/Generator.php">
	<div on:drop|preventDefault|stopPropagation={drop}
	     on:dragover|preventDefault|stopPropagation="{() => isDropping = true}"
	     on:dragleave|preventDefault|stopPropagation="{() => isDropping = false}"
	     on:dragenter|preventDefault|stopPropagation="{() => {}}"
	     class:uk-dragover={isDropping} class="uk-placeholder uk-text-center uk-margin-remove">
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

	<div class="uk-text-meta uk-margin-bottom uk-text-center">Recommended Minimum Size: 310x310 px</div>

	{#if uploaded}
		{#if previewURL !== ''}
			<div class="uk-text-center">
				<b>Preview:</b>&nbsp;

				{#if $generate64ico}
					<img src={previewURL} alt="64px Icon" style="height: 64px; width: 64px;">
				{/if}

				{#if $generate48ico}
					<img src={previewURL} alt="48px Icon" style="height: 48px; width: 48px;">
				{/if}

				<img src={previewURL} alt="16px Icon" style="height: 16px; width: 16px;">
			</div>
		{/if}

		<button on:click={generate} class="uk-button uk-button-primary uk-width-1-1 uk-margin-top">
			{#if generating}
				<div uk-spinner="ratio: 0.5"></div>
			{:else}
				Generate
			{/if}
		</button>

		{#if generated}
			<div class="uk-text-center uk-margin-small-top">
				<a href={downloadURL} target="_blank" class="uk-button uk-button-text">Download Again</a>
			</div>
		{/if}
	{/if}
</Tool>