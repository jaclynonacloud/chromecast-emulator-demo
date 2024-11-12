<script lang="ts">
	import { onMount } from 'svelte'

	type LoadRequestInputProps = {
		value: string
	}
	let { value = $bindable() }: LoadRequestInputProps = $props()

	let html: string = $state(value)

	let el: HTMLElement | null = $state(null)

	const TAB_UNICODE = '&emsp;'

	let isValid = $state(false)

	/** https://stackoverflow.com/questions/10143904/cleaning-the-json-string-from-special-chars */
	const validateJSONInput = (text: string) => {
		// removing validate for now -- please write good load requests : )
		// return text.replace(/[\u0080-\uFFFF]+/g, '')
		return text
	}

	$effect(() => {
		const sanitizedJSONString = validateJSONInput(html)
		try {
			isValid = !!JSON.parse(sanitizedJSONString)

			if (isValid) {
				value = sanitizedJSONString
			}
		} catch (e) {
			isValid = false
		}
	})

	// ------ Selection Tools
	const insertNodeAtCurrentSelection = (node: Node) => {
		const sel = window.getSelection()
		sel?.getRangeAt(0).insertNode(node)
		sel?.collapseToEnd()
		return node
	}
	const insertTextAtCurrentSelection = (text: string) => {
		const node = document.createElement('span')
		node.innerHTML = text
		return insertNodeAtCurrentSelection(node)
	}

	const offsetCaret = (node: Node, offset: number) => {
		const sel = window.getSelection()
		if (!sel) return

		const range = new Range()
		range.selectNode(node)
		range.setEnd(node, offset)

		sel.removeAllRanges()
		sel.addRange(range)

		sel.collapseToEnd()
	}

	// ------ Input Handling
	const handleInput = async (ev: KeyboardEvent) => {
		if (ev.key === 'Tab') {
			ev.preventDefault()
			ev.stopPropagation()
			insertTextAtCurrentSelection(TAB_UNICODE)
		} else if (ev.key === '{') {
			ev.preventDefault()
			const node = insertTextAtCurrentSelection('{')
			insertTextAtCurrentSelection('}')
			// walk back a step
			offsetCaret(node, 1)
		} else if (ev.key === 'Enter') {
			// add in the correct amount of tabbing
			// first, check last line to see if it ends in a "{"
			let sel = window.getSelection()
			if (!sel) return
			const range = sel.getRangeAt(0)
			if (!range) return

			let hasPreceedingParen = false
			let hasSucceedingParen = false

			const currNode = range.startContainer
			if (currNode) {
				// look behind for "{"
				if (currNode.textContent === '{') hasPreceedingParen = true

				// look ahead for "}"
				const nextNode = currNode.nextSibling
				if (nextNode && nextNode.textContent?.endsWith('')) hasSucceedingParen = true
			}

			// if we have a preceeding parenthesis
			if (hasPreceedingParen && hasSucceedingParen) {
				// add a space between
				const nextNode = currNode.nextSibling
				if (nextNode) {
					nextNode.textContent = '\n' + nextNode.textContent
				}
			}
		}
	}

	onMount(() => {
		html = value
	})
</script>

<div class="load-request-input">
	<pre
		class="load-request-input__input"
		class:valid={isValid}
		contenteditable
		spellcheck={false}
		bind:innerText={html}
		bind:this={el}
		onkeydown={handleInput}></pre>
	{#if !html}
		<div class="load-request-input__placeholder">Write your Load Request Here...</div>
	{/if}
</div>

<style lang="scss">
	.load-request-input {
		position: relative;

		&__input {
			position: relative;
			background: var(--col-obj-primary);
			display: block;
			width: 100%;
			min-height: 200px;
			padding: 0.45rem 0.65rem;
			color: white;
			text-wrap: pretty;
			border: solid 4px var(--col-obj-success);
			border-radius: 0.45rem;
			box-sizing: border-box;
			font-family: 'Quicksand', 'Arial', sans-serif;

			&:not(.valid) {
				border-color: var(--col-obj-error);

				&::after {
					content: 'x';
					position: absolute;
					right: 0.65rem;
					top: 0;
					color: red;
					font-size: 2.2rem;
					pointer-events: none;
					user-select: none;
				}
			}
		}

		&__placeholder {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			color: white;
			opacity: 0.4;
			font-weight: 200;
			pointer-events: none;
			user-select: none;
		}
	}
</style>
