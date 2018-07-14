
const QUERY_KEY = 'q'

export function getQuery(qs: string): (string|null) {
    const params = new URLSearchParams(qs)
    const query = params.get(QUERY_KEY)
    if (query) {
        return query.trim()
    }
    return null;
}