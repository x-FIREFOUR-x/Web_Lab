<script>

	import formSpinner from '$lib/formSpinner.png';
	import Task from './task.svelte';
	import { storeFE, idIncrement } from './store.js';

	$storeFE = [];
	idIncrement.set(0);	
	function addTask(){
		var l = $storeFE.length;

		const input = document.querySelector("input[type='text']"); 
		let texttask = input.value;
		if (input.value != "")
		{
			$storeFE[l] = {id:$idIncrement, name: 'todo',
			otherattrib:texttask};
			$idIncrement++;
			input.value = "";
		}
	}

	let form = {
		reset: () => {}
	}

	let textError = "";
	let showSpinner = false;
	let statusMessage = false;
	let errorMessage = false;
	let formBtnDisable = false;

	function resetFormStatus(){
		statusMessage = false;
		errorMessage = false;
		formBtnDisable = false;
	}
	
	let FormHandler = async (e) =>{
		formBtnDisable = true;
		showSpinner = true;
		statusMessage = false;
		
		try{
			await fetch('/api/sendmail',{
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData),
				method: 'POST'
			}).then((res) => {
				if(res.status >= 200 && res.status < 300){
					return res;
				}
				else{
					throw res;
				}
			})
			statusMessage = true;
			//form.reset();
			showSpinner = false;
			formBtnDisable = false;
			e.target.reset();
		}catch(e){
			if (e.status >= 500){
				textError = "Error Server";
			}
			else if(e.status === 400)
			{
				textError = "Empty email message!";
			}
			else if(e.status === 429)
			{
				textError = "Send too many mail";
			}
			statusMessage = false;
			errorMessage = true;
			showSpinner = false;
			formBtnDisable = false;
			console.log(e);
		}
	}
</script>


<form id ="form" method="post" bind:this={form} on:submit|preventDefault={FormHandler}>
	<h1>
		<i><u>Завдання</u></i>
	</h1>
	<input id="add" type = "text" name="nametask" placeholder="Введіть ваше завдання" >
	<button on:click={addTask} type="submit">
		Добавити завдання
	</button>
	<ul id="tasks">
		{#each $storeFE as task}
			<svelte:component this={Task} objAttributes={task}/>
		{/each}
	</ul>
</form>
	
	




<style>
	 *{
		 margin: 2px;
		 --bg-color: white;
		 --border-color: black;
		 --button-color: rgb(251, 255, 0);
		 --button-border-color: rgb(255, 197, 5);

	}
	form{
		display: flex;
		flex-direction:column ;
		justify-content: center;
		align-items: center;
		text-align: center;
		min-width: 100%;
		min-height: 100%;
	}
	h1{
		background-color: var(--border-list);
		flex-direction: column;
		align-items: center;
		
	}
	input {
		background-color:var(--bg-color);
		border:1px solid var(--border-color);
		font-size: 20px;
		padding: 3px;
		min-width: 70%;
		margin: 4px;
	}
	button{
		background-color: var(--button-color);
		border-color: var(--button-border-color);
		min-width: 50%;
		font-size: 15px;
		padding: 3px;
		margin: 4px;
	}
	ul{
		align-items: center;
		text-align: left;
		padding: 0;
		min-width: 100%;
		
	}
	
</style>
