import { showSpinner, showeror, token } from './store.js';
import { get } from 'svelte/store';

export function errorHandler() {
	showeror.set(true);
	setTimeout(() => showeror.set(false), 1800);
}

export async function fetchGraphQL(operationsDoc, operationName, variables) {
	const result = await fetch(import.meta.env.VITE_API_HTTPS_ENDPOINT, {
		method: 'POST',
		body: JSON.stringify({
			query: operationsDoc,
			variables: variables,
			operationName: operationName
		}),
		headers: {
			Authorization: `Bearer ${get(token)}`
			//'x-hasura-admin-secret': import.meta.env.VITE_API_HASURA_ADMIN_SECRET
		}
	}).catch(function (e) {
		console.log('catch works:');
		console.log(e);
		errorHandler();
	});

	return await result.json();
}

export const operationsDoc = `
    query MyQuery {
      Todo {
        id
        taskText
		user_id
      }
    }
  `;

export const insert = `
  	mutation MyMutation($taskText: String = "") {
    	insert_Todo_one(object: {taskText: $taskText}) {
      		id
    	}
    }
`;

export const delete_ = `
  query MyQuery {
    __typename
  }
  
  mutation MyMutation($_id: uuid) {
    delete_Todo(where: {id: {_eq: $_id}}) {
      affected_rows
    }
  }
`;
