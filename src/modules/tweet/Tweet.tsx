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

/* Interfaces */
interface Props {
    /** If we want to provide an external source of
     * data for this post. Can not be set with post_id
     * not undefined at the same time */
    post_content_override?: PostWithUser,

    /** Make this tweet fetch its own content */
    post_id?: number,
    compose: (reply_to: number | null) => void,
    navigate?: NavigateFunction
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
        this.onClick = this.onClick.bind(this);
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
                        className="hashtag"
                        onClick={(e) => e.stopPropagation()}
                    >{part}</Link>
                );
            } else if (part.startsWith('@')) {
                return (
                    <Link
                        to={`/user/${part.substring(1)}`}
                        key={index}
                        className="mention"
                        onClick={(e) => e.stopPropagation()}
                    >{part}</Link>
                );
            } else {
                return <span key={index} style={{ opacity: hideDefault === true ? 0 : 1 }} className="default-text">{part}</span>;
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

    render(): React.ReactNode {
        return (
            <div
                className="tweet"
                onClick={this.onClick}
            >
                <TweetSidebar user_id={this.state.post_with_user?.poster_id} />

                <div className="body">
                    <TweetHeader
                        displayname={this.state.post_with_user?.displayname ?? null}
                        handle={this.state.post_with_user?.handle ?? null}
                        user_id={this.state.post_with_user?.poster_id ?? null}
                    />

                    {/* Citation of another post if exists */}
                    {this.state.post_with_user
                        && this.state.post_with_user.citation
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

                    {/* Like, share, reply etc */}
                    {this.state.action_bar_active && <ActionBar
                        post_id={this.state.post_with_user?.id ?? -29}
                        opinions={this.state.opinions}
                        liked={this.state.liked}
                        bookmarked={this.state.bookmarked}
                        toggleLike={this.toggleLike}
                        toggleBookmark={this.toggleBookmark}
                        total_likes={this.state.total_likes}
                        total_replies={this.state.total_replies}
                        reply={this.reply}
                    />}
                </div>
            </div>
        );
    }
}

const TweetWrapper = (props: Props): JSX.Element => {
    const navigate = useNavigate();
    return <Tweet_
        {...props}
        navigate={navigate}
    />
}

export { TweetWrapper as Tweet }
