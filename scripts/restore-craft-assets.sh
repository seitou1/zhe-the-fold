#!/usr/bin/env bash
# Restore craft-archive story + dish stills into Next public/assets.
# Archives current regen set under public/assets/_archive-regen-2026-07/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${CRAFT_ASSETS:-$HOME/Desktop/Code/Zhe-The-Fold-Website/assets}"
DST="$ROOT/public/assets"
ARCH="$DST/_archive-regen-2026-07"

if [[ ! -d "$SRC" ]]; then
  echo "Craft assets not found at: $SRC"
  echo "Set CRAFT_ASSETS=/path/to/Zhe-The-Fold-Website/assets"
  exit 1
fi

mkdir -p "$ARCH"

echo "Archiving current regen set → $ARCH"
for f in \
  dish-pork.webp dish-pork.jpg dish-beef.webp dish-beef.jpg \
  dish-shrimp.webp dish-shrimp.jpg dish-bamboo.webp dish-bamboo.jpg \
  dish-crab.webp dish-crab.jpg dish-chestnut.webp dish-chestnut.jpg \
  dish-mushroom.webp dish-mushroom.jpg dish-tofu.webp dish-tofu.jpg \
  story-house.webp story-house.jpg story-hands.webp story-hands.jpg \
  story-night.webp story-night.jpg
do
  if [[ -f "$DST/$f" ]]; then
    cp -p "$DST/$f" "$ARCH/$f"
  fi
done

echo "Restoring craft dishes…"
for name in pork beef shrimp bamboo crab chestnut mushroom tofu; do
  cp -p "$SRC/dish-$name.webp" "$DST/dish-$name.webp"
  cp -p "$SRC/dish-$name.jpg" "$DST/dish-$name.jpg"
done

echo "Restoring craft story trio (village / city / fold)…"
cp -p "$SRC/story-village.webp" "$DST/story-village.webp"
cp -p "$SRC/story-village.jpg" "$DST/story-village.jpg"
cp -p "$SRC/story-city.webp" "$DST/story-city.webp"
cp -p "$SRC/story-city.jpg" "$DST/story-city.jpg"
cp -p "$SRC/story-fold.webp" "$DST/story-fold.webp"
cp -p "$SRC/story-fold.jpg" "$DST/story-fold.jpg"

# Same content on house/hands/night paths so existing CMS image fields still work:
# House ← village (prep / craft table)
# Hands ← fold (hands at work)
# Night ← city (night storefront)
cp -p "$SRC/story-village.webp" "$DST/story-house.webp"
cp -p "$SRC/story-village.jpg" "$DST/story-house.jpg"
cp -p "$SRC/story-fold.webp" "$DST/story-hands.webp"
cp -p "$SRC/story-fold.jpg" "$DST/story-hands.jpg"
cp -p "$SRC/story-city.webp" "$DST/story-night.webp"
cp -p "$SRC/story-city.jpg" "$DST/story-night.jpg"

echo "Done."
ls -la "$DST"/dish-pork.webp "$DST"/story-village.webp "$DST"/story-house.webp
echo "Regen backup: $ARCH"
