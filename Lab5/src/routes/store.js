import { writable, derived } from 'svelte/store';

export let storeFE = writable({});
export let idtask = writable({});
export let showSpinner = writable(false);
export let showeror = writable(false);

export const todos = writable([]);
export const token = writable('');
export const isAuthenticated = writable(false);
export const user = writable({});
export const popupOpen = writable(false);
