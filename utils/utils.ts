// SWR fetcher
export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
    const res = await fetch(input, init);
    if (!res.ok) {
        const error: Error & { status?: number } = new Error('An error occurred while fetching the data.');
        // Attach extra info to the error object.
        error.status = res.status;
        throw error;
    }
    return res.json();
}
