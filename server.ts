// clean-server.ts
import path from 'path'
import { type BunFile } from 'bun'

// Define types first to avoid hoisting issues
type SymbolConfig = {
    WILD: number
    SCATTER: number
    BONUS: number
    WILD_2X: number
    WILD_3X: number
    [key: string]: number
}

type VirtualReels = {
    above: number[][]
    below: number[][]
}

// A single, consolidated MachineState type
type MachineState = {
    view: number[][]
    payLines: number[][]
    betPerLine: number
    totalBet: number
    payTable: number[][]
    reels: number[][]
    winMoney: number
    totalWin: number
    SYMBOLS: SymbolConfig
    winLines: any[]
    rwd: string
    currentGame: string
    virtualReels: VirtualReels
    updated_at: string
}

type PlayerData = {
    id: string
    balance: number
    bet_per_line: number
    total_bet: number
    view_cache: any // Can be refined if the structure is known
    created_at: string
    updated_at: string
    machine: MachineState
}

// Game configuration constants
const SYMBOLS: SymbolConfig = {
    WILD: 13, // Regular wild
    SCATTER: 7, // Scatter symbol
    BONUS: 14, // Bonus symbol
    WILD_2X: 20, // 2x wild multiplier
    WILD_3X: 200, // 3x wild multiplier
}

// payTable[matchCount][symbol] = multiplier
const payTable: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // matchCount 0 (unused)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // matchCount 1 (unused)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // matchCount 2 (unused)
    [0, 0, 0, 1000, 200, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0], // matchCount 3
    [0, 0, 0, 400, 100, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0], // matchCount 4
    [0, 0, 0, 250, 75, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0], // matchCount 5
]

// Define reels configuration (5 reels with their symbol distributions)
const reelsConfig = [
    [
        7, 10, 3, 8, 11, 5, 13, 4, 12, 6, 9, 8, 10, 5, 13, 11, 8, 9, 4, 12, 7,
        10, 13, 11, 8, 9, 6, 11, 8, 7, 12, 3, 10, 13, 8, 6, 10, 12, 5, 9, 8, 11,
    ],
    [
        7, 10, 3, 8, 11, 5, 13, 4, 12, 6, 9, 8, 10, 5, 13, 11, 8, 9, 4, 12, 7,
        10, 13, 11, 8, 9, 6, 11, 8, 7, 12, 3, 10, 13, 8, 6, 10, 12, 5, 9, 8, 11,
    ],
    [
        7, 10, 3, 8, 11, 5, 13, 4, 12, 6, 9, 8, 10, 5, 13, 11, 8, 9, 4, 12, 7,
        10, 13, 11, 8, 9, 6, 11, 8, 7, 12, 3, 10, 13, 8, 6, 10, 12, 5, 9, 8, 11,
    ],
    [
        7, 10, 3, 8, 11, 5, 13, 4, 12, 6, 9, 8, 10, 5, 13, 11, 8, 9, 4, 12, 7,
        10, 13, 11, 8, 9, 6, 11, 8, 7, 12, 3, 10, 13, 8, 6, 10, 12, 5, 9, 8, 11,
    ],
    [
        7, 10, 3, 8, 11, 5, 13, 4, 12, 6, 9, 8, 10, 5, 13, 11, 8, 9, 4, 12, 7,
        10, 13, 11, 8, 9, 6, 11, 8, 7, 12, 3, 10, 13, 8, 6, 10, 12, 5, 9, 8, 11,
    ],
]

const payLinesConfig = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [0, 6, 12, 8, 4],
    [10, 6, 2, 8, 14],
    [0, 1, 7, 13, 14],
    [10, 11, 7, 3, 4],
    [5, 1, 2, 3, 9],
    [5, 11, 12, 13, 9],
    [0, 11, 12, 8, 4],
    [10, 1, 2, 8, 14],
    [0, 6, 7, 8, 4],
    [10, 6, 7, 8, 14],
    [5, 6, 2, 8, 9],
    [5, 6, 12, 8, 9],
    [0, 6, 12, 8, 14],
    [10, 6, 2, 8, 4],
    [5, 1, 7, 13, 9],
    [5, 11, 7, 3, 9],
    [0, 11, 7, 3, 4],
]

// Simple in-memory store for player data
const players: Map<string, PlayerData> = new Map()

// Helper function to get the current file and line for logging
function getCallerInfo(): string {
    const stack = new Error().stack?.split('\n') || []
    // The 4th line in the stack trace is the caller of the log function
    const callerLine = stack[3]?.trim() || ''
    const match = callerLine.match(/at\s+.+\s+\((.+):(\d+):(\d+)\)/)
    if (match) {
        const filePath = match[1].split('/').pop() || 'unknown'
        return `${filePath}:${match[2]}`
    }
    return 'unknown:0'
}

// Helper function to log with file and line info
function log(message: string, level: 'info' | 'error' | 'debug' = 'info') {
    const timestamp = new Date().toISOString()
    const callerInfo = getCallerInfo()
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${callerInfo}] ${message}`

    if (level === 'error') {
        console.error(logMessage)
    } else if (level === 'debug') {
        console.debug(logMessage)
    } else {
        console.log(logMessage)
    }
}

// Safely get player data or throw an error
function getPlayer(playerId: string): PlayerData {
    const player = players.get(playerId)
    if (!player) {
        throw new Error(`Player not found: ${playerId}`)
    }
    return player
}

// Single helper function to update player state safely
function updatePlayerState(
    playerId: string,
    updateFn: (player: PlayerData) => void
): void {
    const player = getPlayer(playerId)
    updateFn(player)
    player.updated_at = new Date().toISOString()
    players.set(playerId, player)
}

// Helper function to create a new player
function createPlayer(
    id: string,
    initialBalance: number = 10000,
    betPerLine: number = 100
): PlayerData {
    const totalBet = betPerLine * payLinesConfig.length

    // Generate initial view for the slot machine
    const initialView: number[][] = []
    for (let i = 0; i < 5; i++) {
        const reel = reelsConfig[i]
        const randomIndex = Math.floor(Math.random() * reel.length)
        const reelView = [
            reel[randomIndex],
            reel[(randomIndex + 1) % reel.length],
            reel[(randomIndex + 2) % reel.length],
        ]
        initialView.push(reelView)
    }

    return {
        id,
        balance: initialBalance,
        bet_per_line: betPerLine,
        total_bet: totalBet,
        view_cache: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        machine: {
            view: initialView,
            payLines: payLinesConfig,
            betPerLine,
            totalBet,
            payTable,
            reels: reelsConfig,
            winMoney: 0,
            totalWin: 0,
            SYMBOLS,
            winLines: [],
            rwd: '',
            currentGame: 'BASE',
            virtualReels: {
                above: Array(5)
                    .fill(0)
                    .map(() => Array(3).fill(0)),
                below: Array(5)
                    .fill(0)
                    .map(() => Array(3).fill(0)),
            },
            updated_at: new Date().toISOString(),
        },
    }
}

// Helper function to send JSON responses
function jsonResponse(data: any, status = 200): Response {
    console.log(data)
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    })
}

// Helper function to serve static files
async function serveStaticFile(filePath: string): Promise<Response> {
    try {
        if (filePath.endsWith('/')) {
            filePath = path.join(filePath, 'index.html')
        }

        const mimeTypes: Record<string, string> = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
        }

        const fullPath = path.join(import.meta.dir, 'public', filePath)
        const file: BunFile = Bun.file(fullPath)
        const exists = await file.exists()

        if (!exists) {
            log(`File not found: ${fullPath}`, 'error')
            return new Response('File not found', { status: 404 })
        }

        const ext = path.extname(filePath).toLowerCase()
        const contentType = mimeTypes[ext] || 'application/octet-stream'

        return new Response(file, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
        })
    } catch (error) {
        log(`Error serving static file: ${error}`, 'error')
        return new Response('Internal Server Error', { status: 500 })
    }
}

// Request handler
const server = Bun.serve({
    port: 3009,
    async fetch(req) {
        const url = new URL(req.url)
        const pathname = url.pathname

        if (req.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            })
        }

        if (!pathname.startsWith('/api/')) {
            return serveStaticFile(pathname === '/' ? 'index.html' : pathname)
        }

        // API Routes
        try {
            if (pathname === '/api/init' && req.method === 'POST') {
                const playerId = 'test-player-1'
                let player = players.get(playerId)

                if (!player) {
                    player = createPlayer(playerId, 1000000, 100)
                    players.set(playerId, player)
                    log(`New player created: ${playerId}`)
                } else {
                    log(`Player already exists: ${playerId}`)
                }

                // The InitApi might modify the player state, so we pass the player object.
                // Assuming ApiManager is defined elsewhere and handles its own logic.
                // const initResult = apiManager.InitApi(player, {});

                return jsonResponse({
                    success: true,
                    player,
                    // ...initResult, // Spread result from an API manager if needed
                })
            }

            if (pathname === '/api/spin') {
                // let playerId = url.searchParams.get('playerId')
                const body = await req.json()
                const playerId = body.playerId
                console.log(playerId)
                if (!playerId) {
                    return jsonResponse({ error: 'Player ID is required' }, 400)
                }

                const player = getPlayer(playerId)
                const totalBet = player.total_bet

                if (player.balance < totalBet) {
                    return jsonResponse({ error: 'Insufficient balance' }, 400)
                }

                // Generate a new view
                const newView: number[][] = []
                for (let i = 0; i < 5; i++) {
                    const reel = player.machine.reels[i]
                    const randomIndex = Math.floor(Math.random() * reel.length)
                    const reelView = [
                        reel[randomIndex],
                        reel[(randomIndex + 1) % reel.length],
                        reel[(randomIndex + 2) % reel.length],
                    ]
                    newView.push(reelView)
                }
                const flatView = newView.flat()

                // Calculate wins
                let winAmount = 0
                const winningLines: any[] = []

                for (
                    let lineIndex = 0;
                    lineIndex < player.machine.payLines.length;
                    lineIndex++
                ) {
                    const line = player.machine.payLines[lineIndex]
                    const lineSymbols = line.map((pos: number) => flatView[pos])

                    let paySymbol =
                        lineSymbols.find(
                            (s) =>
                                s !== SYMBOLS.WILD &&
                                s !== SYMBOLS.WILD_2X &&
                                s !== SYMBOLS.WILD_3X
                        ) ?? SYMBOLS.WILD

                    let matchCount = 0
                    for (const symbol of lineSymbols) {
                        if (
                            symbol === paySymbol ||
                            symbol === SYMBOLS.WILD ||
                            symbol === SYMBOLS.WILD_2X ||
                            symbol === SYMBOLS.WILD_3X
                        ) {
                            matchCount++
                        } else {
                            break
                        }
                    }

                    if (matchCount >= 3) {
                        const winMultiplier =
                            player.machine.payTable[matchCount]?.[paySymbol] ||
                            0

                        let wildMultiplier = 1
                        for (let i = 0; i < matchCount; i++) {
                            const symbol = lineSymbols[i]
                            if (symbol === SYMBOLS.WILD_2X) wildMultiplier *= 2
                            if (symbol === SYMBOLS.WILD_3X) wildMultiplier *= 3
                        }

                        const lineWin =
                            player.machine.betPerLine *
                            winMultiplier *
                            wildMultiplier

                        if (lineWin > 0) {
                            winAmount += lineWin
                            winningLines.push({
                                line: lineIndex + 1,
                                symbol: paySymbol,
                                count: matchCount,
                                win: lineWin,
                                multiplier: winMultiplier * wildMultiplier,
                                isWildMultiplied: wildMultiplier > 1,
                            })
                        }
                    }
                }

                // Update player state in one go
                updatePlayerState(playerId, (p) => {
                    p.balance += winAmount - totalBet // Correct balance update
                    p.machine.winMoney = winAmount
                    p.machine.totalWin = winAmount
                    p.machine.winLines = winningLines
                    p.machine.view = newView
                })

                const updatedPlayer = getPlayer(playerId) // get the fresh state

                return jsonResponse({
                    success: true,
                    player: updatedPlayer,
                    win: winAmount,
                    balance: updatedPlayer.balance,
                    view: flatView,
                    isWin: winAmount > 0,
                    winLines: winningLines,
                })
            }

            if (pathname === '/api/collect' && req.method === 'POST') {
                const playerId = 'test-player-1' // Or get from body/params
                const player = getPlayer(playerId)

                const winAmount = player.machine.totalWin

                // Reset win information on collect
                updatePlayerState(playerId, (p) => {
                    p.machine.winMoney = 0
                    p.machine.totalWin = 0
                    p.machine.winLines = []
                })

                return jsonResponse({
                    success: true,
                    winAmount,
                    balance: player.balance,
                })
            }

            return jsonResponse({ success: false, error: 'Not found' }, 404)
        } catch (error) {
            log(`Server error on path ${pathname}: ${error}`, 'error')
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'
            return jsonResponse(
                {
                    success: false,
                    error: 'Internal server error',
                    message: errorMessage,
                },
                500
            )
        }
    },
})

log(`Game server running at http://localhost:${server.port}`)

process.on('SIGINT', () => {
    log('Shutting down server...')
    process.exit(0)
})

export {}
