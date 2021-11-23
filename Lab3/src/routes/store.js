import { writable } from 'svelte/store';
export let storeFE = writable({});
export let idIncrement = writable({});
export let showSpinner = writable(false);