<?php

namespace App\Games\Kernel;

// This is the refactored, reusable base class.
// It uses modern, consistent naming conventions.
class BaseSlotSettings
{
    // --- COMMON PROPERTIES (camelCase) ---
    public ?string $playerId = null;
    public float $balanceInCoins = 0; // Explicitly state units
    public float $gameBank = 0;
    public int $rtpPercent = 0;
    public string $slotId = '';
    public ?object $user = null;
    public ?object $game = null;
    public ?object $shop = null;
    public array $playerSessionData = []; // Renamed from gameData for clarity

    // --- GAME-SPECIFIC PROPERTIES (to be set by child classes) ---
    public array $paytable = [];
    public array $reelStrips = [];
    public array $slotFreeCount = [];

    /**
     * The constructor now handles all common state initialization.
     * It is 'final' to ensure child classes use the 'setup' method for customization.
     */
    final public function __construct(array $gameStateData)
    {
        // 1. Initialize all common properties from the incoming state object.
        $this->playerId = $gameStateData['playerId'] ?? null;
        $this->user = (object)($gameStateData['user'] ?? []);
        $this->game = (object)($gameStateData['game'] ?? []);
        $this->shop = (object)($gameStateData['shop'] ?? []);
        $this->gameBank = $gameStateData['bank'] ?? 0;
        $this->balanceInCoins = $gameStateData['balance'] ?? 0;
        $this->rtpPercent = $gameStateData['shop']['percent'] ?? 0;
        $this->playerSessionData = $gameStateData['gameData'] ?? [];
        $this->slotId = $gameStateData['game']['name'] ?? 'unknown_game';

        // 2. Call the new abstract 'setup' method.
        // This forces each child game to define its own specific settings.
        $this->setup();
    }

    /**
     * This is where game-specific settings will be defined.
     * Each child class MUST implement this method.
     */
    protected function setup(): void
    {
        // This will be overridden by the child class to set Paytables, Reels, etc.
    }

    // --- SHARED, REUSABLE METHODS WITH CLEAR NAMES ---

    public function setSessionData(string $key, $value): void
    {
        $timeLife = 86400; // 24 hours
        $this->playerSessionData[$key] = [
            'timelife' => time() + $timeLife,
            'payload' => $value
        ];
    }

    public function getSessionData(string $key)
    {
        return $this->playerSessionData[$key]['payload'] ?? 0;
    }

    public function hasSessionData(string $key): bool
    {
        return isset($this->playerSessionData[$key]);
    }

    public function setBalanceInCoins(float $sum): void
    {
        $this->balanceInCoins += $sum;
    }

    public function getBalanceInCoins(): float
    {
        return $this->balanceInCoins;
    }

    public function setGameBank(float $sum): void
    {
        $this->gameBank += $sum;
    }

    public function getGameBank(): float
    {
        return $this->gameBank;
    }

    public function getRtpPercent(): int
    {
        return $this->rtpPercent;
    }

    public function isActive(): bool
    {
        return true;
    }

    /**
     * A more robust error logging method.
     * It ensures the log directory exists before writing the file.
     * The filename is now based on date for easier log rotation and management.
     */
    public function logError(string $errorMessage): void
    {
        try {
            // Define a single, central log directory.
            $logDir = __DIR__ . '/../logs';

            // Create the directory if it doesn't exist.
            if (!is_dir($logDir)) {
                mkdir($logDir, 0755, true);
            }

            // Use a date-based log file for better organization.
            $logFile = $logDir . '/games_error_' . date("Y-m-d") . '.log';

            // Format a clear log entry.
            $logEntry = sprintf(
                "[%s] [Game: %s] [Player: %s] :: %s\n",
                date("Y-m-d H:i:s"),
                $this->slotId,
                $this->playerId ?? 'N/A',
                $errorMessage
            );

            // Append the error to the log file.
            file_put_contents($logFile, $logEntry, FILE_APPEND);

        } catch (\Exception $e) {
            // Fallback if logging itself fails, to prevent crashing the engine.
            error_log("Failed to write to game log: " . $e->getMessage());
        }
    }
}
