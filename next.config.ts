import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    turbopack: {
        root: import.meta.dirname
    },
    agentRules: false
}

export default nextConfig
