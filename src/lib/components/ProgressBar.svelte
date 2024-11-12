<script lang="ts">
	type ProgressBarProps = {
		currentTime: number
		duration?: number
		handleTimeUpdate: any
	}
	let { currentTime = $bindable(), duration = 0, handleTimeUpdate }: ProgressBarProps = $props()
	let preferredTime = $state(0)
	let isInteracting = $state(false)

	$effect(() => {
		if (!isInteracting) preferredTime = currentTime
	})

	/** https://dev.to/alexparra/js-seconds-to-hh-mm-ss-22o6 */
	const generateTimestamp = (seconds: number): string => {
		const SECONDS_PER_DAY = 86400
		const HOURS_PER_DAY = 24
		const days = Math.floor(seconds / SECONDS_PER_DAY)
		const remainderSeconds = seconds % SECONDS_PER_DAY
		const hms = new Date(remainderSeconds * 1000).toISOString().substring(11, 19)
		return hms.replace(/^(\d+)/, (h) => `${Number(h) + days * HOURS_PER_DAY}`.padStart(2, '0'))
	}

	const handleInteraction = (state: boolean) => (_: any) => (isInteracting = state)
</script>

<svelte:window
	onmouseup={() => {
		if (!isInteracting) return
		isInteracting = false
		currentTime = preferredTime
	}}
/>
<div class="progress-bar">
	<input
		type="range"
		min="0"
		max={duration}
		bind:value={preferredTime}
		onchange={handleTimeUpdate}
		onmousedown={handleInteraction(true)}
	/>
	<div class="timestamps">
		<div>{generateTimestamp(preferredTime)}</div>
		<div>{generateTimestamp(duration)}</div>
	</div>
</div>

<style lang="scss">
	.progress-bar {
		input {
			position: relative;
			width: 100%;
			pointer-events: all;
		}

		.timestamps {
			display: flex;
			justify-content: space-between;
		}
	}
</style>
