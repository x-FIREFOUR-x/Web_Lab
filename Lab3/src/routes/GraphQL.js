/*
This is an example snippet - you should consider tailoring it
to your service.
*/

export async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(
      "https://solid-redfish-35.hasura.app/v1/graphql",
      {
        method: "POST",
        headers: {'x-hasura-admin-secret':'SB0Q55wAmCt7FYVliHhmsdOM9zoq3tW3bZifkbo0TcdnyHYjhQRcYDD3MdXGjPlz'},
        body: JSON.stringify({
          query: operationsDoc,
          variables: variables,
          operationName: operationName
        })
      }
    );
  
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
  
  function fetchMyQuery() {
    return fetchGraphQL(
      operationsDoc,
      "MyQuery",
      {}
    );
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
  
  