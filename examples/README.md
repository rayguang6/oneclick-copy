# Bulk User Registration API

This API allows you to register multiple users at once with Supabase authentication.

## Usage

### API Endpoint

```
POST /api/auth/bulk-signup
```

### Request Format

Send a POST request with a JSON array of user objects, each containing:
- `email`: User's email address (required)
- `password`: User's password (required)

Example request body:
```json
[
  {
    "email": "user1@example.com",
    "password": "password123"
  },
  {
    "email": "user2@example.com",
    "password": "password456"
  }
]
```

### Response Format

The API will respond with a JSON object containing:
- `total`: Total number of users processed
- `successful`: Number of users successfully registered
- `failed`: Number of users that failed to register
- `results`: Array of results for each user with details on success/failure

Example response:
```json
{
  "total": 2,
  "successful": 1,
  "failed": 1,
  "results": [
    {
      "success": true,
      "email": "user1@example.com"
    },
    {
      "success": false,
      "email": "user2@example.com",
      "error": "User already registered"
    }
  ]
}
```

### Example using curl

```bash
curl -X POST \
  http://localhost:3000/api/auth/bulk-signup \
  -H 'Content-Type: application/json' \
  -d @examples/bulk-signup.json
```

### Example using JavaScript fetch

```javascript
async function bulkSignupUsers() {
  const users = [
    { email: "user1@example.com", password: "password123" },
    { email: "user2@example.com", password: "password456" }
  ];

  const response = await fetch('/api/auth/bulk-signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(users),
  });

  const data = await response.json();
  console.log(data);
}
```

## Notes

- Each email must be unique - attempting to register an email that already exists will result in an error
- All users will need to verify their email addresses if email verification is enabled in your Supabase project
- The API processes users sequentially, so it might take some time for large batches 