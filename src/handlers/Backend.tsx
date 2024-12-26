import { Cookie } from "./Cookie";

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
    static BACKEND_URL: string = "http://localhost:8081";//"https://twitter2-backend.artur.red";

    /** Tries to fetch backend and convert response
     * into T, else returning ErrorMessage interface */
    private static async fetch_inner<T>(
        ext: string,
        method?: string,
        auth?: string,
        body?: string | FormData | Blob,
        skipContentType?: boolean,
    ): Promise<Result<T, ErrorMessage>> {
        let headers = { "Authorization": "Bearer " + auth };

        return fetch(this.BACKEND_URL + ext, {
            method: method ?? "GET",
            body: body,
            headers: skipContentType ? headers : {
                ...headers,
                "Content-Type": "application/json"
            }
        }).then(async res => {
            const text = await res.text();
            if (res.status != 200) {
                try {
                    let json: ErrorMessage = JSON.parse(text);
                    return Err(json);
                }catch(e) {
                    return Err({
                        description: `JSON was NOT returned (${text})`,
                        status: "-1"
                    })
                }
            }else {
                if (text === "") return Ok(null);

                try {
                    const json = JSON.parse(text);
                    return Ok(json);
                }catch (e) {
                    return Err({
                        description: `Error parsing JSON (text: ${text})`,
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

    /** Send POST request to an endpoint with auth and form body and retrieve data T */
    static async post_infer_content_type_auth<T>(ext: string, body: FormData): Promise<Result<T, ErrorMessage>> {
        // Todo cookie return error if not present
        return this.fetch_inner<T>(ext, "POST", Cookie.get("token") ?? "", body, true)
    }

    /** Get the URL for some user's profile image */
    static profileImage(user_id: number | undefined | null): string {
        return Backend.BACKEND_URL
            + "/user/profile-image/"
            + (typeof user_id === "number" ? user_id : -1);
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

