<script>

	import formSpinner from '$lib/formSpinner.png';
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
	let contactFormHandler = async (e) =>{
		formBtnDisable = true;
		showSpinner = true;
		statusMessage = false;
		const referrerVal = document.referrer;

		let formData = {

				Mame: form.elements.userName.value,
				Email: form.elements.userEmail.value,
				Message: form.elements.userMessage.value,
				referrer : referrerVal
		}

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


<form id ="form" method="post">
	<h1>
		<i><u>Завдання</u></i>
	</h1>
	<input id="Add" type = "text" placeholder="Введіть ваше завдання"/>
	<button type="submit">
		Добавити завдання
	</button>
	<ul id="todos">
		<li>jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj</li>
		
	</ul>
</form>
	
	




<style>
	 *{
		 margin: 2px;
		 --bg-color: white;
		 --border-color: black;
		 --button-color: rgb(0, 60, 255);
		 --button-border-color: rgb(18, 5, 194);

	}
	form{
		display: flex;
		flex-direction:column ;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
	h1{
		background-color: var(--border-list);
		flex-direction: column;
		align-items: center;
		
	}
	button{
		background-color: var(--button-color);
		border-color: var(--button-border-color);
		min-width: 0%;
	}
	ul{
		justify-content: left;
		align-items: flex-start;
		text-align: left;
		padding: 0;
		min-width: 100%;
		
	}
	li{
		background-color:var(--bg-color);
		border-color: var(--border-color);
		border:0;
		list-style:none;
		padding: 3px;
		font-size: 10px;
	}
</style>
