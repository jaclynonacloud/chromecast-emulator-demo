<script lang="ts">
	let { children } = $props()
</script>

<section class="sender">
	{@render children()}
</section>

<style lang="scss">
	:root {
		--col-obj-background: black;
		--col-obj-primary: rgb(39, 39, 39);
		--col-obj-accent: rgb(39, 101, 143);
		--col-obj-border: rgb(78, 78, 78);
		--col-obj-error: rgb(122, 15, 15);
		--col-obj-success: rgb(63, 226, 98);
	}

	:global(html, body) {
		padding: 0;
		margin: 0;
		min-height: 100svh;
		background: var(--col-obj-background);
		color: white;
	}

	:global(h1, h2, h3) {
		padding: 0;
		margin: 0;
	}

	:global(svg.control) {
		width: 32px;
		height: 32px;
	}

	:global(svg.header) {
		width: 50px;
		height: 50px;
	}
</style>
