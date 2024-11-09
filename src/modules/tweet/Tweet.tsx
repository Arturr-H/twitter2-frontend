/* Imports */
import React from "react";
import "./styles.css";
import { Backend } from "../../handlers/Backend";
import toast from "react-hot-toast";
import { PostWithUser } from "./TweetTypes";
import { ActionBar } from "./ActionBar";
import { TweetHeader } from "./Header";
import { TweetSidebar } from "./Sidebar";
import { TweetQuote } from "./TweetQuote";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { Text } from "../../components/text/Text";
import { OpinionInterface } from "./Opinions";
import { Cookie } from "../../handlers/Cookie";

/* Constants */
const MAX_REPLY_NESTING = 1;

/* Interfaces */
interface Props {
    /** If we want to provide an external source of
     * data for this post. Can not be set with post_id
     * not undefined at the same time */
    post_content_override?: PostWithUser,

    /** Make this tweet fetch its own content */
    post_id?: number,
    compose: (reply_to: number | null) => void,
    navigate?: NavigateFunction,

    /** If this post should be scaled down
     * and not show the action bar */
    reply_view?: true,
    show_reply?: true,
    nest_level?: number
}
interface State {
    liked: boolean,
    bookmarked: boolean,
    total_likes: number,
    total_replies: number,
    opinions: OpinionInterface[],
    action_bar_active: boolean,
    post_with_user: PostWithUser | null
}

export class Tweet_ extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.toggleLike = this.toggleLike.bind(this);
        this.isOwner = this.isOwner.bind(this);
        this.onClick = this.onClick.bind(this);
        this.delete = this.delete.bind(this);
        this.reply = this.reply.bind(this);

        this.state = {
            action_bar_active: false, liked: false,
            bookmarked: false, total_likes: 0, total_replies: 0,
            opinions: [],
            post_with_user: null
        }
    }

    /* Initialize */
    componentDidMount(): void {
        this.setPostContent();
    }

    /** Sets from override external content or fetches */
    async setPostContent(): Promise<void> {
        let { post_id, post_content_override } = this.props;
        if (post_id !== undefined && post_content_override !== undefined) {
            throw new Error("Can't set both post_id and post_content_override for Tweet ");
        }else {
            /* Fetch */
            if (post_id !== undefined) {
                let post_with_user
                    = await Tweet_.fetchContent(post_id);
                let  { liked, bookmarked, total_likes, total_replies }
                    = post_with_user;

                this.setState({
                    liked, bookmarked, total_likes, total_replies,
                    opinions: await Tweet_.getOpinions(post_id),
                    action_bar_active: true, post_with_user
                });
            }
            /* External input */
            else if (post_content_override !== undefined) {
                let { liked, bookmarked, total_likes, total_replies, id }
                    = post_content_override;
                this.setState({
                    liked, bookmarked, total_likes, total_replies,
                    opinions: await Tweet_.getOpinions(id),
                    action_bar_active: true,
                    post_with_user: post_content_override
                })
            }

            /* Nothing provided */
            else {
                throw new Error("No content provided for post")
            }
        }
    }

    /** Returns a list of opinions */
    public static async getOpinions(_post_id: number): Promise<OpinionInterface[]> {
        return []
        // return Backend.get_auth<OpinionInterface[]>("/post/opinion/get-opinions/" + post_id).then(e => {
        //     if (e.ok) {
        //         return e.value;
        //     }else {
        //         toast(e.error.description);
        //         return []
        //     }
        // }).catch(e => {
        //     toast(e);
        //     return []
        // });
    }

    /** Fetch tweet content */
    public static async fetchContent(post_id: number): Promise<PostWithUser> {
        return Backend.get_auth<PostWithUser>("/post/id/" + post_id).then(async e => {
            if (e.ok) {
                return e.value;
            }else {
                toast(e.error.description);
                throw `Could not fetch /post/id/${post_id} ${e.error.description}`;
            }
        }).catch(e => {
            throw `Error fetching /post/id/${post_id} ${e.error.description}`;
        })
    }

    /** Highlights #hashtags and @mentions */
    public static formatContent(content: string, hideDefault?: boolean): JSX.Element[] {
        const regex = /(#\w+|@\w+)/g;
        const parts = content.split(regex);

        return parts.map((part, index) => {
            if (part.startsWith('#')) {
                return (
                    <Link
                        to={`/hashtag/${part.substring(1)}`}
                        key={index}
                        className="hashtag btext"
                        onClick={(e) => e.stopPropagation()}
                    >{part}</Link>
                );
            } else if (part.startsWith('@')) {
                return (
                    <Link
                        to={`/user/${part.substring(1)}`}
                        key={index}
                        className="mention btext"
                        onClick={(e) => e.stopPropagation()}
                    >{part}</Link>
                );
            } else {
                return <span key={index} style={{ opacity: hideDefault === true ? 0 : 1 }} className="default-text btext">{part}</span>;
            }
        });
    }

    /** Toggle liked (send fetch req) */
    toggleLike(): void {
        if (!this.state.post_with_user) return;
        let like = !this.state.liked;
        Backend.post_auth("/post/set-like", {
            to: like, post_id: this.state.post_with_user.id
        }).then(e => { if (!e.ok) { toast(e.error.description); } })
        this.setState({ liked: !this.state.liked })
    }

    /** Toggle bookmarked (send fetch req) */
    toggleBookmark(): void {
        if (!this.state.post_with_user) return;
        let bookmark = !this.state.bookmarked;
        Backend.post_auth("/post/set-bookmark", {
            to: bookmark, post_id: this.state.post_with_user.id
        }).then(e => { if (!e.ok) { toast(e.error.description); } })
        this.setState({ bookmarked: !this.state.bookmarked })
    }

    /** Delete post */
    delete(): void {
        if (!this.state.post_with_user) return;
        Backend.post_auth("/post/delete", {
            post_id: this.state.post_with_user.id
        }).then(e => {
            if (e.ok) {
                toast("Post deleted");
                this.setState({ post_with_user: null });
            }else{
                toast(e.error.description);
            }
        })
    }

    /** When we press reply in the action bar */
    reply(): void {
        if (!this.state.post_with_user) return;
        this.props.compose(this.state.post_with_user.id);
    }

    /** Navigate to post */
    onClick(e: React.MouseEvent): void {
        e.stopPropagation();
        e.preventDefault();
        if (this.state.post_with_user && this.props.navigate) {
            const TO = "/post/" + this.state.post_with_user?.id;
            this.props.navigate(TO)
        }
    }

    /** If the user is the owner of this post */
    isOwner(): boolean {
        let id = Cookie.get("user_id");
        if (!id || !this.state.post_with_user) return false;
        return this.state.post_with_user.poster_id === parseInt(id);
    }
    
    render(): React.ReactNode {
        return (
            <div
                className={`tweet ${this.props.reply_view ? "reply-view" : ""}`}
                onClick={this.onClick}
            >
                <TweetSidebar
                    user_id={this.state.post_with_user?.poster_id}
                    handle={this.state.post_with_user?.handle}
                />

                <div className="body">
                    <TweetHeader
                        displayname={this.state.post_with_user?.displayname ?? null}
                        handle={this.state.post_with_user?.handle ?? null}
                        user_id={this.state.post_with_user?.poster_id ?? null}
                        created_at={this.state.post_with_user?.created_at ?? null}
                    />

                    {/* Citation of another post if exists */}
                    {this.state.post_with_user
                        && this.state.post_with_user.citation
                        && (this.props.nest_level ?? 0) < MAX_REPLY_NESTING
                        && <Link
                            onClick={(e) => e.stopPropagation()}
                            to={"/post/" + this.state.post_with_user.citation.post_id}
                            style={{ textDecoration: "none" }}
                        >
                            <TweetQuote
                                citation={this.state.post_with_user.citation}
                            />
                        </Link>}

                    {/* Content of post */}
                    <div className="content-container">
                        {this.state.post_with_user !== null 
                            ? Tweet_.formatContent(this.state.post_with_user.content)
                            : <Text.PSkeletalSentence lengths={[6, 4, 10, 8, 9]} />}
                    </div>


                    {/* Reply to another post if exists */}
                    {this.state.post_with_user
                        && this.state.post_with_user.replies_to
                        && !this.state.post_with_user.citation
                        && this.props.show_reply
                        && (this.props.nest_level ?? 0) < MAX_REPLY_NESTING
                        && <Link
                            onClick={(e) => e.stopPropagation()}
                            to={"/post/" + this.state.post_with_user.replies_to}
                            style={{ textDecoration: "none" }}
                        >
                        <TweetWrapper
                            post_id={this.state.post_with_user.replies_to}
                            compose={this.props.compose}
                            reply_view
                            nest_level={(this.props.nest_level ?? 0) + 1}
                        />
                    </Link>}

                    {/* Like, share, reply etc */}
                    {this.state.action_bar_active
                    && !this.props.reply_view
                    && <ActionBar
                        post_id={this.state.post_with_user?.id ?? -29}
                        opinions={this.state.opinions}
                        liked={this.state.liked}
                        bookmarked={this.state.bookmarked}
                        toggleLike={this.toggleLike}
                        toggleBookmark={this.toggleBookmark}
                        total_likes={this.state.total_likes}
                        total_replies={this.state.total_replies}
                        reply={this.reply}
                        delete={this.delete}
                        copyText={() => {
                            if (this.state.post_with_user) {
                                navigator.clipboard.writeText(this.state.post_with_user.content);
                            }
                        }}
                        isOwner={this.isOwner()}
                    />}
                </div>
            </div>
        );
    }
}

interface WrapperProps {
    refDrill?: React.RefObject<Tweet_>
}
const TweetWrapper = (props: Props & WrapperProps): JSX.Element => {
    const navigate = useNavigate();
    return <Tweet_
        {...props}
        ref={props.refDrill}
        navigate={navigate}
        nest_level={props.nest_level ?? 0}
    />
}

export { TweetWrapper as Tweet }
