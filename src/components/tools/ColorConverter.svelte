<script>
	import Tool from './Tool.svelte';
	import color from 'tinycolor2';

	let value = color.random().toHexString();

	$: hasAlpha = (color(value).getAlpha() !== 1);
	$: namedColor = color(value).toName();
	$: hexColor = hasAlpha ? color(value).toHex8String() : color(value).toHexString();
	$: rgbColor = color(value).toRgbString();
	$: hslColor = color(value).toHslString();
	$: hsvColor = color(value).toHsvString();

	let nameField;
	let hexField;
	let rgbField;
	let hslField;
	let hsvField;

	export let copyText;

	function select(element) {
		element.select();
		element.setSelectionRange(0, element.value.length);
	}
</script>

<Tool title="Color Converter" size="small">
	<div class="uk-margin-small">
		<input bind:value class="uk-input sk-monospace" type="text" placeholder="Enter a color in any format...">
	</div>

	<div class="uk-grid-small" uk-grid>
		<div class="uk-width-1-6@s">
			<div class="uk-height-1-1 preview-background">
				<div class="uk-height-1-1 uk-width-1-1" style="background-color: {hexColor}; border: 1px solid black;"></div>
			</div>
		</div>

		<div class="uk-width-expand uk-form-stacked">
			{#if namedColor}
				<div class="uk-margin-small">
					<label class="uk-form-label" for="color-name">Name</label>
					<div class="uk-form-controls">
						<div class="uk-inline uk-width-1-1">
							<a href="" on:click={copyText(namedColor)} class="uk-form-icon uk-form-icon-flip" uk-icon="copy" uk-tooltip title="Copy"></a>
							<input on:click={select(nameField)} value={namedColor} bind:this={nameField} id="color-name" placeholder="dodgerblue" class="uk-input uk-form-small sk-monospace" readonly type="text">
						</div>
					</div>
				</div>
			{/if}

			<div class="uk-margin-small">
				<label class="uk-form-label" for="hex-color">HEX{#if hasAlpha}8{/if}</label>
				<div class="uk-form-controls">
					<div class="uk-inline uk-width-1-1">
						<a href="" on:click={copyText(hexColor)} class="uk-form-icon uk-form-icon-flip" uk-icon="copy" uk-tooltip title="Copy"></a>
						<input on:click={select(hexField)} value={hexColor} bind:this={hexField} id="hex-color" placeholder="#1e90ff" class="uk-input uk-form-small sk-monospace" readonly type="text">
					</div>
				</div>
			</div>

			<div class="uk-margin-small">
				<label class="uk-form-label" for="rgb-color">RGB{#if hasAlpha}A{/if}</label>
				<div class="uk-form-controls">
					<div class="uk-inline uk-width-1-1">
						<a href="" on:click={copyText(rgbColor)} class="uk-form-icon uk-form-icon-flip" uk-icon="copy" uk-tooltip title="Copy"></a>
						<input on:click={select(rgbField)} value={rgbColor} bind:this={rgbField} id="rgb-color" placeholder="rgb(30, 144, 255)" class="uk-input uk-form-small sk-monospace" readonly type="text">
					</div>
				</div>
			</div>

			<div class="uk-margin-small">
				<label class="uk-form-label" for="hsl-color">HSL{#if hasAlpha}A{/if}</label>
				<div class="uk-form-controls">
					<div class="uk-inline uk-width-1-1">
						<a href="" on:click={copyText(hslColor)} class="uk-form-icon uk-form-icon-flip" uk-icon="copy" uk-tooltip title="Copy"></a>
						<input on:click={select(hslField)} value={hslColor} bind:this={hslField} id="hsl-color" placeholder="hsl(210, 100%, 56%)" class="uk-input uk-form-small sk-monospace" readonly type="text">
					</div>
				</div>
			</div>

			<div class="uk-margin-small">
				<label class="uk-form-label" for="hsv-color">HSV{#if hasAlpha}A{/if}</label>
				<div class="uk-form-controls">
					<div class="uk-inline uk-width-1-1">
						<a href="" on:click={copyText(hsvColor)} class="uk-form-icon uk-form-icon-flip" uk-icon="copy" uk-tooltip title="Copy"></a>
						<input on:click={select(hsvField)} value={hsvColor} bind:this={hsvField} id="hsv-color" placeholder="hsv(210, 88%, 100%)" class="uk-input uk-form-small sk-monospace" readonly type="text">
					</div>
				</div>
			</div>
		</div>
	</div>
</Tool>

<style lang="scss">
	.preview-background {
		background-image: url(/transparent-background.gif);
		background-repeat: repeat;
		background-position: top left;
		background-color: #fff;
		min-height: 35px;
	}
</style>