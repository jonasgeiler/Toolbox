<script>
	import Tool from './Tool.svelte';

	let numA;
	let numB;
	let numC;
	$: result = numC * (numB / numA);
</script>

<Tool title="Rule of Three" size="small">
	<div class="uk-grid-small" uk-grid>
		<div class="uk-width-expand">
			<input bind:value={numA} class="uk-input" type="number" placeholder="Number...">
		</div>
		<div class="uk-width-auto uk-text-center uk-flex uk-flex-center uk-flex-column">
			<span uk-icon="icon: arrow-right; ratio: 1.5" uk-tooltip title="corresponds to"></span>
		</div>
		<div class="uk-width-expand">
			<input bind:value={numB} class="uk-input" type="number" placeholder="Number...">
		</div>
	</div>

	<div class="uk-grid-small" uk-grid>
		<div class="uk-width-expand">
			<input bind:value={numC} class="uk-input" type="number" placeholder="Number...">
		</div>
		<div class="uk-width-auto uk-text-center uk-flex uk-flex-center uk-flex-column">
			<span uk-icon="icon: arrow-right; ratio: 1.5" uk-tooltip title="corresponds to"></span>
		</div>
		<div class="uk-width-expand">
			<input value={!isNaN(result) ? result : ''} class="uk-input" type="number" placeholder="Result..." readonly>
		</div>
	</div>
</Tool>