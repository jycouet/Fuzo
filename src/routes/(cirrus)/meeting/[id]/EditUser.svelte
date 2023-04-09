<script lang="ts">
	import DualRangeInput from '$lib/DualRangeInput.svelte';
	import type { UTCSlot } from '$lib/User';
	import all from '$lib/timezone.json';
	import { me } from '$lib/users';
	import { utcToZonedTime } from 'date-fns-tz';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();
	const timezones = Object.keys(all);
	let slots: Array<{ start: number; end: number }> = [];

	onMount(() => {
		if ($me.timezone === '') {
			$me.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		}
		slots = $me.slots.map((slot: UTCSlot) => ({
			start: utcToZonedTime(slot.start, $me.timezone).getHours(),
			end: utcToZonedTime(slot.end, $me.timezone).getHours()
		}));
	});
	function save() {
		$me.removeAllSlots();
		slots.forEach((value) => {
			$me.addTodaySlot(value.start, value.end);
		});
		$me = $me;
		dispatch('save');
	}
	function addSlot() {
		slots.push({ start: 8, end: 20 });
		slots = slots;
	}
	function removeSlot(index: number) {
		slots.splice(index, 1);
		slots = slots;
	}
</script>

<div class="modal modal-animated--dropdown" id="edit-user">
	<a href="#home" class="modal-overlay close-btn text-transparent" aria-label="Close">Close</a>
	<article class="modal-content">
		<header class="modal-header">
			<h4>Edit user</h4>
		</header>
		<section class="modal-body">
			<div class="row level">
				<div class="col-xs-4 level-item">
					<label for="createUserName">Name</label>
				</div>
				<div class="col-xs-8 level-item">
					<input id="createUserName" bind:value={$me.name} />
				</div>
			</div>
			<div class="row level">
				<div class="col-xs-4 level-item">
					<label for="createUserTimezone">Timezone</label>
				</div>
				<div class="col-xs-8 level-item">
					<select class="select" id="createUserTimezone" bind:value={$me.timezone}>
						{#each timezones as tz}<option>{tz}</option>{/each}
					</select>
				</div>
			</div>
			<div class="divider" data-content="Slots" />
			<section>
				{#each slots as { start, end }, index (index)}
					<div class="u-flex u-gap-1 u-items-baseline">
						<span class="font-bold">Hours:</span>
						<span>{start}h</span>
						<DualRangeInput min={0} max={24} bind:low={start} bind:high={end} />
						<span>{end}h</span>
						<button
							style="min-width: 3rem"
							class="btn-transparent btn--sm"
							on:click={() => removeSlot(index)}>🗑</button
						>
					</div>
				{:else}
					<div class="toast  u-text-center"><em>No Slots</em></div>
				{/each}
				<button on:click={addSlot}>Add a slot</button>
			</section>
		</section>
		<footer class="modal-footer u-text-center">
			<button on:click={save} class="btn-success">Save</button>
		</footer>
	</article>
</div>
