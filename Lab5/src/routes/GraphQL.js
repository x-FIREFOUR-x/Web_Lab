/*
This is an example snippet - you should consider tailoring it
to your service.
*/

import { showSpinner, showeror, token } from './store.js';
//import{token} from "..store";
import{get} from "svelte/store";

function errorHandler() {
	showeror.set(true);
  showSpinner.set(false);
}


	//API_URL = import.meta.env.VITE_API_HTTPS_ENDPOINT;

	export async function fetchGraphQL(operationsDoc, operationName, variables) {
		const result = await fetch(import.meta.env.VITE_API_HTTPS_ENDPOINT, {
			method: 'POST',
			body: JSON.stringify({
				query: operationsDoc,
				variables: variables,
				operationName: operationName
			}),
			headers: { 
				Authorization: `Bearer ${get(token)}`,
				//'x-hasura-admin-secret': import.meta.env.VITE_API_HASURA_ADMIN_SECRET 
			},
			
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
  
  mutation MyMutation($_id: Int) {
    delete_Todo(where: {id: {_eq: $_id}}) {
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
