<script>
	import { fetchGraphQL, errorHandler, delete_ } from './GraphQL.js';
	import { storeFE, showSpinner } from './store.js';

	export let objAttributes = {};

	function removeComponent() {
		$showSpinner = true;
		fetchGraphQL(delete_, 'MyMutation', { _id: objAttributes.id })
			.then(function () {
				let indexOfTask = $storeFE.findIndex((task) => task.id === objAttributes.id);
				if (indexOfTask >= 0) {
					$storeFE = [
						...$storeFE.slice(0, indexOfTask),
						...$storeFE.slice(indexOfTask + 1)
					];
				}
			})
			.catch(errorHandler)
			.finally(() => {
				$showSpinner = false;
			});
	}
</script>

<li transition>
	{#if objAttributes.id}<em>{objAttributes.taskText}</em>{/if}
	<button on:click={removeComponent}>x</button>
</li>

<style>
	li {
		display: flex;
		background-color: var(--bg-color);
		border: 1px solid var(--border-color);
		list-style: none;
		padding: 3px;
		justify-content: start;
		margin: 2px;
	}
	button {
		justify-content: end;
	}
	em {
		width: 95%;
	}
</style>
