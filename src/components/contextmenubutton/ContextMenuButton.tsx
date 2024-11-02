/* Imports */
import React from "react";
import "./styles.css";

/* Interfaces */
interface Props {
    children: React.ReactNode,

    /** True indicates a horizonal row */
    buttons: (CtxButton | true)[],
}
interface State {
    showMenu: boolean;
}
interface CtxButton {
    onClick: () => void,
    text: string,
    icon: React.ReactNode,
    destructive?: true,
    hidden?: boolean,
}

export class ContextMenuButton extends React.PureComponent<Props, State> {
    buttonRef: React.RefObject<HTMLButtonElement> = React.createRef();
    constructor(props: Props) {
        super(props);

        this.state = {
            showMenu: false,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(): void {
        document.addEventListener("click", () => this.setState({ showMenu: false }));
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.setState({ showMenu: false });
            }
        });
    }

    handleClick(e: React.MouseEvent<HTMLButtonElement>): void {
        e.stopPropagation();
        this.setState({ showMenu: !this.state.showMenu });
    }

    render(): React.ReactNode {
        return (
            <div className="ctx-menu-button-container">
                <button
                    ref={this.buttonRef}
                    onClick={this.handleClick}
                    className="ctx-menu-button"
                >
                    {this.props.children}
                </button>
                {this.state.showMenu && (
                    <div
                        className="ctx-menu"
                        style={{ top: (this.buttonRef.current?.offsetHeight ?? 0) + 5 }}
                    >{this.props.buttons.map((e) => e === true
                        ? <div className="horizontal-row" />
                        : e.hidden === true
                        ? null
                        : <button
                            onClick={(a) => {
                                a.stopPropagation();
                                e.onClick();
                                this.setState({ showMenu: false });
                            }}
                            className={e.destructive ? "destructive" : ""}
                        >
                            {e.icon}
                            {e.text}
                    </button>)}</div>
                )}
            </div>
        );
    }
}
