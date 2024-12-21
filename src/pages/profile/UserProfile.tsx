/* Imports */
import React from "react";
import "./styles.css";
import { Feed } from "../../modules/feed/Feed";
import { UserInfo } from "../../modules/tweet/TweetTypes";
import { Backend } from "../../handlers/Backend";
import toast from "react-hot-toast";
import { Button } from "../../components/button/Button";
import { UserMinus, UserPlus } from "lucide-react";

/* Interfaces */
interface Props {
    handle: string,
    compose: (replies_to: number | null) => void
}
interface State {
    user_info: UserInfo | null,
    following: boolean
}

export class UserProfile extends React.PureComponent<Props, State> {
    feed: React.RefObject<Feed> = React.createRef();
    constructor(props: Props) {
        super(props);

        this.state = {
            user_info: null,
            following: false
        }

        this.setHandle = this.setHandle.bind(this);
        this.follow = this.follow.bind(this);
    }

    componentDidMount(): void {
        this.setHandle(this.props.handle);
    }

    /** Called externally to update this page */
    setHandle(handle: string): void {
        Backend.get_auth<UserInfo>("/user/handle/" + handle).then(e => {
            if (e.ok) {
                this.setState({
                    user_info: e.value,
                    following: e.value.is_followed
                });
                this.feed.current?.setFeed("/user/posts/" + e.value.user_id);
            }else {
                toast(e.error.description);
            }
        })
    }

    /** Try toggling follow of user */
    async follow(): Promise<void> {
        await Backend.post_auth("/user/set-following", {
            followee_id: this.state.user_info!.user_id,
            follow: !this.state.following
        }).then(e => {
            if (e.ok) {
                this.setState({ following: !this.state.following });
            }else {
                toast(e.error.description);
            }
        });
    }

    render(): React.ReactNode {
        return (
            this.state.user_info && <React.Fragment>
                <div className="profile-container">
                    <img
                        src={Backend.profileImage(this.state.user_info.user_id)}
                        className="profile-image"
                    />
                    <div className="name-container">
                        <p className="displayname">{this.state.user_info.displayname}</p>
                        <p className="handle"><span>@</span>{this.state.user_info.handle}</p>
                    </div>
                </div>

                <div className="number-info-container">
                    <div className="number-info">
                        <p className="number">{this.state.user_info.followers}</p>
                        <p className="text">Followers</p>
                    </div>
                    <div className="number-info">
                        <p className="number">{this.state.user_info.following}</p>
                        <p className="text">Following</p>
                    </div>

                    <div className="follow-button-container">
                        {this.state.following
                        ? <Button
                            text="Unfollow" primary destructive
                            icon={<UserMinus size={"1rem"} />}
                            onClickAsync={this.follow}
                            width="7rem"
                        />
                        
                        : <Button
                            text="Follow" primary
                            icon={<UserPlus size={"1rem"} />}
                            onClickAsync={this.follow}
                            width="7rem"
                        />}
                    </div>
                </div>

                <Feed
                    title="Posts"
                    compose={this.props.compose}
                    feed={"/user/posts/" + this.state.user_info.user_id}
                    showPostReplies
                    ref={this.feed}
                />
            </React.Fragment>
        );
    }
}
