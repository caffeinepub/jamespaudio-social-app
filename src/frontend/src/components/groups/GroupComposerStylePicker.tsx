import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  type MembershipTier,
  MessageColor,
  MessageEffect,
} from "../../backend";
import {
  getRequiredTierForColor,
  getRequiredTierForEffect,
  getTierDisplayName,
  isColorUnlocked,
  isEffectUnlocked,
} from "../../utils/membershipTier";
import { getColorLabel, getEffectLabel } from "../../utils/messageStyle";

interface GroupComposerStylePickerProps {
  currentColor: MessageColor;
  currentEffect: MessageEffect;
  userTier: MembershipTier;
  onColorChange: (color: MessageColor) => void;
  onEffectChange: (effect: MessageEffect) => void;
}

export default function GroupComposerStylePicker({
  currentColor,
  currentEffect,
  userTier,
  onColorChange,
  onEffectChange,
}: GroupComposerStylePickerProps) {
  const allColors: MessageColor[] = [
    MessageColor.normal,
    MessageColor.black,
    MessageColor.orange,
    MessageColor.blue,
    MessageColor.purple,
  ];

  const allEffects: MessageEffect[] = [
    MessageEffect.none,
    MessageEffect.skull,
    MessageEffect.fiery,
    MessageEffect.dodge,
  ];

  const handleColorClick = (color: MessageColor) => {
    if (isColorUnlocked(userTier, color)) {
      onColorChange(color);
    } else {
      const requiredTier = getRequiredTierForColor(color);
      if (requiredTier) {
        toast.error(
          `${getColorLabel(color)} color requires ${getTierDisplayName(requiredTier)} plan`,
        );
      }
    }
  };

  const handleEffectClick = (effect: MessageEffect) => {
    if (isEffectUnlocked(userTier, effect)) {
      onEffectChange(effect);
    } else {
      const requiredTier = getRequiredTierForEffect(effect);
      if (requiredTier) {
        toast.error(
          `${getEffectLabel(effect)} effect requires ${getTierDisplayName(requiredTier)} plan`,
        );
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Color Picker */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Text Color
        </p>
        <div className="flex flex-wrap gap-2">
          {allColors.map((color) => {
            const unlocked = isColorUnlocked(userTier, color);
            const requiredTier = getRequiredTierForColor(color);
            const isSelected = currentColor === color;

            return (
              <Button
                key={color}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleColorClick(color)}
                className={`relative ${!unlocked ? "opacity-60" : ""}`}
              >
                {getColorLabel(color)}
                {!unlocked && requiredTier && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {getTierDisplayName(requiredTier)}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Effect Picker */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Text Effect
        </p>
        <div className="flex flex-wrap gap-2">
          {allEffects.map((effect) => {
            const unlocked = isEffectUnlocked(userTier, effect);
            const requiredTier = getRequiredTierForEffect(effect);
            const isSelected = currentEffect === effect;

            return (
              <Button
                key={effect}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleEffectClick(effect)}
                className={`relative ${!unlocked ? "opacity-60" : ""}`}
              >
                {getEffectLabel(effect)}
                {!unlocked && requiredTier && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {getTierDisplayName(requiredTier)}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
