export interface Post {
    id: number,
    content: string,
    total_likes: number,
    total_replies: number,
    poster_id: number,
    replies_to: number | null,

    citation: PostCitation | null,
    created_at: number
}
export interface PostWithUser {
    id: number,
    content: string,
    total_likes: number,
    total_replies: number,
    replies_to: number | null,
    created_at: number,
    
    citation: PostCitation | null,

    poster_id: number,
    handle: string,
    displayname: string

    liked: boolean,
    bookmarked: boolean,
}
export interface UserInfo {
    handle: string,
    displayname: string,
    user_id: number
}
export interface PostMetadata {
    /** If the user which is viewing
     * the post has it liked */
    liked: boolean,
    bookmarked: boolean,
}
export interface PostCitation {
    content_slice: string,
    beginning: number,
    end: number,
    ellipsis_left: boolean,
    ellipsis_right: boolean,
    post_id: number,
    displayname: string,
    handle: string,
    user_id: number,
}

