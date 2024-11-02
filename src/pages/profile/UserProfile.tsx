/* Imports */
import React from "react";
import "./styles.css";
import { Feed } from "../../modules/feed/Feed";
import { UserInfo } from "../../modules/tweet/TweetTypes";
import { Backend } from "../../handlers/Backend";
import toast from "react-hot-toast";

/* Interfaces */
interface Props {
    handle: string,
    compose: (replies_to: number | null) => void
}
interface State {
    user_info: UserInfo | null
}

export class UserProfile extends React.PureComponent<Props, State> {
    feed: React.RefObject<Feed> = React.createRef();
    constructor(props: Props) {
        super(props);

        this.state = {
            user_info: null
        }

        this.setHandle = this.setHandle.bind(this);
    }

    componentDidMount(): void {
        this.setHandle(this.props.handle);
    }

    /** Called externally to update this page */
    setHandle(handle: string): void {
        Backend.get_auth<UserInfo>("/user/handle/" + handle).then(e => {
            if (e.ok) {
                this.setState({ user_info: e.value });
                this.feed.current?.setFeed("/user/posts/" + e.value.user_id);
            }else {
                toast(e.error.description);
            }
        })
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
