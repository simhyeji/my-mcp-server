import { InferenceClient } from '@huggingface/inference'

const MODEL = 'black-forest-labs/FLUX.1-schnell'
const PROVIDER = 'fal-ai'

export type GenerateImageResult =
    | { ok: true; data: string; mimeType: 'image/png' }
    | { ok: false; error: string }

export async function generateImage(
    prompt: string,
    numInferenceSteps: number
): Promise<GenerateImageResult> {
    const token = process.env.HF_TOKEN

    if (!token) {
        return {
            ok: false,
            error: 'HF_TOKEN 환경변수가 설정되어 있지 않습니다. Hugging Face 토큰을 설정해 주세요.'
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
