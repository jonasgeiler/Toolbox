<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { fade } from 'svelte/transition';

	export let title = '';
	export let size = 'large';
	export let settings = false;
	export let settingsInfo = false;

	$: titleSlug = title.toLowerCase().replace(/[^\s\w\-]+/g, '').replace(/\s+/g, '-');

	let visible = false;
	onMount(() => visible = true);
</script>

<div id={titleSlug} class="{size == 'small' ? 'uk-width-1-2@s uk-width-1-3@l uk-width-1-4@xl' : (size == 'medium' ? 'uk-width-1-1 uk-width-1-3@l uk-width-1-2@xl' : 'uk-width-1-2@l')}">
	{#if visible}
		<div class="uk-card uk-card-default uk-card-small uk-card-hover" transition:fade>
			<div class="uk-card-header">
				<div class="uk-grid uk-grid-medium">
					<div class="uk-width-expand"><h4>{title}</h4></div>

					<div class="uk-width-auto uk-text-right">
						{#if settings}
							<a uk-toggle="#{titleSlug}-modal" uk-tooltip uk-icon="cog" href="" class="uk-icon-link uk-margin-small-right" title="Settings"></a>

							<div uk-modal id="{titleSlug}-modal">
								<div class="uk-modal-dialog uk-margin-auto-vertical">

									<button class="uk-modal-close-default" type="button" uk-close uk-tooltip="pos: left" title="Close"></button>
									<div class="uk-modal-header">
										<h2 class="uk-modal-title uk-text-middle">
											{title} - Settings

											{#if settingsInfo}
												<a href={settingsInfo} target="_blank" uk-icon="info" uk-tooltip="pos: right" title="More Info"></a>
											{/if}
										</h2>
									</div>

									<div class="uk-modal-body" uk-overflow-auto>
										<div class="uk-form-stacked uk-text-left">

											{#each settings as setting, id}
												<div class="uk-margin">
													{#if setting.type !== 'checkbox'}
														<label class="uk-form-label">{@html setting.name}</label>
													{/if}

													{#if setting.type === 'text'}
														<div class="uk-form-controls">
															<input value={get(setting.bind)} on:input={e => setting.bind.set(e.target.value)} type="text" class="uk-input" placeholder={setting.placeholder}>
														</div>
													{:else if setting.type === 'number'}
														<div class="uk-form-controls">
															<input value={get(setting.bind)} on:input={e => setting.bind.set(parseInt(e.target.value))} type="number" class="uk-input" min={setting.min} max={setting.max} placeholder={setting.placeholder}>
														</div>
													{:else if setting.type === 'select'}
														<div class="uk-form-controls">
															<select class="uk-select" on:change={e => setting.bind.set(e.target.options[e.target.selectedIndex].value)}>
																{#each setting.options as option}
																	<option value={option.value} selected={option.value == get(setting.bind)}>{option.name}</option>
																{/each}
															</select>
														</div>
													{:else if setting.type === 'checkbox'}
														<div class="uk-form-controls">
															<label><input class="uk-checkbox" type="checkbox" on:change={e => setting.bind.set(e.target.checked)} checked={get(setting.bind)}> {@html setting.name}</label>
														</div>
													{/if}
												</div>
											{/each}

										</div>
									</div>

								</div>
							</div>
						{/if}

						<a href="" class="uk-sortable-handle uk-icon-link" title="Move" uk-tooltip uk-icon="move"></a>
					</div>
				</div>
			</div>
			<div class="uk-card-body">
				<slot></slot>
			</div>
		</div>
	{/if}
</div>

