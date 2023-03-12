// SWR fetcher
export const fetcher = async <JSON>(input: RequestInfo, init?: RequestInit): Promise<JSON> => {
    const res = await fetch(input, init);
    if (!res.ok) {
        const error: Error & { status?: number } = new Error('An error occurred while fetching the data.');
        // Attach extra info to the error object.
        error.status = res.status;
        throw error;
    }
    return res.json();
};

export const randomHexColor = () => {
    return (
        '#' +
        Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, '0')
    );
};
