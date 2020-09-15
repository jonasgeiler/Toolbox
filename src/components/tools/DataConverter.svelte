<script>
	import Tool from './Tool.svelte';
	import CodeBlock from '../misc/CodeBlock.svelte';

	const dataFormats = [
		{
			format: 'json',
			name:   'JSON',
			input:  true,
			output: true,
			displayAs: 'json'
		},
		{
			format: 'yaml',
			name:   'YAML',
			input:  true,
			output: true,
			displayAs: 'yaml'
		},
		{
			format: 'csv',
			name:   'CSV',
			input:  true,
			output: false,
		},
		{
			format: 'xml',
			name:   'XML',
			input:  true,
			output: true,
			displayAs: 'xml'
		},
		{
			format: 'ini',
			name:   'INI',
			input:  true,
			output: false,
		},
		{
			format: 'phps',
			name:   'PHP Serialized',
			input:  false,
			output: true,
			displayAs: 'plaintext'
		},
		{
			format: 'phpc',
			name:   'PHP Code',
			input:  false,
			output: true,
			displayAs: 'php'
		},
	];

	let inputData = '';
	let inputFormat = 'json';

	let outputData = '';
	let outputFormat = 'yaml';
	let outputLang = '';

	let converting = false;

	export let showAlert;
	export let copyText;

	function convert() {
		if (inputFormat.trim() === '') return;

		converting = true;
		
		const formData = new FormData();

		formData.append('data', inputData);
		formData.append('inputformat', inputFormat);
		formData.append('outputformat', outputFormat);

		const request = new XMLHttpRequest();

		request.open('POST', 'https://skayo.dev/data-converter/?key=bxpuux0lo4q5egcjbpnyatp87rotm6sv', true);
		request.responseType = 'json';

		request.onload = function () {
			converting = false;
			
			if (this.status === 0 || this.status >= 200 && this.status < 300 || this.status === 304) {
				const data = this.response;

				if (!data) return showAlert('Got invalid Response');
				if (data.errors) {
					let errors = '<ul>';

					for (let errorCategory of Object.values(data.errors)) {
						for (let error of errorCategory) {
							errors += '<li>';
							errors += error;
							errors += '</li>';
						}
					}

					errors += '</ul>';

					return showAlert(errors);
				}

				outputData = data.result.data;
				outputLang = getFormatInfo(outputFormat).displayAs;
			} else {
				showAlert(this.statusText);
			}
		};

		request.onerror = () => {
			showAlert('Network Error');
			converting = false;
		};

		request.ontimeout = () => {
			showAlert('Network Timeout');
			converting = false;
		};

		request.send(formData);
	}

	function setInputFormat(event) {
		inputFormat = event.target.options[event.target.selectedIndex].value;

		if (outputFormat === inputFormat) {
			for (let dataFormat of dataFormats) {
				if (dataFormat.output && dataFormat.format !== inputFormat) {
					outputFormat = dataFormat.format;
					return;
				}
			}
		}
	}

	function getFormatInfo(format) {
		for (let dataFormat of dataFormats) {
			if (dataFormat.format === format) return dataFormat;
		}
	}
</script>

<Tool title="Data Converter">
	<div class="uk-grid-small" uk-grid>
		<div class="uk-width-expand">
			<select class="uk-select" on:change="{setInputFormat}">
				{#each dataFormats as dataFormat}
					{#if dataFormat.input}
						<option value={dataFormat.format} selected={inputFormat === dataFormat.format}>{dataFormat.name}</option>
					{/if}
				{/each}
			</select>
		</div>
		<div class="uk-width-auto uk-text-center uk-flex uk-flex-center uk-flex-column">
			<span uk-icon="icon: arrow-right; ratio: 1.5" uk-tooltip title="Convert to"></span>
		</div>
		<div class="uk-width-expand">
			<select class="uk-select" on:change={e => outputFormat = e.target.options[e.target.selectedIndex].value}>
				{#each dataFormats as dataFormat}
					{#if dataFormat.output && inputFormat !== dataFormat.format}
						<option value={dataFormat.format} selected={outputFormat === dataFormat.format}>{dataFormat.name}</option>
					{/if}
				{/each}
			</select>
		</div>
	</div>

	<div class="uk-margin-small">
		<textarea bind:value={inputData} class="uk-textarea uk-width-1-1 sk-monospace" placeholder="{getFormatInfo(inputFormat).name}..."></textarea>
	</div>

	<button on:click={convert} class="uk-button uk-button-primary uk-width-1-1">
		{#if converting}
			<div uk-spinner="ratio: 0.5"></div>
		{:else}
			Convert
		{/if}
	</button>

	{#if outputData !== ''}
		<div class="uk-width-1-1 uk-flex uk-flex-center uk-margin-small">
			<span class="uk-width-auto" uk-icon="icon: arrow-down; ratio: 3" uk-tooltip="pos: left" title="Converted"></span>
		</div>

		<div>
			<CodeBlock code={outputData} language={outputLang} />
		</div>

		<button on:click={copyText(outputData)} class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-top">Copy</button>
	{/if}
</Tool>