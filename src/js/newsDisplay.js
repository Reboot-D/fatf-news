import { getFATFNews } from './api.js';

export class NewsDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.newsCache = [];
        this.init();
    }

    async init() {
        await this.fetchAndDisplayNews();
        this.startAutoRefresh();
    }

    async fetchAndDisplayNews() {
        try {
            this.showLoading();
            const articles = await getFATFNews();
            this.newsCache = articles;
            this.renderNews();
        } catch (error) {
            this.showError(error);
        }
    }

    showLoading() {
        this.container.innerHTML = '<div class="loading">加载中...</div>';
    }

    showError(error) {
        this.container.innerHTML = `
            <div class="error">
                <p>获取新闻失败</p>
                <p>${error.message}</p>
            </div>
        `;
    }

    renderNews() {
        this.container.innerHTML = this.newsCache
            .map(article => `
                <article class="news-card">
                    ${article.urlToImage ? `
                        <img class="news-image" 
                             src="${article.urlToImage}" 
                             alt="${article.title}"
                             onerror="this.style.display='none'"
                        >
                    ` : ''}
                    <div class="news-content">
                        <h2>${article.title}</h2>
                        <p class="news-meta">
                            <span>${new Date(article.publishedAt).toLocaleString()}</span>
                            <span>${article.source.name}</span>
                        </p>
                        <p class="news-description">${article.description || ''}</p>
                        <a href="${article.url}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="read-more">
                            阅读更多
                        </a>
                    </div>
                </article>
            `)
            .join('');
    }

    startAutoRefresh() {
        // 每小时自动刷新一次
        setInterval(() => this.fetchAndDisplayNews(), 60 * 60 * 1000);
    }
} 