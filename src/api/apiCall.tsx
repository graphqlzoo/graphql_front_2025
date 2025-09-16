import TokenStore from './tokenStore';
import { request } from "graphql-request";

export async function apiCall(body : any):Promise<Response | null> {
   const options: RequestInit = {
    method: "POST",
    headers: {
      'Content-Type': 'application/graphql',
      'authorization': `Bearer ${TokenStore.getToken()}`,
    },
  };

  if (body !== undefined && body !== null) {
    options.body = JSON.stringify(body);
  }
  console.log(options);
  try {
    const response = await fetch("http://localhost:4000/graphql", options);
    return response;
  } catch (error) {
    console.error("Network error in apiCall:", error);
    return null;
  }
}

export async function fetchGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const endpoint = "http://localhost:4000/graphql";
  return await request<T>(endpoint, query, variables);
}