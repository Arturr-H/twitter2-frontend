import { Cookie } from "./Cookie";

const BACKEND_URL = "http://127.0.0.1:8080";

type Ok<T> = { ok: true, value: T };
type Err<E> = { ok: false, error: E };
type Result<T, E> = Ok<T> | Err<E>;


function Ok<T>(value: T): Result<T, never> { return { ok: true, value }; }
function Err<E>(error: E): Result<never, E> { return { ok: false, error }; }

/** Returns from backend */
interface ErrorMessage {
    status: string,
    description: string,
}

export class Backend {
    /** Tries to fetch backend and convert response
     * into T, else returning ErrorMessage interface */
    private static async fetch_inner<T>(
        ext: string,
        method?: string,
        auth?: string,
        body?: string
    ): Promise<Result<T, ErrorMessage>> {
        return fetch(BACKEND_URL + ext, {
            method: method ?? "GET",
            body: body,
            headers: {
                "Authorization": "Bearer " + auth,
                "Content-Type": "application/json"
            }
        }).then(async res => {
            if (res.status != 200) {
                const json = await res.json();
                return Err(json as ErrorMessage);
            }else {
                const text = await res.text();
                if (text === "") return Ok(null);

                try {
                    const json = JSON.parse(text);
                    return Ok(json);
                }catch (e) {
                    return Err({
                        description: `Error parsing JSON (${e})`,
                        status: "-1"
                    });
                }
            }
        }).catch(e => {
            return Err({
                description: `Could not fetch backend (${e})`,
                status: "-1"
            });
        })
    }

    /** Send GET request to an endpoint and retrieve data T */
    static async get<T>(ext: string): Promise<Result<T, ErrorMessage>> {
        return this.fetch_inner(ext, "GET")
    }

    /** Send GET request with auth to an endpoint and retrieve data T */
    static async get_auth<T>(ext: string): Promise<Result<T, ErrorMessage>> {
        // Todo cookie return error if not present
        return this.fetch_inner(ext, "GET", Cookie.get("token") ?? "")
    }

    /** Send POST request to an endpoint with JSON body and retrieve data T */
    static async post<T>(ext: string, body: any): Promise<Result<T, ErrorMessage>> {
        let body_ = this.stringifyBody(body);
        if (!body_.ok) { return body_ /* Error message */ };
        return this.fetch_inner<T>(ext, "POST", undefined, body_.value)
    }

    /** Send POST request to an endpoint with auth and JSON body and retrieve data T */
    static async post_auth<T>(ext: string, body: any): Promise<Result<T, ErrorMessage>> {
        let body_ = this.stringifyBody(body);
        if (!body_.ok) { return body_ /* Error message */ };
        // Todo cookie return error if not present
        return this.fetch_inner<T>(ext, "POST", Cookie.get("token") ?? "", body_.value)
    }

    private static stringifyBody(body: any): Result<string, ErrorMessage> {
        let body_stringified;
        try {
            body_stringified = JSON.stringify(body)
        }catch (e) {
            return Err({ status: "-1", description: `${e}` })
        }

        return Ok(body_stringified)
    }
}

