<?php

namespace app\games\LuckyNewYearTigerTreasures\PragmaticLib;

class Statistic
{
    public static function setStatistic($user, $win, $game, $bank, $bet, $toSlotBank, $toJackpot, $toProfit, $fs, $slotArea, $fromJP)
    {
        if ($fromJP) {
            $addName = 'JP';
        } elseif ($fs) {
            $addName = ' FS';
        } else {
            $addName = '';
        }
        \VanguardLTE\StatGame::create([
            'user_id' => $user->id,
            'balance' => (float)$user->balance,
            'bet' => (float)$bet,
            'win' => (float)$win,
            'game' => $game->name.$addName,
            'in_game' => (float)$toSlotBank,
            'in_jpg' => (float)$toJackpot,
            'in_profit' => (float)$toProfit,
            'denomination' => $game->denomination,
            'shop_id' => $user->shop_id,
            'slots_bank' => (float)$bank->slots,
            'bonus_bank' => (float)$bank->bonus,
            'fish_bank' => (float)$bank->fish_bank,
            'table_bank' => (float)$bank->table_bank,
            'little_bank' => (float)$bank->little,
            'total_bank' => (float)$bank->slots + $bank->bonus + $bank->fish_bank + $bank->table_bank + $bank->little,
            //'symbols' => self::getSymbols($slotArea)
        ]);
    }

    private static function getSymbols($slotArea)
    {
        $symbols = [];
        foreach ($slotArea as $reel) {
            foreach ($reel as $key => $symbol) {
                $symbols[$key] = array_key_exists($key, $symbols) ? $symbols[$key].$symbol.'_' : $symbol.'_';
            }
        }
        $symbols = implode(",", $symbols);
        return $symbols;
    }
}
