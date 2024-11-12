<script lang="ts">
	type IconWrapperProps = {
		onClicked?: () => void
		children: any
	}
	let { children, onClicked }: IconWrapperProps = $props()
</script>

<button onclick={() => onClicked?.()}>
	{@render children()}
</button>

<style lang="scss">
	button {
		background: transparent;
		border: none;
		outline: none;
		cursor: pointer;
	}
</style>
