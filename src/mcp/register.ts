import type { McpServer } from '@modelcontextprotocol/server'
import { z } from 'zod'
import { generateImage } from '@/generate-image'
import {
    PROMPT_NAMES,
    RESOURCE_NAMES,
    SERVER_NAME,
    SERVER_VERSION,
    TOOL_NAMES
} from '@/mcp/config'
import { resolveHfToken } from '@/mcp/lib/hf-token'
import { findCountryTimezone } from '@/country-timezones'
import { formatGeocodedLocation, searchLocations } from '@/geocode'
import {
    fetchCurrentWeather,
    formatTimeAndWeather,
    formatWeather
} from '@/weather'

export function registerAll(server: McpServer) {
    server.registerTool(
        'greet',
        {
            description: '이름과 언어를 입력하면 인사말을 반환합니다.',
            inputSchema: z.object({
                name: z.string().describe('인사할 사람의 이름'),
                language: z
                    .enum(['ko', 'en'])
                    .optional()
                    .default('en')
                    .describe('인사 언어 (기본값: en)')
            }),
            outputSchema: z.object({
                content: z
                    .array(
                        z.object({
                            type: z.literal('text'),
                            text: z.string().describe('인사말')
                        })
                    )
                    .describe('인사말')
            })
        },
        async ({ name, language }) => {
            const greeting =
                language === 'ko'
                    ? `안녕하세요, ${name}님!`
                    : `Hey there, ${name}! 👋 Nice to meet you!`

            return {
                content: [
                    {
                        type: 'text' as const,
                        text: greeting
                    }
                ],
                structuredContent: {
                    content: [
                        {
                            type: 'text' as const,
                            text: greeting
                        }
                    ]
                }
            }
        }
    )

    server.registerTool(
        'calculator',
        {
            description:
                '두 개의 숫자와 하나의 연산자를 입력받아 계산 결과를 반환합니다.',
            inputSchema: z.object({
                a: z.number().describe('첫 번째 숫자'),
                b: z.number().describe('두 번째 숫자'),
                operator: z
                    .enum(['+', '-', '*', '/'])
                    .describe('연산자 (+, -, *, /)')
            }),
            outputSchema: z.object({
                content: z
                    .array(
                        z.object({
                            type: z.literal('text'),
                            text: z.string().describe('계산 결과')
                        })
                    )
                    .describe('계산 결과')
            })
        },
        async ({ a, b, operator }) => {
            let result: number

            switch (operator) {
                case '+':
                    result = a + b
                    break
                case '-':
                    result = a - b
                    break
                case '*':
                    result = a * b
                    break
                case '/':
                    if (b === 0) {
                        const errorText = '0으로 나눌 수 없습니다.'
                        return {
                            isError: true,
                            content: [
                                {
                                    type: 'text' as const,
                                    text: errorText
                                }
                            ],
                            structuredContent: {
                                content: [
                                    {
                                        type: 'text' as const,
                                        text: errorText
                                    }
                                ]
                            }
                        }
                    }
                    result = a / b
                    break
            }

            const text = `${a} ${operator} ${b} = ${result}`

            return {
                content: [
                    {
                        type: 'text' as const,
                        text
                    }
                ],
                structuredContent: {
                    content: [
                        {
                            type: 'text' as const,
                            text
                        }
                    ]
                }
            }
        }
    )

    server.registerTool(
        'global_time',
        {
            description:
                'Global Time: 나라 이름을 입력하면 해당 나라의 현재 시간과 날씨를 반환합니다. 나라 이름을 생략하면 대한민국 기준입니다.',
            inputSchema: z.object({
                country: z
                    .string()
                    .optional()
                    .describe(
                        '현재 시간과 날씨를 조회할 나라 이름 (예: 한국, Japan, USA). 생략 시 대한민국'
                    )
            }),
            outputSchema: z.object({
                content: z
                    .array(
                        z.object({
                            type: z.literal('text'),
                            text: z
                                .string()
                                .describe('해당 나라의 현재 시간과 날씨')
                        })
                    )
                    .describe('해당 나라의 현재 시간과 날씨')
            })
        },
        async ({ country }) => {
            const info = findCountryTimezone(country)

            if (!info) {
                const errorText = `"${country}"에 해당하는 나라를 찾을 수 없습니다. 나라 이름(예: 한국, Japan, USA)을 입력해 주세요.`
                return {
                    isError: true,
                    content: [
                        {
                            type: 'text' as const,
                            text: errorText
                        }
                    ],
                    structuredContent: {
                        content: [
                            {
                                type: 'text' as const,
                                text: errorText
                            }
                        ]
                    }
                }
            }

            const weather = await fetchCurrentWeather(info)
            const text = formatTimeAndWeather(info, weather)

            return {
                content: [
                    {
                        type: 'text' as const,
                        text
                    }
                ],
                structuredContent: {
                    content: [
                        {
                            type: 'text' as const,
                            text
                        }
                    ]
                }
            }
        }
    )

    server.registerTool(
        'geocode',
        {
            description:
                '도시명, 지명, 우편번호로 위도·경도 좌표를 조회합니다. 날씨가 필요하면 이 도구로 좌표를 얻은 뒤 get_weather에 넘기세요.',
            inputSchema: z.object({
                query: z
                    .string()
                    .describe(
                        '검색할 도시명, 지명 또는 우편번호 (예: 서울, Tokyo, Paris, France)'
                    ),
                count: z
                    .number()
                    .int()
                    .min(1)
                    .max(10)
                    .optional()
                    .default(5)
                    .describe('반환할 최대 결과 수 (1–10, 기본값 5)')
            }),
            outputSchema: z.object({
                content: z
                    .array(
                        z.object({
                            type: z.literal('text'),
                            text: z.string().describe('위도·경도 좌표 목록')
                        })
                    )
                    .describe('위도·경도 좌표 목록')
            })
        },
        async ({ query, count }) => {
            if (query.trim().length < 2) {
                const errorText =
                    '검색어는 2글자 이상이어야 합니다. 도시명이나 지명을 입력해 주세요.'
                return {
                    isError: true,
                    content: [
                        {
                            type: 'text' as const,
                            text: errorText
                        }
                    ],
                    structuredContent: {
                        content: [
                            {
                                type: 'text' as const,
                                text: errorText
                            }
                        ]
                    }
                }
            }

            const locations = await searchLocations(query, count)

            if (locations === undefined) {
                const errorText =
                    '위치 정보를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.'
                return {
                    isError: true,
                    content: [
                        {
                            type: 'text' as const,
                            text: errorText
                        }
                    ],
                    structuredContent: {
                        content: [
                            {
                                type: 'text' as const,
                                text: errorText
                            }
                        ]
                    }
                }
            }

            if (locations.length === 0) {
                const errorText = `"${query}"에 해당하는 위치를 찾을 수 없습니다.`
                return {
                    isError: true,
                    content: [
                        {
                            type: 'text' as const,
                            text: errorText
                        }
                    ],
                    structuredContent: {
                        content: [
                            {
                                type: 'text' as const,
                                text: errorText
                            }
                        ]
                    }
                }
            }

            const text = locations.map(formatGeocodedLocation).join('\n')

            return {
                content: [
                    {
                        type: 'text' as const,
                        text
                    }
                ],
                structuredContent: {
                    content: [
                        {
                            type: 'text' as const,
                            text
                        }
                    ]
                }
            }
        }
    )

    server.registerTool(
        'get_weather',
        {
            description:
                '위도·경도 좌표로 현재 날씨를 조회합니다. 좌표가 없으면 먼저 geocode로 도시명에서 위도·경도를 얻으세요.',
            inputSchema: z.object({
                latitude: z
                    .number()
                    .min(-90)
                    .max(90)
                    .describe('위도 (-90 ~ 90)'),
                longitude: z
                    .number()
                    .min(-180)
                    .max(180)
                    .describe('경도 (-180 ~ 180)')
            }),
            outputSchema: z.object({
                content: z
                    .array(
                        z.object({
                            type: z.literal('text'),
                            text: z.string().describe('현재 날씨 정보')
                        })
                    )
                    .describe('현재 날씨 정보')
            })
        },
        async ({ latitude, longitude }) => {
            const location = { latitude, longitude }
            const weather = await fetchCurrentWeather(location)

            if (!weather) {
                const errorText =
                    '날씨 정보를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.'
                return {
                    isError: true,
                    content: [
                        {
                            type: 'text' as const,
                            text: errorText
                        }
                    ],
                    structuredContent: {
                        content: [
                            {
                                type: 'text' as const,
                                text: errorText
                            }
                        ]
                    }
                }
            }

            const text = formatWeather(location, weather)

            return {
                content: [
                    {
                        type: 'text' as const,
                        text
                    }
                ],
                structuredContent: {
                    content: [
                        {
                            type: 'text' as const,
                            text
                        }
                    ]
                }
            }
        }
    )

    server.registerTool(
        'generate-image',
        {
            description:
                '텍스트 프롬프트를 입력하면 Hugging Face Inference API로 이미지를 생성합니다.',
            inputSchema: z.object({
                prompt: z.string().describe('이미지 생성 프롬프트'),
                num_inference_steps: z
                    .number()
                    .int()
                    .min(1)
                    .max(10)
                    .optional()
                    .default(4)
                    .describe('추론 스텝 수 (1–10, 기본값 4)')
            }),
            outputSchema: z.object({
                content: z
                    .array(
                        z.union([
                            z.object({
                                type: z.literal('image'),
                                data: z
                                    .string()
                                    .describe('base64 인코딩된 이미지'),
                                mimeType: z
                                    .literal('image/png')
                                    .describe('이미지 MIME 타입')
                            }),
                            z.object({
                                type: z.literal('text'),
                                text: z.string().describe('에러 메시지')
                            })
                        ])
                    )
                    .describe('생성된 이미지 또는 에러 메시지')
            })
        },
        async ({ prompt, num_inference_steps }, ctx) => {
            const token = resolveHfToken(ctx.http?.req)
            const result = await generateImage(
                prompt,
                num_inference_steps,
                token
            )

            if (!result.ok) {
                return {
                    isError: true,
                    content: [
                        {
                            type: 'text' as const,
                            text: result.error
                        }
                    ],
                    structuredContent: {
                        content: [
                            {
                                type: 'text' as const,
                                text: result.error
                            }
                        ]
                    }
                }
            }

            return {
                content: [
                    {
                        type: 'image' as const,
                        data: result.data,
                        mimeType: result.mimeType
                    }
                ],
                structuredContent: {
                    content: [
                        {
                            type: 'image' as const,
                            data: result.data,
                            mimeType: result.mimeType
                        }
                    ]
                }
            }
        }
    )

    server.registerResource(
        'server-info',
        'config://server',
        {
            title: '서버 구성 정보',
            description:
                '이 MCP 서버의 구성, 제공 도구, 런타임 정보를 반환합니다. 데모용 가짜 데이터를 포함합니다.',
            mimeType: 'application/json'
        },
        async (uri) => {
            const serverInfo = {
                name: SERVER_NAME,
                version: SERVER_VERSION,
                environment: process.env.NODE_ENV ?? 'development',
                region: 'ap-northeast-2',
                instance: {
                    id: 'mcp-demo-01',
                    host: 'demo.mcp.local',
                    status: 'healthy'
                },
                transport: 'streamable-http',
                endpoint: '/api/mcp',
                capabilities: {
                    tools: true,
                    resources: true,
                    prompts: true
                },
                tools: TOOL_NAMES.map((name) => ({ name })),
                resources: RESOURCE_NAMES.map((name) => ({
                    name,
                    uri: 'config://server',
                    mimeType: 'application/json'
                })),
                prompts: PROMPT_NAMES.map((name) => ({ name })),
                limits: {
                    maxConcurrentTools: 8,
                    requestTimeoutMs: 15000,
                    rateLimitPerMinute: 60
                },
                featureFlags: {
                    weather: true,
                    geocode: true,
                    prompts: true
                },
                generatedAt: new Date().toISOString(),
                note: '이 값은 데모용 가짜 서버 정보입니다.'
            }

            return {
                contents: [
                    {
                        uri: uri.href,
                        mimeType: 'application/json',
                        text: JSON.stringify(serverInfo, null, 2)
                    }
                ]
            }
        }
    )

    server.registerPrompt(
        'code_review',
        {
            title: '코드 리뷰',
            description:
                '특정 코드를 입력받아 프로그래밍 언어와 무관하게, 단계적으로 상세 리뷰하는 절차형 프롬프트입니다.',
            argsSchema: z.object({
                code: z.string().describe('리뷰할 소스 코드'),
                context: z
                    .string()
                    .optional()
                    .describe(
                        '코드의 목적, 호출 맥락, 제약 조건 등 추가로 알려줄 배경 정보'
                    ),
                focus: z
                    .string()
                    .optional()
                    .describe(
                        '특히 깊게 볼 영역 (예: 보안, 성능, 동시성, API 설계). 생략 시 전 영역을 균형 있게 검토'
                    )
            })
        },
        async ({ code, context, focus }) => {
            const extraContext = context?.trim()
                ? `## 추가 맥락\n${context.trim()}\n`
                : '## 추가 맥락\n제공되지 않았습니다. 코드만으로 의도를 추론하되, 확신이 없으면 가정이라고 밝히세요.\n'
            const reviewFocus = focus?.trim()
                ? `## 집중 영역\n${focus.trim()}\n이 영역을 더 깊게 보되, 나머지 단계도 건너뛰지 마세요.\n`
                : '## 집중 영역\n지정되지 않았습니다. 아래 절차를 빠짐없이 수행하세요.\n'

            return {
                description:
                    '입력 코드를 언어와 무관하게 단계적으로 상세 리뷰합니다.',
                messages: [
                    {
                        role: 'user' as const,
                        content: {
                            type: 'text' as const,
                            text: `당신은 숙련된 코드 리뷰어입니다. 프로그래밍 언어, 프레임워크, 패러다임에 상관없이 아래 절차를 순서대로 수행하세요. 추측은 가정이라고 표시하고, 코드에 없는 내용을 사실처럼 단정하지 마세요.

${extraContext}
${reviewFocus}
## 리뷰 절차
1. 언어·런타임 식별: 문법, 표준 라이브러리, 관용구로 언어와 실행 환경을 추론하세요. 불확실하면 후보와 근거를 함께 적으세요.
2. 의도 파악: 이 코드가 무엇을 입력받아 무엇을 내보내는지, 성공 조건은 무엇인지 한 단락으로 요약하세요.
3. 구조 분해: 모듈/타입/함수/제어 흐름/상태 변화를 작은 단위로 나눠 설명하세요. 호출 순서와 데이터 흐름을 따라가세요.
4. 정상 경로 추적: 대표적인 입력이 들어왔을 때 실제로 어떤 분기를 타는지 단계적으로 따라가세요.
5. 경계·실패 경로: 빈 값, 잘못된 타입, 범위 밖 값, 동시 호출, 부분 실패, 타임아웃 등 예외 경로를 점검하세요.
6. 정확성: 논리 오류, 오프바이원, 잘못된 조건, 상태 불일치, 경쟁 상태, 불변조건 위반을 찾으세요.
7. 안전성: 입력 검증, 인젝션, 경로/권한, 비밀값 노출, 안전하지 않은 디폴트를 확인하세요.
8. 성능·자원: 불필요한 반복, 조기 종료 부재, 할당/IO/락, 복잡도 급증 지점을 확인하세요.
9. 계약·에러 처리: API 계약, 반환 값, 예외/에러 전파, 로깅, 호출자가 복구할 수 있는지를 확인하세요.
10. 유지보수성: 이름, 중복, 매직 값, 테스트 가능 여부, 확장 시 깨지기 쉬운 지점을 확인하세요.
11. 종합: 심각도(치명/높음/중간/낮음)와 근거, 재현 조건, 구체적 수정 방향을 표나 목록으로 정리하세요. 잘된 점도 짧게 적으세요.

## 작성 규칙
- 반드시 위 1~11 순서를 지키세요. 해당 없는 단계는 "해당 없음"과 이유를 적으세요.
- 이슈는 코드 위치(함수/분기/표현식)와 왜 문제인지, 어떻게 고칠지를 함께 적으세요.
- 언어 특화 관용구가 있으면 그 언어 기준으로 리뷰하되, 언어를 단정할 수 없으면 일반적인 관점에서 리뷰하세요.
- 리뷰 결과는 한국어로 작성하세요.

## 리뷰 대상 코드
\`\`\`
${code}
\`\`\`
`
                        }
                    }
                ]
            }
        }
    )
}
