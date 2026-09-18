import { HF_TOKEN_HEADER } from '@/mcp/lib/hf-token'
import {
    PROMPT_NAMES,
    RESOURCE_NAMES,
    SERVER_DESCRIPTION,
    SERVER_NAME,
    SERVER_VERSION,
    TOOL_NAMES
} from '@/mcp/config'

const codeStyle = {
    background: '#f4f4f5',
    borderRadius: '0.375rem',
    padding: '0.15rem 0.4rem',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
} as const

export default function Home() {
    return (
        <main
            style={{
                maxWidth: '42rem',
                margin: '0 auto',
                padding: '3rem 1.5rem'
            }}
        >
            <h1 style={{ marginBottom: 0 }}>
                {SERVER_NAME}{' '}
                <span style={{ fontSize: '1rem', color: '#71717a' }}>
                    v{SERVER_VERSION}
                </span>
            </h1>
            <p>{SERVER_DESCRIPTION}</p>

            <h2>엔드포인트</h2>
            <p>
                Streamable HTTP:{' '}
                <code style={codeStyle}>POST /api/mcp</code>
            </p>
            <p>
                이미지 생성 도구는 <code style={codeStyle}>{HF_TOKEN_HEADER}</code>{' '}
                요청 헤더로 Hugging Face 토큰을 받습니다. 헤더가 없으면 서버의{' '}
                <code style={codeStyle}>HF_TOKEN</code> 환경변수로 폴백합니다.
            </p>

            <h2>도구</h2>
            <ul>
                {TOOL_NAMES.map((name) => (
                    <li key={name}>
                        <code style={codeStyle}>{name}</code>
                    </li>
                ))}
            </ul>

            <h2>리소스 · 프롬프트</h2>
            <ul>
                {[...RESOURCE_NAMES, ...PROMPT_NAMES].map((name) => (
                    <li key={name}>
                        <code style={codeStyle}>{name}</code>
                    </li>
                ))}
            </ul>
        </main>
    )
}
