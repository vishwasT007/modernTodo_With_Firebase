// SEO utilities for production
class SEO {
  constructor() {
    this.defaultTitle = 'TodoApp Pro - Ultimate Task Management Solution';
    this.defaultDescription = 'The ultimate task management solution for modern productivity. Organize, prioritize, and complete your tasks with ease.';
    this.defaultKeywords = 'todo, task management, productivity, organization, project management, time management';
    this.baseUrl = process.env.REACT_APP_BASE_URL || 'https://todoapp.com';
  }

  // Update page title
  updateTitle(title, includeAppName = true) {
    const fullTitle = includeAppName ? `${title} | TodoApp Pro` : title;
    document.title = fullTitle;
    
    // Update meta title for social sharing
    this.updateMetaTag('og:title', fullTitle);
    this.updateMetaTag('twitter:title', fullTitle);
  }

  // Update page description
  updateDescription(description) {
    this.updateMetaTag('description', description);
    this.updateMetaTag('og:description', description);
    this.updateMetaTag('twitter:description', description);
  }

  // Update page keywords
  updateKeywords(keywords) {
    this.updateMetaTag('keywords', keywords);
  }

  // Update canonical URL
  updateCanonicalUrl(path) {
    const canonicalUrl = `${this.baseUrl}${path}`;
    this.updateMetaTag('canonical', canonicalUrl, 'link');
    this.updateMetaTag('og:url', canonicalUrl);
  }

  // Update Open Graph tags
  updateOpenGraph({
    title,
    description,
    image,
    type = 'website',
    url,
  }) {
    this.updateMetaTag('og:type', type);
    this.updateMetaTag('og:title', title);
    this.updateMetaTag('og:description', description);
    this.updateMetaTag('og:image', image);
    this.updateMetaTag('og:url', url);
  }

  // Update Twitter Card tags
  updateTwitterCard({
    title,
    description,
    image,
    card = 'summary_large_image',
  }) {
    this.updateMetaTag('twitter:card', card);
    this.updateMetaTag('twitter:title', title);
    this.updateMetaTag('twitter:description', description);
    this.updateMetaTag('twitter:image', image);
  }

  // Update meta tag
  updateMetaTag(name, content, tag = 'meta') {
    if (tag === 'meta') {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.querySelector(`meta[property="${name}"]`);
      }
      
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    } else if (tag === 'link') {
      let link = document.querySelector(`link[rel="${name}"]`);
      if (link) {
        link.setAttribute('href', content);
      } else {
        link = document.createElement('link');
        link.setAttribute('rel', name);
        link.setAttribute('href', content);
        document.head.appendChild(link);
      }
    }
  }

  // Generate structured data for todo app
  generateStructuredData(user, todos, stats) {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'TodoApp Pro',
      description: this.defaultDescription,
      url: this.baseUrl,
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      author: {
        '@type': 'Organization',
        name: 'TodoApp Pro Team',
      },
    };

    if (user) {
      structuredData.user = {
        '@type': 'Person',
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      };
    }

    if (todos && todos.length > 0) {
      structuredData.workExample = todos.slice(0, 5).map(todo => ({
        '@type': 'CreativeWork',
        name: todo.title,
        description: todo.body,
        dateCreated: todo.createdAt,
        dateModified: todo.updatedAt || todo.createdAt,
      }));
    }

    if (stats) {
      structuredData.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1000',
        bestRating: '5',
        worstRating: '1',
      };
    }

    return structuredData;
  }

  // Add structured data to page
  addStructuredData(data) {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Generate sitemap data
  generateSitemapData() {
    const pages = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/login', priority: 0.8, changefreq: 'monthly' },
      { url: '/signup', priority: 0.8, changefreq: 'monthly' },
      { url: '/dashboard', priority: 0.9, changefreq: 'daily' },
      { url: '/todos', priority: 0.9, changefreq: 'daily' },
      { url: '/account', priority: 0.7, changefreq: 'weekly' },
    ];

    return pages.map(page => ({
      ...page,
      url: `${this.baseUrl}${page.url}`,
      lastmod: new Date().toISOString(),
    }));
  }

  // Generate robots.txt content
  generateRobotsTxt() {
    return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/

Sitemap: ${this.baseUrl}/sitemap.xml`;
  }

  // Update page for specific routes
  updatePageSEO(route, user = null, todos = null, stats = null) {
    const seoConfig = {
      '/': {
        title: 'TodoApp Pro - Ultimate Task Management Solution',
        description: 'The ultimate task management solution for modern productivity. Organize, prioritize, and complete your tasks with ease.',
        keywords: 'todo, task management, productivity, organization, project management, time management',
      },
      '/login': {
        title: 'Sign In to TodoApp Pro',
        description: 'Sign in to your TodoApp Pro account and start managing your tasks efficiently.',
        keywords: 'login, sign in, todo app, task management, productivity',
      },
      '/signup': {
        title: 'Create Your TodoApp Pro Account',
        description: 'Join thousands of users who are already boosting their productivity with TodoApp Pro.',
        keywords: 'signup, register, create account, todo app, task management',
      },
      '/dashboard': {
        title: 'Dashboard - TodoApp Pro',
        description: 'View your productivity dashboard and track your task completion progress.',
        keywords: 'dashboard, productivity, task overview, progress tracking',
      },
      '/todos': {
        title: 'My Todos - TodoApp Pro',
        description: 'Manage all your tasks in one place. Create, organize, and complete your todos efficiently.',
        keywords: 'todos, tasks, task management, productivity, organization',
      },
      '/account': {
        title: 'Account Settings - TodoApp Pro',
        description: 'Manage your account settings and preferences in TodoApp Pro.',
        keywords: 'account, settings, profile, preferences, user management',
      },
    };

    const config = seoConfig[route] || seoConfig['/'];
    
    // Update basic meta tags
    this.updateTitle(config.title);
    this.updateDescription(config.description);
    this.updateKeywords(config.keywords);
    this.updateCanonicalUrl(route);

    // Update Open Graph tags
    this.updateOpenGraph({
      title: config.title,
      description: config.description,
      image: `${this.baseUrl}/og-image.jpg`,
      url: `${this.baseUrl}${route}`,
    });

    // Update Twitter Card tags
    this.updateTwitterCard({
      title: config.title,
      description: config.description,
      image: `${this.baseUrl}/twitter-card.jpg`,
    });

    // Add structured data
    const structuredData = this.generateStructuredData(user, todos, stats);
    this.addStructuredData(structuredData);
  }

  // Initialize SEO for the app
  initialize() {
    // Set default meta tags
    this.updateTitle(this.defaultTitle);
    this.updateDescription(this.defaultDescription);
    this.updateKeywords(this.defaultKeywords);
    
    // Set viewport meta tag
    this.updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    
    // Set theme color
    this.updateMetaTag('theme-color', '#667eea');
    
    // Set favicon
    this.updateMetaTag('icon', '/favicon.ico', 'link');
    
    // Set apple touch icon
    this.updateMetaTag('apple-touch-icon', '/apple-touch-icon.png', 'link');
    
    // Set manifest
    this.updateMetaTag('manifest', '/manifest.json', 'link');
  }
}

// Create singleton instance
export const seo = new SEO();

// React hook for SEO
export const useSEO = () => {
  return {
    updateTitle: (title, includeAppName) => seo.updateTitle(title, includeAppName),
    updateDescription: (description) => seo.updateDescription(description),
    updateKeywords: (keywords) => seo.updateKeywords(keywords),
    updateCanonicalUrl: (path) => seo.updateCanonicalUrl(path),
    updateOpenGraph: (data) => seo.updateOpenGraph(data),
    updateTwitterCard: (data) => seo.updateTwitterCard(data),
    updatePageSEO: (route, user, todos, stats) => seo.updatePageSEO(route, user, todos, stats),
  };
};

// Utility functions
export const updatePageSEO = (route, user, todos, stats) => seo.updatePageSEO(route, user, todos, stats);
export const updateTitle = (title, includeAppName) => seo.updateTitle(title, includeAppName);
export const updateDescription = (description) => seo.updateDescription(description);

export default seo;
