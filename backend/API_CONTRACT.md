# Clad API Contract

## Base URL
`http://localhost:8000`

## Authentication

### POST `/api/auth/register`
Register a new user.
- **Request Body**:
    ```json
    {
        "email": "user@example.com",
        "password": "password123",
        "full_name": "John Doe",
        "subscription_tier": "free"
    }
    ```
- **Response**: `User` object.

### POST `/api/auth/login`
Login and get a JWT token.
- **Request Body** (Form Data):
    - `username`: email
    - `password`: password
- **Response**:
    ```json
    {
        "access_token": "...",
        "token_type": "bearer"
    }
    ```

### GET `/api/auth/me`
Get current user info.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `User` object.

## Wardrobe Management

### POST `/api/wardrobe/scan`
Upload a photo of a wardrobe item to be automatically cataloged (Vision AI).
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Body**: 
    - `file`: Image file
- **Response**: `WardrobeItem` object (with mock extraction for now).

### POST `/api/wardrobe/`
Manually create a new wardrobe item.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
    ```json
    {
        "photo_url": "http://...",
        "category": "Jacket",
        "color": "Beige",
        "style_tags": ["minimalist"],
        "season": "Fall",
        "occasion": "Formal",
        "brand": "Clad"
    }
    ```
- **Response**: `WardrobeItem` object.

### GET `/api/wardrobe/`
List all wardrobe items for the current user.
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
    - `category`: Filter by category (e.g. "top", "bottom")
    - `color`: Filter by primary color
    - `season`: Filter by season
- **Response**: Array of `WardrobeItem` objects.

### GET `/api/wardrobe/{item_id}`
Get a specific wardrobe item.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `WardrobeItem` object.

### PUT `/api/wardrobe/{item_id}`
Update a wardrobe item.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Same as POST.
- **Response**: `WardrobeItem` object.

### DELETE `/api/wardrobe/{item_id}`
Delete a wardrobe item.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{"message": "..."}`

## Outfits

### GET `/api/outfits/daily`
Get 3 daily outfit recommendations. Generates new ones if none exist for today.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of 3 `Outfit` objects.

### GET `/api/outfits/saved`
Get all saved outfits.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of `Outfit` objects.

### POST `/api/outfits/{outfit_id}/save`
Save an outfit.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{"message": "..."}`

### POST `/api/outfits/{outfit_id}/skip`
Skip an outfit.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{"message": "..."}`

## Style Profile

### GET `/api/profile/`
Get user's style profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `StyleProfile` object.

### PUT `/api/profile/`
Update user's style profile.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
    ```json
    {
        "body_type": "Athletic",
        "style_tags": ["minimalist"],
        "size_preferences": {"top": "L"},
        "lifestyle_tags": ["office"],
        "weather_location": "New York"
    }
    ```
- **Response**: `StyleProfile` object.

## Weather

### GET `/api/weather/`
Get current weather for a location.
- **Query Params**: `location` (default: "New York")
- **Response**:
    ```json
    {
        "location": "...",
        "temperature": 70,
        "unit": "F",
        "condition": "Sunny",
        "forecast": "..."
    }
    ```

## Data Models

### User
```json
{
    "id": "UUID",
    "email": "string",
    "full_name": "string",
    "subscription_tier": "string",
    "created_at": "ISO Date"
}
```

### WardrobeItem
```json
{
    "id": "UUID",
    "user_id": "UUID",
    "photo_url": "string",
    "category": "string",
    "color": "string",
    "style_tags": ["string"],
    "season": "string",
    "occasion": "string",
    "brand": "string",
    "created_at": "ISO Date"
}
```

### Outfit
```json
{
    "id": "UUID",
    "user_id": "UUID",
    "items": ["WardrobeItemID"],
    "status": "pending|saved|skipped",
    "date": "YYYY-MM-DD",
    "created_at": "ISO Date"
}
```

### StyleProfile
```json
{
    "user_id": "UUID",
    "body_type": "string",
    "style_tags": ["string"],
    "size_preferences": {"key": "value"},
    "lifestyle_tags": ["string"],
    "weather_location": "string",
    "updated_at": "ISO Date"
}
```
