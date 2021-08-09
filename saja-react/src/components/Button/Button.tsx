interface ButtonProps {
    className?: string;
    type: string;
    name: string;
    id: string;
    value?: string;
    onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
}

function Button({
    className = "form-control",
    type,
    name,
    id,
    value,
    onClick,
}: ButtonProps) {
    return (
        <input
            className={className}
            type={type}
            name={name}
            id={id}
            value={value}
            onClick={onClick}
        ></input>
    );
}

export default Button;
