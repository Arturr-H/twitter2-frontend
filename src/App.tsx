import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from "react-router-dom"
import { Home } from "./pages/home-dynamic/Home"
import { Login } from "./pages/login/Login"
import { Toaster } from "react-hot-toast";
import { SignUp } from "./pages/signup/SignUp";
import React, { ReactNode, RefObject } from "react";
import { Cookie } from "./handlers/Cookie";
import { Register } from "./pages/register/Register";
import { UserProfile } from "./pages/profile/UserProfile";
import { Feed } from "./modules/feed/Feed";
import { Publish } from "./pages/publish/Publish";
import { Post } from "./pages/post/Post";
import { Bookmarks } from "./pages/bookmarks/Bookmarks";
import { Search } from "./pages/search/Search";
import { SelfProfile } from "./pages/profile/SelfProfile";
import { PostFeeds } from "./pages/postfeeds/PostFeeds";
import { Modal } from "./Modal";

/* Interfaces */
interface Props {}
interface State {
	register: boolean,
    modal: Modal | null
}

export default class App extends React.PureComponent<Props, State> {
    modalOverlay: RefObject<HTMLDivElement> = React.createRef();
	constructor(props: Props) {
		super(props);

		this.state = {
			register: false,
            modal: null
		}

        this.toggleModal = this.toggleModal.bind(this);
        this.accountRoutes = this.accountRoutes.bind(this);
        this.homeRoutes = this.homeRoutes.bind(this);
	}

	componentDidMount(): void {
		let token = Cookie.get("token");
		if (token === null || token.length === 0) {
			this.setState({ register: true });
		}

        if (window.visualViewport) {        
            window.visualViewport.addEventListener("resize", (_) => this.resizeHandler(this.modalOverlay));
        }
	}

    resizeHandler(modalOverlay: RefObject<HTMLDivElement>): void {
        if (!window.visualViewport || !modalOverlay.current) return;

        modalOverlay.current.style.height = window.visualViewport.height.toString() + "px";;
    }

	authNeeded(el: JSX.Element): JSX.Element {
		return this.state.register
			? <Navigate to="/register" replace />
			: el
	}

    toggleModal(open: boolean, modal?: Modal): void {
        if (open) {
            document.body.style.overflow = "hidden !important";
        }else {
            document.body.style.overflow = "auto";
        }

        if (!modal) return this.setState({ modal: null });
        switch (modal.type) {
            case "publish":
                this.setState({ modal: open
                    ? { type: "publish", replies_to: modal.replies_to }
                    : null });
                break;
            default:
                break;
        }
    }

    /* Account related */
    accountRoutes = () => <>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/register" element={<Register />} />
    </>;

    /* Home related */
    homeRoutes = () => <Routes>
        <Route index path="/" element={this.authNeeded(<PostFeeds toggleModal={this.toggleModal} />)} />
        <Route path="/hashtag/:hashtag" element={<HashtagScene
            toggleModal={this.toggleModal}
        />} />
        <Route path="/bookmarks" element={<Bookmarks toggleModal={this.toggleModal} />} />
        <Route path="/search" element={<Search toggleModal={this.toggleModal} />} />
        <Route path="/post/:id" element={<PostScene toggleModal={this.toggleModal} />} />
        <Route path="/user/:handle" element={<ProfileScene toggleModal={this.toggleModal} />} />
        <Route path="/profile" element={<SelfProfile toggleModal={this.toggleModal} />} />
    </Routes>;

	render(): ReactNode {
		return (
			<>
				<Router>
                    <Routes>
                        {this.accountRoutes()}

                        {/* All other paths */}
                        <Route path="/*" element={
                            <Home toggleModal={this.toggleModal}>
                                {this.homeRoutes()}
                            </Home>
                        } />
					</Routes>
                    

                    {/* Composing overlay */}
                    {this.state.modal !== null
                    ? <div
                        className="modal-overlay"
                        ref={this.modalOverlay}
                    >
                        {this.state.modal.type === "publish"
                        ? <Publish
                            replies_to={this.state.modal.replies_to}
                            toggleModal={this.toggleModal}
                        />
                        : <></>}
                    </div> : <></>}
				</Router>

                {/* Toast notifications */}
				<Toaster toastOptions={{ "position": "bottom-center" }} />
			</>
		)
	}
}

function HashtagScene({ toggleModal }: { toggleModal: (open: boolean, modal?: Modal) => void }) {
    const FEED_PREFIX = "/feed/hashtag/single/";
    const { hashtag } = useParams<{ hashtag: string }>();
    const ref: RefObject<Feed> = React.createRef();
    React.useEffect(() => {
        ref.current?.setFeed(FEED_PREFIX + hashtag);
    }, [hashtag]);

    if (hashtag) { return <Feed
        toggleModal={toggleModal}
        ref={ref}
        feed={FEED_PREFIX + hashtag}
        title={"#" + hashtag}
        showPostReplies
    /> }
    else { return <p>Not found!</p> }
}
function ProfileScene({ toggleModal }: { toggleModal: (open: boolean, modal?: Modal) => void }) {
    const ref = React.createRef<UserProfile>();
    const { handle } = useParams<{ handle: string }>();
    React.useEffect(() => {
        if (handle) ref.current?.setHandle(handle);
    });

    if (handle) { return <UserProfile
        toggleModal={toggleModal}
        handle={handle}
        ref={ref}
    /> }
    else { return <p>Not found!</p> }
}
function PostScene({ toggleModal }: { toggleModal: (open: boolean, modal?: Modal) => void }) {
    const ref = React.createRef<Post>();
    const { id } = useParams<{ id: string }>();

    let id_ = parseInt(id ?? "null");
    React.useEffect(() => {
        ref.current?.setPost(id_);
    });

    if (id_ && !Number.isNaN(id_)) {
        return <Post ref={ref} toggleModal={toggleModal} id={id_} />
    }
    else { return <p>Not found!</p> }
}
