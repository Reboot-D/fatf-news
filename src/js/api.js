const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/everything';

export async function getFATFNews() {
    const params = new URLSearchParams({
        q: 'FATF OR "Financial Action Task Force"',
        language: 'en',
        sortBy: 'publishedAt',
        apiKey: API_KEY
    });

    try {
        const response = await fetch(`${BASE_URL}?${params}`);
        const data = await response.json();
        
        if (data.status === 'ok') {
            return data.articles;
        } else {
            throw new Error(data.message || '获取新闻失败');
        }
    } catch (error) {
        console.error('获取新闻时出错:', error);
        throw error;
    }
} 