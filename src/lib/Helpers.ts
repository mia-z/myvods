const SearchParamsFromFragment = (hashFragment: string): URLSearchParams => {
    if (hashFragment.charAt(0) !== "#") {
        throw Error("First character must be a #");
    } else {
        return new URLSearchParams(hashFragment.slice(1));
    }
}

export {
    SearchParamsFromFragment
}