<script>
	import formSpinner from '$lib/formSpinner.png';
	let form = {
		reset: () => {}
	};

	let textError = '';
	let showSpinner = false;
	let statusMessage = false;
	let formBtnDisable = false;
	function resetFormStatus() {
		statusMessage = false;
		formBtnDisable = false;
	}
	let contactFormHandler = async (e) => {
		formBtnDisable = true;
		showSpinner = true;
		statusMessage = false;
		const referrerVal = document.referrer;
		let formData = { referrer: referrerVal };
		Array.from(form.elements)
			.filter((e) => e.tagName !== 'BUTTON')
			.forEach((e) => {
				formData[e.name] = e.value;
			});

		try {
			await fetch('/api/sendmail', {
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData),
				method: 'POST'
			}).then((res) => {
				if (res.ok) {
					return res;
				}
				throw res;
			});
			statusMessage = true;
			e.target.reset();
		} catch (e) {
			if (e.status >= 500) {
				textError = 'Error Server';
			} else if (e.status === 400) {
				textError = 'Empty email message!';
			} else if (e.status === 429) {
				textError = 'Send too many mail';
			}
			statusMessage = false;
			console.log(e);
		} finally {
			showSpinner = false;
			formBtnDisable = false;
		}
	};
</script>

<form class="contact-form" bind:this={form} on:submit|preventDefault={contactFormHandler}>
	<input class="contact-form-input" type="text" name="userName" placeholder="Name" required />
	<input class="contact-form-input" type="email" name="userEmail" placeholder="Email" required />
	<textarea
		class="contact-form-message"
		name="userMessage"
		cols="30"
		rows="10"
		placeholder="Message text"
		required
	/>

	<button class="button contact-form-button" type="submit" disabled={formBtnDisable}>
		{#if showSpinner}
			<img src={formSpinner} alt="spinner" />
		{:else if true}
			Send
		{/if}
	</button>

	{#if statusMessage}
		<p class="status-text success">
			Message sent!
			<button class="button class-btn" on:click={resetFormStatus}> &times; </button>
		</p>
	{:else if textError != ""}
		<p class="status-text error">
			{textError}
			<button class="button class-btn" on:click={resetFormStatus}> &times; </button>
		</p>
	{/if}
</form>

<style>
	* {
		margin: 0;
		--bg-color: white;
		--border-color: black;
	}
	form {
		height: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
	.contact-form-input {
		height: 5%;
		width: 25%;
	}
	button {
		padding: 0;
	}
	textarea {
		width: 25%;
		height: 40%;
	}
	p {
		background: var(--bg-color);
		border: 1px solid;
		border-color: var(--border-color);
	}
	img {
		width: 100%;
		height: 100%;
	}
</style>
