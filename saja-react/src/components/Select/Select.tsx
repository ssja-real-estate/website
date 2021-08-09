interface Option {
    value: string;
    text: string;
}

interface SelectProps {
    className?: string;
    name: string;
    id: string;
    label?: string;
    options: Option[];
    value?: string;
    onChange: React.ChangeEventHandler<HTMLSelectElement> | undefined;
}

function Select({
    className = "form-select",
    name,
    id,
    label,
    options,
    value = "default",
    onChange,
}: SelectProps) {
    return (
        <>
            <label className="form-check-label my-2">{label}</label>
            <select
                className={className}
                name={name}
                id={id}
                value={value}
                onChange={onChange}
            >
                <option value="default" disabled>
                    انتخاب کنید
                </option>
                {options.map((item, index) => {
                    return (
                        <option value={item.value} key={index}>
                            {item.text}
                        </option>
                    );
                })}
            </select>
        </>
    );
}

export default Select;
