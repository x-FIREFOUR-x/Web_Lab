/*
This is an example snippet - you should consider tailoring it
to your service.
*/

import { showSpinner, showeror } from './store.js';
function errorHandler() {
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
	}).catch(function (e) {
		console.log('catch works:');
		console.log(e);
		errorHandler();
	});

	return await result.json();
}

export const operationsDoc = `
    query MyQuery {
      Tasks {
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
  query MyQuery {
    __typename
  }
  
  mutation MyMutation($_id: Int) {
    delete_Tasks(where: {id: {_eq: $_id}}) {
      affected_rows
    }
  }
`;

function fetchMyQuery() {
	return fetchGraphQL(operationsDoc, 'MyQuery', {});
}

export default async function startFetchMyQuery() {
	const { errors, data } = await fetchMyQuery();

	if (errors) {
		// handle those errors like a pro
		console.error(errors);
	}

	// do something great with this precious data
	console.log(data);
}
