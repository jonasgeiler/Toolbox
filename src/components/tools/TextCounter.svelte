<script>
	import { writable } from 'svelte/store';
	import Tool from './Tool.svelte';

	let hardReturns = writable(false);
	let stripTags = writable(false);
	let ignoreReturns = writable(false);
	let ignoreZeroWidth = writable(true);

	const settings = [
		{
			type: 'checkbox',
			name: 'Hard Returns when counting paragraphs (only two newlines start a new paragraph)',
			bind: hardReturns,
		},
		{
			type: 'checkbox',
			name: 'Strip HTML Tags',
			bind: stripTags,
		},
		{
			type: 'checkbox',
			name: 'Ignore Returns when counting characters',
			bind: ignoreReturns,
		},
		{
			type: 'checkbox',
			name: 'Ignore Zero Width Character',
			bind: ignoreZeroWidth,
		},
	];

	let value = '';

	let characterCount = 0;
	let wordCount = 0;
	let sentenceCount = 0;
	let paragraphCount = 0;

	function countWords() {
		var text = value;

		if ($stripTags) text = text.replace(/<\/?[a-z][^>]*>/gi, '');
		if ($ignoreZeroWidth) text = text.replace(/[\u200B]+/, '');

		characterCount = text ? ($ignoreReturns ? text.replace(/[\n\r]/g, '') : text).length : 0;
		wordCount = text ? (text.replace(/['";:,.?\xbf\-!\xa1]+/g, '').match(/\S+/g) || []).length : 0;
		sentenceCount = text ? (text.match(/[.?!\u2026]+./g) || []).length + 1 : 0;
		paragraphCount = text ? (text.match($hardReturns ? /\n{2,}/g : /\n+/g) || []).length + 1 : 0;
	}

	[
		hardReturns,
		stripTags,
		ignoreReturns,
		ignoreZeroWidth
	].forEach(store => store.subscribe(() => countWords()));
</script>

<Tool title="Word Counter" {settings}>
	<div class="uk-grid-divider uk-grid-medium@s uk-grid-small uk-child-width-expand@s" uk-grid>
		<div>
			<span class="uk-text-small">Words</span>
			<h2 class="uk-margin-remove uk-text-primary">{wordCount}</h2>
		</div>
		<div>
			<span class="uk-text-small">Characters</span>
			<h2 class="uk-margin-remove uk-text-primary">{characterCount}</h2>
		</div>
		<div>
			<span class="uk-text-small">Sentences</span>
			<h2 class="uk-margin-remove uk-text-primary">{sentenceCount}</h2>
		</div>
		<div>
			<span class="uk-text-small">Paragraphs</span>
			<h2 class="uk-margin-remove uk-text-primary">{paragraphCount}</h2>
		</div>
	</div>

	<div class="uk-margin-small-top">
		<textarea bind:value on:input={countWords} class="uk-textarea" placeholder="Text..."></textarea>
	</div>
</Tool>