<script>
	import { fade } from 'svelte/transition';
	import { storeFE } from './store.js';
	export let objAttributes = {};
	
	function removeComponent() {
		$storeFE = $storeFE.filter(function(value, index, arr){ 
			if (value.id != objAttributes.id) return value;
		});
	}
</script>
<li transition:fade> 
	{#if objAttributes.otherattrib}<em>{objAttributes.otherattrib}</em>{/if}
	<button on:click={removeComponent}>x</button>
</li>

<style>
    li{
		display: flex;
		background-color:var(--bg-color);
		border:1px solid var(--border-color);
		list-style:none;
		padding: 3px;
		justify-content: start;
        margin: 2px;
	}
    button{
        justify-content: end;
    }
    em{
        width:95%;
    }
</style>

