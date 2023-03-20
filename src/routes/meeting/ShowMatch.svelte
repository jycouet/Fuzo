<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Date from '$lib/Date.svelte';
	import { me } from '$lib/users';
	import type { UTCSlot, User } from '$lib/User';
	import { utcToZonedTime } from 'date-fns-tz';
	const dispatch = createEventDispatcher();
	export let slots: Array<UTCSlot> = [];
	export let others: Array<User> = [];
	let selected: User | undefined = undefined;
</script>

<div class="modal modal-animated--dropdown" id="matching">
	<a
		href="#home"
		class="modal-overlay close-btn  text-transparent"
		aria-label="Close"
		on:click={() => dispatch('close')}>Close</a
	>
	<article class="modal-content">
		<header class="modal-header">
			<h4>Matches</h4>
			<p>Slot that match everyone</p>
		</header>
		<section class="modal-body u-flex u-gap-1">
			<div class="grid u-gap-1 grid-cols-3 u-basis-100p">
				<h6 class="grid-c-3 u-text-center font-light">For You</h6>
				{#each slots as slot}
					<Date
						class="u-text-right"
						date={utcToZonedTime(slot.start, $me.timezone)}
						timezone={$me.timezone}
						format="k'h'"
					/>
					<span class="u-text-center">&rarr;</span>
					<Date
						class="u-text-left"
						date={utcToZonedTime(slot.end, $me.timezone)}
						timezone={$me.timezone}
						format="k'h'"
					/>
				{/each}
			</div>
			<div class="divider--v" />
			<div class="grid u-gap-1 grid-cols-3 text-info u-basis-100p">
				<h6
					class="grid-c-3 u-text-center font-light u-items-baseline u-flex u-flex-nowrap u-justify-center"
				>
					For
					<span>&nbsp;</span>
					<select
						bind:value={selected}
						class="select u-inline-block u-border-0 p-0 w-auto"
						style="font-size: inherit; padding-right: 2.2rem!important;"
					>
						{#each others as user}<option>{user}</option>{/each}
					</select>
				</h6>
				{#if selected}
					{#each slots as slot}
						<Date
							class="u-text-right"
							date={utcToZonedTime(slot.start, selected.timezone)}
							timezone={selected.timezone}
							format="k'h'"
						/>
						<span class="u-text-center">&rarr;</span>
						<Date
							class="u-text-left"
							date={utcToZonedTime(slot.end, selected.timezone)}
							timezone={selected.timezone}
							format="k'h'"
						/>
					{/each}
				{/if}
			</div>
		</section>
	</article>
</div>
