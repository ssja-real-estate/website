function randomId() {
    return `${Math.round(Math.random() * 1000)}-${Math.round(
        Math.random() * 1000
    )}-${Math.round(Math.random() * 1000)}`;
}

export { randomId };
