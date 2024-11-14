<script lang="ts">
	let { children } = $props()
</script>

<section class="sender">
	{@render children()}
</section>

<style lang="scss">
	.sender {
		font-family: 'Quicksand', 'Arial', sans-serif;
		max-width: 1200px;
		padding: 0 1.15rem;
		margin: 0 auto;
	}
</style>
