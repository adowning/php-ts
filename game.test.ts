// test/game.test.ts
import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import type { PlayerData } from '../../models/types/global';

// Import with default import syntax
import ApiManager from '../../models/app/games/100_AladdinSorcer/AladdinSorcerApiManager.js';
import SlotMachine from '../../models/app/games/100_AladdinSorcer/AladdinSorcerSlotMachine.js';

describe('Aladdin & Sorcerer Slot Game', () => {
  let apiManager: InstanceType<typeof ApiManager>;
  let slotMachine: InstanceType<typeof SlotMachine>;

  beforeAll(() => {
    apiManager = new ApiManager();
    slotMachine = new SlotMachine();
  });

  test('should initialize game with default values', () => {
    const player = {
      id: 'test-player',
      balance: 10000,
      betPerLine: 10,
      totalBet: 200
    };

    const result = apiManager.InitApi(player, {});

    expect(result).toBeDefined();
    expect(result.balance).toBe('10000.00');
    expect(result.rtp).toBe('96.23');
    expect(result.l).toBe('20'); // line count
  });

  test('should process a base game spin', () => {
    const player = {
      id: 'test-player',
      balance: 10000,
      betPerLine: 10,
      totalBet: 200
    };

    // First initialize the game
    apiManager.InitApi(player, {});

    // Then process a spin
    const spinResult = slotMachine.SpinFromPattern(player);

    expect(spinResult).toBeDefined();
    expect(spinResult.winMoney).toBeDefined();
    expect(Array.isArray(spinResult.view)).toBe(true);
    expect(spinResult.view.length).toBeGreaterThan(0);
  });

  test('should handle free spin trigger', () => {
    const player = {
      id: 'test-player',
      balance: 10000,
      betPerLine: 10,
      totalBet: 200,
      viewCache: {
        type: 'BASE',
        view: {
          view: [
            [1, 1, 1], // 3 scatters to trigger free spins
            [2, 2, 2],
            [3, 3, 3],
            [4, 4, 4],
            [5, 5, 5]
          ],
          isView: [1, 1, 1, 0, 0], // Mark first 3 reels as scatters
          rwd: 'FREE'
        }
      }
    };

    const spinResult = slotMachine.SpinFromPattern(player);

    expect(spinResult).toBeDefined();
    expect(spinResult.currentGame).toBe('FREE');
    expect(spinResult.freeSpinIndex).toBe(1);
  });
});
