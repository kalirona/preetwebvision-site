# Admin Dashboard Features Report

## Overview
The Preet Web Vision admin dashboard is a comprehensive control panel with 15 modules organized into 5 categories. It provides full management capabilities for the website's content, users, analytics, and system configuration.

---

## Navigation Structure

### 1. Overview
- **Dashboard** - Main analytics and metrics overview

### 2. Customers & CRM
- **Leads** - Manage customer leads and inquiries
- **Appointments** - Booking and appointment management
- **Submissions** - Form submission tracking

### 3. Content Deck
- **Blog Posts** - Create, edit, and manage blog content
- **Pages CMS** - Dynamic page builder and management
- **Media Library** - Upload and organize media assets

### 4. AI & Intelligence
- **Support Chat** - Live chat management and AI chat logs
- **Analytics** - Website analytics and traffic insights
- **AI Logs** - AI activity tracking and monitoring

### 5. System Configuration
- **Services** - Service offerings management
- **SEO Settings** - Search engine optimization controls
- **Affiliates** - Affiliate program management
- **Settings** - General system settings
- **Security** - Security controls and audit logs

---

## Detailed Module Features

### Dashboard Module
**Purpose**: Real-time business intelligence and key performance indicators

**Features**:
- Monthly Recurring Revenue (MRR) tracking with interactive area charts
- Annual Recurring Revenue (ARR) projections
- Growth trend analysis with time range selection (30 days, 90 days, 12 months)
- Active subscription counts and user metrics
- LTV to CAC ratio monitoring
- Conversion rate tracking
- Plan distribution visualization (pie chart)
- Cohort retention/NRR (Net Revenue Retention) analysis
- Live subscriber records table with filtering by plan type
- Revenue expansion metrics
- Customer lifecycle tracking
- Real-time data refresh capability

**Key Metrics Displayed**:
- MRR: $50,250
- Active Subscriptions: 391 users
- LTV/CAC Ratio: 5.2x
- Conversion Rate: 18.42%
- Churn Rate: 1.16%

---

### Leads Module
**Purpose**: Customer relationship management and lead tracking

**Features**:
- View all incoming leads from contact forms
- Lead status management (new, contacted, qualified, closed)
- Lead source tracking
- Contact information display
- Timestamp and IP logging
- Lead assignment capabilities
- Export functionality

---

### Appointments Module
**Purpose**: Booking and appointment scheduling management

**Features**:
- View upcoming appointments
- Appointment status tracking
- Customer details and contact info
- Service type categorization
- Date/time management
- Booking confirmation workflows
- Calendar integration

---

### Submissions Module
**Purpose**: Form submission tracking and management

**Features**:
- View all form submissions across the website
- Form type categorization
- Submission timestamps
- User agent and IP tracking
- Export data capabilities
- Status management (new, read, archived)

---

### Blog Posts Module
**Purpose**: Content management for blog articles

**Features**:
- Create and edit blog posts with rich text editor
- Publish/unpublish posts
- Schedule posts for future publication
- SEO metadata management (title, description, tags)
- Featured image upload
- Author attribution
- Post categories and tags
- View/publish analytics
- Draft saving

---

### Pages Module
**Purpose**: Dynamic page builder and CMS

**Features**:
- Create custom pages
- Edit page content (WYSIWYG editor)
- Page URL slug management
- SEO settings per page
- Page ordering and hierarchy
- Template selection
- Custom code injection
- Page status (published/draft)

---

### Media Library Module
**Purpose**: Digital asset management

**Features**:
- Upload images, videos, documents
- Organize media into folders
- Search and filter media
- Image preview and details
- Bulk upload capability
- File size and type validation
- Direct URL access
- Media usage tracking

---

### Support Chat Module
**Purpose**: Customer support chat management

**Features**:
- View active support conversations
- Respond to customer inquiries
- Chat history logging
- User session tracking
- Chat status (active, closed, pending)
- Agent assignment
- Integration with AI chat system
- Timestamp and IP logging

---

### Analytics Module
**Purpose**: Website traffic and performance analytics

**Features**:
- Traffic source breakdown (organic, direct, referral, social)
- Page view statistics
- Unique visitor tracking
- Bounce rate monitoring
- Average session duration
- Geographic visitor data
- Device/browser statistics
- Real-time visitor count
- Popular pages ranking
- Conversion funnel analysis

---

### AI Logs Module
**Purpose**: Monitor AI system activity and interactions

**Features**:
- View AI interaction logs
- Track AI-generated responses
- Monitor AI usage patterns
- Error tracking for AI services
- Performance metrics
- User interaction history
- AI model version tracking
- Token usage statistics

---

### Services Module
**Purpose**: Manage service offerings

**Features**:
- Add/edit/delete services
- Service descriptions and features
- Pricing information
- Service categorization
- Order/priority management
- Icon/thumbnail upload
- Service page generation
- Status management (active/inactive)

---

### SEO Settings Module
**Purpose**: Search engine optimization controls

**Features**:
- Global meta title and description
- Google Search Console verification
- Bing Webmaster verification
- Custom meta tags
- Open Graph settings
- Twitter Card configuration
- Canonical URL management
- Robots.txt configuration
- Sitemap generation
- Schema markup management
- Header code injection (custom scripts/styles)
- Footer code injection
- Body top code injection

---

### Affiliates Module
**Purpose**: Affiliate program management

**Features**:
- Manage affiliate tools/links
- Track affiliate signups
- Commission tracking
- Affiliate link generation
- Performance metrics
- Referral tracking
- Banner/creative management
- Payout management

---

### Settings Module
**Purpose**: General system configuration

**Features**:
- Site-wide settings management
- Contact information configuration
- Social media links
- Email configuration
- Business hours
- Logo and branding
- Theme customization
- Third-party integrations
- API key management
- Maintenance mode toggle

---

### Security Module
**Purpose**: System security and authentication management

**Features**:
- **Two-Factor Authentication (2FA)**:
  - Generate TOTP secrets for authenticator apps
  - QR code generation for setup
  - Enable/disable 2FA
  - Verify TOTP codes
  - Backup code generation and management
  
- **Security Logging**:
  - Track all login attempts (success/failure)
  - IP address logging
  - Timestamp recording
  - User agent tracking
  - Event categorization
  
- **Vulnerability Scanning**:
  - Execute security scans
  - View security grade and threat score
  - HTTP security headers audit
  - SSL certificate status
  - Database backup status
  - Rate limiter status
  
- **Audit Trail**:
  - Security event log viewer
  - Filterable by date, status, event type
  - Export capabilities
  - Real-time event injection

**Security Metrics**:
- Overall security grade (A+ to F)
- Threat score (0-100)
- Header compliance ratings

---

## Authentication System

### Login Endpoint
**Path**: `POST /api/admin/login`

### Credentials
- **Username**: admin
- **Password**: `admin123` (default, configurable via `ADMIN_PASSWORD` environment variable)

### Authentication Flow
1. POST request with password and optional 2FA code
2. Password validation
3. Optional TOTP 2FA verification
4. JWT token generation (HS256 algorithm)
5. Token expiration: 2 hours
6. Security event logging with IP tracking

### JWT Token Usage
```http
Authorization: Bearer <token>
```

---

## Technical Stack

### Frontend
- React 19
- TypeScript
- Vite (build tool)
- Tailwind CSS v4
- Motion (animations)
- Recharts (analytics charts)
- React Router v7 (routing)
- Lucide React (icons)

### Backend
- Node.js / Express
- JWT authentication with Jose library
- TOTP 2FA with crypto
- JSON file-based storage (default) or MySQL (optional)
- Nginx reverse proxy

---

## Security Features

1. **JWT-based Authentication**
   - HS256 signing algorithm
   - 2-hour session expiration
   - Secure token storage

2. **Two-Factor Authentication (2FA)**
   - TOTP (Time-based One-Time Password)
   - Google Authenticator compatible
   - 30-second time windows
   - ±1 time drift tolerance

3. **Security Logging**
   - All authentication events logged
   - IP address tracking
   - Timestamp recording
   - Event status (SUCCESS/FAIL)

4. **Rate Limiting** (configurable)
5. **Input Validation**
6. **SQL Injection Prevention** (parameterized queries)
7. **XSS Protection**
8. **CSRF Protection**

---

## Mobile Responsiveness

- Fully responsive design
- Mobile navigation drawer
- Touch-friendly interface
- Adaptive layouts for tablets and phones
- Collapsible sidebar on mobile

---

## Access Information

**Admin Login URL**: http://your-domain.com/admin/login
**Admin Dashboard URL**: http://your-domain.com/admin/dashboard

**Default Credentials**:
- Username: admin
- Password: admin123

**⚠️ Important**: Change the default password immediately after first login via environment configuration.

---

## Deployment on aaPanel

See `DEPLOYMENT_GUIDE.md` for complete aaPanel deployment instructions.

**Quick Start**:
1. Upload project to `/www/wwwroot/your-domain.com/`
2. Run `npm install --production`
3. Create `.env` file with secure credentials
4. Run `npm run build`
5. Install PM2: `sudo npm install -g pm2`
6. Create `ecosystem.config.js`
7. Start with PM2: `pm2 start ecosystem.config.js`
8. Configure Nginx reverse proxy
9. Access admin panel at `/admin/login`

---

## Data Storage

### Default: JSON Files
All data stored in `/data/` directory:
- menus.json
- pages.json
- services.json
- leads.json
- settings.json
- seoSettings.json
- security_settings.json
- security_logs.json
- bookings.json
- posts.json
- contacts.json
- affiliateTools.json

### Optional: MySQL Database
Configuration via environment variables:
- `DB_TYPE=mysql`
- `DB_HOST=localhost`
- `DB_USER=username`
- `DB_PASSWORD=password`
- `DB_NAME=database_name`

---

## Maintenance

### Update Application
```bash
cd /www/wwwroot/your-domain.com
git pull origin main
npm install
npm run build
pm2 reload preet-web-vision
```

### View Logs
```bash
pm2 logs preet-web-vision
```

### Restart Application
```bash
pm2 restart preet-web-vision
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Performance

- Server-side rendering for SEO
- Code splitting for faster loads
- Lazy loading of routes
- Optimized bundle size
- CDN-ready static assets
- Minified production build

---

**Report Generated**: 2026-07-28
**Application Version**: 1.0.0
**Total Modules**: 15
**Authentication**: JWT + TOTP 2FA
**Default Port**: 3000