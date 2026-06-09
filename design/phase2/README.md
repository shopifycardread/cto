# Clad Design - Phase 2 Assets

This directory contains supplemental UI states, refined components, and advanced mockups for the next phase of development.

## Contents

### `mockups/`
- **`mockup-style-moodboard.png`**: Refined Style Profile UI featuring a mood board selection and style tag cloud.

### `assets/`
- **`success-outfit-saved.png`**: Success visual for when a user saves a recommendation.
- **`success-item-added.png`**: Success visual for adding a new item to the digital closet.
- **`loading-skeleton-outfit.png`**: Skeleton/Ghost state for outfit cards during AI generation.
- **`error-camera-access.png`**: Specific error state for when camera permissions are denied.
- **`refined-outfit-card.png`**: Detailed card design with weather, occasion, and match percentage metadata.
- **`refined-item-card.png`**: Detailed wardrobe item card with material, brand, and care metadata.

## Integration Notes
- **Success States:** These should be triggered after a successful API write (saving an outfit or cataloging an item).
- **Skeleton States:** Use `loading-skeleton-outfit.png` as a template for CSS skeletons during data fetching in the Outfit view.
- **Error States:** Use `error-camera-access.png` when the `navigator.mediaDevices.getUserMedia` promise is rejected.
