<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let min = 0;
	export let max = 100;
	export let low = 10;
	export let high = 40;
	export let interval = 1;

	$: low = Math.min(low, high - interval);
	$: dispatch('change', { low, high });
</script>

<div class="sliders_control">
	<input type="range" bind:value={low} {min} {max} />
	<input type="range" bind:value={high} {min} {max} />
</div>

<style>
	.sliders_control {
		position: relative;
		height: var(--thumb-size, 12px);
		width: 100%;
		margin: 1rem 0;
	}

	.sliders_control:before {
		content: '\a0';
		position: absolute;
		top: calc(50% - 2px);
		left: 0;
		right: 0;
		height: 4px;
		background: #c6c6c6;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		pointer-events: all;
		width: var(--thumb-size, 12px);
		height: var(--thumb-size, 12px);
		background-color: #fff;
		border-radius: 50%;
		box-shadow: 0 0 0 1px #c6c6c6;
		border: none;
		cursor: pointer;
		box-sizing: border-box;
	}

	input[type='range']::-moz-range-thumb {
		-webkit-appearance: none;
		appearance: none;
		pointer-events: all;
		width: var(--thumb-size, 12px);
		height: var(--thumb-size, 12px);
		background-color: #fff;
		border-radius: 50%;
		box-shadow: 0 0 0 1px #c6c6c6;
		border: none;
		cursor: pointer;
		box-sizing: border-box;
	}

	input[type='range']::-webkit-slider-thumb:hover {
		background: #f7f7f7;
	}

	input[type='range']::-webkit-slider-thumb:active {
		background: black;
		/*box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;*/
		/*-webkit-box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;*/
	}

	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		height: var(--thumb-size, 12px);
		/*width: 100%;*/
		position: absolute;
		background-color: #c6c6c6;
		background-color: transparent;
		padding: 0 !important;
		margin: 0 !important;
		pointer-events: none;
		border: none !important;
	}
</style>
