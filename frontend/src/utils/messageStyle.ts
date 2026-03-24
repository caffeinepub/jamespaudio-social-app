import { MessageColor, MessageEffect } from '../backend';

// Cycle through message colors
export function cycleMessageColor(current: MessageColor): MessageColor {
  switch (current) {
    case MessageColor.normal:
      return MessageColor.black;
    case MessageColor.black:
      return MessageColor.orange;
    case MessageColor.orange:
      return MessageColor.cyan;
    case MessageColor.cyan:
      return MessageColor.blue;
    case MessageColor.blue:
      return MessageColor.purple;
    case MessageColor.purple:
      return MessageColor.normal;
    default:
      return MessageColor.normal;
  }
}

// Get display label for color
export function getColorLabel(color: MessageColor): string {
  switch (color) {
    case MessageColor.normal:
      return 'Normal';
    case MessageColor.black:
      return 'Black';
    case MessageColor.orange:
      return 'Orange';
    case MessageColor.cyan:
      return 'Cyan';
    case MessageColor.blue:
      return 'Blue';
    case MessageColor.purple:
      return 'Purple';
    default:
      return 'Normal';
  }
}

// Map color to Tailwind classes
export function getColorClasses(color: MessageColor, isOwn: boolean): string {
  switch (color) {
    case MessageColor.black:
      return 'text-black dark:text-white';
    case MessageColor.orange:
      return 'text-orange-500';
    case MessageColor.cyan:
      return 'text-cyan-500';
    case MessageColor.blue:
      return 'text-blue-500';
    case MessageColor.purple:
      return 'text-purple-500';
    case MessageColor.normal:
    default:
      return isOwn ? 'text-primary-foreground' : 'text-foreground';
  }
}

// Get display label for effect
export function getEffectLabel(effect: MessageEffect): string {
  switch (effect) {
    case MessageEffect.none:
      return 'None';
    case MessageEffect.skull:
      return 'Skull ☠️';
    case MessageEffect.fiery:
      return 'Fiery 🔥';
    case MessageEffect.devil:
      return 'Devil 😈';
    case MessageEffect.spooky:
      return 'Spooky 👻';
    case MessageEffect.animated:
      return 'Animated ✨';
    case MessageEffect.dodge:
      return 'Dodge ⚡';
    default:
      return 'None';
  }
}

// Render effect decoration (lightweight, no animations)
export function renderEffectDecoration(effect: MessageEffect): string {
  switch (effect) {
    case MessageEffect.skull:
      return '☠️';
    case MessageEffect.fiery:
      return '🔥';
    case MessageEffect.devil:
      return '😈';
    case MessageEffect.spooky:
      return '👻';
    case MessageEffect.animated:
      return '✨';
    case MessageEffect.dodge:
      return '⚡';
    case MessageEffect.none:
    default:
      return '';
  }
}

// Normalize color for backward compatibility
export function normalizeColor(color: MessageColor | undefined): MessageColor {
  return color ?? MessageColor.normal;
}

// Normalize effect for backward compatibility
export function normalizeEffect(effect: MessageEffect | undefined): MessageEffect {
  return effect ?? MessageEffect.none;
}
