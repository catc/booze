
export const SEARCH_QUERY_KEY = 'q'
export const PRODUCT_QUERY_KEY = 'p'

export function getQueryParam(qs: string, key: string): (string|null) {
    const params = new URLSearchParams(qs)
    const query = params.get(key)
    if (query) {
        return query.trim()
    }
    return null;
}

export function getNonProductQS(qs: string): string {
    const params = new URLSearchParams(qs)
    params.delete(PRODUCT_QUERY_KEY)
    return `?${params.toString()}`
}