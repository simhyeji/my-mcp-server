export const SERVER_NAME = 'my-mcp-server'
export const SERVER_VERSION = '2.0.0'
export const SERVER_DESCRIPTION =
    '인사, 계산, 시간, 지오코딩, 날씨 조회, 이미지 생성을 제공하는 MCP 서버'

export const TOOL_NAMES = [
    'greet',
    'calculator',
    'global_time',
    'geocode',
    'get_weather',
    'generate-image'
] as const

export const RESOURCE_NAMES = ['server-info'] as const
export const PROMPT_NAMES = ['code_review'] as const
