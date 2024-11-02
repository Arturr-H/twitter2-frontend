/* Imports */
import React, { RefObject } from "react";
import "./styles.css";
import { Feed } from "../../modules/feed/Feed";
import { UserInfo } from "../../modules/tweet/TweetTypes";
import { Backend } from "../../handlers/Backend";
import toast from "react-hot-toast";
import { Button } from "../../components/button/Button";

/* Interfaces */
interface Props {
    compose: (replies_to: number | null) => void
}
interface State {
    user_info: UserInfo | null,
    profileImageURL?: string
}

export class SelfProfile extends React.PureComponent<Props, State> {
    fileInputRef: RefObject<HTMLInputElement> = React.createRef();
    constructor(props: Props) {
        super(props);

        this.state = {
            user_info: null,
            profileImageURL: undefined
        }

        this.triggerFileGallery = this.triggerFileGallery.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.removePfp = this.removePfp.bind(this);
    }

    componentDidMount(): void {
        Backend.get_auth<UserInfo>("/user/profile").then(e => {
            if (e.ok) {
                this.setState({
                    user_info: e.value,
                    profileImageURL: Backend.profileImage(e.value.user_id)
                });
            }else {
                toast(e.error.description);
            }
        })
    }

    /** Open the thing where the user can select images etc */
    async triggerFileGallery(): Promise<void> {
        this.fileInputRef.current?.click();
    }

    /** Upload pfp on change of selected file */
    async onFileChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const file = e.target.files?.[0];
        if (file) {
            this.setState({ profileImageURL: URL.createObjectURL(file) });
            // const bytes = await file.bytes();
            const form = new FormData();
            form.append("image", file);

            /* Create form data and try post */
            Backend.post_infer_content_type_auth("/user/profile-image", form).then(e => {
                if (!e.ok) {
                    toast(e.error.description);
                }else {
                    toast("Profile image updated");
                    window.location.reload();
                }
            });
        }
    }

    /** Remove pfp for current user */
    async removePfp(): Promise<void> {
        Backend.post_auth("/user/delete-profile-image", {}).then(e => {
            if (!e.ok) {
                toast(e.error.description);
            }else {
                this.setState({ profileImageURL: undefined });
                toast("Profile image removed");
            }
        });
    }
    
    render(): React.ReactNode {
        return (
            this.state.user_info && <React.Fragment>
                <div className="profile-container">
                    <div className="profile-image">
                        <img
                            src={this.state.profileImageURL}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "50%"
                            }}
                        />
                    </div>
                    <div className="name-container">
                        <p className="displayname">{this.state.user_info.displayname}</p>
                        <p className="handle"><span>@</span>{this.state.user_info.handle}</p>
                    </div>
                </div>

                <div className="profile-image-button-container">
                    <Button primary expand text="Change image" onClickSync={this.triggerFileGallery} />
                    <Button destructive expand text="Remove image" onClickSync={this.removePfp} />
                </div>
                <input
                    type="file"
                    style={{ display: "none" }}
                    id="profile-upload"
                    ref={this.fileInputRef}
                    onChange={this.onFileChange}
                    accept=".png, .jpg, .jpeg"
                />

                <div className="horizontal-row" />

                <Feed
                    compose={this.props.compose}
                    feed={"/user/posts/" + this.state.user_info.user_id}
                    showPostReplies
                />
            </React.Fragment>
        );
    }
}
