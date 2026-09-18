import { InferenceClient } from '@huggingface/inference'
import { HF_TOKEN_HEADER } from '@/mcp/lib/hf-token'

const MODEL = 'black-forest-labs/FLUX.1-schnell'
const PROVIDER = 'fal-ai'

export type GenerateImageResult =
    | { ok: true; data: string; mimeType: 'image/png' }
    | { ok: false; error: string }

export async function generateImage(
    prompt: string,
    numInferenceSteps: number,
    token?: string
): Promise<GenerateImageResult> {
    if (!token) {
        return {
            ok: false,
            error: `Hugging Face 토큰이 없습니다. MCP 클라이언트 설정의 headers에 ${HF_TOKEN_HEADER} 헤더를 추가하거나, 서버에 HF_TOKEN 환경변수를 설정하세요.`
        }
    }

    try {
        const client = new InferenceClient(token)
        const image = await client.textToImage(
            {
                provider: PROVIDER,
                model: MODEL,
                inputs: prompt,
                parameters: { num_inference_steps: numInferenceSteps }
            },
            { outputType: 'blob' }
        )

        const base64 = Buffer.from(await image.arrayBuffer()).toString('base64')

        return {
            ok: true,
            data: base64,
            mimeType: 'image/png'
        }
    } catch (error) {
        let message = error instanceof Error ? error.message : String(error)

        if (error && typeof error === 'object' && 'httpResponse' in error) {
            const httpResponse = (
                error as {
                    httpResponse?: { status?: number; body?: unknown }
                }
            ).httpResponse

            if (httpResponse) {
                const body =
                    typeof httpResponse.body === 'string'
                        ? httpResponse.body
                        : JSON.stringify(httpResponse.body)
                message = `${message} (HTTP ${httpResponse.status}${
                    body ? `: ${body}` : ''
                })`
            }
        }

        return {
            ok: false,
            error: `이미지 생성에 실패했습니다: ${message}`
        }
    }
}
