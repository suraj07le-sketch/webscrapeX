# WebScrapeX - Production Ready Web Scraping Service

A modern, production-ready web scraping service built with Next.js 16, TypeScript, and Supabase.

## ✨ Features

### Core Features
- **Hybrid Scraping**: Fast mode (Cheerio) + Deep mode (Puppeteer)
- **Multiple Extractors**: Metadata, colors, fonts, technologies, social data, LinkedIn
- **Background Processing**: Queue system for non-blocking operations
- **Intelligent Caching**: In-memory caching for repeated requests
- **Rate Limiting**: Per-user rate limiting to prevent abuse
- **Retry Logic**: Exponential backoff for network failures
- **Production Monitoring**: Health checks, logging, error tracking

### Technical Features
- **Next.js 16** with App Router and TypeScript
- **Supabase** for database, auth, and storage
- **Tailwind CSS** with dark mode support
- **Radix UI** for accessible components
- **Framer Motion** for animations
- **Security Headers**: CSP, HSTS, XSS protection
- **Performance Optimized**: Caching, CDN-ready, image optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/webscrapex.git
cd webscrapex

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit environment variables
# Fill in your Supabase credentials
```

### Development
```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

## 📊 Architecture

### System Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Scraping      │
│   (Next.js)     │───▶│   (Next.js)     │───▶│   Engine        │
│                 │    │                 │    │   (Cheerio/     │
│                 │    │                 │    │    Puppeteer)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Caching       │    │   Rate Limiting │    │   Database      │
│   Layer         │    │                 │    │   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **User Request**: User submits URL via frontend
2. **Rate Check**: System checks rate limits for user
3. **Cache Check**: System checks if URL was recently scraped
4. **Queue Job**: Scraping job added to queue (background processing)
5. **Scraping**: Engine extracts data using appropriate mode
6. **Storage**: Results saved to database and storage
7. **Response**: Frontend polls for results and displays

## 🛠️ Configuration

### Environment Variables
See `.env.example` for all configuration options.

### Database Schema
Run the following to generate TypeScript types:
```bash
npm run db:generate
```

## 🔒 Security

### Authentication
- Supabase Auth with session management
- Rate limiting per user/IP
- CORS configuration for API endpoints

### Data Protection
- Row Level Security (RLS) enabled
- Encrypted connections (HTTPS)
- Secure environment variables

### Content Security Policy
Implemented via middleware with strict policies.

## 📈 Monitoring

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Logs
- Application logs to console (JSON format in production)
- Database logs in Supabase logs table
- Error tracking ready for Sentry integration

### Metrics
- Request rate and response time
- Cache hit/miss rate
- Queue processing metrics
- Error rates and types

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
npm run deploy:vercel
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
npm run deploy:netlify
```

### Docker
```bash
# Build image
docker build -t webscrapex .

# Run container
docker run -p 3000:3000 --env-file .env.local webscrapex
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev              # Start dev server
npm run dev:turbo        # Start with TurboPack

# Building
npm run build            # Build for production
npm run build:analyze    # Build with bundle analyzer

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run typecheck        # TypeScript type checking

# Database
npm run db:push          # Push schema to Supabase
npm run db:studio        # Open Supabase Studio
npm run db:generate      # Generate TypeScript types

# Queue Management
npm run queue:clean      # Clean old queue jobs
npm run queue:start      # Start queue worker

# Production
npm run start:prod       # Start production server
npm run health           # Check health endpoint
```

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── health/        # Health check
│   │   ├── scrape/        # Scraping endpoints
│   │   └── v2/            # V2 API
│   ├── result/            # Result pages
│   └── ...                # Other pages
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── cache.ts          # Caching layer
│   ├── logger.ts         # Logging utility
│   ├── queue.ts          # Queue system
│   ├── rateLimiter.ts    # Rate limiting
│   ├── retry.ts          # Retry logic
│   └── scraper.ts        # Core scraping logic
├── scripts/              # Utility scripts
├── public/               # Static assets
└── ...                   # Config files
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@webscrapex.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/webscrapex/issues)
- 📖 Documentation: [Docs](https://docs.webscrapex.com)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Cheerio and Puppeteer teams for scraping capabilities
- All open source contributors

---

Made with ❤️ by the WebScrapeX team