<?php
namespace app\games\CreatureFromTheBlackLagoonNET;

class SlotSettings2.php2Php2.php
{
    public $playerId = null;
    public $splitScreen = null;
    public $reelStrip1 = [];
    public $reelStrip2 = [];
    public $reelStrip3 = [];
    public $reelStrip4 = [];
    public $reelStrip5 = [];
    public $reelStrip6 = [];
    public $reelStripBonus1 = [];
    public $reelStripBonus2 = [];
    public $reelStripBonus3 = [];
    public $reelStripBonus4 = [];
    public $reelStripBonus5 = [];
    public $reelStripBonus6 = [];
    public $slotId = '';
    public $slotDBId = '';
    public $Line = [];
    public $scaleMode = null;
    public $numFloat = null;
    public $gameLine = [];
    public $Bet = [];
    public $isBonusStart = null;
    public $Balance = 0;
    public $SymbolGame = [];
    public $GambleType = null;
    public $lastEvent = null;
    public $Jackpots = [];
    public $keyController = null;
    public $slotViewState = null;
    public $hideButtons = null;
    public $slotReelsConfig = null;
    public $slotFreeCount = null;
    public $slotFreeMpl = null;
    public $slotWildMpl = null;
    public $slotExitUrl = null;
    public $slotBonus = null;
    public $slotBonusType = null;
    public $slotScatterType = null;
    public $slotGamble = null;
    public $Paytable = [];
    public $slotSounds = [];
    public $jpgs = null;
    private $Bank = 0;
    private $Percent = 0;
    private $WinLine = null;
    private $WinGamble = 0;
    private $Bonus = null;
    private $shop_id = null;
    public $currency = null;
    public $user = null;
    public $game = null;
    public $shop = null;
    public $jpgPercentZero = false;
    public $count_balance = null;
    public $gameData = [];
    public $gameDataStatic = [];

    public $MaxWin = 0;
    public $CurrentDenom = 1;
    public $increaseRTP = 1;
    public $slotFastStop = 1;
    public $Denominations = [];
    public $CurrentDenomination = 1; // Will be updated by CurrentDenom value
    public $slotJackPercent = [];
    public $slotJackpot = [];
    public $AllBet = 0;
    public $slotCurrency = '';

    public function __construct($gameStateData)
    {
        $this->playerId = $gameStateData['playerId'] ?? null;
        $this->user = (object)($gameStateData['user'] ?? []);
        $this->game = (object)($gameStateData['game'] ?? []);
        $this->shop = (object)($gameStateData['shop'] ?? []);
        $this->Bank = $gameStateData['bank'] ?? 0;
        $this->Balance = $gameStateData['balance'] ?? 0;
        $this->Percent = $gameStateData['shop']['percent'] ?? 0; // Ensure 'shop' key exists or handle error
        $this->gameData = $gameStateData['gameData'] ?? [];
        $this->gameDataStatic = $gameStateData['gameDataStatic'] ?? [];
        $this->currency = $gameStateData['currency'] ?? '';
        $this->slotId = $gameStateData['game']['name'] ?? 'CreatureFromTheBlackLagoonNET';
        $this->slotDBId = $gameStateData['game']['id'] ?? '';
        $this->MaxWin = $gameStateData['shop']['max_win'] ?? 0;
        $this->shop_id = $gameStateData['user']['shop_id'] ?? 0;
        $this->count_balance = $gameStateData['user']['count_balance'] ?? 0;

        $this->Denominations = isset($gameStateData['game']['denominations_list']) && is_array($gameStateData['game']['denominations_list']) ? $gameStateData['game']['denominations_list'] : (isset($gameStateData['game']['denominations_list']) ? explode(',', $gameStateData['game']['denominations_list']) : []);
        $this->CurrentDenom = $gameStateData['game']['denomination'] ?? (!empty($this->Denominations) ? $this->Denominations[0] : 1);
        $this->CurrentDenomination = $this->CurrentDenom;

        $this->increaseRTP = $gameStateData['game']['increaseRTP'] ?? 1;
        $this->slotFastStop = $gameStateData['game']['slotFastStop'] ?? 1;
        $this->slotJackPercent = $gameStateData['game']['slotJackPercent'] ?? [];
        $this->slotJackpot = $gameStateData['game']['slotJackpot'] ?? [];
        $this->slotCurrency = $gameStateData['currency'] ?? ($this->shop->currency ?? '');
        $this->jpgs = $gameStateData['jpgs'] ?? [];


        $this->scaleMode = 0; // Default or from $gameStateData if available
        $this->numFloat = 0; // Default or from $gameStateData if available
            $this->Paytable['SYM_0'] = [0,0,0,0,0,0];
            $this->Paytable['SYM_1'] = [0,0,0,0,0,0]; // Typically Wild or Scatter, check game rules
            $this->Paytable['SYM_2'] = [0,0,0,0,0,0]; // Typically Wild or Scatter, check game rules
            $this->Paytable['SYM_3'] = [0,0,0,25,250,750];
            $this->Paytable['SYM_4'] = [0,0,0,20,200,600];
            $this->Paytable['SYM_5'] = [0,0,0,15,150,500];
            $this->Paytable['SYM_6'] = [0,0,0,10,100,400];
            $this->Paytable['SYM_7'] = [0,0,0,5,40,125];
            $this->Paytable['SYM_8'] = [0,0,0,5,40,125];
            $this->Paytable['SYM_9'] = [0,0,0,4,30,100];
            $this->Paytable['SYM_10'] = [0,0,0,4,30,100];

            $reel = new GameReel(); // Ensure GameReel is available in this namespace or use FQCN
            foreach (['reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5', 'reelStrip6'] as $reelStrip) {
                if (isset($reel->reelsStrip[$reelStrip]) && count($reel->reelsStrip[$reelStrip])) {
                    $this->$reelStrip = $reel->reelsStrip[$reelStrip];
                }
            }
            // Bonus reels if they exist in GameReel.php
            foreach (['reelStripBonus1', 'reelStripBonus2', 'reelStripBonus3', 'reelStripBonus4', 'reelStripBonus5', 'reelStripBonus6'] as $reelStrip) {
                if (isset($reel->reelsStripBonus[$reelStrip]) && count($reel->reelsStripBonus[$reelStrip])) {
                    $this->$reelStrip = $reel->reelsStripBonus[$reelStrip];
                }
            }

            $this->keyController = $gameStateData['game']['keyController'] ?? [
                '13' => 'uiButtonSpin,uiButtonSkip', '49' => 'uiButtonInfo', '50' => 'uiButtonCollect', '51' => 'uiButtonExit2', '52' => 'uiButtonLinesMinus', '53' => 'uiButtonLinesPlus', '54' => 'uiButtonBetMinus', '55' => 'uiButtonBetPlus', '56' => 'uiButtonGamble', '57' => 'uiButtonRed', '48' => 'uiButtonBlack', '189' => 'uiButtonAuto', '187' => 'uiButtonSpin'
            ];
            $this->slotReelsConfig = $gameStateData['game']['slotReelsConfig'] ?? [
                [425,142,3], [669,142,3], [913,142,3], [1157,142,3], [1401,142,3]
            ];
            $this->slotBonusType = $gameStateData['game']['slotBonusType'] ?? 1;
            $this->slotScatterType = $gameStateData['game']['slotScatterType'] ?? 0; // Assuming 0 is a valid default
            $this->splitScreen = $gameStateData['game']['splitScreen'] ?? false;
            $this->slotBonus = $gameStateData['game']['slotBonus'] ?? true;
            $this->slotGamble = $gameStateData['game']['slotGamble'] ?? true;
            $this->slotExitUrl = $gameStateData['game']['slotExitUrl'] ?? '/';
            $this->slotWildMpl = $gameStateData['game']['slotWildMpl'] ?? 1;
            $this->GambleType = $gameStateData['game']['GambleType'] ?? 1;

            $this->slotFreeCount = $gameStateData['game']['slotFreeCount'] ?? [0,0,0,10,15,20];
            $this->slotFreeMpl = $gameStateData['game']['slotFreeMpl'] ?? 1;
            $this->slotViewState = $gameStateData['game']['slotViewState'] ?? 'Normal';
            $this->hideButtons = $gameStateData['game']['hideButtons'] ?? [];

            $this->Line = isset($gameStateData['game']['lines']) ? (is_array($gameStateData['game']['lines']) ? $gameStateData['game']['lines'] : explode(',', $gameStateData['game']['lines'])) : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
            $this->gameLine = isset($gameStateData['game']['gameLine']) ? (is_array($gameStateData['game']['gameLine']) ? $gameStateData['game']['gameLine'] : explode(',', $gameStateData['game']['gameLine'])) : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
            $this->Bet = isset($gameStateData['game']['bet']) ? (is_array($gameStateData['game']['bet']) ? $gameStateData['game']['bet'] : explode(',', $gameStateData['game']['bet'])) : [];

            $this->SymbolGame = $gameStateData['game']['SymbolGame'] ?? ['1','2','3','4','5','6','7','8','9','10','11','12','13']; // Ensure '13' is intended
            $this->WinGamble = $gameStateData['game']['rezerv'] ?? 0; // rezerv is WinGamble

            if (($this->user->address ?? 0) > 0 && $this->count_balance == 0) {
                $this->Percent = 0;
                $this->jpgPercentZero = true;
            } elseif ($this->count_balance == 0) {
                $this->Percent = 100;
            }
        }

        public function is_active()
        {
            return true;
        }

        public function SetGameData($key, $value)
        {
            $timeLife = 86400;
            $this->gameData[$key] = [
                'timelife' => time() + $timeLife,
                'payload' => $value
            ];
        }

        public function GetGameData($key)
        {
            if (isset($this->gameData[$key])) {
                return $this->gameData[$key]['payload'];
            } else {
                return 0;
            }
        }

        public function FormatFloat($num)
        {
            $str0 = explode('.', $num);
            if (isset($str0[1])) {
                if (strlen($str0[1]) > 4) {
                    return round($num * 100) / 100;
                } else if (strlen($str0[1]) > 2) {
                    return floor($num * 100) / 100;
                } else {
                    return $num;
                }
            } else {
                return $num;
            }
        }

        public function SaveGameData()
        {
            // This method will do nothing as game data is not saved back to user session from here.
        }

        public function CheckBonusWin()
        {
            $allRateCnt = 0;
            $allRate = 0;
            foreach ($this->Paytable as $vl) {
                foreach ($vl as $vl2) {
                    if ($vl2 > 0) {
                        $allRateCnt++;
                        $allRate += $vl2;
                        break;
                    }
                }
            }
            return $allRateCnt > 0 ? $allRate / $allRateCnt : 0; // Avoid division by zero
        }

        public function GetRandomPay()
        {
            $allRate = [];
            foreach ($this->Paytable as $vl) {
                foreach ($vl as $vl2) {
                    if ($vl2 > 0) {
                        $allRate[] = $vl2;
                    }
                }
            }
            shuffle($allRate);
            // Ensure $this->game is an object and stat_in/stat_out are accessible
            $statIn = (isset($this->game->stat_in) ? $this->game->stat_in : 0);
            $statOut = (isset($this->game->stat_out) ? $this->game->stat_out : 0);
            if ($statIn < ($statOut + ($allRate[0] * $this->AllBet))) {
                $allRate[0] = 0;
            }
            return $allRate[0] ?? 0; // Return 0 if allRate is empty
        }

        public function HasGameDataStatic($key)
        {
            if (isset($this->gameDataStatic[$key])) {
                return true;
            } else {
                return false;
            }
        }

        public function SaveGameDataStatic()
        {
            // This method will do nothing.
        }

        public function SetGameDataStatic($key, $value)
        {
            $timeLife = 86400;
            $this->gameDataStatic[$key] = [
                'timelife' => time() + $timeLife,
                'payload' => $value
            ];
        }

        public function GetGameDataStatic($key)
        {
            if (isset($this->gameDataStatic[$key])) {
                return $this->gameDataStatic[$key]['payload'];
            } else {
                return 0;
            }
        }

        public function HasGameData($key)
        {
            if (isset($this->gameData[$key])) {
                return true;
            } else {
                return false;
            }
        }

        public function GetHistory()
        {
            return 'NULL'; // History is no longer managed here
        }

        public function UpdateJackpots($bet)
        {
            // This method will do nothing.
            $this->Jackpots = [];
        }

        public function GetBank($slotState = '')
        {
            // Bank is now a simple property, not fetched dynamically based on slotState from game object
            return $this->Bank;
        }

        public function GetPercent()
        {
            return $this->Percent;
        }

        public function GetCountBalanceUser()
        {
            return $this->count_balance;
        }

        public function InternalError($errcode)
        {
            $strLog = '';
            $strLog .= "\n";
            $strLog .= ('{"responseEvent":"error","responseType":"' . $errcode . '","serverResponse":"InternalError","request":' . json_encode($_REQUEST) . ',"requestRaw":' . file_get_contents('php://input') . '}');
            $strLog .= "\n";
            $strLog .= ' ############################################### ';
            $strLog .= "\n";
            $slg = '';
            $logPath = __DIR__ . '/logs/' . $this->slotId . 'Internal.log';
            if (file_exists($logPath)) {
                $slg = file_get_contents($logPath);
            }
            file_put_contents($logPath, $slg . $strLog);
            exit('');
        }

        public function InternalErrorSilent($errcode)
        {
            $strLog = '';
            $strLog .= "\n";
            $strLog .= ('{"responseEvent":"error","responseType":"' . $errcode . '","serverResponse":"InternalError","request":' . json_encode($_REQUEST) . ',"requestRaw":' . file_get_contents('php://input') . '}');
            $strLog .= "\n";
            $strLog .= ' ############################################### ';
            $strLog .= "\n";
            $slg = '';
            // $logPath = __DIR__ . '/logs/' . $this->slotId . '/Internal.log';
            $logPath = __DIR__ . '/logs/' . 'Internal.log';
            if (file_exists($logPath)) {
                $slg = file_get_contents($logPath);
            }
            file_put_contents($logPath, $slg . $strLog);
        }

        public function SetBank($sum, $slotState = '',  $slotEvent = '')
        {
            // Simplified: just update the Bank property.
            // Complex logic related to game banks, percentages, etc. is removed.
            if ($this->Bank + $sum < 0) {
                 // It's good practice to check this, but the original InternalError call used GetBank($slotState)
                 // which now behaves differently. We'll check against the current Bank property.
                 // $this->InternalError('Bank_   ' . $sum . '  CurrentBank_ ' . $this->Bank . ' CurrentState_ ' . $slotState . ' Trigger_ ' . ($this->Bank + $sum));
            }
            $this->Bank += $sum;
        }

        public function SetBalance($sum, $slotEvent = '')
        {
            // Simplified: just update the Balance property.
            // Complex logic related to user balance, count_balance, address, etc. is removed.
            if ($this->Balance + $sum < 0) {
                // $this->InternalError('Balance_   ' . $sum); // Original check
            }
            $this->Balance += $sum;
        }

        public function GetBalance()
        {
            // Balance is now a simple property.
            return $this->Balance;
        }

        public function SaveLogReport($spinSymbols, $bet, $lines, $win, $slotState)
        {
            // This method will do nothing.
        }

        public function getNewSpin($game,  $lines, $spinWin = 0, $bonusWin = 0, $garantType = 'bet')
        {
            $curField = 10; // Default
            switch ($lines) {
                case 10: $curField = 10; break;
                case 9: case 8: $curField = 9; break;
                case 7: case 6: $curField = 7; break;
                case 5: case 4: $curField = 5; break;
                case 3: case 2: $curField = 3; break;
                case 1: $curField = 1; break;
            }
            $pref = ($garantType != 'bet') ? '_bonus' : '';
            $win = []; // Initialize win array

            // $game here is expected to be $this->game, which should have 'game_win' property
            $gameWinConfig = (array)($this->game->game_win ?? []);

            if ($spinWin && isset($gameWinConfig['winline' . $pref . $curField])) {
                $win = explode(',', $gameWinConfig['winline' . $pref . $curField]);
            } elseif ($bonusWin && isset($gameWinConfig['winbonus' . $pref . $curField])) {
                $win = explode(',', $gameWinConfig['winbonus' . $pref . $curField]);
            }

            if (!empty($win)) {
                $number = rand(0, count($win) - 1);
                return $win[$number];
            }
            return 0; // Default return if no win lines found or applicable
        }

        public function GetRandomScatterPos($rp)
        {
            $rpResult = [];
            if(!is_array($rp)) return rand(2, 5); // Basic fallback if $rp is not an array
            for ($i = 0; $i < count($rp); $i++) {
                // Original logic used '0' as scatter symbol for this game.
                // If scatter symbol is different, this needs adjustment.
                if ($rp[$i] == '0') { // Assuming '0' is the scatter symbol identifier
                    if (isset($rp[$i + 1]) && isset($rp[$i - 1])) {
                        array_push($rpResult, $i);
                    }
                    if (isset($rp[$i - 1]) && isset($rp[$i - 2])) {
                        array_push($rpResult, $i - 1);
                    }
                    if (isset($rp[$i + 1]) && isset($rp[$i + 2])) {
                        array_push($rpResult, $i + 1);
                    }
                }
            }
            shuffle($rpResult);
            if (!isset($rpResult[0])) {
                 // Fallback if no suitable scatter positions found based on '0'
                return rand(2, count($rp) - 3); // Ensure this range is valid for reel strips
            }
            return $rpResult[0];
        }

        public function GetGambleSettings()
        {
            $spinWin = rand(1, max(1, (int)$this->WinGamble)); // Ensure WinGamble is at least 1
            return $spinWin;
        }

        public function GetReelStrips($winType, $slotEvent)
        {
            // $game = $this->game; // $this->game is already an object property
            if ($slotEvent == 'freespin') {
                $reel = new GameReel(); // Assumes GameReel has reelsStripBonus defined
                if (isset($reel->reelsStripBonus) && is_array($reel->reelsStripBonus)) {
                    $fArr = $reel->reelsStripBonus; // Use a copy for manipulation
                    foreach (['reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5', 'reelStrip6'] as $reelStripKey) {
                         // Check if $fArr has elements and the specific bonus reel strip exists
                        if (!empty($fArr) && isset($reel->reelsStripBonus[$reelStripKey]) && count($reel->reelsStripBonus[$reelStripKey])) {
                            // This part of original logic seems problematic: array_shift($fArr) shifts the outer array,
                            // not assigning specific named bonus reels.
                            // Correct approach: assign the specific bonus reel strip if available.
                            $this->$reelStripKey = $reel->reelsStripBonus[$reelStripKey];
                        } elseif (isset($reel->reelsStrip[$reelStripKey])) { // Fallback to normal reels if bonus not specific
                            $this->$reelStripKey = $reel->reelsStrip[$reelStripKey];
                        }
                    }
                }
            }

            $prs = [];
            $reelStripsToProcess = ['reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5']; // Creature has 5 reels
            // $reelStripsToProcess = ['reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5', 'reelStrip6']; // If 6 reels

            if ($winType != 'bonus') {
                foreach ($reelStripsToProcess as $index => $reelStrip) {
                    if (is_array($this->$reelStrip) && count($this->$reelStrip) > 2) { // Need at least 3 symbols to pick middle one
                        $prs[$index + 1] = mt_rand(0, count($this->$reelStrip) - 3);
                    } else {
                        $prs[$index + 1] = 0; // Default if reel strip is too short or not an array
                    }
                }
            } else { // Bonus win type - try to place scatters
                $reelsId = [];
                foreach ($reelStripsToProcess as $index => $reelStrip) {
                    if (is_array($this->$reelStrip) && count($this->$reelStrip) > 2) {
                         // GetRandomScatterPos needs the reel strip array.
                        $prs[$index + 1] = $this->GetRandomScatterPos($this->$reelStrip);
                        $reelsId[] = $index + 1;
                    } else {
                        $prs[$index + 1] = 0;
                    }
                }

                if (!empty($reelsId)) {
                     // Logic for ensuring scatter count, adapted from original
                    $scattersCnt = rand(3, count($reelsId)); // Ensure at least 3 scatters if possible
                    shuffle($reelsId);
                    for ($i = 0; $i < count($reelsId); $i++) {
                        $currentReelId = $reelsId[$i];
                        $currentReelStripName = 'reelStrip' . $currentReelId;
                        if ($i < $scattersCnt) {
                            // Re-calculate scatter position for designated scatter reels
                            $prs[$currentReelId] = $this->GetRandomScatterPos($this->$currentReelStripName);
                        } else {
                            // For non-scatter reels, pick a random position that's not a scatter (if possible)
                            // This part of the logic might need refinement if specific non-scatter symbols are required.
                            // For now, just a random position.
                            if (is_array($this->$currentReelStripName) && count($this->$currentReelStripName) > 2) {
                                $prs[$currentReelId] = rand(0, count($this->$currentReelStripName) - 3);
                            } else {
                                $prs[$currentReelId] = 0;
                            }
                        }
                    }
                }
            }

            $reel = ['rp' => []];
            foreach ($prs as $index => $value) {
                $reelStripName = 'reelStrip' . $index;
                $key = $this->$reelStripName;
                if (is_array($key) && count($key) > 0) {
                    $cnt = count($key);
                    // Circular array access helper
                    $safe_key_access = function($k_arr, $idx) use ($cnt) {
                        if ($idx < 0) return $k_arr[$cnt + $idx];
                        if ($idx >= $cnt) return $k_arr[$idx % $cnt];
                        return $k_arr[$idx];
                    };

                    // Ensure value is within bounds for array access after mt_rand
                    $value = max(0, min($value, $cnt - 1));

                    // Check if reel has enough symbols for $value-1, $value, $value+1
                    if ($cnt >= 3) {
                         // Adjust value if it's at the very beginning or end to allow for -1 and +1 indexing safely with circular logic
                        if ($value == 0) $actual_value_for_rp = 1; // Use index 1 if value is 0 to avoid -1 issues with simple array access
                        elseif ($value == $cnt -1) $actual_value_for_rp = $cnt - 2; // use index cnt-2 if value is at the end
                        else $actual_value_for_rp = $value;

                        $reel['reel' . $index][0] = $safe_key_access($key, $actual_value_for_rp - 1);
                        $reel['reel' . $index][1] = $safe_key_access($key, $actual_value_for_rp);
                        $reel['reel' . $index][2] = $safe_key_access($key, $actual_value_for_rp + 1);
                    } elseif ($cnt > 0) { // If less than 3 symbols, just repeat the first one or adapt logic
                        $reel['reel' . $index][0] = $key[0];
                        $reel['reel' . $index][1] = $key[0];
                        $reel['reel' . $index][2] = $key[0];
                    } else { // Empty reel strip
                        $reel['reel' . $index][0] = 0; // Default symbol
                        $reel['reel' . $index][1] = 0;
                        $reel['reel' . $index][2] = 0;
                    }

                    $reel['reel' . $index][3] = ''; // Seems to be an unused placeholder in original
                    $reel['rp'][] = $value; // Store original random position
                } else { // Fallback for non-array or empty reel strip
                     $reel['reel' . $index][0] = 0; $reel['reel' . $index][1] = 0; $reel['reel' . $index][2] = 0; $reel['reel' . $index][3] = '';
                     $reel['rp'][] = 0;
                }
            }
            return $reel;
        }
    }