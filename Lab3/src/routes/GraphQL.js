/*
This is an example snippet - you should consider tailoring it
to your service.
*/

import { showSpinner, showeror } from './store.js';

export function errorHandler() {
	showeror.set(true);
}

export async function fetchGraphQL(operationsDoc, operationName, variables) {
	const result = await fetch(import.meta.env.VITE_API_HTTPS_ENDPOINT, {
		method: 'POST',
		headers: { 'x-hasura-admin-secret': import.meta.env.VITE_API_HASURA_ADMIN_SECRET },
		body: JSON.stringify({
			query: operationsDoc,
			variables: variables,
			operationName: operationName
		})
	});

	return result.json();
}

export const operationsDoc = `
	query MyQuery {
    	Tasks(order_by: {date: asc}) {
      		id
      		taskText
    	}
  	}
`;

export const insert = `
    mutation MyMutation($taskText: String = "") {
    	insert_Tasks_one(object: {taskText: $taskText}) {
      		id
    	}
    }
`;

export const delete_ = `
  mutation MyMutation($_id: uuid) {
    delete_Tasks(where: {id: {_eq: $_id}}) {
      affected_rows
    }
  }
`;
