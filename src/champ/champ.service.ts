import { Injectable } from '@nestjs/common';
import { getData, updateModelPlaces, VideoModel } from 'src/supa-api.service';

interface MatchResult {
  competitors: [any, any];
  winner: VideoModel;
}

export interface RoundResult {
  round: string;
  matches?: MatchResult[];
  winners: VideoModel[];
  champion?: VideoModel;
}

@Injectable()
export class ChampService {
  async getChampion() {
    const girls = await getData();
    // Check if there are at least 256 models
    if (girls.length < 256) {
      throw new Error('There must be at least 256 models.');
    }

    // Only take the first 256 models
    let currentRound = girls.slice(0, 256);

    const roundsHistory: RoundResult[] = [];

    // Names for the rounds
    const roundNames: { [key: number]: string } = {
      256: '128th-finals',
      128: '64th-finals',
      64: '32nd-finals',
      32: '16th-finals',
      16: 'Octofinals',
      8: 'Quarterfinals',
      4: 'Semifinals',
      2: 'Final',
    };

    // Set a scaling factor for bonus
    const scaleFactor = 50;

    // Simulate matches until only one winner remains
    while (currentRound.length > 1) {
      const roundName =
        roundNames[currentRound.length] ||
        `Round with ${currentRound.length} participants`;
      const roundMatches: MatchResult[] = [];
      const winners: VideoModel[] = [];

      // Loop through models in pairs
      for (let i = 0; i < currentRound.length; i += 2) {
        const model1 = currentRound[i];
        const model2 = currentRound[i + 1];

        const totalRating = model1.averageRating + model2.averageRating;

        // Calculate base win probabilities
        let winChanceModel1 = (model1.averageRating / totalRating) * 100;
        let winChanceModel2 = 100 - winChanceModel1;

        // Add bonus based on rating difference (max 10%)
        if (model1.averageRating > model2.averageRating) {
          const bonus = Math.min(
            10,
            (model1.averageRating - model2.averageRating) / scaleFactor,
          );
          winChanceModel1 = Math.min(winChanceModel1 + bonus, 100);
          winChanceModel2 = 100 - winChanceModel1;
        } else if (model2.averageRating > model1.averageRating) {
          const bonus = Math.min(
            10,
            (model2.averageRating - model1.averageRating) / scaleFactor,
          );
          winChanceModel2 = Math.min(winChanceModel2 + bonus, 100);
          winChanceModel1 = 100 - winChanceModel2;
        }

        // Determine the winner based on adjusted probabilities
        const random = Math.random() * 100;
        const winner = random <= winChanceModel1 ? model1 : model2;

        // Save match details with competitors and the winner
        roundMatches.push({
          competitors: [
            { ...model1, winChance: Number(winChanceModel1.toFixed()) },
            { ...model2, winChance: Number(winChanceModel2.toFixed()) },
          ],
          winner,
        });
        winners.push(winner);

        // For rounds Quarterfinals and above, update the model by recording the loss
        if (currentRound.length <= 8) {
          const loser = winner.id === model1.id ? model2 : model1;
          await updateModelPlaces(loser.id, roundName);
        }
      }

      roundsHistory.push({
        round: roundName,
        matches: roundMatches,
        winners,
      });

      // Prepare the list of winners for the next round
      currentRound = winners;
    }

    // Final round: add the final winner (champion)
    roundsHistory.push({
      round: 'Champion',
      winners: currentRound,
      champion: currentRound[0],
    });
    await updateModelPlaces(currentRound[0].id, 'winner');

    // Helper function to map a VideoModel
    const mapCompetitor = (model: VideoModel & { winChance?: number }) => {
      const base = {
        id: model.id,
        name: model.name,
        averageRating: model.averageRating,
      };
      return model.winChance !== undefined
        ? { ...base, winChance: model.winChance }
        : base;
    };

    // Map the final history to include essential information
    const mappedHistory = roundsHistory.map((round) => ({
      ...round,
      winners: round.winners.map(mapCompetitor),
      champion: round.champion ? mapCompetitor(round.champion) : undefined,
      matches: round.matches?.map((match) => ({
        competitors: match.competitors.map(mapCompetitor),
        winner: mapCompetitor(match.winner),
      })),
    }));

    return mappedHistory;
  }

  // ------------------------------
  // Mapped parameters:
  // brest -> dmg;
  // ass -> armor;
  // face -> critChance;
  // overall -> critDamage;
  // content -> minusArmor;
  // wife -> hp;
  // height -> dodge;
  // body -> accuracy;
  // hair -> hpRegen;
  // nipples -> extraAttackChance;
  // legs -> lifeSteal;
  // pussy -> stunChance;
  // ------------------------------

  // Clamp function: any value over 100 is reduced to 100
  clamp(value: number): number {
    return value > 100 ? 100 : value;
  }

  // Initialize parameters based on scores (0-100) and balance coefficients
  initializeParameters(user: any): void {
    // Ensure each parameter is at most 100
    user.wife    = this.clamp(user.wife);
    user.brest   = this.clamp(user.brest);
    user.ass     = this.clamp(user.ass);
    user.face    = this.clamp(user.face);
    user.overall = this.clamp(user.overall);
    user.content = this.clamp(user.content);
    user.hair    = this.clamp(user.hair);
    user.height  = this.clamp(user.height);
    user.body    = this.clamp(user.body);
    user.nipples = this.clamp(user.nipples);
    user.legs    = this.clamp(user.legs);
    user.pussy   = this.clamp(user.pussy);

    // Calculate effective in-game values using the suggested coefficients:
    user.hp                = user.wife * 12;        // Max: 100×12 = 1200 HP
    user.dmg               = user.brest * 0.8;      // Max: 80 damage
    user.armor             = user.ass * 0.5;        // Max: 50 armor
    user.critChance        = user.face * 0.003;     // Max: 0.3 (30% crit chance)
    user.critDamage        = user.overall * 0.005;  // Max: 0.5 (50% crit bonus)
    user.minusArmor        = user.content * 0.4;    // Max: 40
    user.hpRegen           = user.hair * 0.05;      // Max: 50 HP regen per round
    user.dodge             = user.height * 0.002;   // Max: 0.2 (20% dodge)
    user.accuracy          = user.body * 0.0085;    // Max: 0.85 (85% hit chance)
    user.extraAttackChance = user.nipples * 0.005;  // Max: 0.5 (50% extra attack)
    user.lifeSteal         = user.legs * 0.003;     // Max: 0.3 (30% life steal)
    user.stunChance        = user.pussy * 0.0025;   // Max: 0.25 (25% stun chance)
  }

  // The duel method simulates the duel and returns an object with round details and the winner
  duel(user1: any, user2: any): any {
    // Initialize parameters for both players
    this.initializeParameters(user1);
    this.initializeParameters(user2);
    console.log("Initializing users");

    // Reset initial HP and stun status
    user1.stunned = false;
    user2.stunned = false;

    let round = 1;
    const roundsLog: { round: number; actions: string[] }[] = [];
    const MAX_ROUNDS = 1000; // Prevent infinite duels

    // Set a limit for recursion of extra attacks
    const MAX_EXTRA_ATTACKS = 3;

    // Corrected: Default depth now starts at 0
    function attack(attacker: any, defender: any, log: string[], depth: number = 0) {
      // Regenerate HP at the beginning of the turn using hpRegen
      attacker.hp += attacker.hpRegen;
      log.push(
        `${attacker.name} regenerates ${attacker.hpRegen.toFixed(2)} HP (HP now: ${attacker.hp.toFixed(2)})`
      );

      // Calculate hit chance: using attacker's accuracy vs. defender's dodge
      const hitChance = (attacker.accuracy / (attacker.accuracy + defender.dodge)) * 100;
      const hitRoll = Math.random() * 100;
      if (hitRoll > hitChance) {
        log.push(
          `${attacker.name} misses the attack (roll: ${hitRoll.toFixed(2)} vs needed: ≤ ${hitChance.toFixed(2)})`
        );
        return;
      }

      // Base damage calculated from dmg
      let damage = attacker.dmg;

      // Critical check using critChance
      const critRoll = Math.random();
      if (critRoll < attacker.critChance) {
        damage *= 1 + attacker.critDamage;
        log.push(
          `${attacker.name} lands a CRITICAL HIT! (roll: ${critRoll.toFixed(2)} < ${attacker.critChance.toFixed(2)})`
        );
      }

      // Calculate effective armor: defender's armor minus attacker's minusArmor
      const effectiveArmor = Math.max(defender.armor - attacker.minusArmor, 0);
      const finalDamage = Math.max(damage - effectiveArmor, 1);

      defender.hp -= finalDamage;
      log.push(
        `${attacker.name} hits ${defender.name} for ${finalDamage.toFixed(2)} damage (HP ${defender.name}: ${defender.hp.toFixed(2)})`
      );

      // Life steal: attacker heals for a percentage of the damage
      const recovered = finalDamage * attacker.lifeSteal;
      attacker.hp += recovered;
      log.push(
        `${attacker.name} steals ${recovered.toFixed(2)} HP (HP now: ${attacker.hp.toFixed(2)})`
      );

      // Stun chance
      const stunRoll = Math.random();
      if (stunRoll < attacker.stunChance) {
        defender.stunned = true;
        log.push(
          `${attacker.name} stuns ${defender.name}! (roll: ${stunRoll.toFixed(2)} < ${attacker.stunChance.toFixed(2)})`
        );
      }

      // Chance for an extra attack, limited by MAX_EXTRA_ATTACKS
      const extraAttackRoll = Math.random();
      if (extraAttackRoll < attacker.extraAttackChance && depth < MAX_EXTRA_ATTACKS) {
        log.push(
          `${attacker.name} executes an extra attack (roll: ${extraAttackRoll.toFixed(2)} < ${attacker.extraAttackChance.toFixed(2)})`
        );
        attack(attacker, defender, log, depth + 1);
      }
    }

    // Simulate the duel until one of the players reaches 0 HP or max rounds is reached
    while (user1.hp > 0 && user2.hp > 0 && round <= MAX_ROUNDS) {
      const roundActions: string[] = [];
      roundActions.push(`--- Round ${round} ---`);

      if (user1.stunned) {
        roundActions.push(`${user1.name} is stunned and loses their turn.`);
        user1.stunned = false;
      } else {
        attack(user1, user2, roundActions);
      }
      if (user2.hp <= 0) {
        roundsLog.push({ round, actions: roundActions });
        break;
      }
      if (user2.stunned) {
        roundActions.push(`${user2.name} is stunned and loses their turn.`);
        user2.stunned = false;
      } else {
        attack(user2, user1, roundActions);
      }
      roundsLog.push({ round, actions: roundActions });
      round++;
    }

    let winner;
    if (user1.hp > 0 && user2.hp <= 0) {
      winner = { id: user1.id, name: user1.name, remainingHP: user1.hp };
    } else if (user2.hp > 0 && user1.hp <= 0) {
      winner = { id: user2.id, name: user2.name, remainingHP: user2.hp };
    } else if (round > MAX_ROUNDS) {
      winner = null; // Duel ended in a draw or timeout
    }

    // Return the object that will be used on the front-end
    return { rounds: roundsLog, winner };
  }
}
