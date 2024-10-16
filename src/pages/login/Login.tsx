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
interface LoginResponse { token: string }
export class Login extends React.PureComponent<Props, State> {
    email: RefObject<Input> = React.createRef();
    password: RefObject<Input> = React.createRef();
    constructor(props: Props) {
        super(props);

        this.login = this.login.bind(this);
    }

    async login(): Promise<void> {
        let email, password;

        try {
            [this.password, this.email].forEach(e => {
                if (!e.current) throw new Error("Can't find input element");
            });

            email = this.email.current?.value();
            password = this.password.current?.value();
        }catch (e) {
            toast(`${e}`);
            return;
        }

        /* Send to backend */
        let res = await Backend.post<LoginResponse>("/auth/login", {
            email, password
        });

        if (res.ok) {
            Cookie.set("token", res.value.token, 31);
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
                        <Text.H3 text="Login" />
                    </div>

                    <div className="register-input-container">
                        <Input
                            ref={this.email} placeholder="Email..."
                            type="email" expand required name="email address"
                            regexCriteria="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                        />
                        <Input
                            ref={this.password} placeholder="Password..."
                            type="password" expand required hideable name="password"
                        />
                        <Button
                            onClickAsync={this.login}
                            text="Login" primary expand
                        />
                    </div>

                    <p className="register-info">Don't have an account? <Link to="/sign-up">Create one</Link></p>
                </div>
            </div>
        );
    }
}
