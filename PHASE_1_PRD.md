# AskYourTutor.com - Phase 1 PRD
## Product Requirements Document

---

## **Executive Summary**

**Product**: AskYourTutor.com - Online STEM Tutoring Platform  
**Phase**: Phase 1 - Core Platform Foundation  
**Timeline**: 2-3 weeks  
**Objective**: Build a working MVP with core user flows for tutor discovery and session booking  

### **Success Metrics**
- Users can register and create profiles
- Students can discover and book tutors
- Tutors can manage availability and sessions
- Admin can approve tutor applications
- 100% responsive design across devices

---

## **1. Product Overview**

### **Vision Statement**
Create the foundational platform that connects STEM students with verified expert tutors through an intuitive, reliable booking system.

### **Target Users**
1. **Students**: University/A-level students needing STEM help
2. **Tutors**: PhD holders, lecturers, and subject matter experts
3. **Admins**: Platform administrators managing quality and operations

### **Core Value Propositions**
- **For Students**: Easy discovery of qualified STEM tutors
- **For Tutors**: Simple platform to offer expertise and earn income
- **For Platform**: Quality-controlled marketplace for STEM education

---

## **2. Feature Requirements**

### **2.1 User Authentication System**

#### **2.1.1 User Registration**
**Priority**: P0 (Critical)

**Functional Requirements:**
- Email-based registration with verification
- Phone number registration (optional)
- Role selection during signup (Student/Tutor)
- Password strength validation
- Terms of service acceptance
- Email verification before account activation

**User Flow:**
```
1. User visits /register
2. Selects role (Student/Tutor)
3. Enters email, password, basic info
4. Receives verification email
5. Clicks verification link
6. Account activated → redirect to profile setup
```

**Technical Specifications:**
- JWT-based authentication
- Secure password hashing (bcrypt)
- Email service integration (SendGrid/AWS SES)
- Session management with refresh tokens
- Rate limiting on registration attempts

**Acceptance Criteria:**
- [ ] User can register with valid email/password
- [ ] Email verification required before login
- [ ] Role-based redirects after registration
- [ ] Password meets security requirements
- [ ] Error handling for duplicate emails
- [ ] Registration form validates in real-time

#### **2.1.2 User Login/Logout**
**Priority**: P0 (Critical)

**Functional Requirements:**
- Email/password login
- "Remember me" functionality
- Password reset via email
- Secure logout with session cleanup
- Failed login attempt protection

**User Flow:**
```
1. User visits /login
2. Enters credentials
3. System validates → JWT token issued
4. Redirect to role-appropriate dashboard
5. Logout clears all sessions
```

**Acceptance Criteria:**
- [ ] Valid credentials grant access
- [ ] Invalid credentials show error
- [ ] Password reset email functionality
- [ ] Session persists across browser refresh
- [ ] Logout completely clears session
- [ ] Auto-logout after token expiry

### **2.2 User Profile Management**

#### **2.2.1 Student Profiles**
**Priority**: P0 (Critical)

**Required Fields:**
- Full name
- Email (from registration)
- University/Institution
- Course of study
- Year of study
- Profile picture (optional)
- Learning goals (text area)
- Preferred subjects

**Profile Setup Flow:**
```
1. After email verification → /student/profile-setup
2. Multi-step form:
   - Step 1: Basic info (name, university, course)
   - Step 2: Academic details (year, subjects)
   - Step 3: Learning goals and preferences
3. Profile completion → redirect to dashboard
```

**Acceptance Criteria:**
- [ ] All required fields must be completed
- [ ] University dropdown with search functionality
- [ ] Subject selection from predefined list
- [ ] Profile picture upload and crop
- [ ] Form saves progress between steps
- [ ] Validation prevents incomplete submissions

#### **2.2.2 Tutor Profiles**
**Priority**: P0 (Critical)

**Required Fields:**
- Full name
- Email (from registration)
- Professional title
- University/Institution affiliation
- Qualifications (degree, PhD, etc.)
- Teaching experience (years)
- Subject specializations
- Hourly rate (USD)
- Profile picture
- Bio/description
- Credentials upload (PDF)

**Profile Setup Flow:**
```
1. After email verification → /tutor/profile-setup
2. Multi-step form:
   - Step 1: Personal & professional info
   - Step 2: Qualifications & credentials upload
   - Step 3: Subject expertise & pricing
   - Step 4: Bio and profile picture
3. Submit for admin approval
4. Approval email → profile goes live
```

**Acceptance Criteria:**
- [ ] All required fields completed
- [ ] Credentials file upload (PDF only)
- [ ] Subject expertise selection (multiple)
- [ ] Hourly rate validation ($10-200 range)
- [ ] Bio character limit (500 words)
- [ ] Profile submitted for approval workflow
- [ ] Status tracking (Pending/Approved/Rejected)

### **2.3 Tutor Discovery System**

#### **2.3.1 Browse Tutors Page**
**Priority**: P0 (Critical)

**URL**: `/tutors`

**Core Features:**
- Grid layout of tutor cards
- Search by name or subject
- Filter by subject, university, price range
- Sort by rating, price, availability
- Pagination (20 tutors per page)

**Tutor Card Display:**
- Profile picture
- Name and title
- University affiliation
- Subjects taught (max 3 displayed)
- Hourly rate
- Rating (placeholder for Phase 2)
- "View Profile" and "Book Session" buttons

**Filter Options:**
- Subject: Chemistry, Physics, Math, Biology, Engineering
- University: Dropdown with search
- Price Range: Slider ($10-200)
- Availability: Today, This Week, Anytime

**Acceptance Criteria:**
- [ ] Displays only approved tutors
- [ ] Search works by name and subject
- [ ] All filters function correctly
- [ ] Responsive grid layout
- [ ] Loading states for search/filter
- [ ] No results state with helpful message

#### **2.3.2 Tutor Profile Page**
**Priority**: P0 (Critical)

**URL**: `/tutor/[username]`

**Profile Information Display:**
- Professional headshot
- Name, title, and credentials
- University affiliation
- Teaching experience
- Subject specializations
- Hourly rate
- Bio/description
- Verification badge (admin approved)

**Interactive Elements:**
- "Book a Session" primary CTA
- "Send Message" secondary CTA (Phase 2)
- Subject tags (clickable to filter)
- Basic availability indicator

**Acceptance Criteria:**
- [ ] All tutor information displayed correctly
- [ ] Responsive design on all devices
- [ ] Book session button leads to booking flow
- [ ] 404 page for non-existent tutors
- [ ] Only shows approved tutor profiles
- [ ] SEO-optimized with proper meta tags

### **2.4 Session Booking System**

#### **2.4.1 Book Session Flow**
**Priority**: P0 (Critical)

**URL**: `/book?tutor=[username]`

**Booking Steps:**
1. **Tutor Confirmation**: Display selected tutor info
2. **Session Type**: Individual (1-on-1) or Group (2-5 students)
3. **Date & Time**: Calendar picker with available slots
4. **Session Details**: Subject, topic, special requirements
5. **Confirmation**: Review and confirm booking

**Session Types (Phase 1):**
- Individual Session (1-on-1) - 60 minutes
- Group Session (2-5 students) - 60 minutes
- Mini Session (quick help) - 30 minutes

**Required Information:**
- Session date and time
- Subject area
- Specific topic/concept
- Session duration
- Special requirements (optional)

**Acceptance Criteria:**
- [ ] Multi-step booking form with progress indicator
- [ ] Calendar shows only available time slots
- [ ] Form validation at each step
- [ ] Booking confirmation with details
- [ ] Email confirmation sent to both parties
- [ ] Booking saved to database with unique ID

#### **2.4.2 Session Management**
**Priority**: P1 (Important)

**Student Session Management:**
- View upcoming sessions
- Session details and join links (placeholder)
- Cancel session (with policy)
- Reschedule request

**Tutor Session Management:**
- View session requests
- Accept/decline session requests
- View upcoming confirmed sessions
- Cancel/reschedule sessions

**Acceptance Criteria:**
- [ ] Students can view all their sessions
- [ ] Tutors can manage session requests
- [ ] Cancel/reschedule functionality works
- [ ] Email notifications for all changes
- [ ] Session status tracking (Pending/Confirmed/Cancelled)

### **2.5 Dashboard Systems**

#### **2.5.1 Student Dashboard**
**Priority**: P0 (Critical)

**URL**: `/student/dashboard`

**Dashboard Sections:**
- **Welcome Section**: Personalized greeting
- **Upcoming Sessions**: Next 3 sessions with details
- **Quick Actions**: Find Tutor, Book Session
- **Recent Activity**: Last 5 bookings/interactions
- **Profile Completion**: Progress bar and missing info

**Key Metrics Display:**
- Total sessions booked
- Favorite subjects
- Upcoming sessions count

**Acceptance Criteria:**
- [ ] Personalized content based on user data
- [ ] Quick access to main platform features
- [ ] Responsive design across devices
- [ ] Real-time data updates
- [ ] Empty states for new users

#### **2.5.2 Tutor Dashboard**
**Priority**: P0 (Critical)

**URL**: `/tutor/dashboard`

**Dashboard Sections:**
- **Welcome Section**: Personalized greeting with approval status
- **Session Requests**: Pending requests requiring action
- **Upcoming Sessions**: Confirmed sessions
- **Quick Actions**: Update Availability, View Profile
- **Profile Status**: Approval status and completion

**Key Metrics Display:**
- Pending session requests
- Upcoming sessions this week
- Profile completion percentage
- Approval status

**Acceptance Criteria:**
- [ ] Different views for pending vs approved tutors
- [ ] Session request management interface
- [ ] Quick access to profile editing
- [ ] Real-time updates for new requests
- [ ] Clear approval status communication

### **2.6 Admin Panel**

#### **2.6.1 Tutor Approval Workflow**
**Priority**: P1 (Important)

**URL**: `/admin/tutors`

**Approval Interface:**
- List of pending tutor applications
- Detailed view of tutor credentials
- Approve/reject actions with comments
- Email notifications to tutors

**Tutor Application Review:**
- Personal information verification
- Credentials document review
- Qualification validation
- Subject expertise assessment

**Acceptance Criteria:**
- [ ] Admin can view all pending applications
- [ ] Credentials documents are viewable
- [ ] Approve/reject functionality works
- [ ] Email notifications sent on status change
- [ ] Comments system for rejection reasons
- [ ] Approved tutors appear in search immediately

#### **2.6.2 Basic User Management**
**Priority**: P2 (Nice to Have)

**Features:**
- User list with search and filter
- View user profiles and activity
- Suspend/activate user accounts
- Basic platform statistics

**Acceptance Criteria:**
- [ ] Admin can search and filter users
- [ ] User account status management
- [ ] Basic reporting on user activity
- [ ] Secure admin-only access

### **2.7 Email Notification System**

#### **2.7.1 Automated Emails**
**Priority**: P0 (Critical)

**Email Types:**
1. **Registration**: Welcome email with verification link
2. **Verification**: Account activation confirmation
3. **Booking Confirmation**: Session details to both parties
4. **Tutor Approval**: Application status updates
5. **Session Reminders**: 24 hours and 1 hour before
6. **Cancellation**: Session cancellation notifications

**Email Requirements:**
- Professional design with branding
- Mobile-responsive templates
- Unsubscribe functionality
- Delivery tracking
- Error handling and retries

**Acceptance Criteria:**
- [ ] All email types send correctly
- [ ] Mobile-responsive email design
- [ ] Proper error handling for failed sends
- [ ] Unsubscribe links in all emails
- [ ] Email delivery confirmation

---

## **3. Technical Requirements**

### **3.1 Frontend Architecture**

**Technology Stack:**
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation

**Component Structure:**
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── forms/        # Form components
│   ├── layout/       # Layout components
│   └── features/     # Feature-specific components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── store/            # Zustand stores
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── constants/        # App constants
```

### **3.2 Backend Architecture**

**Technology Stack:**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **File Upload**: Cloudinary/AWS S3
- **Email Service**: SendGrid
- **Validation**: Zod

**API Structure:**
```
/api/
├── auth/             # Authentication endpoints
├── users/            # User management
├── tutors/           # Tutor-specific endpoints
├── sessions/         # Session booking/management
├── admin/            # Admin panel endpoints
└── upload/           # File upload endpoints
```

### **3.3 Database Schema**

**Core Tables:**
1. **users**: Authentication and basic info
2. **student_profiles**: Student-specific data
3. **tutor_profiles**: Tutor-specific data
4. **subjects**: Available subjects
5. **universities**: Institution data
6. **sessions**: Booking information
7. **notifications**: Email tracking

**Key Relationships:**
- Users → Profiles (1:1)
- Sessions → Users (Many:1)
- Tutors → Subjects (Many:Many)
- Users → Universities (Many:1)

### **3.4 Security Requirements**

**Authentication & Authorization:**
- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- CORS configuration

**Data Protection:**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- File upload security
- HTTPS enforcement

### **3.5 Performance Requirements**

**Frontend:**
- Page load time < 3 seconds
- Time to Interactive < 5 seconds
- Responsive design (mobile-first)
- Image optimization and lazy loading
- Code splitting for routes

**Backend:**
- API response time < 500ms
- Database query optimization
- Caching strategy for static data
- Error handling and logging
- Monitoring and alerts

---

## **4. User Experience Requirements**

### **4.1 Design System**

**Brand Colors:**
- Primary: STEM-focused blue (#2563eb)
- Secondary: Academic green (#059669)
- Accent: Warning orange (#ea580c)
- Neutral: Modern grays (#64748b, #f1f5f9)

**Typography:**
- Headings: Inter (clean, professional)
- Body: Inter (readable, accessible)
- Code/Math: JetBrains Mono (for formulas)

**Component Library:**
- Buttons (primary, secondary, ghost)
- Form inputs with validation states
- Cards for content display
- Navigation components
- Loading states and skeletons

### **4.2 Responsive Design**

**Breakpoints:**
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

**Mobile-First Approach:**
- Touch-friendly interface
- Simplified navigation
- Optimized forms for mobile input
- Fast loading on slow connections

### **4.3 Accessibility**

**WCAG 2.1 AA Compliance:**
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios
- Alt text for images
- Form label associations
- Focus indicators

---

## **5. Testing Requirements**

### **5.1 Testing Strategy**

**Unit Testing:**
- Component testing with React Testing Library
- Utility function testing with Jest
- API endpoint testing with Supertest
- Database operation testing

**Integration Testing:**
- User flow testing (registration to booking)
- API integration testing
- Email delivery testing
- File upload testing

**End-to-End Testing:**
- Critical user journeys with Playwright
- Cross-browser compatibility
- Mobile device testing
- Performance testing

### **5.2 Quality Assurance**

**Code Quality:**
- ESLint configuration with strict rules
- Prettier for code formatting
- TypeScript strict mode
- Husky pre-commit hooks

**Testing Coverage:**
- Minimum 80% code coverage
- Critical path 100% coverage
- Error scenario testing
- Edge case validation

---

## **6. Deployment & DevOps**

### **6.1 Environment Setup**

**Environments:**
- **Development**: Local development with hot reload
- **Staging**: Production-like environment for testing
- **Production**: Live platform for users

**Environment Variables:**
- Database connection strings
- API keys and secrets
- Email service configuration
- File storage credentials

### **6.2 CI/CD Pipeline**

**Continuous Integration:**
- Automated testing on pull requests
- Code quality checks
- Build verification
- Security scanning

**Continuous Deployment:**
- Automated deployment to staging
- Manual approval for production
- Database migration scripts
- Rollback capabilities

### **6.3 Monitoring & Analytics**

**Application Monitoring:**
- Error tracking with Sentry
- Performance monitoring
- API response time tracking
- Database performance metrics

**User Analytics:**
- User registration and activation rates
- Booking conversion rates
- Feature usage analytics
- User journey analysis

---

## **7. Success Criteria & Metrics**

### **7.1 Technical Metrics**

**Performance:**
- Page load time < 3 seconds
- API response time < 500ms
- 99.9% uptime
- Zero critical security vulnerabilities

**Quality:**
- 80%+ test coverage
- Zero production bugs in first week
- All accessibility requirements met
- Mobile-responsive on all devices

### **7.2 Business Metrics**

**User Engagement:**
- 90%+ email verification rate
- 70%+ profile completion rate
- 50%+ tutor approval rate
- 30%+ booking conversion rate

**Platform Health:**
- 100+ registered users in first month
- 20+ approved tutors
- 50+ session bookings
- 95%+ user satisfaction (surveys)

### **7.3 Acceptance Criteria**

**Phase 1 Complete When:**
- [ ] All P0 features implemented and tested
- [ ] User can complete full journey: register → find tutor → book session
- [ ] Admin can approve tutors and manage platform
- [ ] All automated emails working correctly
- [ ] Platform is responsive and accessible
- [ ] Security audit passed
- [ ] Performance benchmarks met

---

## **8. Timeline & Milestones**

### **Week 1: Foundation**
- **Days 1-2**: Project setup, routing, authentication
- **Days 3-4**: User registration and profile creation
- **Days 5-7**: Basic UI components and layout

### **Week 2: Core Features**
- **Days 8-10**: Tutor discovery and search functionality
- **Days 11-12**: Session booking system
- **Days 13-14**: Dashboard development

### **Week 3: Polish & Launch**
- **Days 15-17**: Admin panel and email notifications
- **Days 18-19**: Testing, bug fixes, and optimization
- **Days 20-21**: Final testing and deployment preparation

### **Key Milestones:**
- **Day 7**: Authentication and profiles working
- **Day 14**: Booking flow complete
- **Day 21**: Phase 1 MVP ready for launch

---

## **9. Risk Assessment**

### **High-Risk Areas**

**Technical Risks:**
- Email delivery reliability
- File upload and storage
- Database performance with growth
- Third-party service dependencies

**Mitigation Strategies:**
- Multiple email service providers
- Comprehensive error handling
- Database indexing and optimization
- Fallback options for critical services

**Business Risks:**
- Low tutor signup rate
- Poor user experience on mobile
- Competition from established platforms
- Regulatory compliance issues

**Mitigation Strategies:**
- Tutor recruitment strategy
- Mobile-first design approach
- Unique value proposition focus
- Legal consultation on compliance

### **Dependencies**

**External Dependencies:**
- Email service provider setup
- File storage service configuration
- Domain and SSL certificate
- Payment gateway (future phases)

**Internal Dependencies:**
- Design system completion
- Content creation (terms, policies)
- Admin user creation
- Testing data setup

---

## **10. Post-Launch Plan**

### **Immediate Post-Launch (Week 4)**
- Monitor system performance and errors
- Collect user feedback and pain points
- Address critical bugs and issues
- Analyze user behavior and conversion rates

### **Phase 1 Optimization (Week 5-6)**
- Performance improvements based on usage
- UI/UX refinements from user feedback
- Additional error handling and edge cases
- Preparation for Phase 2 features

### **Transition to Phase 2**
- Review Phase 1 success metrics
- Gather requirements for enhanced features
- Plan Q&A board and resource hub development
- Prepare for advanced communication features

---

**This PRD serves as the complete blueprint for Phase 1 development. All features, requirements, and success criteria are clearly defined to ensure successful delivery of the AskYourTutor.com MVP.**
