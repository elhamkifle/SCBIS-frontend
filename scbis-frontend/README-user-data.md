# User Data Management

This document describes the implementation of user data management in the SCBIS frontend application.

## Overview

The implementation follows a pattern where we fetch the latest user data from the backend whenever needed, ensuring that the frontend always has the most up-to-date information. This approach has several advantages:

1. **Real-time data**: User data displayed in forms and previews is always accurate
2. **Simplified state management**: No need to manually sync local state with backend
3. **Consistent experience**: All components show the same user data

## Key Components

### 1. User Data Utilities (`userUtils.ts`)

Core functions for fetching and updating user data:

- `fetchUserData()`: Gets the latest user data from the backend and updates the store
- `updateUserData(userData)`: Updates user data on the backend and then refreshes the store

### 2. Auth Hook Enhancement (`useAuth.ts`)

The `useAuth` hook now automatically fetches fresh user data when pages load.

### 3. Higher-Order Component (`withUserData.tsx`)

A reusable HOC that can wrap any component to ensure it has the latest user data:

```jsx
export default withUserData(MyComponent);
```

Options:
- `fetchOnMount`: Whether to fetch user data when the component mounts (default: true)
- `showLoading`: Whether to show a loading indicator while fetching (default: true)

### 4. Example Implementation

- `PersonalDetailForm`: Fetches the latest user data when the form is loaded
- `Preview`: Gets fresh data before displaying the user's information
- `PersonalDataExample`: Shows how to use the HOC and provides a manual refresh button

## Usage

### Basic Usage

To use the latest user data in a component:

```jsx
import { useEffect } from 'react';
import { useUserStore } from '@/store/authStore/useUserStore';
import { fetchUserData } from '@/utils/userUtils';

export function MyComponent() {
  const user = useUserStore(state => state.user);
  
  useEffect(() => {
    const loadData = async () => {
      await fetchUserData();
    };
    
    if (user?._id) {
      loadData();
    }
  }, [user?._id]);
  
  // Use user data...
}
```

### Using the Higher-Order Component

For simpler implementation, use the HOC:

```jsx
import { withUserData } from '@/utils/withUserData';

function MyComponent() {
  const user = useUserStore(state => state.user);
  
  // Component code that uses user...
}

export default withUserData(MyComponent);
```

### Updating User Data

When you need to update user data:

```jsx
import { updateUserData } from '@/utils/userUtils';

async function submitForm(data) {
  try {
    // This will update the data on the backend and refresh the store
    await updateUserData(data);
    // Success handling...
  } catch (error) {
    // Error handling...
  }
}
```

## Benefits

- Ensures all components always display the most recent user data
- Centralized handling of user data fetching and updating
- Consistent error handling and loading states
- Simplifies component code by extracting data fetching logic
- Improves user experience by showing the most accurate information 