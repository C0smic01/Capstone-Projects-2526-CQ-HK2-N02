import type { APIResponse } from '../models/APIResponse'
import APIError from '../models/APIError';
import { API_BASE_URL, API_TIMEOUT } from '../Constants'

export const callAnalysisAPI = async (
    solutionFile: File | null,
    problemFile: File | null
): Promise<APIResponse> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
        const formData = new FormData();

        if (problemFile) {
            formData.append('problem_file', problemFile);
        }

        if (solutionFile) {
            formData.append('solution_file', solutionFile);
        }

        formData.append('language', 'cpp');

        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
            headers: { 'Accept': 'application/json' },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                const errorText = await response.text();
                throw new APIError(errorText, response.status, 'fail');
            }

            if (errorData && errorData.status === 'fail') {
                throw new APIError(errorData.message, errorData.code, errorData.status);
            } else {
                throw new APIError(JSON.stringify(errorData), response.status, 'fail');
            }
        }

        return await response.json();
    } finally {
        clearTimeout(timeoutId);
    }
};
