export type Modal = 
    | { type: "publish", replies_to: number | null }
    | { type: "create_opinion", post_id: number };
