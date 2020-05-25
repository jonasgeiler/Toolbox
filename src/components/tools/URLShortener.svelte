<script>
	import Tool from './Tool.svelte';

	const domain = 'https://l.skayo.dev/';
	const apiKey = '8a8438bc4f3d65147049d62ec8356f99';

	let link = '';
	let customID = '';
	let expires = 0;

	let shortening = false;
	let shortened = false;
	let shortenedLinkID = '';
	let deleteKey = '';

	let shortenedLinkField;
	let deleteKeyField;

	export let copyText;
	export let showAlert;

	function shorten() {
		shortening = true;

		const request = new XMLHttpRequest();

		request.open('POST', 'https://l.skayo.dev/api/shorten', true);
		request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		request.setRequestHeader('Authorization', 'Basic YXBpOjhhODQzOGJjNGYzZDY1MTQ3MDQ5ZDYyZWM4MzU2Zjk5');
		request.responseType = 'json';

		request.onload = function () {
			if (this.status === 0 || this.status >= 200 && this.status < 300 || this.status === 304) {
				const data = this.response;

				if (!data) return showAlert('Got invalid Response');
				if (data.error) return showAlert(data.error);

				shortenedLinkID = data.id;
				deleteKey = data.deleteKey;

				shortened = true;
			} else {
				showAlert(this.statusText);
			}

			shortening = false;
		};

		request.onerror = () => {
			showAlert('Network Error');
			shortening = false;
		};

		request.ontimeout = () => {
			showAlert('Network Timeout');
			shortening = false;
		};

		request.send('link=' + encodeURIComponent(link) + '&expires=' + expires + '&custom_id=' + customID.trim());
	}

	function select(element) {
		element.select();
		element.setSelectionRange(0, element.value.length);
	}
</script>

<Tool title="URL Shortener" size="small">
	<div class="uk-margin-small">
		<input bind:value={link} class="uk-input" type="text" placeholder="Shorten your link...">
	</div>

	<div class="uk-form-stacked">
		<div class="uk-margin-small">
			<label class="uk-form-label" for="custom-id">Custom ID (Optional)</label>
			<div class="uk-form-controls">
				<input bind:value={customID} id="custom-id" placeholder="ID..." class="uk-input uk-form-small" type="text">
			</div>
		</div>

		<div class="uk-margin-small">
			<label class="uk-form-label" for="expires">Expires</label>
			<div class="uk-form-controls">
				<select bind:value={expires} class="uk-select uk-form-small" id="expires">
					<option value="0">Never</option>
					<option value="1">In 1 hour</option>
					<option value="3">In 3 hours</option>
					<option value="6">In 6 hours</option>
					<option value="12">In 12 hours</option>
					<option value="24">In 24 hours</option>
					<option value="48">In 48 hours</option>
				</select>
			</div>
		</div>
	</div>

	<button on:click={shorten} class="uk-button uk-button-primary uk-margin-small-top uk-width-1-1">
		{#if shortening}
			<div uk-spinner="ratio: 0.5"></div>
		{:else}
			Shorten
		{/if}
	</button>

	{#if shortened}
		<div class="uk-margin-small uk-width-1-1 uk-flex uk-flex-center">
			<span uk-icon="icon: arrow-down; ratio: 2"></span>
		</div>

		<div class="uk-margin-small-bottom">
			<div class="uk-inline uk-width-1-1">
				<a href="" on:click={copyText(domain + shortenedLinkID)} class="uk-form-icon uk-form-icon-flip" uk-icon="icon: copy; ratio: 1.33333333334" uk-tooltip title="Copy"></a>
				<input on:click={select(shortenedLinkField)} value={domain + shortenedLinkID} bind:this={shortenedLinkField} placeholder="Shortened Link..." class="uk-input" readonly type="text">
			</div>
		</div>

		<div class="uk-form-stacked">
			<div class="uk-margin-small">
				<label class="uk-form-label" for="delete-key">
					Delete Key
					<a href={domain + 'delete'} target="_blank" uk-icon="icon: info; ratio: 0.9" uk-tooltip="pos: right" title="Delete link your link on {domain + 'delete'}"></a>
				</label>
				<div class="uk-form-controls">
					<div class="uk-inline uk-width-1-1">
						<a href="" on:click={copyText(deleteKey)} class="uk-form-icon uk-form-icon-flip" uk-icon="copy" uk-tooltip title="Copy"></a>
						<input on:click={select(deleteKeyField)} value={deleteKey} bind:this={deleteKeyField} id="delete-key" placeholder="Delete Key..." class="uk-input uk-form-small" readonly type="text">
					</div>
				</div>
			</div>
		</div>

		<div class="uk-text-center uk-margin-top">
			<a href={domain + shortenedLinkID + '/stats'} target="_blank" class="uk-button uk-button-text">Statistics Page</a>
		</div>
	{/if}
</Tool>