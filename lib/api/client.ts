// Enhanced client-side API helper for automatic token refresh
// Use this if you want to add client-side refresh logic in the future

interface ApiConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export async function apiCall<T>(endpoint: string, config: ApiConfig = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = config;

  const requestConfig: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    requestConfig.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(endpoint, requestConfig);

    if (!response.ok) {
      // For now, just throw - in the future, you could implement
      // client-side token refresh here if needed
      throw new Error(`API call failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Usage example:
// const workspaces = await apiCall<{workspaces: Workspace[]}>('/api/workspace');
// const newWorkspace = await apiCall<CreateWorkspaceResponse>('/api/workspace', {
//   method: 'POST',
//   body: { name: 'My Dance Studio', ownerId: 'user123' }
// });