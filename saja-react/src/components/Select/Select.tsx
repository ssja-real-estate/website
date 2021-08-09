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
}

function Select({
    className = "form-select",
    name,
    id,
    label,
    options,
}: SelectProps) {
    return (
        <>
            <label className="form-check-label my-2">{label}</label>
            <select className={className} name={name} id={id}>
                <option value="---" disabled selected>
                    انتخاب کنید
                </option>
                {options.map((item) => {
                    return <option value={item.value}>{item.text}</option>;
                })}
            </select>
        </>
    );
}

export default Select;
