import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from "react-router-dom"
import { Home } from "./pages/home-dynamic/Home"
import { Login } from "./pages/login/Login"
import { Toaster } from "react-hot-toast";
import { SignUp } from "./pages/signup/SignUp";
import React, { ReactNode } from "react";
import { Cookie } from "./handlers/Cookie";
import { Register } from "./pages/register/Register";
import { Profile } from "./pages/profile/Profile";
import { Feed } from "./modules/feed/Feed";
import { Publish } from "./pages/publish/Publish";
import { Post } from "./pages/post/Post";

/* Interfaces */
interface Props {}
interface State {
	register: boolean,
    compose: { replies_to: number | null } | null
}

export default class App extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			register: false,
            compose: null
		}

        this.compose = this.compose.bind(this);
	}

	componentDidMount(): void {
		let token = Cookie.get("token");
		if (token === null || token.length === 0) {
			this.setState({ register: true });
		}
	}

	authNeeded(el: JSX.Element): JSX.Element {
		return this.state.register
			? <Navigate to="/register" replace />
			: el
	}

    compose(replies_to: number | null): void {
        this.setState({ compose: { replies_to } })
    }

	render(): ReactNode {
		return (
			<>
				<Router>
                    <Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/sign-up" element={<SignUp />} />
						<Route path="/register" element={<Register />} />
                        <Route path="/user/:handle" element={<ProfileScene />} />
					</Routes>
                    
                    <Home compose={this.compose}>
                        <Routes>
						    <Route index path="/" element={this.authNeeded(<Feed
                                compose={this.compose}
                                title="What's happening?"
                                feed="/post/feed"
                            />)} />
						    <Route path="/hashtag/:hashtag" element={<HashtagScene
                                compose={this.compose}
                            />} />
                            <Route path="/post/:id" element={<PostScene />} />
                        </Routes>
                    </Home>

                    {/* Composing overlay */}
                    {this.state.compose !== null ? <div className="publish-post-overlay">
                        <Publish
                            close={() => this.setState({ compose: null })}
                            replies_to={this.state.compose.replies_to}
                        />
                    </div> : <></>}
				</Router>
				<Toaster toastOptions={{ "position": "bottom-center" }} />
			</>
		)
	}
}

function HashtagScene({ compose }: { compose: (n: number|null) => void }) {
    const { hashtag } = useParams<{ hashtag: string }>();
    if (hashtag) { return <Feed
        compose={compose}
        feed={"/hashtag/single/" + hashtag} title={"#" + hashtag}
    /> }
    else { return <p>Not found!</p> }
}
function ProfileScene() {
    const { handle } = useParams<{ handle: string }>();
    if (handle) { return <Profile handle={handle} /> }
    else { return <p>Not found!</p> }
}
function PostScene() {
    const { id } = useParams<{ id: string }>();
    let id_ = parseInt(id ?? "null");
    if (id_ && !Number.isNaN(id_)) { return <Post id={id_} /> }
    else { return <p>Not found!</p> }
}
