
export const api_endpoint='http://localhost:9080/';

export function api_get(what, fetchArgs={}) {
	fetchArgs.method = "GET";
	return fetch(api_endpoint+what, fetchArgs).then((r)=>r.json());
}
