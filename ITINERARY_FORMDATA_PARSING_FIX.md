# Itinerary FormData Parsing Fix

## Problem

When creating a package, the API returned:

```
400 Bad Request
{
  "success": false,
  "message": "Validation error",
  "error": "\"itinerary\" must be an array"
}
```

## Root Cause

### The Flow:

1. **Frontend** sends itinerary as JSON string in FormData:

   ```typescript
   formData.append("itinerary", JSON.stringify(value));
   ```

2. **Backend** receives the request and processes it through middleware:

   ```
   uploadPackageImages → handleUploadError → validate() → controller
   ```

3. **Problem**: The validation middleware runs BEFORE the itinerary string is parsed to JSON
   - `req.body.itinerary` = `"[{\"day\":1,...}]"` (string)
   - Joi validation expects an array
   - Validation fails ❌

### Why FormData?

We use FormData because we need to upload images along with the package data. FormData can only send strings and files, so complex objects like arrays must be stringified.

## Solution

Added a middleware to parse JSON fields from FormData BEFORE validation runs.

### File: `api/src/routes/packageRoutes.js`

```javascript
// Middleware to parse JSON fields from FormData
const parseFormDataJSON = (req, res, next) => {
  if (req.body.itinerary && typeof req.body.itinerary === "string") {
    try {
      req.body.itinerary = JSON.parse(req.body.itinerary);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: "Invalid itinerary format",
      });
    }
  }
  next();
};
```

### Updated Middleware Order

**Before:**

```javascript
router.post(
  "/",
  authenticate,
  authorize("COMPANY"),
  uploadPackageImages,
  handleUploadError,
  validate(createPackageValidation), // ❌ Validates before parsing
  PackageController.createPackage,
);
```

**After:**

```javascript
router.post(
  "/",
  authenticate,
  authorize("COMPANY"),
  uploadPackageImages,
  handleUploadError,
  parseFormDataJSON, // ✅ Parse JSON first
  validate(createPackageValidation), // ✅ Then validate
  PackageController.createPackage,
);
```

## How It Works

### Step-by-Step Flow:

1. **Frontend sends FormData:**

   ```javascript
   formData.append("title", "Coffee Tour");
   formData.append(
     "itinerary",
     JSON.stringify([{ day: 1, title: "Arrival", description: "..." }]),
   );
   ```

2. **Upload middleware processes files:**
   - Saves uploaded images
   - Populates `req.files`

3. **parseFormDataJSON middleware:**

   ```javascript
   // Before: req.body.itinerary = "[{\"day\":1,...}]" (string)
   req.body.itinerary = JSON.parse(req.body.itinerary);
   // After: req.body.itinerary = [{day:1,...}] (array)
   ```

4. **Validation middleware:**

   ```javascript
   // Now itinerary is an array, validation passes ✅
   Joi.array().items(Joi.object({...}))
   ```

5. **Controller receives parsed data:**
   ```javascript
   req.body.itinerary; // Already an array, ready to use
   ```

## Benefits

1. **Separation of Concerns**: Parsing logic is separate from validation
2. **Error Handling**: Catches JSON parse errors with helpful message
3. **Reusable**: Can be applied to other routes with JSON fields
4. **Type Safety**: Ensures data types match validation schema
5. **Clean Controller**: Controller doesn't need to parse data

## Testing

### Test Case 1: Valid Itinerary

```javascript
// Frontend
const itinerary = [
  { day: 1, title: "Day 1", description: "First day" },
  { day: 2, title: "Day 2", description: "Second day" },
];
formData.append("itinerary", JSON.stringify(itinerary));

// Result: ✅ Package created successfully
```

### Test Case 2: Invalid JSON

```javascript
// Frontend sends malformed JSON
formData.append("itinerary", "{invalid json}");

// Result: ❌ "Invalid itinerary format"
```

### Test Case 3: Missing Itinerary

```javascript
// Frontend doesn't send itinerary
// (itinerary is optional in validation)

// Result: ✅ Package created without itinerary
```

### Test Case 4: Empty Itinerary

```javascript
// Frontend sends empty array
formData.append("itinerary", JSON.stringify([]));

// Result: ✅ Package created with empty itinerary
```

## Alternative Solutions Considered

### Option 1: Parse in Controller ❌

```javascript
// In controller
if (typeof req.body.itinerary === "string") {
  req.body.itinerary = JSON.parse(req.body.itinerary);
}
```

**Problem**: Validation would still fail before reaching controller

### Option 2: Custom Joi Validation ❌

```javascript
itinerary: Joi.alternatives().try(
  Joi.array(),
  Joi.string().custom((value) => JSON.parse(value)),
);
```

**Problem**: Messy, validation should validate not transform

### Option 3: Middleware (Chosen) ✅

```javascript
const parseFormDataJSON = (req, res, next) => {
  // Parse before validation
};
```

**Benefits**: Clean, reusable, proper separation of concerns

## Files Modified

1. ✅ `api/src/routes/packageRoutes.js` - Added parseFormDataJSON middleware

## Related Files (No Changes Needed)

- `frontend/src/services/packages.ts` - Already stringifying correctly
- `api/src/validations/packageValidation.js` - Validation schema is correct
- `api/src/controllers/packageController.js` - Controller receives parsed data

## Future Enhancements

### 1. Create Reusable Middleware

Move to `api/src/middlewares/parseFormData.js`:

```javascript
export const parseFormDataJSON = (...fields) => {
  return (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Validation error",
            error: `Invalid ${field} format`,
          });
        }
      }
    });
    next();
  };
};

// Usage
router.post("/", parseFormDataJSON("itinerary", "metadata"), ...);
```

### 2. Add Type Checking

```javascript
const parseFormDataJSON = (req, res, next) => {
  if (req.body.itinerary && typeof req.body.itinerary === "string") {
    try {
      const parsed = JSON.parse(req.body.itinerary);

      // Ensure it's an array
      if (!Array.isArray(parsed)) {
        throw new Error("Itinerary must be an array");
      }

      req.body.itinerary = parsed;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message || "Invalid itinerary format",
      });
    }
  }
  next();
};
```

### 3. Apply to Other Routes

Check if other routes need similar parsing:

- Review routes
- Booking routes
- Any route that accepts FormData with JSON fields

## Summary

The fix ensures that JSON-stringified fields in FormData are parsed back to their original types before validation, allowing the Joi schema to properly validate the data structure. This is a common pattern when working with file uploads and complex data structures.

**Key Takeaway**: When using FormData with complex objects, always parse JSON strings before validation middleware runs.
