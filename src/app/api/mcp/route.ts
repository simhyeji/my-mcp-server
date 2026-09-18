import { createMcpHandler } from 'mcp-handler'
import { SERVER_NAME, SERVER_VERSION } from '@/mcp/config'
import { registerAll } from '@/mcp/register'

export const runtime = 'nodejs'
export const maxDuration = 60

const handler = createMcpHandler(registerAll, {
    serverInfo: { name: SERVER_NAME, version: SERVER_VERSION }
})

export { handler as GET, handler as POST }
