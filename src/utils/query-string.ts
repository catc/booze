
export const SEARCH_QUERY_KEY = 'q'

export function getQueryParam(qs: string, key: string): (string|null) {
    const params = new URLSearchParams(qs)
    const query = params.get(key)
    if (query) {
        return query.trim()
    }
    return null;
}