interface TextInputProps {
    className?: string;
    type?: string;
    placeholder?: string;
    name: string;
    id: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

function TextInput({
    className = "form-control",
    type = "text",
    placeholder,
    name,
    id,
    value,
    onChange,
}: TextInputProps) {
    return (
        <input
            className={className}
            type={type}
            placeholder={placeholder}
            name={name}
            id={id}
            value={value}
            onChange={onChange}
        ></input>
    );
}

export default TextInput;
