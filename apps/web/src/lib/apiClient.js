/**
 * @file apiClient.js
 * @description HTTP client utility for handling API requests to the Loom backend endpoints (/api).
 */

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Executes a JSON fetch request against the backend server API.
 * @param {string} endpoint - Relative API endpoint path.
 * @param {object} [options] - Fetch configuration options.
 * @returns {Promise<object>} Parsed JSON response.
 */
export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...(options.headers || {}),
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Uploads a set of project files to the backend for auto-stack detection and import.
 * @param {Object} files - Key-value map of path -> content.
 */
export async function uploadProject(files) {
  return apiFetch('/api/upload', {
    method: 'POST',
    body: JSON.stringify({ files }),
  });
}

/**
 * Triggers a download of the project ZIP archive.
 * @param {string} projectId 
 */
export function triggerProjectDownload(projectId) {
  window.open(`/api/download/${projectId}`, '_blank');
}

export default {
  apiFetch,
  uploadProject,
  triggerProjectDownload,
};
