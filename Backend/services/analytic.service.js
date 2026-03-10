/**
 * Analytics API Service (ES6 Modules)
 * Handles all API calls to the analytics endpoints
 * Includes error handling, retry logic, and mock data for development
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Mock analytics data for development/testing
 * Replace with real API calls in production
 */
export const mockAnalyticsData = {
  totalBots: 4,
  totalConversations: 320,
  activeBots: 3,
  averageResponseTime: 842,
  messagesPerDay: [
    { date: "2026-02-28", count: 15 },
    { date: "2026-03-01", count: 32 },
    { date: "2026-03-02", count: 28 },
    { date: "2026-03-03", count: 45 },
    { date: "2026-03-04", count: 38 },
    { date: "2026-03-05", count: 52 },
    { date: "2026-03-06", count: 42 },
  ],
  topQuestions: [
    { question: "What is your pricing model?", count: 45 },
    { question: "How do I integrate LinguaBot?", count: 32 },
    { question: "What languages are supported?", count: 28 },
    { question: "Do you offer a free trial?", count: 25 },
    { question: "How is my data secured?", count: 19 },
  ],
  recentConversations: [
    {
      _id: "1",
      botName: "Support Bot",
      userMessage: "How do I reset my password?",
      aiMessage: "To reset your password, click on 'Forgot Password' on the login page.",
      responseTimeMs: 234,
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      botId: "bot1",
    },
    {
      _id: "2",
      botName: "Sales Bot",
      userMessage: "What are your enterprise plans?",
      aiMessage:
        "Our enterprise plans start at $2,000/month with unlimited bots and priority support.",
      responseTimeMs: 456,
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      botId: "bot2",
    },
    {
      _id: "3",
      botName: "Support Bot",
      userMessage: "Can I export my conversation data?",
      aiMessage: "Yes! You can export all your conversation data as CSV from the Analytics page.",
      responseTimeMs: 189,
      timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
      botId: "bot1",
    },
    {
      _id: "4",
      botName: "Integration Bot",
      userMessage: "Does LinguaBot work with Slack?",
      aiMessage: "Yes, we offer native Slack integration. Check our docs for setup instructions.",
      responseTimeMs: 312,
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      botId: "bot3",
    },
    {
      _id: "5",
      botName: "Support Bot",
      userMessage: "What is the API rate limit?",
      aiMessage: "Our standard plan allows 10,000 API calls per day.",
      responseTimeMs: 145,
      timestamp: new Date(Date.now() - 65 * 60000).toISOString(),
      botId: "bot1",
    },
  ],
};

/**
 * Fetch analytics data from API
 * @param {Object} options - Configuration options
 * @param {string} options.token - JWT authentication token
 * @param {boolean} options.useMock - Use mock data instead of API (default: false)
 * @returns {Promise<Object>} Analytics data
 * @throws {Error} If request fails
 */
export const fetchAnalytics = async (options = {}) => {
  const { token, useMock = false } = options;

  // Use mock data for development
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAnalyticsData), 800);
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    throw error;
  }
};

/**
 * Fetch analytics for a specific bot
 * @param {string} botId - Bot ID
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} Bot analytics data
 */
export const fetchBotAnalytics = async (botId, options = {}) => {
  const { token, useMock = false } = options;

  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            botId,
            botName: "Sample Bot",
            totalConversations: 150,
            averageResponseTime: 543,
            messagesPerDay: mockAnalyticsData.messagesPerDay,
            isActive: true,
          }),
        500
      );
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/bot/${botId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch bot analytics for ${botId}:`, error);
    throw error;
  }
};

/**
 * Export analytics data as CSV
 * @param {Object} options - Configuration options
 * @returns {Promise<Blob>} CSV file blob
 */
export const exportAnalyticsCSV = async (options = {}) => {
  const { token } = options;

  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/export`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to export analytics");
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Failed to export analytics:", error);
    throw error;
  }
};

/**
 * Download analytics CSV file
 * @param {Object} options - Configuration options
 */
export const downloadAnalyticsCSV = async (options = {}) => {
  try {
    const blob = await exportAnalyticsCSV(options);

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `linguabot-analytics-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download CSV:", error);
    throw error;
  }
};

/**
 * Retry logic for failed requests
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retries (default: 3)
 * @param {number} delay - Delay between retries in ms (default: 1000)
 * @returns {Promise}
 */
export const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    console.warn(`Request failed, retrying... (${retries} attempts left)`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay);
  }
};

/**
 * React Hook for analytics data
 * Usage: const { analytics, loading, error } = useAnalytics(token);
 */
export const useAnalytics = (token, useMock = false) => {
  const [analytics, setAnalytics] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await retryRequest(() =>
          fetchAnalytics({ token, useMock })
        );

        setAnalytics(data);
      } catch (err) {
        setError(err.message);
        console.error("Analytics hook error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token || useMock) {
      loadAnalytics();
    }
  }, [token, useMock]);

  return { analytics, loading, error };
};

/**
 * Example Usage in React Component:
 *
 * import { fetchAnalytics, downloadAnalyticsCSV } from './services/analyticsService.js';
 *
 * export default function MyAnalyticsComponent() {
 *   const token = localStorage.getItem('token');
 *   const [analytics, setAnalytics] = useState(null);
 *
 *   useEffect(() => {
 *     fetchAnalytics({ token, useMock: true }) // Use mock: true for testing
 *       .then(setAnalytics)
 *       .catch(console.error);
 *   }, [token]);
 *
 *   const handleExport = async () => {
 *     await downloadAnalyticsCSV({ token });
 *   };
 *
 *   return (
 *     <div>
 *       {analytics && <p>Total Conversations: {analytics.totalConversations}</p>}
 *       <button onClick={handleExport}>Export CSV</button>
 *     </div>
 *   );
 * }
 */