

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



<div class = "list">
	<div class ="name-list">
		<i><u>Завдання</u></i>
	</div>
	<div class = "writes-list">

	</div>
</div>	




<style>
	 *{

		 margin: 2px;
		 --bg-color: white;
		 --border-color: black;
		 --border-list: #f3f326;

	}

	.list{
		background-color: var(--border-list);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
	}
	.name-list{
		text-align: center;
	}
	
</style>
