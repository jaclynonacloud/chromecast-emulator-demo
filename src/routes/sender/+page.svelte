<script lang="ts">
	import { browser } from '$app/environment'
	import LoadRequestInput from '$lib/components/LoadRequestInput.svelte'
	import ProgressBar from '$lib/components/ProgressBar.svelte'
	import { DEFAULT_MEDIA, DEFAULT_QUEUED_MEDIA, TemplateLoadRequestEnum } from '$lib/constants'
	import IconWrapper from '$lib/icons/IconWrapper.svelte'
	import MuteIcon from '$lib/icons/MuteIcon.svelte'
	import PauseIcon from '$lib/icons/PauseIcon.svelte'
	import PlayIcon from '$lib/icons/PlayIcon.svelte'
	import ReelIcon from '$lib/icons/ReelIcon.svelte'
	import SeekBack10Icon from '$lib/icons/SeekBack10Icon.svelte'
	import SeekForward10Icon from '$lib/icons/SeekForward10Icon.svelte'
	import SoundIcon from '$lib/icons/SoundIcon.svelte'
	import WobblyCastIcon from '$lib/icons/WobblyCastIcon.svelte'
	import {
		messageConnected,
		messageMediaLoad,
		messageMute,
		messagePause,
		messagePlay,
		messageReady,
		messageSeek,
		messageSkipBack,
		messageSkipForward,
		messageVolume
	} from '$lib/messages'
	import sendMessage from '$lib/sendMessage'
	import { mediaSessionId } from '$lib/store'
	import type {
		GenericMediaMetadata,
		MediaInformation
	} from 'chromecast-caf-receiver/cast.framework.messages'
	import { onDestroy, tick } from 'svelte'

	const CAST_WEBSOCKET_URL: string = 'ws://localhost:8008/v2/ipc'

	const DEFAULT_LOAD_REQUEST = JSON.stringify(DEFAULT_MEDIA, null, 2)

	let ws: WebSocket | null = $state(null)
	let volume: number = $state(50)
	let muted: boolean = $state(false)
	let isConnected: boolean = $state(false)
	let currentTime: number = $state(0)
	let templateLoadRequest = $state(TemplateLoadRequestEnum.BASIC)
	let loadRequest: string = $state(DEFAULT_LOAD_REQUEST)

	type GenericMediaInformation = MediaInformation & { metadata: GenericMediaMetadata }
	// @ts-ignore
	let currentMediaInfo: GenericMediaInformation = $state()
	let { title = '', subtitle = '', images = [] } = $derived(currentMediaInfo?.metadata || {})
	let { duration } = $derived(currentMediaInfo || { duration: 0 })

	// ----------- Assign the WebSocket once we have the browser environment ready
	$effect(() => {
		if (browser && !ws) {
			ws = new WebSocket(CAST_WEBSOCKET_URL)

			ws.addEventListener('open', () =>
				sendMessage(ws, { message: 'Sender is connected! ' + navigator.userAgent, sender: true })
			)

			ws.addEventListener('message', (msg) => {
				const data = JSON.parse(msg.data)

				const { type } = data || {}

				// tell us if we are connected!
				if (
					data.namespace === 'urn:x-cast:com.google.cast.system' &&
					data.data.includes('senderconnected')
				) {
					isConnected = true
				}

				if (type === 'MEDIA_STATUS') {
					// update the media info if it has changed
					const updatedMediaStatus = data.status?.[0]
					const updatedMediaInfo = updatedMediaStatus?.media
					if (updatedMediaInfo) {
						currentMediaInfo = updatedMediaInfo
					}

					// update the media session id if it has changed
					const sessionId = updatedMediaStatus?.mediaSessionId
					if (sessionId && sessionId !== $mediaSessionId) mediaSessionId.set(sessionId)

					if (updatedMediaStatus.currentTime) currentTime = updatedMediaStatus.currentTime
				}
			})
		}
	})

	const handleSenderWarmup = async () => {
		sendMessage(ws, messageReady())
		await tick()
		sendMessage(ws, messageConnected())
	}

	const handleMediaLoad = () => {
		try {
			const mediaInfo = JSON.parse(loadRequest)
			console.log(mediaInfo)
			sendMessage(ws, messageMediaLoad(mediaInfo))
		} catch (e) {
			console.error(e)
		}
	}

	const handleMute = () => {
		muted = !muted
		sendMessage(ws, messageMute(volume, muted))
	}

	const handleTimeUpdate = () => {
		sendMessage(ws, messageSeek(currentTime))
	}

	// ----------- Handle Load Request Template Change
	const handleLoadRequestTemplateChange = (ev: any) => {
		const type = parseInt(ev.target.value || '0')
		switch (type) {
			case TemplateLoadRequestEnum.BASIC:
				loadRequest = JSON.stringify(DEFAULT_MEDIA, null, 2)
				break
			case TemplateLoadRequestEnum.BASIC_QUEUE:
				loadRequest = JSON.stringify(DEFAULT_QUEUED_MEDIA, null, 2)
				console.log('new load request', loadRequest)
				break
		}
	}

	// ----------- Handle CAF Messages
	$effect(() => {
		if (browser) {
		}
	})

	// ----------- Destroy the WebSocket if we kill this page.
	onDestroy(() => {
		if (ws) {
			ws.close()
		}
	})
</script>

<svelte:head>
	<script src="//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"></script>
</svelte:head>
<header>
	<div>
		<div style:color={isConnected ? 'var(--col-obj-success)' : 'white'}>Cast Locally</div>
		<IconWrapper onClicked={handleSenderWarmup}
			><WobblyCastIcon
				--cast-connected={isConnected ? 'var(--col-obj-success)' : 'white'}
			/></IconWrapper
		>
	</div>
	<div>
		<IconWrapper onClicked={handleMediaLoad}><ReelIcon /></IconWrapper>
		<div>Send Load Request</div>
	</div>
</header>

<section class="mini-controller">
	<h2>{@html title || '&nbsp;'}</h2>
	<h3>{@html subtitle || '&nbsp;'}</h3>
	<img src={images?.[0]?.url || 'idle-icon.png'} alt="thumb" />

	<ProgressBar bind:currentTime {duration} {handleTimeUpdate} />

	<div class="controls">
		<div>
			<IconWrapper onClicked={() => sendMessage(ws, messagePlay())}><PlayIcon /></IconWrapper>
			<IconWrapper onClicked={() => sendMessage(ws, messagePause())}><PauseIcon /></IconWrapper>
		</div>

		<div class="seek">
			<IconWrapper onClicked={() => sendMessage(ws, messageSkipBack())}
				><SeekBack10Icon /></IconWrapper
			>
			<IconWrapper onClicked={() => sendMessage(ws, messageSkipForward())}
				><SeekForward10Icon /></IconWrapper
			>
		</div>

		<div class="sound">
			<IconWrapper onClicked={handleMute}>
				{#if muted}
					<MuteIcon />
				{:else}
					<SoundIcon />
				{/if}
			</IconWrapper>
			<input
				type="range"
				bind:value={volume}
				min={0}
				max={100}
				disabled={muted}
				onchange={() => sendMessage(ws, messageVolume(volume))}
			/>
		</div>
	</div>
</section>

<section class="default-requests">
	<h3>Pick from Template:</h3>
	<div>
		<label class:active={templateLoadRequest === TemplateLoadRequestEnum.BASIC}>
			<input
				type="radio"
				value={TemplateLoadRequestEnum.BASIC}
				bind:group={templateLoadRequest}
				onchange={handleLoadRequestTemplateChange}
			/>
			<div>Basic Load Request</div>
		</label>
		<label class:active={templateLoadRequest === TemplateLoadRequestEnum.BASIC_QUEUE}>
			<input
				type="radio"
				value={TemplateLoadRequestEnum.BASIC_QUEUE}
				bind:group={templateLoadRequest}
				onchange={handleLoadRequestTemplateChange}
			/>
			<div>Basic Queue Load Request</div>
		</label>
	</div>
</section>

<LoadRequestInput bind:value={loadRequest} />

<style lang="scss">
	header {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.45rem;
		padding: 0 0 1.45rem;
		margin-top: 1.45rem;
		color: white;

		& > div {
			display: flex;
			align-items: center;
		}
	}

	.mini-controller {
		display: flex;
		flex-flow: column;
		gap: 0.45rem;
		background: var(--col-obj-primary);
		color: white;
		padding: 0.85rem 1.15rem;
		box-sizing: border-box;
		border: solid 1px var(--col-obj-border);
		border-radius: 0.45rem;

		img {
			max-height: 300px;
			object-fit: contain;
		}

		.controls {
			display: grid;
			grid-template-columns: repeat(3, 1fr);

			.seek {
				justify-self: center;
			}

			.sound {
				justify-self: flex-end;
				display: flex;
				align-items: center;
			}
		}
	}

	.default-requests {
		display: flex;
		flex-flow: column;
		gap: 0.45rem;
		padding: 1.45rem 0 0.45rem 0;
		color: white;

		& > div {
			display: flex;
			flex-flow: row wrap;
			align-items: center;
			gap: 0.45rem;

			label {
				display: flex;
				flex-flow: row wrap;
				gap: 0.45rem;
				background: var(--col-obj-primary);
				padding: 0.45rem 0.65rem;
				box-sizing: border-box;
				border: solid 1px var(--col-obj-border);
				border-radius: 0.35rem;

				input {
					display: none;
				}

				&.active {
					background: var(--col-obj-accent);
				}
			}
		}
	}
</style>
