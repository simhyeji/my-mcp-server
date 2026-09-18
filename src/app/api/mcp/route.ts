import { createMcpHandler } from 'mcp-handler'
import { SERVER_NAME, SERVER_VERSION } from '@/mcp/config'
import { registerAll } from '@/mcp/register'

export const runtime = 'nodejs'
export const maxDuration = 60

const mcpHandler = createMcpHandler(registerAll, {
    serverInfo: { name: SERVER_NAME, version: SERVER_VERSION }
})

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
        'Content-Type, Accept, Authorization, x-hf-token, mcp-session-id, last-event-id, mcp-protocol-version',
    'Access-Control-Expose-Headers': 'mcp-session-id, mcp-protocol-version'
}

function withCors(response: Response): Response {
    const headers = new Headers(response.headers)
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
        headers.set(key, value)
    }
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
    })
}

export function OPTIONS() {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(request: Request) {
    const accept = request.headers.get('accept') ?? ''

    // 브라우저 주소창으로 열면 GET이라서 MCP 세션 오류처럼 보입니다.
    if (accept.includes('text/html')) {
        return withCors(
            Response.json(
                {
                    name: SERVER_NAME,
                    version: SERVER_VERSION,
                    transport: 'streamable-http',
                    endpoint: '/api/mcp',
                    methods: ['POST'],
                    note: '이 URL은 MCP Streamable HTTP 엔드포인트입니다. Cursor에서는 type: http 로 연결하고, 요청은 POST만 사용하세요.'
                },
                { status: 200 }
            )
        )
    }

    // Stateless 서버는 SSE GET 세션을 열지 않습니다. 스펙상 405이며 JSON-RPC 본문은 넣지 않습니다.
    return withCors(
        new Response(null, {
            status: 405,
            headers: {
                Allow: 'POST, GET, DELETE, OPTIONS'
            }
        })
    )
}

export async function POST(request: Request) {
    return withCors(await mcpHandler(request))
}

export async function DELETE(request: Request) {
    return withCors(
        new Response(null, {
            status: 405,
            headers: {
                Allow: 'POST, GET, DELETE, OPTIONS'
            }
        })
    )
}
