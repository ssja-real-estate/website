interface InputProps {
    className?: string;
    type: string;
    placeholder?: string;
    name: string;
    id: string;
    value?: string;
    checked?: boolean;
    onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

function Input({
    className = "form-control",
    type = "text",
    placeholder,
    name,
    id,
    value,
    checked,
    onClick,
    onChange,
}: InputProps) {
    return (
        <input
            className={className}
            type={type}
            placeholder={placeholder}
            name={name}
            id={id}
            value={value}
            checked={checked}
            onClick={onClick}
            onChange={onChange}
        ></input>
    );
}

export default Input;
