/* Imports */
import React from "react";
import "./styles.css";
import { Modal } from "../../Modal";
import { PostWithUser } from "../../modules/tweet/TweetTypes";
import { Backend } from "../../handlers/Backend";
import toast from "react-hot-toast";
import { Tweet_ } from "../../modules/tweet/Tweet";
import { TweetSidebar } from "../../modules/tweet/Sidebar";
import { TweetHeader } from "../../modules/tweet/Header";
import { Opinion, OpinionInterface } from "../../modules/tweet/Opinions";
import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { TicketPlus, X } from "lucide-react";
import { Text } from "../../components/text/Text";

/* Interfaces */
interface Props {
    toggleModal: (open: boolean, modal?: Modal) => void,
    post_id: number,
}
interface State {
    tweet: PostWithUser | null,
    opinions: OpinionInterface[] | null
}

export class CreateOpinion extends React.PureComponent<Props, State> {
    input: React.RefObject<Input> = React.createRef();
    constructor(props: Props) {
        super(props);

        this.state = {
            tweet: null,
            opinions: null
        };

        this.getTweetInfo = this.getTweetInfo.bind(this);
        this.submitOpinion = this.submitOpinion.bind(this);
    }

    async getTweetInfo(): Promise<void> {
        Backend.get_auth<PostWithUser>("/post/id/" + this.props.post_id).then(e => {
            if (e.ok) {
                this.setState({ tweet: e.value });
            } else {
                toast(e.error.description);
            }
        });

        Backend.get_auth<OpinionInterface[]>("/post/opinion/get-opinions/" + this.props.post_id).then(e => {
            if (e.ok) {
                console.log(e.value[0]);
                this.setState({ opinions: e.value });
            } else {
                toast(e.error.description);
            }
        });
    }

    async submitOpinion(): Promise<void> {
        const URL = "/post/opinion/create";
        const input = this.input.current?.value();

        if (input === "") {
            toast("Are you really that speechless?");
            return;
        }else if (input === null) {
            return;
        }

        const response = await Backend.post_auth(URL, {
            post_id: this.props.post_id,
            opinion: input
        });

        if (response.ok) {
            this.setState({ opinions: null }, () => {
                this.getTweetInfo();
            });
            this.input.current?.clear();
        } else {
            toast(response.error.description);
        }
    }

    componentDidMount(): void {
        this.getTweetInfo();

        document.addEventListener("keyup", (e) => {
            if (e.key === "Escape") this.props.toggleModal(false);
        });
        /* Esc */
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.props.toggleModal(false);
        });
    }

    render(): React.ReactNode {
        const tweet = this.state.tweet;

        return (
            <div className="modal-page">
                <div className="row-space publish">
                    <div style={{
                        flexDirection: "row",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}>
                        <TicketPlus color="#fff" strokeWidth={2} />
                        <Text.H3 text="Create Opinion" />
                    </div>

                    <button
                        className="close-button"
                        onClick={() => this.props.toggleModal(false)}
                    >
                        <X strokeWidth={3} size={"0.75rem"} color="#fff" />
                    </button>
                </div>

                {tweet !== null ? <div
                    className="post-reply-container"
                >
                    <div className="tweet">
                        <TweetSidebar user_id={tweet.poster_id} />

                        <div className="body">
                            <TweetHeader
                                created_at={tweet.created_at}
                                displayname={tweet.displayname}
                                handle={tweet.handle}
                                user_id={tweet.poster_id}
                                is_followed={tweet.is_followed}
                            />

                            <div className="content-container quote-highlight">
                                {Tweet_.formatContent(tweet.content)}
                            </div>
                        </div>
                    </div>
                </div> : null}
                
                <div className="modal-container">
                    <div className="all-opinion-container">
                        {this.state.opinions !== null ? 
                        this.state.opinions.map(e => <Opinion
                            post_id={this.props.post_id} {...e}
                            style={{ height: "1.4rem"}} extensive
                        />) : <></>}
                    </div>

                    <div className="submit-row">
                        <Input
                            placeholder="Write your opinion here..."
                            type="text" legendTitle={false}
                            expand ref={this.input}
                        />
                        <Button text="Submit" primary width="25%" onClickAsync={this.submitOpinion} />
                    </div>
                </div>
            </div>
        );
    }
}
