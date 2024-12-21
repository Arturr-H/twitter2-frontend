/* Imports */
import React, { ChangeEvent, HTMLInputTypeAttribute, RefObject } from "react";
import "./styles.css";
import { Eye, EyeOff } from "lucide-react";

/* Interfaces */
interface Props {
    type: HTMLInputTypeAttribute,
    placeholder: string,

    expand?: true,
    hideable?: true,

    /** Places @ sign at the start and
     * makes all characters lowercase */
    handle?: true,
    required?: true,
    maxlen?: number,
    minlen?: number,
    name?: string,
    onChange?: (value: string) => void,
    focused?: true,

    regexCriteria?: string,
}
interface State {
    visibleIfHideable: boolean,
    value: string,
}

export class Input extends React.PureComponent<Props, State> {
    value_: string = "";
    self: RefObject<HTMLDivElement> = React.createRef();
    errorAnimationTimeout: number | undefined = undefined;

    constructor(props: Props) {
        super(props);

        this.state = {
            visibleIfHideable: false,
            value: this.value_,
        }

        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.checkCriteria = this.checkCriteria.bind(this);
        this.highlightError = this.highlightError.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.value = this.value.bind(this);
        this.clear = this.clear.bind(this);
    }

    /** Called externally (throws) */
    public value(): string {
        try {
            this.checkCriteria();
        }catch (e) {
            this.self.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center"
            });
            this.highlightError();
            throw e;
        }

        return this.value_
    }
    private checkCriteria(): void {
        /* If required */
        if (this.props.required === true && this.value_ === "")
            throw "Field required";
        
        /* Length criteria */
        let minlen = this.props.minlen ?? 0;
        let maxlen = this.props.maxlen ?? Number.MAX_SAFE_INTEGER;
        if (this.value_.length < minlen) {
            throw `Too short. Needs to be at least ${minlen} characters long.` 
        }else if (this.value_.length > maxlen) {
            throw `Too long. Needs to be less than ${maxlen} characters long.` 
        }
        
        /* Regex criteria */
        let crit = this.props.regexCriteria;
        if (crit !== undefined) {
            let reg = new RegExp(crit, "gi");
            console.log(this.value_);
            if (!reg.test(this.value_))
                throw `Invalid ${this.props.name ?? "field"}`;
        };
    }

    toggleVisibility(): void {
        this.setState({ visibleIfHideable: !this.state.visibleIfHideable });
    }
    highlightError(): void {
        clearTimeout(this.errorAnimationTimeout);
        if (!this.self.current) return;
        this.self.current.classList.remove("error");
        void this.self.current.offsetWidth;
        this.self.current.classList.add("error");
        this.errorAnimationTimeout = setTimeout(() => {
            if (!this.self.current) return;
            this.self.current.classList.remove("error");
        }, 1000);
    }

    handleChange(e: ChangeEvent<HTMLInputElement>): void {
        if (this.props.handle === true) {
            this.value_ = e.currentTarget.value.replace(/[^a-z0-9.]/gi, '').toLowerCase();
            if (this.value_.length === 0) {
                this.setState({ value: this.value_ });
            }else {
                this.setState({ value: "@" + this.value_ });
            }
        }else {
            this.value_ = e.currentTarget.value;
            this.setState({ value: this.value_ });
        }

        this.props.onChange && this.props.onChange(this.value_)
    }

    clear(): void {
        this.value_ = "";
        this.setState({ value: this.value_ });
    }

    render(): React.ReactNode {
        return (
            <div className={`input-wrapper ${this.props.expand && "expand"}`} ref={this.self}>
                {this.state.value !== "" && <p className="input-title">{this.props.placeholder}</p>}
                <input
                    className={`input
                        ${this.props.hideable && "no-right-padding"}
                    `}
                    type={this.props.hideable === true
                        ? (this.state.visibleIfHideable ? "text" : this.props.type)
                        : this.props.type
                    }
                    placeholder={this.props.placeholder}
                    onChange={this.handleChange}
                    value={this.state.value}
                    maxLength={this.props.maxlen ?? 256}
                    autoFocus={this.props.focused}
                />

                {this.props.hideable && <button
                    onClick={this.toggleVisibility}
                    className="eye-icon-wrapper"
                    tabIndex={-1}
                >
                    {this.state.visibleIfHideable
                        ? <EyeOff size={24} color={"#999"} className="eye-icon" />
                        : <Eye size={24} color={"#999"} className="eye-icon" />
                    }
                </button>}
            </div>
        );
    }
}
