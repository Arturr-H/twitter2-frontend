/* Imports */
import React, { RefObject } from "react";
import "./styles.css";
import { Text } from "../../components/text/Text";
import { Button } from "../../components/button/Button";
import { Input } from "../../components/input/Input";
import toast from "react-hot-toast";
import { Backend } from "../../handlers/Backend";
import { Cookie } from "../../handlers/Cookie";
import { Link } from "react-router-dom";

/* Interfaces */
interface Props {}
interface State {}
interface SignUpResponse { token: string, id: string }

export class SignUp extends React.PureComponent<Props, State> {
    email: RefObject<Input> = React.createRef();
    password: RefObject<Input> = React.createRef();
    displayname: RefObject<Input> = React.createRef();
    handle: RefObject<Input> = React.createRef();
    constructor(props: Props) {
        super(props);

        this.signup = this.signup.bind(this);
    }

    async signup(): Promise<void> {
        let email, password, displayname, handle;

        try {
            [this.email, this.displayname, this.password, this.email].forEach(e => {
                if (!e.current) throw new Error("Can't find input element");
            });

            displayname = this.displayname.current?.value();
            handle = this.handle.current?.value();
            email = this.email.current?.value();
            password = this.password.current?.value();
        }catch (e) {
            toast(`${e}`);
            return;
        }

        /* Send to backend */
        let res = await Backend.post<SignUpResponse>("/auth/sign-up", {
            email, password, displayname, handle,
        });

        /* Navigate to home */
        if (res.ok) {
            Cookie.set("token", res.value.token, 31);
            Cookie.set("user_id", res.value.id, 31);
            window.location.replace("/");
        }else {
            toast(res.error.description);
        }
    }

    render(): React.ReactNode {
        return (
            <div className="container center">
                <div className="register-container">
                    <div className="row-space">
                        <Text.H1 text="Twitter2" />
                        <Text.H3 text="Sign up" />
                    </div>

                    <div className="register-input-container">
                        <Input
                            ref={this.displayname} placeholder="Displayname..."
                            type="text" expand required name="displayname"
                            minlen={1} maxlen={24}
                        />
                        <Input
                            ref={this.handle} placeholder="@handle..."
                            type="text" expand handle required name="handle"
                            regexCriteria="[a-z0-9.]"
                            minlen={3} maxlen={15}
                        />
                        <Input
                            ref={this.email} placeholder="Email..."
                            type="email" expand required name="email address"
                            regexCriteria="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                            maxlen={256}
                        />
                        <Input
                            ref={this.password} placeholder="Password..."
                            type="password" expand required hideable name="password"
                            minlen={7} maxlen={256}
                        />
                        <Button
                            onClickAsync={this.signup}
                            text="Create account" primary expand
                        />
                    </div>
                    <p className="register-info">Already have an account? <Link to="/login">Log in</Link></p>
                </div>
            </div>
        );
    }
}
