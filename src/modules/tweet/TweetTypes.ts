export interface Post {
    id: number,
    content: string,
    total_likes: number,
    total_replies: number,
    poster_id: number,
    replies_to: number | null,

    citation: PostCitation | null
}
export interface PostUserInfo {
    user_id: number,
    handle: string,
    displayname: string
}
export interface PostWithUser {
    post: Post,
    user: PostUserInfo,
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

