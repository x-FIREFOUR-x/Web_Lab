<script context="module">
	export const ssr = false;
</script>

<script>
	import formSpinner from '$lib/formSpinner.png';
	import Todo from './task.svelte';
	import { storeFE, idIncrement, showSpinner, showeror, isAuthenticated, user, token } from './store.js';
	import { fetchGraphQL, operationsDoc, insert } from './GraphQL.js';
	import auth from "./auth-service";
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';



	window.onload = async() => {
		if(get(isAuthenticated)){
			downloadTasks()
		}
	};

	token.subscribe(async(tokenValue)=>{
		if(tokenValue !== ""){
			downloadTasks()
		}
	});

	let auth0Client;
	onMount(async () =>{
		auth0Client = await auth.createClient();
		isAuthenticated.set(await auth0Client.isAuthenticated());
		const accessToken = await auth0Client.getIdTokenClaims();
		if(accessToken){
			token.set(accessToken.__raw);
			downloadTasks();
		}
		user.set(await auth0Client.getUser());
	});

	function login(){
		auth.loginWithPopup(auth0Client);
	}

	function logout(){
		token.set("");
		auth.logout(auth0Client);
	}

	$storeFE = [];
	idIncrement.set(0);

	function addTask() {
		const input = document.querySelector("input[type='text']");
		let text = input.value;

		if (input.value != '') {
			$showSpinner = true;
			var l = fetchGraphQL(insert, 'MyMutation', { taskText: text });

			l.then(function (v) {
				idIncrement.set(v.data.insert_Todo_one.id);
				var size = $storeFE.length;
				$storeFE[size] = { id: $idIncrement, name: 'todo', taskText: text };
				input.value = '';
				$showSpinner = false;
			});
		}
	}

	function downloadTasks() {
		$showSpinner = true;
		let tasks = fetchGraphQL(operationsDoc,"MyQuery").then((data) => {
			console.log(data);
			storeFE.set(data.data.Todo);
		});
		tasks.then(function () {
			$showSpinner = false;
		});
	}

	let offline = false;
	window.onoffline = () => {
		offline= true;
	};
	window.ononline = () => {
		offline = false;
	};

	let form;
</script>
{#if offline}
	<h1> Перевірте своє інтернет підключення</h1>
{:else}
	{#if $isAuthenticated}
		{#if !$showSpinner}
			<form id="form" method="post" bind:this={form} on:submit|preventDefault={addTask}>
				<h1>
					<i><u>Завдання</u></i>
				</h1>
				<button on:click={logout}> Вийти з профіля </button>
				<input id="add" type="text" name="nametask" placeholder="Введіть ваше завдання" />
				<button type="submit"> Добавити завдання </button>
				<ul id="tasks">
					{#each $storeFE as task}
						<svelte:component this={Todo} objAttributes={task} />
					{/each}
				</ul>
			</form>
		{:else if $showSpinner}
			<img src={formSpinner} alt="spinner" />
		{/if}
	{:else}
			<button on:click = {login}> Log in </button>
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
</style>
