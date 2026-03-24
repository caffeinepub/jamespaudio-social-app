import { MembershipTier, MessageColor, MessageEffect } from '../backend';

// Tier hierarchy for comparison
const tierOrder: Record<MembershipTier, number> = {
  [MembershipTier.free]: 0,
  [MembershipTier.pro]: 1,
  [MembershipTier.ultra]: 2,
  [MembershipTier.ultimate]: 3,
};

// Check if a tier meets or exceeds the required tier
export function meetsOrExceedsTier(userTier: MembershipTier, requiredTier: MembershipTier): boolean {
  return tierOrder[userTier] >= tierOrder[requiredTier];
}

// Get all unlocked colors for a tier
export function getUnlockedColors(tier: MembershipTier): MessageColor[] {
  const colors: MessageColor[] = [MessageColor.normal];
  
  if (meetsOrExceedsTier(tier, MembershipTier.pro)) {
    colors.push(MessageColor.black, MessageColor.orange, MessageColor.blue, MessageColor.purple);
  }
  
  return colors;
}

// Get all unlocked effects for a tier
export function getUnlockedEffects(tier: MembershipTier): MessageEffect[] {
  const effects: MessageEffect[] = [MessageEffect.none];
  
  if (meetsOrExceedsTier(tier, MembershipTier.ultra)) {
    effects.push(MessageEffect.skull, MessageEffect.fiery);
  }
  
  if (meetsOrExceedsTier(tier, MembershipTier.ultimate)) {
    effects.push(MessageEffect.dodge);
  }
  
  return effects;
}

// Check if a color is unlocked for a tier
export function isColorUnlocked(tier: MembershipTier, color: MessageColor): boolean {
  return getUnlockedColors(tier).includes(color);
}

// Check if an effect is unlocked for a tier
export function isEffectUnlocked(tier: MembershipTier, effect: MessageEffect): boolean {
  return getUnlockedEffects(tier).includes(effect);
}

// Get the required tier for a color
export function getRequiredTierForColor(color: MessageColor): MembershipTier | null {
  switch (color) {
    case MessageColor.normal:
      return null; // Always available
    case MessageColor.black:
    case MessageColor.orange:
    case MessageColor.blue:
    case MessageColor.purple:
      return MembershipTier.pro;
    default:
      return null;
  }
}

// Get the required tier for an effect
export function getRequiredTierForEffect(effect: MessageEffect): MembershipTier | null {
  switch (effect) {
    case MessageEffect.none:
      return null; // Always available
    case MessageEffect.skull:
    case MessageEffect.fiery:
      return MembershipTier.ultra;
    case MessageEffect.dodge:
      return MembershipTier.ultimate;
    default:
      return null;
  }
}

// Get display name for tier
export function getTierDisplayName(tier: MembershipTier): string {
  switch (tier) {
    case MembershipTier.free:
      return 'Free';
    case MembershipTier.pro:
      return 'Pro';
    case MembershipTier.ultra:
      return 'Ultra';
    case MembershipTier.ultimate:
      return 'Ultimate';
    default:
      return 'Free';
  }
}
