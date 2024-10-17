/* Imports */
import React from "react";
import "./styles.css";
import { LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";

/* Interfaces */
interface Props {
    text: string,
    onClickSync?: () => void,
    onClickAsync?: () => Promise<void>,

    primary?: true,
    expand?: true,

    icon?: JSX.Element,
    to?: string,
}
interface State {
    loading: boolean
}

export class NavButton extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
        }

        this.onClick = this.onClick.bind(this);
    }

    componentDidMount(): void {
        if (this.props.onClickAsync !== undefined && this.props.onClickSync !== undefined) {
            throw new Error("Can't have both async and sync callbacks on button")
        }
    }

    /** Runs either the async or sync function if provided */
    async onClick(): Promise<void> {
        let async_f = this.props.onClickAsync !== undefined;
        let sync_f = this.props.onClickSync !== undefined;
        if (!async_f && !sync_f) { return };
        if (async_f)
            this.setState({ loading: true });

        let runner: () => Promise<void>;
        if (async_f) {
            runner = async () => {
                await this.props.onClickAsync!();
                this.setState({ loading: false });
            };
        }else {
            runner = async () => new Promise((resolve) => {
                resolve(this.props.onClickSync!());
            });
        }

        return runner()
    }

    render(): React.ReactNode {
        let inner = <>
            {this.props.icon && this.props.icon}
            {this.state.loading
                ? <LoaderCircle className="loading-icon" size={24} />
                : this.props.text}
        </>;

        return (
            this.props.to !== undefined
            ? <Link
                to={this.props.to}
                style={{ textDecoration: "none" }}
                className="navbutton"
            >
                {inner}
            </Link>
            
            : <button
                onClick={this.onClick}
                className={`navbutton
                    ${this.props.primary && "primary"}
                    ${this.props.expand && "expand"}
                `}
            >
                {inner}
            </button>
        );
    }
}
