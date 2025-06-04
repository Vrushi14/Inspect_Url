class AdvancedURLInspector {
            constructor() {
                this.urlCount = 0;
                this.validationStartTime = 0;
                this.currentUrl = null;
                this.debounceTimer = null;
                this.initialize();
            }

            initialize() {
                this.setupEventListeners();
                this.startRealTimeUpdates();
            }

            setupEventListeners() {
                const urlInput = document.getElementById('urlInput');
                const bulkInput = document.getElementById('bulkInput');
                const quickTestButtons = document.querySelectorAll('.quick-test-btn');

                // Real-time input validation
                urlInput.addEventListener('input', (e) => {
                    clearTimeout(this.debounceTimer);
                    this.debounceTimer = setTimeout(() => {
                        this.validateURL(e.target.value);
                    }, 300);
                });

                // Bulk input handling
                bulkInput.addEventListener('input', (e) => {
                    clearTimeout(this.debounceTimer);
                    this.debounceTimer = setTimeout(() => {
                        this.processBulkURLs(e.target.value);
                    }, 500);
                });

                // Quick test buttons
                quickTestButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const url = btn.dataset.url;
                        urlInput.value = url;
                        this.validateURL(url);
                    });
                });

                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                        const url = urlInput.value;
                        if (url) this.validateURL(url);
                    }
                });
            }

            async validateURL(urlString) {
                if (!urlString.trim()) {
                    this.showWelcomeMessage();
                    return;
                }

                this.validationStartTime = performance.now();
                this.updateInputStatus('checking');
                this.showLoadingSkeleton();

                try {
                    const analysis = await this.performComprehensiveAnalysis(urlString);
                    this.displayResults(analysis);
                    this.updateInputStatus(analysis.isValid ? 'valid' : 'invalid');
                    this.updateStats(analysis);
                } catch (error) {
                    this.displayError(error.message);
                    this.updateInputStatus('invalid');
                }
            }

            async processBulkURLs(urlsText) {
                const urls = urlsText.split('\n').filter(url => url.trim());
                if (urls.length === 0) return;

                this.showBulkAnalysis(urls);
            }

            async performComprehensiveAnalysis(urlString) {
                const analysis = {
                    original: urlString,
                    isValid: false,
                    timestamp: new Date().toISOString(),
                    components: {},
                    security: {},
                    performance: {},
                    seo: {},
                    accessibility: {},
                    bestPractices: {},
                    overallScore: 0
                };

                try {
                    const url = new URL(urlString);
                    analysis.isValid = true;
                    analysis.components = this.extractComponents(url);
                    analysis.security = await this.analyzeSecurityDeep(url);
                    analysis.performance = this.analyzePerformance(url);
                    analysis.seo = this.analyzeSEO(url);
                    analysis.accessibility = this.analyzeAccessibility(url);
                    analysis.bestPractices = this.analyzeBestPracticesAdvanced(url);
                    analysis.overallScore = this.calculateOverallScore(analysis);

                    // Simulate network delay for realism
                    await this.delay(Math.random() * 500 + 200);
                } catch (error) {
                    analysis.error = error.message;
                }

                return analysis;
            }

            extractComponents(url) {
                return {
                    protocol: url.protocol,
                    hostname: url.hostname,
                    port: url.port || this.getDefaultPort(url.protocol),
                    pathname: url.pathname,
                    search: url.search,
                    hash: url.hash,
                    origin: url.origin,
                    username: url.username,
                    password: url.password ? '***' : '',
                    href: url.href
                };
            }

            async analyzeSecurityDeep(url) {
                const security = {
                    score: 0,
                    issues: [],
                    recommendations: []
                };

                // HTTPS Analysis
                if (url.protocol === 'https:') {
                    security.score += 30;
                } else {
                    security.issues.push('Not using HTTPS');
                    security.recommendations.push('Switch to HTTPS for better security');
                }

                // Port Analysis
                const standardPorts = { 'http:': '80', 'https:': '443', 'ftp:': '21' };
                if (!url.port || url.port === standardPorts[url.protocol]) {
                    security.score += 10;
                } else {
                    security.issues.push(`Using non-standard port: ${url.port}`);
                }

                // Domain Security
                if (this.isValidDomain(url.hostname)) {
                    security.score += 20;
                } else {
                    security.issues.push('Invalid domain format');
                }

                // URL Injection Check
                if (this.hasInjectionPatterns(url.href)) {
                    security.issues.push('Potential injection patterns detected');
                } else {
                    security.score += 15;
                }

                // Password in URL
                if (url.password) {
                    security.issues.push('Password visible in URL');
                } else {
                    security.score += 10;
                }

                // Suspicious TLD
                const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf'];
                if (suspiciousTlds.some(tld => url.hostname.endsWith(tld))) {
                    security.issues.push('Suspicious top-level domain');
                } else {
                    security.score += 10;
                }

                security.score = Math.min(100, security.score);
                return security;
            }

            analyzePerformance(url) {
                const performance = {
                    score: 100,
                    issues: [],
                    metrics: {}
                };

                // URL Length
                const urlLength = url.href.length;
                performance.metrics.urlLength = urlLength;
                if (urlLength > 2048) {
                    performance.score -= 20;
                    performance.issues.push('URL too long (>2048 chars)');
                } else if (urlLength > 1024) {
                    performance.score -= 10;
                    performance.issues.push('URL moderately long');
                }

                // Query Parameters
                const params = new URLSearchParams(url.search);
                const paramCount = params.size;
                performance.metrics.parameterCount = paramCount;
                if (paramCount > 20) {
                    performance.score -= 15;
                    performance.issues.push('Too many query parameters');
                } else if (paramCount > 10) {
                    performance.score -= 5;
                }

                // Path Depth
                const pathDepth = url.pathname.split('/').filter(p => p).length;
                performance.metrics.pathDepth = pathDepth;
                if (pathDepth > 8) {
                    performance.score -= 10;
                    performance.issues.push('Deep URL structure');
                }

                return performance;
            }

            analyzeSEO(url) {
                const seo = {
                    score: 100,
                    issues: [],
                    recommendations: []
                };

                // WWW prefix
                if (url.hostname.startsWith('www.')) {
                    seo.score -= 5;
                    seo.recommendations.push('Consider using non-www version');
                }

                // Trailing slash consistency
                if (url.pathname.endsWith('/') && url.pathname !== '/') {
                    seo.score -= 5;
                    seo.issues.push('Trailing slash present');
                }

                // Uppercase characters
                if (/[A-Z]/.test(url.pathname)) {
                    seo.score -= 10;
                    seo.issues.push('Uppercase characters in path');
                }

                // Underscores vs hyphens
                if (url.pathname.includes('_')) {
                    seo.score -= 5;
                    seo.recommendations.push('Use hyphens instead of underscores');
                }

                // Fragment identifier
                if (url.hash) {
                    seo.score -= 5;
                    seo.issues.push('Fragment identifier present');
                }

                return seo;
            }

            analyzeAccessibility(url) {
                const accessibility = {
                    score: 100,
                    issues: [],
                    recommendations: []
                };

                // Special characters
                if (/[^\x00-\x7F]/.test(url.href)) {
                    accessibility.score -= 10;
                    accessibility.issues.push('Non-ASCII characters present');
                }

                // Encoded characters
                if (/%[0-9A-Fa-f]{2}/.test(url.href)) {
                    accessibility.score -= 5;
                    accessibility.issues.push('URL-encoded characters present');
                }

                // Readability
                const readableScore = this.calculateReadabilityScore(url.pathname);
                accessibility.score += readableScore - 50; // Normalize around 50

                return accessibility;
            }

            analyzeBestPracticesAdvanced(url) {
                const practices = {
                    score: 100,
                    violations: [],
                    recommendations: []
                };

                // Check for best practices
                const checks = [
                    {
                        condition: url.href.length <= 2048,
                        points: 15,
                        violation: 'URL exceeds recommended length'
                    },
                    {
                        condition: !url.href.includes(' '),
                        points: 10,
                        violation: 'URL contains spaces'
                    },
                    {
                        condition: url.pathname.split('/').length <= 5,
                        points: 10,
                        violation: 'URL path too deep'
                    },
                    {
                        condition: new URLSearchParams(url.search).size <= 10,
                        points: 10,
                        violation: 'Too many query parameters'
                    },
                    {
                        condition: !/[<>'"&]/.test(url.href),
                        points: 15,
                        violation: 'Suspicious characters detected'
                    }
                ];

                checks.forEach(check => {
                    if (!check.condition) {
                        practices.score -= check.points;
                        practices.violations.push(check.violation);
                    }
                });

                return practices;
            }

            calculateOverallScore(analysis) {
                if (!analysis.isValid) return 0;

                const weights = {
                    security: 0.3,
                    performance: 0.25,
                    seo: 0.2,
                    accessibility: 0.15,
                    bestPractices: 0.1
                };

                return Math.round(
                    analysis.security.score * weights.security +
                    analysis.performance.score * weights.performance +
                    analysis.seo.score * weights.seo +
                    analysis.accessibility.score * weights.accessibility +
                    analysis.bestPractices.score * weights.bestPractices
                );
            }

            displayResults(analysis) {
                const resultsPanel = document.getElementById('resultsPanel');
                
                if (!analysis.isValid) {
                    resultsPanel.innerHTML = this.generateErrorCard(analysis.error);
                    return;
                }

                resultsPanel.innerHTML = `
                    ${this.generateOverviewCard(analysis)}
                    ${this.generateComponentsCard(analysis)}
                    ${this.generateSecurityCard(analysis)}
                    ${this.generatePerformanceCard(analysis)}
                    ${this.generateSEOCard(analysis)}
                    ${this.generateAccessibilityCard(analysis)}
                `;
            }

            generateOverviewCard(analysis) {
                const scoreClass = this.getScoreClass(analysis.overallScore);
                return `
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-title">Overall Score</div>
                            <div class="metric-score ${scoreClass}">${analysis.overallScore}/100</div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${analysis.overallScore}%; background: ${this.getScoreColor(analysis.overallScore)};"></div>
                        </div>
                        <div class="metric-details">
                            <div class="metric-item">
                                <span class="metric-label">URL Length</span>
                                <span class="metric-value">${analysis.original.length} chars</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Protocol</span>
                                <span class="metric-value">${analysis.components.protocol.toUpperCase()}</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Validated At</span>
                                <span class="metric-value">${new Date(analysis.timestamp).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            generateComponentsCard(analysis) {
                const components = analysis.components;
                return `
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-title">URL Components</div>
                        </div>
                        <div class="components-grid">
                            ${Object.entries(components).filter(([key, value]) => value && value !== '').map(([key, value]) => `
                                <div class="component-item">
                                    <div class="component-label">${key}</div>
                                    <div class="component-value">${value}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            generateSecurityCard(analysis) {
                const security = analysis.security;
                const scoreClass = this.getScoreClass(security.score);
                return `
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-title">Security Analysis</div>
                            <div class="metric-score ${scoreClass}">${security.score}/100</div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${security.score}%; background: ${this.getScoreColor(security.score)};"></div>
                        </div>
                        <div class="metric-details">
                            ${security.issues.length === 0 ? 
                                '<div class="security-badge badge-secure">✓ No security issues detected</div>' : 
                                security.issues.map(issue => `<div class="security-badge badge-danger">⚠ ${issue}</div>`).join('')
                            }
                            ${security.recommendations.map(rec => `<div class="security-badge badge-warning">💡 ${rec}</div>`).join('')}
                        </div>
                    </div>
                `;
            }

            generatePerformanceCard(analysis) {
                const performance = analysis.performance;
                const scoreClass = this.getScoreClass(performance.score);
                return `
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-title">Performance Analysis</div>
                            <div class="metric-score ${scoreClass}">${performance.score}/100</div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${performance.score}%; background: ${this.getScoreColor(performance.score)};"></div>
                        </div>
                        <div class="metric-details">
                            <div class="metric-item">
                                <span class="metric-label">URL Length</span>
                                <span class="metric-value">${performance.metrics.urlLength} chars</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Parameters</span>
                                <span class="metric-value">${performance.metrics.parameterCount}</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Path Depth</span>
                                <span class="metric-value">${performance.metrics.pathDepth} levels</span>
                            </div>
                            ${performance.issues.map(issue => `<div class="security-badge badge-warning">⚠ ${issue}</div>`).join('')}
                        </div>
                    </div>
                `;
            }

            generateSEOCard(analysis) {
                const seo = analysis.seo;
                const scoreClass = this.getScoreClass(seo.score);
                return `
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-title">SEO Analysis</div>
                            <div class="metric-score ${scoreClass}">${seo.score}/100</div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${seo.score}%; background: ${this.getScoreColor(seo.score)};"></div>
                        </div>
                        <div class="metric-details">
                            ${seo.issues.length === 0 ? 
                                '<div class="security-badge badge-secure">✓ SEO-friendly URL structure</div>' : 
                                seo.issues.map(issue => `<div class="security-badge badge-warning">⚠ ${issue}</div>`).join('')
                            }
                            ${seo.recommendations.map(rec => `<div class="security-badge badge-warning">💡 ${rec}</div>`).join('')}
                        </div>
                    </div>
                `;
            }

            generateAccessibilityCard(analysis) {
                const accessibility = analysis.accessibility;
                const scoreClass = this.getScoreClass(accessibility.score);
                return `
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-title">Accessibility Analysis</div>
                            <div class="metric-score ${scoreClass}">${accessibility.score}/100</div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${accessibility.score}%; background: ${this.getScoreColor(accessibility.score)};"></div>
                        </div>
                        <div class="metric-details">
                            ${accessibility.issues.length === 0 ? 
                                '<div class="security-badge badge-secure">✓ Accessible URL format</div>' : 
                                accessibility.issues.map(issue => `<div class="security-badge badge-warning">⚠ ${issue}</div>`).join('')
                            }
                            ${accessibility.recommendations.map(rec => `<div class="security-badge badge-warning">💡 ${rec}</div>`).join('')}
                        </div>
                    </div>
                `;
            }

            generateErrorCard(error) {
                return `
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-title">Validation Error</div>
                            <div class="metric-score score-poor">Invalid</div>
                        </div>
                        <div class="metric-details">
                            <div class="security-badge badge-danger">❌ ${error}</div>
                        </div>
                    </div>
                `;
            }

            showBulkAnalysis(urls) {
                const resultsPanel = document.getElementById('resultsPanel');
                resultsPanel.innerHTML = `
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-title">Bulk Analysis</div>
                            <div class="metric-score score-good">${urls.length} URLs</div>
                        </div>
                        <div class="metric-details">
                            ${urls.map((url, index) => `
                                <div class="metric-item" style="cursor: pointer;" onclick="document.getElementById('urlInput').value='${url}'; this.parentElement.parentElement.parentElement.parentElement.querySelector('.input-panel input').dispatchEvent(new Event('input'));">
                                    <span class="metric-label">${index + 1}. ${url.substring(0, 50)}${url.length > 50 ? '...' : ''}</span>
                                    <span class="metric-value">Click to analyze</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            showLoadingSkeleton() {
                const resultsPanel = document.getElementById('resultsPanel');
                resultsPanel.innerHTML = `
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-title">Analyzing URL...</div>
                        </div>
                        <div class="loading-skeleton"></div>
                        <div class="loading-skeleton"></div>
                        <div class="loading-skeleton"></div>
                    </div>
                `;
            }

            showWelcomeMessage() {
                const resultsPanel = document.getElementById('resultsPanel');
                resultsPanel.innerHTML = `
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-title">Ready for Analysis</div>
                        </div>
                        <p style="color: rgba(255,255,255,0.8); text-align: center; padding: 20px;">
                            Enter a URL to see comprehensive real-time analysis
                        </p>
                    </div>
                `;
            }

            displayError(message) {
                const resultsPanel = document.getElementById('resultsPanel');
                resultsPanel.innerHTML = this.generateErrorCard(message);
            }

            updateInputStatus(status) {
                const statusElement = document.getElementById('inputStatus');
                statusElement.className = `input-status status-${status}`;
                
                const icons = {
                    valid: '✓',
                    invalid: '✗',
                    checking: '⟳'
                };
                
                statusElement.textContent = icons[status] || '';
            }

            updateStats(analysis) {
                this.urlCount++;
                const validationTime = Math.round(performance.now() - this.validationStartTime);
                
                document.getElementById('urlCount').textContent = this.urlCount;
                document.getElementById('validationTime').textContent = `${validationTime}ms`;
                document.getElementById('securityScore').textContent = analysis.isValid ? `${analysis.security.score}/100` : 'N/A';
            }

            startRealTimeUpdates() {
                setInterval(() => {
                    // Update timestamp displays
                    const timeElements = document.querySelectorAll('[data-timestamp]');
                    timeElements.forEach(el => {
                        const timestamp = el.dataset.timestamp;
                        if (timestamp) {
                            el.textContent = new Date(timestamp).toLocaleTimeString();
                        }
                    });
                }, 1000);
            }

            // Utility methods
            getScoreClass(score) {
                if (score >= 90) return 'score-excellent';
                if (score >= 70) return 'score-good';
                if (score >= 50) return 'score-warning';
                return 'score-poor';
            }

            getScoreColor(score) {
                if (score >= 90) return 'var(--success)';
                if (score >= 70) return 'var(--info)';
                if (score >= 50) return 'var(--warning)';
                return 'var(--error)';
            }

            getDefaultPort(protocol) {
                const ports = {
                    'http:': '80',
                    'https:': '443',
                    'ftp:': '21',
                    'ws:': '80',
                    'wss:': '443'
                };
                return ports[protocol] || 'unknown';
            }

            isValidDomain(hostname) {
                const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                return domainRegex.test(hostname) && !this.isIPAddress(hostname);
            }

            isIPAddress(hostname) {
                const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
                const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
                return ipv4Regex.test(hostname) || ipv6Regex.test(hostname);
            }

            hasInjectionPatterns(url) {
                const patterns = [
                    /<script/i,
                    /javascript:/i,
                    /vbscript:/i,
                    /onload=/i,
                    /onerror=/i,
                    /eval\(/i,
                    /union.*select/i,
                    /drop.*table/i
                ];
                return patterns.some(pattern => pattern.test(url));
            }

            calculateReadabilityScore(pathname) {
                let score = 50;
                
                // Penalize for length
                if (pathname.length > 100) score -= 20;
                else if (pathname.length > 50) score -= 10;
                
                // Reward for hyphens (readable separation)
                const hyphens = (pathname.match(/-/g) || []).length;
                score += Math.min(hyphens * 5, 20);
                
                // Penalize for underscores
                const underscores = (pathname.match(/_/g) || []).length;
                score -= underscores * 3;
                
                // Penalize for numbers at the end (often IDs)
                if (/\d+$/.test(pathname)) score -= 10;
                
                return Math.max(0, Math.min(100, score));
            }

            delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        }

        // Initialize the advanced URL inspector
        document.addEventListener('DOMContentLoaded', () => {
            new AdvancedURLInspector();
        });