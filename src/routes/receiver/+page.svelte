<script lang="ts">
	import { browser } from '$app/environment'
	import { messageToSender } from '$lib/messages'
	import sendMessage from '$lib/sendMessage'
	import type { CastReceiverContext } from 'chromecast-caf-receiver/cast.framework'
	import type { LoadRequestData } from 'chromecast-caf-receiver/cast.framework.messages'
	import { onDestroy } from 'svelte'

	let castContext: CastReceiverContext | null = $state(null)
	let castAvailable: boolean = $state(false)

	// ----------- Wait for Cast SDK to be available on the browser page
	$effect(() => {
		const waitForCastAvailable = () =>
			setTimeout(() => {
				if (!browser) return
				if (castAvailable) return
				if (!!cast.framework) {
					castAvailable = true
				}

				waitForCastAvailable()
			}, 100)

		waitForCastAvailable()
	})

	// ----------- Start the Chromecast Session once we have the cast object available on the window
	$effect(() => {
		if (castAvailable) {
			castContext = cast.framework.CastReceiverContext.getInstance()
			const options = new cast.framework.CastReceiverOptions()
			options.shakaVersion = '4.9.2'
			options.useShakaForHls = true
			castContext!.start(options)

			castContext
				.getPlayerManager()
				.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, updateLoadRequest)

			castContext
				.getPlayerManager()
				.addEventListener(cast.framework.events.EventType.TIME_UPDATE, (_) => {
					castContext?.getPlayerManager().broadcastStatus(true)
				})
		}
	})

	// ----------- Update the Load Requests
	const updateLoadRequest = (loadRequest: LoadRequestData) => {
		loadRequest.autoplay = true
		return loadRequest
	}

	// ----------- Destroy the Chromecast Session whenever we kill this page.
	onDestroy(() => {
		if (castContext) {
			castContext.stop()
		}
	})
</script>

<svelte:head>
		<!-- Polyfill and framework need to be loaded in sync, local setup, and Receiver setup need duplication -->
		<script src="/platform-polyfill.js"></script>
		<script defer src="//www.gstatic.com/cast/sdk/libs/caf_receiver/v3/cast_receiver_framework.js"></script>
</svelte:head>
<div class="chromecast-receiver">
	{#if castAvailable}
		<cast-media-player></cast-media-player>
	{:else}
		<div>Loading...</div>
	{/if}
</div>
