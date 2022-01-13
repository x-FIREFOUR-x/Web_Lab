<script context="module">
	export const ssr = false;
</script>

<script>
	import formSpinner from '$lib/formSpinner.gif';
	import Todo from './task.svelte';
	import {
		storeFE,
		idtask,
		showSpinner,
		isAuthenticated,
		user,
		token,
		showeror
	} from './store.js';
	import { fetchGraphQL, errorHandler, operationsDoc, insert } from './GraphQL.js';
	import auth from './auth-service';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	window.onload = async () => {
		if (get(isAuthenticated)) {
			downloadTasks();
		}
	};

	token.subscribe(async (tokenValue) => {
		if (tokenValue !== '') {
			downloadTasks();
		}
	});

	let auth0Client;
	onMount(async () => {
		auth0Client = await auth.createClient();
		isAuthenticated.set(await auth0Client.isAuthenticated());
		const accessToken = await auth0Client.getIdTokenClaims();
		if (accessToken) {
			token.set(accessToken.__raw);
			downloadTasks();
		}
		user.set(await auth0Client.getUser());
	});

	function login() {
		auth.loginWithPopup(auth0Client);
	}

	function logout() {
		token.set('');
		auth.logout(auth0Client);
	}

	$storeFE = [];

	function addTask() {
		const input = document.querySelector("input[type='text']");
		let text = input.value;

		if (input.value.trim()) {
			$showSpinner = true;
			fetchGraphQL(insert, 'MyMutation', { taskText: text })
				.then(function (v) {
					idtask.set(v.data.insert_Todo_one.id);
					let size = $storeFE.length;
					$storeFE[size] = { id: $idtask, name: 'task', taskText: text };
					input.value = '';
				})
				.catch(errorHandler)
				.finally(() => {
					$showSpinner = false;
				});
		}
	}

	export function downloadTasks() {
		$showSpinner = true;
		fetchGraphQL(operationsDoc, 'MyQuery')
			.then((data) => {
				storeFE.set(data.data.Todo);
			})
			.catch(errorHandler)
			.finally(() => {
				$showSpinner = false;
			});
	}

	let offline = false;
	window.onoffline = () => {
		offline = true;
	};
	window.ononline = () => {
		offline = false;
	};

	let form;
</script>

{#if offline}
	<h1>Перевірте своє інтернет підключення</h1>
{:else if !offline}
	{#if $isAuthenticated}
		{#if $showeror}
			<h1>Помилка</h1>
		{:else}
			<form id="form" method="post" bind:this={form} on:submit|preventDefault={addTask}>
				<h1>
					<i><u>Завдання</u></i>
				</h1>
				<button on:click={logout}> Вийти з профіля </button>
				<input
					id="add"
					type="text"
					name="nametask"
					maxlength="25"
					placeholder="Введіть ваше завдання"
				/>
				<button type="submit"> Добавити завдання </button>
				<ul id="tasks">
					{#each $storeFE as task (task.id)}
						<svelte:component this={Todo} objAttributes={task} />
					{/each}
				</ul>
			</form>
			{#if $showSpinner}
				<img src={formSpinner} alt="spinner" />
			{/if}
		{/if}
	{:else if !$isAuthenticated}
		<button on:click={login}> Log in </button>
	{/if}
{/if}

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
	img {
		top: 0;
		left: 0;
		position: fixed;
		z-index: 2;
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0;
	}
</style>
