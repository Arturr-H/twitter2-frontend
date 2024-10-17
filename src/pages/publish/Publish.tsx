/* Imports */
import React from "react";
import "./styles.css";
import { Text } from "../../components/text/Text";
import { Button } from "../../components/button/Button";
import { Check, PaintbrushIcon, Quote, Reply, X } from "lucide-react";
import { Backend } from "../../handlers/Backend";
import toast from "react-hot-toast";
import { Tweet_ } from "../../modules/tweet/Tweet";
import { PostCitation, PostWithUser } from "../../modules/tweet/TweetTypes";
import { TweetSidebar } from "../../modules/tweet/Sidebar";
import { TweetHeader } from "../../modules/tweet/Header";
import { TweetQuote } from "../../modules/tweet/TweetQuote";

/* Interfaces */
interface Props {
    close: () => void,
    replies_to: number | null
}
interface State {
    text: string,
    reply_to_post: PostWithUser | null,
    quoting: boolean,
    quote: PostCitation | null
}

export class Publish extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            text: "",
            reply_to_post: null,
            quoting: false,
            quote: null
        };

        this.toggleQuoting = this.toggleQuoting.bind(this);
        this.removeQuote = this.removeQuote.bind(this);
        this.trySetQuote = this.trySetQuote.bind(this);
        this.stopQuoting = this.stopQuoting.bind(this);
        this.publish = this.publish.bind(this);
    }

    /* If we want to reply to a tweet, we'll
        display that tweet above the compose 
        section */
    async tryDisplayReply(): Promise<void> {
        let reply_id = this.props.replies_to;
        if (reply_id === null) return;

        Backend.get_auth<PostWithUser>("/post/id/" + reply_id).then(e => {
            if (e.ok) {
                this.setState({ reply_to_post: e.value });
            } else {
                toast(e.error.description);
            }
        })
    }

    /** Try publish */
    async publish(): Promise<void> {
        if (this.state.text === "") {
            toast("Are you really that speechless?");
            return;
        }
        let response = await Backend.post_auth<undefined>("/post/publish", {
            content: this.state.text,
            replies_to: this.props.replies_to ?? undefined,
            citation: this.state.quote
        });

        if (response.ok) {
            this.props.close();
        } else {
            toast(response.error.description)
        }
    }

    componentDidMount(): void {
        this.tryDisplayReply();

        document.addEventListener("mouseup", this.trySetQuote)
        document.addEventListener("keyup", (e) => {
            if (e.key === "Escape") this.stopQuoting();
        })
    }

    /** Enables / disables the "quoting" mode
     * where you can select a part of the post
     * you are replying to for "quoting" */
    toggleQuoting(): void {
        let quoting = !this.state.quoting;
        if (!quoting) {
            this.stopQuoting();
        }else {
            this.setState({ quoting });
        }
    }
    stopQuoting(): void {
        this.setState({ quoting: false });
        this.clearTextSelection();
    }

    clearTextSelection(): void {
        if (window.getSelection) {
            let w = window.getSelection();
            if (w && w.empty) {
                w.empty();
            } else if (w && w.removeAllRanges) {
                w.removeAllRanges();
            }
        }
        /* @ts-ignore */
        else if (document.selection) {
            /* @ts-ignore */
            document.selection.empty();
        }
    }

    /** Gets the selected text used for quoting */
    getSelectionText(): string {
        let text = "";
        let windowSelection = window.getSelection();
        if (windowSelection) {
            text = windowSelection.toString();
        }
        /* @ts-ignore */
        else if (document.selection && document.selection.type != "Control") {
            /* @ts-ignore */
            text = document.selection.createRange().text;
        }

        return text;
    }

    /** Tries to set the quote */
    trySetQuote(): void {
        let quote = this.getSelectionText();
        let reply_content = this.state.reply_to_post?.post.content;
        if (quote !== "" && reply_content && reply_content.includes(quote)) {
            let start_ref = reply_content.indexOf(quote);
            let end_ref = start_ref + quote.length;
            this.setState({ quote: this.generateCitation(reply_content, start_ref, end_ref) })
        }
    }

    generateCitation(
        content: string,
        start_ref: number, end_ref: number,
    ): PostCitation {
        if (this.state.reply_to_post === null) {
            toast("Can't find post to reply to");
            throw "Can't find post"
        }

        const REFERENCE_PADDING = 15;
        let start_slice_index = Math.max(start_ref - REFERENCE_PADDING, 0);
        let end_slice_index = Math.min(end_ref + REFERENCE_PADDING, content.length);
        let beginning = REFERENCE_PADDING - Math.max(REFERENCE_PADDING - start_ref, 0);
        let end = beginning + end_ref - start_ref;
        let content_slice = content.slice(start_slice_index, end_slice_index);
        let ellipsis_left = false;
        let ellipsis_right = false;

        if (start_ref >= REFERENCE_PADDING + 1) {
            ellipsis_left = true;
        } if (end_ref + REFERENCE_PADDING < content.length) {
            ellipsis_right = true;
        }

        return {
            content_slice: content_slice,
            beginning,
            end,
            ellipsis_right,
            ellipsis_left,
            post_id: this.state.reply_to_post.post.id,
            displayname: this.state.reply_to_post.user.displayname,
            handle: this.state.reply_to_post.user.handle,
            user_id: this.state.reply_to_post.post.poster_id,
        }
    }

    removeQuote(): void {
        this.stopQuoting();
        this.setState({
            quote: null
        });
    }

    render(): React.ReactNode {
        return (
            <div className="publish-page">
                <div className="row-space publish">
                    <div style={{
                        flexDirection: "row",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        zIndex: this.state.quoting ? 50 : "inherit"
                    }}>
                        {this.props.replies_to !== null ? <>
                            <Reply color="#fff" strokeWidth={2} />
                            <Text.H3 text="Reply" />
                            <div />
                            {this.state.quoting && <Text.P text="  Select the specific part you want to quote" />}
                        </> : <>
                            <PaintbrushIcon color="#fff" strokeWidth={2} />
                            <Text.H3 text="Compose" />
                        </>}
                    </div>

                    <button
                        className="close-button"
                        onClick={this.props.close}
                    >
                        <X strokeWidth={3} size={16} color="#fff" />
                    </button>
                </div>

                {/* If this tweet item is used as the tweet above
                the compose section when replying to someone
                (Disables action bar etc) */}
                {this.state.reply_to_post !== null ? <div
                    className="post-reply-container"
                    style={{
                        zIndex: this.state.quoting ? 50 : "inherit"
                    }}
                >
                    <div className="tweet">
                        <TweetSidebar />

                        <div className="body">
                            <TweetHeader
                                displayname={this.state.reply_to_post.user.displayname}
                                handle={this.state.reply_to_post.user.handle}
                                user_id={this.state.reply_to_post.post.poster_id}
                            />

                            {this.state.reply_to_post.post.citation && <TweetQuote
                                citation={this.state.reply_to_post.post.citation}
                            />}

                            <div className="content-container quote-highlight">
                                {Tweet_.formatContent(this.state.reply_to_post.post.content)}
                            </div>
                        </div>

                        {/* Enable "Quote mode" button */}
                        <button
                            className={"quote-button " + (this.state.quoting ? " disabled" : "")}
                            title="Quote a certain part of the tweet you are replying to"
                            onClick={this.toggleQuoting}
                        >
                            {this.state.quoting
                                ? <Check color="#fff" />
                                : <Quote color="#fff" />}
                        </button>
                    </div>
                </div> : null}

                <div className="publish-container">
                    <div className="publish-tweet">
                        <div className="sidebar">
                            <div className="profile-image"></div>
                        </div>
                        <div className="body">
                            <div className="header">
                                <p className="displayname">Artur Hoffsümmer</p>
                                <p className="handle">~artur</p>
                            </div>

                            {/* The quote (if we have selected one) */}
                            {this.state.quote && <TweetQuote
                                removeQuote={this.removeQuote}
                                citation={this.state.quote}
                            />}

                            {/* Post content input */}
                            <textarea
                                placeholder="What's on your mind?"
                                onChange={(e: any) => this.setState({ text: e.currentTarget.value })}
                                value={this.state.text}
                                autoFocus={true}
                            />
                        </div>
                    </div>

                    <Button text="Publish" primary expand onClickAsync={this.publish} />
                </div>


                {this.state.quoting ? <div
                    onClick={this.stopQuoting}
                    className="quoting-background"
                ></div> : null}
            </div>
        );
    }
}
