

<script>
	//import Counter from '$lib/Counter.svelte';
	import formSpinner from '$lib/formSpinner.png';
		let form = {
			reset: () => {}
		}


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
			})
			statusMessage = true;
			//form.reset();
			showSpinner = false;
			formBtnDisable = false;
			e.target.reset();
		}catch(e){
			errorMessage = true;
			showSpinner = false;
			formBtnDisable = false;
			console.log(e);
		}
	}
</script>



<section>


	<form class="contact-form" bind:this={form} on:submit|preventDefault = {contactFormHandler} >
		<input class = "contact-form-input" type="text" name="userName" placeholder="Name" required />
		<input class = "contact-form-input" type="email" name="userEmail" placeholder="Email" required />
		<textarea class="contact-form-message"
				  name="userMessage"
				  cols="30"
				  rows="10"
				  placeholder="Message text"
				  required
		/>

		{#if statusMessage}
			<p class="status-text success">
				Message sent!
				<button class="button class-btn" on:click={resetFormStatus}> &times; </button>
			</p>
		{:else if errorMessage}
			<p class="status-text error">
				Email doesn't exist
				<button class="button class-btn" on:click={resetFormStatus}> &times; </button>
			</p>
		{/if}

		<button class="button contact-form-button" type="submit" disabled={formBtnDisable}>
			{#if showSpinner}
				<img src={formSpinner} alt="spinner" />
			{/if}
			Submit
		</button>
	</form>


</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
