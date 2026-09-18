import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { SERVER_DESCRIPTION, SERVER_NAME } from '@/mcp/config'

export const metadata: Metadata = {
    title: SERVER_NAME,
    description: SERVER_DESCRIPTION
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ko">
            <body
                style={{
                    margin: 0,
                    fontFamily:
                        'ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
                    color: '#18181b',
                    background: '#fafafa',
                    lineHeight: 1.6
                }}
            >
                {children}
            </body>
        </html>
    )
}
