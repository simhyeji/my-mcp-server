# TypeScript MCP Server 보일러플레이트 (Streamable HTTP / Vercel)

Next.js App Router + [`mcp-handler`](https://github.com/vercel/mcp-handler)로 Model Context Protocol(MCP) 서버를 Streamable HTTP 엔드포인트로 제공하는 보일러플레이트입니다. 그대로 Vercel에 배포할 수 있습니다.

- 엔드포인트: `POST /api/mcp`
- 프로토콜: Streamable HTTP (stateless). 2026-07-28 스펙 네이티브 + 2025년대 클라이언트 폴백을 한 핸들러가 모두 처리합니다.
- 제공 기능: 도구 6개(`greet`, `calculator`, `global_time`, `geocode`, `get_weather`, `generate-image`), 리소스 `server-info`, 프롬프트 `code_review`

## 프로젝트 구조

```
src/
  app/
    layout.tsx, page.tsx        # 엔드포인트/도구 목록 안내 페이지
    api/mcp/route.ts            # MCP 핸들러 마운트
  mcp/
    config.ts                   # 서버 이름·버전·기능 목록
    register.ts                 # registerAll(server): 도구·리소스·프롬프트 등록
    lib/hf-token.ts             # x-hf-token 헤더 해석
  generate-image.ts             # Hugging Face 이미지 생성
  weather.ts, geocode.ts, country-timezones.ts
next.config.ts
tsconfig.json
```

요청 1건마다 새 MCP 서버 인스턴스가 만들어지고 `registerAll`이 실행됩니다. 서버는 상태를 보관하지 않으므로 서버리스 환경에서 그대로 확장됩니다.

## 시작하기

```bash
npm install
npm run dev        # http://localhost:3000
```

MCP 엔드포인트: `http://localhost:3000/api/mcp`

### 환경 변수 (선택)

로컬에서 서버 측 HF 토큰 fallback을 쓰려면 `.env` 파일을 만듭니다:

```bash
cp .env.example .env
# HF_TOKEN=hf_xxx
```

클라이언트가 `x-hf-token` 헤더를 보내면 **헤더 값이 우선**되고, 없을 때만 `HF_TOKEN` 환경변수를 사용합니다.

### MCP Inspector로 테스트

```bash
npm run inspect
```

1. 브라우저에서 `http://127.0.0.1:6274` 접속
2. Transport를 **Streamable HTTP**로 선택
3. URL에 `http://localhost:3000/api/mcp` 입력
4. Configuration에서 커스텀 헤더(`x-hf-token`)를 추가한 뒤 **Connect**

### curl로 빠르게 확인

```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"calculator\",\"arguments\":{\"a\":7,\"b\":6,\"operator\":\"*\"}}}"
```

Stateless 서빙이므로 `GET`/`DELETE`(2025년대 세션 조작)는 `405`로 응답할 수 있습니다. 정상 동작입니다.

## Hugging Face 토큰: `x-hf-token` 헤더

`generate-image` 도구는 토큰을 다음 순서로 찾습니다.

1. 요청의 `x-hf-token` 헤더 — 클라이언트가 자기 토큰을 주입하는 기본 경로
2. 서버의 `HF_TOKEN` 환경변수 — 폴백

구현은 [`src/mcp/lib/hf-token.ts`](src/mcp/lib/hf-token.ts)의 `resolveHfToken()`이며, 도구 안에서는 `ctx.http?.req`로 원본 HTTP 요청에 접근합니다.

토큰이 둘 다 없으면 도구가 `isError`와 함께 설정 안내 메시지를 반환합니다. 토큰 값은 로그나 응답에 포함하지 않습니다.

## MCP 클라이언트 연결

`npm run dev` 실행 후 [`.cursor/mcp.json`](./.cursor/mcp.json)을 참고하세요:

```json
{
    "mcpServers": {
        "my-mcp-server": {
            "url": "http://localhost:3000/api/mcp",
            "headers": {
                "x-hf-token": "YOUR_HUGGING_FACE_TOKEN_HERE"
            }
        }
    }
}
```

배포 후에는 URL만 `https://<your-project>.vercel.app/api/mcp`로 바꾸면 됩니다.

stdio만 지원하는 클라이언트는 [`mcp-remote`](https://www.npmjs.com/package/mcp-remote)로 연결합니다.

```json
{
    "mcpServers": {
        "my-mcp-server": {
            "command": "npx",
            "args": [
                "-y",
                "mcp-remote",
                "http://localhost:3000/api/mcp",
                "--header",
                "x-hf-token:YOUR_HUGGING_FACE_TOKEN_HERE"
            ]
        }
    }
}
```

## Vercel 배포

1. GitHub 저장소를 Vercel 프로젝트에 연결하면 `main` 푸시마다 자동 배포됩니다.
2. 빌드 설정은 기본값(`next build`) 그대로 사용합니다.
3. 환경변수 `HF_TOKEN`은 서버 측 폴백이 필요할 때만 등록합니다. 클라이언트가 항상 `x-hf-token`을 보낸다면 등록하지 않아도 됩니다.
4. [`src/app/api/mcp/route.ts`](src/app/api/mcp/route.ts)에서 실행 환경을 지정합니다.

```ts
export const runtime = 'nodejs'
export const maxDuration = 60 // 이미지 생성 여유
```

배포된 엔드포인트는 인증 없이 공개됩니다. 접근 제어가 필요하면 `mcp-handler`의 `withMcpAuth` + `/.well-known/oauth-protected-resource` 라우트로 OAuth를 추가하세요.

## 도구 추가하기

[`src/mcp/register.ts`](src/mcp/register.ts)의 `registerAll` 함수 안에 `server.registerTool(...)`을 추가합니다.

- `inputSchema`/`outputSchema`/`argsSchema`는 원시 shape가 아니라 완전한 스키마(`z.object({ ... })`)를 넘깁니다. MCP SDK v2 규칙입니다.
- 실패는 예외 대신 `isError: true`와 사용자용 메시지로 반환하는 편이 클라이언트 경험이 좋습니다.
- `config.ts`의 `TOOL_NAMES`에도 이름을 추가하면 `server-info` 리소스와 안내 페이지에 함께 반영됩니다.

## 스크립트

| 명령 | 설명 |
| ------------------- | --------------------------------- |
| `npm run dev` | 개발 서버 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 빌드 결과 실행 |
| `npm run typecheck` | 타입 검사 |
| `npm run inspect` | MCP Inspector 실행 |

## 참고 자료

- [Deploy MCP servers to Vercel](https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel)
- [vercel/mcp-handler](https://github.com/vercel/mcp-handler)
- [Model Context Protocol 공식 문서](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Zod 문서](https://zod.dev/)

## 라이선스

MIT
