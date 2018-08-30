
export const SEARCH_QUERY_KEY = 'q'
export const PRODUCT_QUERY_KEY = 'p'

const qsRegex = new RegExp(/\?(.+)/i)

export function getQueryParam(key: string): (string|null) {
    const match = location.hash.match(qsRegex)
    if (!match || !match[1]){
        return null;
    }

    const params = new URLSearchParams(match[1])
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