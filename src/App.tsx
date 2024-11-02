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

/* Interfaces */
interface Props {}
interface State {
	register: boolean,
    compose: { replies_to: number | null } | null
}

export default class App extends React.PureComponent<Props, State> {
    composeOverlay: RefObject<HTMLDivElement> = React.createRef();
	constructor(props: Props) {
		super(props);

		this.state = {
			register: false,
            compose: null
		}

        this.compose = this.compose.bind(this);
        this.stopCompose = this.stopCompose.bind(this);
        this.accountRoutes = this.accountRoutes.bind(this);
        this.homeRoutes = this.homeRoutes.bind(this);
	}

	componentDidMount(): void {
		let token = Cookie.get("token");
		if (token === null || token.length === 0) {
			this.setState({ register: true });
		}

        if (window.visualViewport) {        
            window.visualViewport.addEventListener("resize", (_) => this.resizeHandler(this.composeOverlay));
        }
	}

    resizeHandler(composeOverlay: RefObject<HTMLDivElement>): void {
        if (!window.visualViewport || !composeOverlay.current) return;

        composeOverlay.current.style.height = window.visualViewport.height.toString() + "px";;
    }

	authNeeded(el: JSX.Element): JSX.Element {
		return this.state.register
			? <Navigate to="/register" replace />
			: el
	}

    compose(replies_to: number | null): void {
        document.body.style.overflow = "hidden !important";
        this.setState({ compose: { replies_to } });
    }
    stopCompose(): void {
        document.body.style.overflow = "auto";
        this.setState({ compose: null });
    }

    /* Account related */
    accountRoutes = () => <>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/register" element={<Register />} />
    </>;

    /* Home related */
    homeRoutes = () => <Routes>
        <Route index path="/" element={this.authNeeded(<PostFeeds compose={this.compose} />)} />
        <Route path="/hashtag/:hashtag" element={<HashtagScene
            compose={this.compose}
        />} />
        <Route path="/bookmarks" element={<Bookmarks compose={this.compose} />} />
        <Route path="/search" element={<Search compose={this.compose} />} />
        <Route path="/post/:id" element={<PostScene compose={this.compose} />} />
        <Route path="/user/:handle" element={<ProfileScene compose={this.compose} />} />
        <Route path="/profile" element={<SelfProfile compose={this.compose} />} />
    </Routes>;

	render(): ReactNode {
		return (
			<>
				<Router>
                    <Routes>
                        {this.accountRoutes()}

                        {/* All other paths */}
                        <Route path="/*" element={
                            <Home compose={this.compose}>
                                {this.homeRoutes()}
                            </Home>
                        } />
					</Routes>
                    

                    {/* Composing overlay */}
                    {this.state.compose !== null
                    ? <div
                        className="publish-post-overlay"
                        ref={this.composeOverlay}
                    >
                        <Publish
                            close={this.stopCompose}
                            replies_to={this.state.compose.replies_to}
                        />
                    </div> : <></>}
				</Router>

                {/* Toast notifications */}
				<Toaster toastOptions={{ "position": "bottom-center" }} />
			</>
		)
	}
}

function HashtagScene({ compose }: { compose: (n: number|null) => void }) {
    const FEED_PREFIX = "/feed/hashtag/single/";
    const { hashtag } = useParams<{ hashtag: string }>();
    const ref: RefObject<Feed> = React.createRef();
    React.useEffect(() => {
        ref.current?.setFeed(FEED_PREFIX + hashtag);
    }, [hashtag]);

    if (hashtag) { return <Feed
        compose={compose}
        ref={ref}
        feed={FEED_PREFIX + hashtag}
        title={"#" + hashtag}
        showPostReplies
    /> }
    else { return <p>Not found!</p> }
}
function ProfileScene({ compose }: { compose: (n: number|null) => void }) {
    const ref = React.createRef<UserProfile>();
    const { handle } = useParams<{ handle: string }>();
    React.useEffect(() => {
        if (handle) ref.current?.setHandle(handle);
    });

    if (handle) { return <UserProfile
        compose={compose}
        handle={handle}
        ref={ref}
    /> }
    else { return <p>Not found!</p> }
}
function PostScene({ compose }: { compose: (n: number|null) => void }) {
    const ref = React.createRef<Post>();
    const { id } = useParams<{ id: string }>();

    let id_ = parseInt(id ?? "null");
    React.useEffect(() => {
        ref.current?.setPost(id_);
    });

    if (id_ && !Number.isNaN(id_)) {
        return <Post ref={ref} compose={compose} id={id_} />
    }
    else { return <p>Not found!</p> }
}
