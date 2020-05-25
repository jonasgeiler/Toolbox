<script>
	import { writable } from 'svelte/store';
	import Tool from './Tool.svelte';

	let lineSeparator = writable('lf');
	let separateLines = writable(false);
	let chunks = writable(false);
	let urlSafe = writable(false);

	const settings = [
		{
			type:    'select',
			name:    'Newline separator to use when encoding',
			options: [
				{ name: 'LF (Unix)', value: 'lf' },
				{ name: 'CRLF (Windows)', value: 'crlf' },
			],
			bind:    lineSeparator,
		},
		{
			type: 'checkbox',
			name: 'Process each line separately (useful for multiple entries)',
			bind: separateLines,
		},
		{
			type: 'checkbox',
			name: 'Split lines into 76 character wide chunks when encoding (useful for MIME)',
			bind: chunks,
		},
		{
			type: 'checkbox',
			name: 'Perform URL safe encoding (uses Base64URL format)',
			bind: urlSafe,
		},
	];

	let plainText = '';
	let plainTextError = false;

	let base64Text = '';
	let base64TextError = false;

	export let copyText;

	let lastAction = () => {
	};

	function encodeText() {
		lastAction = encodeText;

		const separator = ($lineSeparator == 'crlf' ? '\r\n' : '\n');
		try {
			if ($separateLines) {
				base64Text = plainText.split(/\r?\n/g).map(function (value) {
					return $urlSafe ? unicodeBase64Encode(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '') : unicodeBase64Encode(value);
				}).join(separator);
			} else {
				base64Text = $urlSafe ? unicodeBase64Encode(plainText.replace(/\r?\n/g, separator)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '') : unicodeBase64Encode(plainText.replace(/\r?\n/g, separator));

				if ((typeof (base64Text) === 'string' && base64Text !== '' && $chunks)) base64Text = base64Text.match(/.{1,76}/g).join(separator);
			}

			base64TextError = false;
			plainTextError = false;
		} catch (error) {
			plainTextError = true;
		}
	}

	function decodeText() {
		lastAction = decodeText;

		try {
			plainText = $separateLines ? base64Text.split(/\r?\n/g).map(function (value) {
				return unicodeBase64Decode(value.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/'));
			}).join('\n') : unicodeBase64Decode(base64Text.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/'));

			plainTextError = false;
			base64TextError = false;
		} catch (error) {
			base64TextError = true;
		}
	}

	function unicodeBase64Decode(text) {
		return decodeURIComponent(Array.prototype.map.call(window.atob(text), function (c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
	}

	function unicodeBase64Encode(text) {
		return window.btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, function (match, p1) {
			return String.fromCharCode('0x' + p1);
		}));
	}

	[
		lineSeparator,
		separateLines,
		chunks,
		urlSafe,
	].forEach(store => store.subscribe(() => lastAction()));
</script>

<Tool title="Base64 Encoder / Decoder" {settings}>
	<div class="uk-grid-small" uk-grid>
		<div class="uk-width-expand@s uk-width-1-1 uk-flex uk-flex-column">
			<textarea bind:value={plainText} on:input={encodeText} class:uk-form-danger={plainTextError} class="uk-textarea uk-width-1-1" placeholder="Plain Text..."></textarea>

			<button on:click={copyText(plainText)} class="uk-button uk-button-primary uk-button-small uk-width-1-1 uk-margin-small-top">Copy</button>
		</div>
		<div class="uk-width-auto uk-flex uk-flex-center uk-flex-column uk-visible@s">
			<span class="uk-width-auto" uk-icon="icon: arrow-right; ratio: 3" uk-tooltip title="Encode"></span>
			<span class="uk-width-auto" uk-icon="icon: arrow-left; ratio: 3" uk-tooltip="pos: bottom" title="Decode"></span>

			<div style="height: 38px"></div>
		</div>
		<div class="uk-width-1-1 uk-flex uk-flex-center uk-hidden@s">
			<span class="uk-width-auto uk-hiddden@s" uk-icon="icon: arrow-down; ratio: 2" uk-tooltip="pos: left" title="Encode"></span>
			<span class="uk-width-auto uk-hidden@s" uk-icon="icon: arrow-up; ratio: 2" uk-tooltip="pos: right" title="Decode"></span>
		</div>
		<div class="uk-width-expand@s uk-width-1-1 uk-flex uk-flex-column">
			<textarea bind:value={base64Text} on:input={decodeText} class:uk-form-danger={base64TextError} class="uk-textarea uk-height-1-1" placeholder="Base64..."></textarea>

			<button on:click={copyText(base64Text)} class="uk-button uk-button-primary uk-button-small uk-width-1-1 uk-margin-small-top">Copy</button>
		</div>
	</div>
</Tool>