interface CheckboxProps {
    className?: string;
    name: string;
    id: string;
    checked?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
    label?: string;
}

function Checkbox({
    className = "form-check-label",
    name,
    id,
    checked,
    onChange,
    label,
}: CheckboxProps) {
    return (
        <>
            <label className="form-check-label">{label}</label>
            <input
                className={className}
                type="checkbox"
                name={name}
                id={id}
                checked={checked}
                onChange={onChange}
            ></input>
        </>
    );
}

export default Checkbox;
