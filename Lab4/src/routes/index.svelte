<script context="module">
	export const ssr = false;
</script>

<script>
	let form
</script>

	<form id="form" method="post" bind:this={form} on:submit|preventDefault={addTask}>
		<h1>
			<i><u>Завдання</u></i>
		</h1>
		<input id="add" type="text" name="nametask" placeholder="Введіть ваше завдання" />
		<button type="submit"> Добавити завдання </button>
		<ul id="tasks">
		</ul>
	</form>

<style>
	* {
		margin: 2px;
		--bg-color: white;
		--border-color: black;
		--button-color: rgb(251, 255, 0);
		--button-border-color: rgb(255, 197, 5);
	}
	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		min-width: 100%;
		min-height: 100%;
	}
	h1 {
		background-color: var(--border-list);
		flex-direction: column;
		align-items: center;
	}
	input {
		background-color: var(--bg-color);
		border: 1px solid var(--border-color);
		font-size: 20px;
		padding: 3px;
		min-width: 70%;
		margin: 4px;
	}
	button {
		background-color: var(--button-color);
		border-color: var(--button-border-color);
		min-width: 50%;
		font-size: 15px;
		padding: 3px;
		margin: 4px;
	}
	ul {
		align-items: center;
		text-align: left;
		padding: 0;
		min-width: 100%;
	}
</style>
