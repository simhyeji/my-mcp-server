export const HF_TOKEN_HEADER = 'x-hf-token'

/**
 * 클라이언트가 보낸 x-hf-token 헤더를 우선 사용하고, 없으면 서버 환경변수로 폴백한다.
 * 반환값은 절대 로그나 응답 본문에 노출하지 않는다.
 */
export function resolveHfToken(req?: Request): string | undefined {
    const fromHeader = req?.headers.get(HF_TOKEN_HEADER)?.trim()
    return fromHeader || process.env.HF_TOKEN || undefined
}
