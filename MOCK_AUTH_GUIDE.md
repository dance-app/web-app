# Mock Authentication Guide

## Overview

The dance app now supports complete mock authentication that works without a backend server. This includes sign-in, sign-up, and session management through NextAuth.

## Mock Mode

Mock authentication is currently hardcoded on. No environment variable is needed.

## Test Users

You can sign in with any of these pre-configured mock users:

| Email | Password | Name | Role |
|-------|----------|------|------|
| `john.smith@example.com` | any password | John Smith | Regular User |
| `maria.garcia@gmail.com` | any password | Maria Garcia | Regular User |
| `carlos.rodriguez@example.com` | any password | Carlos Rodriguez | Regular User |
| `demo@example.com` | any password | Demo User | Regular User |
| `admin@example.com` | any password | Test Admin | Super Admin |

**Note:** When using mock data, any password will work for existing users.

## Features

### Sign-In
- Navigate to `/auth/sign-in`
- Use any of the test emails above with any password
- Authentication happens instantly with mock data
- JWT tokens are generated and stored in cookies
- Session is automatically created via NextAuth

### Sign-Up
- Navigate to `/auth/sign-up`
- Create new accounts with any email/password combination
- All required fields (email, password, firstName, lastName) are validated
- New users are automatically added to the mock data
- Duplicate email validation works correctly

### Session Management
- Current user data is available through NextAuth hooks
- Token refresh works with mock tokens
- Sign-out functionality clears mock session data

### API Integration
- `/api/auth/me` returns current mock user
- All workspace/member/event APIs work with mock data
- Console logs show `🎭 Mock API:` prefix for mock operations

## Usage Examples

### Using NextAuth hooks:
```tsx
import { useSession } from 'next-auth/react'

function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <p>Loading...</p>
  if (status === 'unauthenticated') return <p>Not logged in</p>
  
  return <p>Welcome {session.user.firstName}!</p>
}
```

### Sign out:
```tsx
import { signOut } from 'next-auth/react'

function SignOutButton() {
  return (
    <button onClick={() => signOut()}>
      Sign Out
    </button>
  )
}
```

## Switching to Real API

To disable mock authentication and use the real backend (temporarily):

1. Change `USE_MOCK_DATA` in `lib/mock-api.ts` to `false`.
2. Ensure your backend API is running and accessible at the configured `BASE_URL`.

## Development Benefits

- **No Backend Required**: Develop frontend features without backend setup
- **Realistic Testing**: Complete authentication flow with realistic delays
- **Multiple User Types**: Test different user roles and permissions
- **Data Persistence**: Mock data persists during the dev session
- **Easy Switching**: Toggle between mock and real data with one environment variable

## Implementation Details

The mock authentication system:
- Integrates seamlessly with NextAuth.js
- Provides realistic API response delays (200-500ms)
- Validates user inputs properly
- Handles token refresh cycles
- Maintains session state correctly
- Works with all existing authentication hooks and components
