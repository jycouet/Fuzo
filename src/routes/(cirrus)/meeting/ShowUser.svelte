<script lang="ts">
	import Date from '$lib/Date.svelte';
	import type { User } from '$lib/User';
	import { me } from '$lib/users';
	import { utcToZonedTime } from 'date-fns-tz';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let user: User;
	export let id: string;
</script>

<div class="modal modal-animated--dropdown" id="user/{id}">
	<a
		href="#home"
		class="modal-overlay close-btn text-transparent"
		aria-label="Close"
		on:click={() => dispatch('close')}>Close</a
	>
	<article class="modal-content">
		<header class="modal-header">
			<h4>{user.name}</h4>
			<p>{user.timezone}</p>
		</header>
		<section class="modal-body u-flex u-gap-0">
			<div class="grid u-gap-1 grid-cols-3">
				<h6 class="grid-c-3 u-text-center font-light">For You</h6>
				{#each user.slots as slot}
					<Date
						class="u-text-right"
						date={utcToZonedTime(slot.start, $me.timezone)}
						format="k'h'"
						timezone={$me.timezone}
					/>
					<span class="u-text-center">&rarr;</span>
					<Date
						class="u-text-left"
						date={utcToZonedTime(slot.end, $me.timezone)}
						format="k'h'"
						timezone={$me.timezone}
					/>
				{/each}
			</div>
			<div class="divider--v" />
			<div class="grid u-gap-1 grid-cols-3 text-info">
				<h6 class="grid-c-3 u-text-center font-light">For {user.name}</h6>
				{#each user.slots as slot}
					<Date
						class="u-text-right"
						date={utcToZonedTime(slot.start, user.timezone)}
						format="k'h'"
						timezone={user.timezone}
					/>
					<span class="u-text-center">&rarr;</span>
					<Date
						class="u-text-left"
						date={utcToZonedTime(slot.end, user.timezone)}
						format="k'h'"
						timezone={user.timezone}
					/>
				{/each}
			</div>
		</section>
		<footer class="modal-footer" />
	</article>
</div>
