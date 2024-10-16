/* Imports */
import React from "react";
import "./styles.css";
import { Button } from "../../components/button/Button";
import { Text } from "../../components/text/Text";

/* Interfaces */
interface Props {}
interface State {}

export class Register extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    signup(): void { window.location.href = "/sign-up"; }
    login(): void { window.location.href = "/login"; }

    render(): React.ReactNode {
        return (
            <div className="container center">
                <div className="register-container">
                    <div className="row-space">
                        <Text.H1 text="Welcome 2 twitter2" />
                    </div>

                    <Button
                        onClickSync={this.signup}
                        text="Sign up" primary expand
                    />
                    <Button
                        onClickSync={this.login}
                        text="Login" primary expand
                    />
                </div>
            </div>
        );
    }
}
