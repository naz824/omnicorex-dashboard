-- ============================================================================
-- OmnicoreX Dashboard — Seed Data Migration
-- Version: 002
-- Description: Populates all tables with initial mock data
-- ============================================================================

-- Insert Leads (6 leads)
INSERT INTO leads (id, name, email, phone, business_name, website_url, industry, location, status, source, score, budget_range, urgency, notes, assigned_agent, next_follow_up, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Maria Santos', 'maria@santosplumbing.com', '(571) 555-0102', 'Santos Plumbing & HVAC', 'http://santosplumbing.com', 'Plumbing/HVAC', 'Fairfax, VA', 'qualified', 'website', 82, '$5,000 – $10,000', 'Within 30 days', 'Current site is 8 years old, not mobile-friendly. Losing jobs to competitors with better online presence.', 'Nova', '2026-03-17T14:00:00Z', '2026-03-10T09:15:00Z', '2026-03-14T16:30:00Z'),
('550e8400-e29b-41d4-a716-446655440002', 'James Chen', 'james@chendentalcare.com', '(703) 555-0198', 'Chen Dental Care', 'http://chendentalcare.com', 'Dental', 'Arlington, VA', 'proposal_sent', 'google', 91, '$10,000 – $25,000', 'Immediate', 'Wants full rebrand + new patient booking system. Very motivated. Has budget approved.', 'Nova', '2026-03-16T10:00:00Z', '2026-03-08T11:00:00Z', '2026-03-15T09:00:00Z'),
('550e8400-e29b-41d4-a716-446655440003', 'Sarah Thompson', 'sarah@thompsonlaw.com', '(571) 555-0234', 'Thompson & Associates Law', 'http://thompsonlaw.com', 'Legal', 'Tysons, VA', 'new', 'referral', 68, '$5,000 – $10,000', 'Within 60 days', 'Referred by Chen Dental. Needs modern site with intake forms and case results showcase.', 'Nova', NULL, '2026-03-14T15:45:00Z', '2026-03-14T15:45:00Z'),
('550e8400-e29b-41d4-a716-446655440004', 'Mike Rodriguez', 'mike@rodriguezauto.com', '(703) 555-0367', 'Rodriguez Auto Repair', '', 'Automotive', 'Manassas, VA', 'contacted', 'cold_outreach', 55, '$2,500 – $5,000', 'Exploring options', 'No website at all. Running business from Facebook page. Needs education on ROI.', 'Nova', '2026-03-18T11:00:00Z', '2026-03-12T08:30:00Z', '2026-03-13T14:20:00Z'),
('550e8400-e29b-41d4-a716-446655440005', 'Lisa Park', 'lisa@parkfitness.com', '(571) 555-0489', 'Park Fitness Studio', 'http://parkfitness.com', 'Fitness', 'Reston, VA', 'negotiation', 'social_media', 76, '$5,000 – $10,000', 'Within 30 days', 'Wants class booking system and member portal. Comparing us with 2 other agencies.', 'Nova', '2026-03-16T15:00:00Z', '2026-03-06T10:00:00Z', '2026-03-15T11:00:00Z'),
('550e8400-e29b-41d4-a716-446655440006', 'David Kim', 'david@kimlandscaping.com', '(703) 555-0512', 'Kim Landscaping', 'http://kimlandscaping.com', 'Landscaping', 'Centreville, VA', 'won', 'website', 88, '$5,000 – $10,000', 'Immediate', 'Signed Growth package. Wants portfolio showcase and quote request form.', 'Nova', NULL, '2026-02-28T09:00:00Z', '2026-03-12T16:00:00Z');

-- Insert Agents (8 agents)
INSERT INTO agents (id, name, code_name, role, status, avatar_color, avatar_initials, current_task, tasks_completed_today, tasks_completed_total, approvals_pending, last_active, model, tools, created_at, updated_at) VALUES
('apex', 'Orchestrator', 'Apex', 'Lead Coordinator', 'working', 'from-white to-slate-300', 'AO', 'Coordinating Kim Landscaping design phase', 8, 247, 0, '2026-03-15T21:30:00Z', 'sonnet', ARRAY['Read', 'Write', 'Edit', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Bash', 'Agent'], '2026-03-01T09:00:00Z', '2026-03-15T21:30:00Z'),
('nova', 'Sales Agent', 'Nova', 'Senior Sales Strategist', 'waiting_approval', 'from-blue-400 to-blue-600', 'NS', 'Drafting follow-up email for Park Fitness', 5, 189, 2, '2026-03-15T21:15:00Z', 'sonnet', ARRAY['Read', 'Write', 'Edit', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Bash'], '2026-03-01T09:00:00Z', '2026-03-15T21:15:00Z'),
('meridian', 'Marketing Agent', 'Meridian', 'Digital Marketing Strategist', 'working', 'from-emerald-400 to-emerald-600', 'MK', 'Running SEO audit on Santos Plumbing competitor sites', 3, 156, 0, '2026-03-15T21:20:00Z', 'sonnet', ARRAY['Read', 'Write', 'Edit', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Bash'], '2026-03-01T09:00:00Z', '2026-03-15T21:20:00Z'),
('prism', 'Design Agent', 'Prism', 'Senior UX/UI Designer', 'working', 'from-purple-400 to-purple-600', 'PD', 'Creating homepage mockup for Kim Landscaping', 2, 134, 1, '2026-03-15T21:25:00Z', 'sonnet', ARRAY['Read', 'Write', 'Edit', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Bash'], '2026-03-01T09:00:00Z', '2026-03-15T21:25:00Z'),
('vertex', 'Frontend Agent', 'Vertex', 'Senior Frontend Engineer', 'idle', 'from-cyan-400 to-cyan-600', 'VF', NULL, 0, 98, 0, '2026-03-15T18:00:00Z', 'sonnet', ARRAY['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash'], '2026-03-01T09:00:00Z', '2026-03-15T18:00:00Z'),
('nexus', 'Backend Agent', 'Nexus', 'Senior Backend Engineer', 'idle', 'from-orange-400 to-orange-600', 'NB', NULL, 1, 112, 0, '2026-03-15T17:30:00Z', 'sonnet', ARRAY['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash'], '2026-03-01T09:00:00Z', '2026-03-15T17:30:00Z'),
('sentinel', 'QA Agent', 'Sentinel', 'Senior QA Engineer', 'idle', 'from-rose-400 to-rose-600', 'SQ', NULL, 0, 87, 0, '2026-03-15T16:00:00Z', 'sonnet', ARRAY['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash'], '2026-03-01T09:00:00Z', '2026-03-15T16:00:00Z'),
('compass', 'Operations Agent', 'Compass', 'Senior Operations Manager', 'working', 'from-amber-400 to-amber-600', 'CO', 'Preparing onboarding materials for Chen Dental', 4, 203, 1, '2026-03-15T21:28:00Z', 'sonnet', ARRAY['Read', 'Write', 'Edit', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Bash'], '2026-03-01T09:00:00Z', '2026-03-15T21:28:00Z');

-- Insert Projects (2 projects)
INSERT INTO projects (id, lead_id, name, client_name, client_email, status, package, budget, start_date, estimated_end_date, actual_end_date, progress, current_phase, notes, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'Kim Landscaping Website Redesign', 'David Kim', 'david@kimlandscaping.com', 'design', 'growth', 7500.00, '2026-03-12', '2026-04-23', NULL, 25, 'Design mockups in progress', 'Client wants earthy tones. Portfolio gallery is key feature.', '2026-03-12T16:00:00Z', '2026-03-15T10:00:00Z'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Chen Dental Care Full Rebrand', 'James Chen', 'james@chendentalcare.com', 'discovery', 'premium', 18000.00, '2026-03-15', '2026-05-15', NULL, 5, 'Discovery call scheduled for Monday', 'Full rebrand + booking system + patient portal. High-value client.', '2026-03-15T09:00:00Z', '2026-03-15T09:00:00Z');

-- Insert Project Tasks (6 tasks)
INSERT INTO project_tasks (id, project_id, title, description, status, priority, assigned_agent, estimated_hours, actual_hours, due_date, completed_at, created_at, updated_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Gather brand assets from client', 'Collect logo, photos, brand colors, and content from David.', 'done', 'p2', 'Compass', 2.0, 1.5, '2026-03-14', '2026-03-13T14:00:00Z', '2026-03-12T16:00:00Z', '2026-03-13T14:00:00Z'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Create homepage wireframe', 'Design low-fidelity wireframe for the homepage layout.', 'done', 'p2', 'Prism', 4.0, 3.0, '2026-03-15', '2026-03-14T17:00:00Z', '2026-03-12T16:00:00Z', '2026-03-14T17:00:00Z'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Design homepage mockup', 'High-fidelity mockup based on approved wireframe.', 'in_progress', 'p1', 'Prism', 6.0, 2.0, '2026-03-18', NULL, '2026-03-14T17:00:00Z', '2026-03-15T10:00:00Z'),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'Design services page', 'Mockup for the services/portfolio page.', 'backlog', 'p2', 'Prism', 4.0, 0.0, '2026-03-20', NULL, '2026-03-14T17:00:00Z', '2026-03-14T17:00:00Z'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', 'Set up project repository', 'Initialize React + Vite project with Tailwind CSS.', 'backlog', 'p3', 'Vertex', 2.0, 0.0, '2026-03-22', NULL, '2026-03-12T16:00:00Z', '2026-03-12T16:00:00Z'),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', 'Schedule discovery call', 'Book 60-min discovery call with Dr. Chen.', 'in_progress', 'p1', 'Compass', 1.0, 0.5, '2026-03-16', NULL, '2026-03-15T09:00:00Z', '2026-03-15T09:00:00Z');

-- Insert Bookings (3 bookings)
INSERT INTO bookings (id, lead_id, name, email, phone, business_name, website_url, goal, preferred_date, preferred_time, status, notes, meeting_link, created_at, updated_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Sarah Thompson', 'sarah@thompsonlaw.com', '(571) 555-0234', 'Thompson & Associates Law', 'http://thompsonlaw.com', 'Modern website with client intake forms', '2026-03-17', '10:00 AM', 'confirmed', 'Referred by Chen Dental', 'https://meet.google.com/abc-defg-hij', '2026-03-14T15:45:00Z', '2026-03-15T08:00:00Z'),
('880e8400-e29b-41d4-a716-446655440002', NULL, 'Roberto Vasquez', 'roberto@vasquezhvac.com', '(703) 555-0623', 'Vasquez HVAC Services', '', 'Need a website to get more customers', '2026-03-18', '2:00 PM', 'pending', '', NULL, '2026-03-15T12:00:00Z', '2026-03-15T12:00:00Z'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'Lisa Park', 'lisa@parkfitness.com', '(571) 555-0489', 'Park Fitness Studio', 'http://parkfitness.com', 'Class booking system and member portal', '2026-03-20', '11:00 AM', 'confirmed', 'Follow-up call to discuss revised proposal', 'https://meet.google.com/xyz-abcd-efg', '2026-03-15T11:00:00Z', '2026-03-15T11:30:00Z');

-- Insert Approvals (4 approvals)
INSERT INTO approvals (id, agent_id, agent_name, category, title, description, content, status, priority, submitted_at, reviewed_at, reviewer_notes, metadata) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'nova', 'Nova', 'email', 'Follow-up email to Park Fitness', 'Day 3 check-in email with case study for fitness studios', 'Subject: Quick thought for Park Fitness Studio

Hi Lisa,

I was thinking about our conversation and wanted to share how we helped FitZone Studio increase their class bookings by 40% with a custom booking system.

Would love to walk you through the specific features that made the biggest difference for them.

Best,
Nasir Chase
OmnicoreX', 'pending', 'p2', '2026-03-15T21:15:00Z', NULL, '', '{"lead_id": "550e8400-e29b-41d4-a716-446655440005", "email_type": "follow_up", "sequence_day": 3}'::jsonb),
('990e8400-e29b-41d4-a716-446655440002', 'nova', 'Nova', 'proposal', 'Growth Package Proposal — Santos Plumbing', 'Customized proposal for Santos Plumbing & HVAC based on discovery call', '# Website Proposal: Santos Plumbing & HVAC

## Recommended: Growth Package ($7,500)

### What You Get:
- Custom 8-page responsive website
- Mobile-first design
- Service area pages (Fairfax, Arlington, Alexandria)
- Online appointment booking
- Google Business Profile optimization
- 90-day SEO foundation
- 30-day money-back guarantee

### Timeline: 6 weeks
### Payment: 50% upfront, 50% on launch', 'pending', 'p1', '2026-03-15T20:00:00Z', NULL, '', '{"lead_id": "550e8400-e29b-41d4-a716-446655440001", "package_tier": "growth", "amount": 7500}'::jsonb),
('990e8400-e29b-41d4-a716-446655440003', 'prism', 'Prism', 'design', 'Kim Landscaping Homepage Wireframe', 'Low-fidelity wireframe for client review', 'Wireframe includes: Hero with portfolio slideshow, services grid, testimonials carousel, contact CTA, footer.', 'approved', 'p2', '2026-03-14T15:00:00Z', '2026-03-14T16:30:00Z', 'Looks great. Add a seasonal specials section.', '{"project_id": "660e8400-e29b-41d4-a716-446655440001", "phase": "design"}'::jsonb),
('990e8400-e29b-41d4-a716-446655440004', 'compass', 'Compass', 'email', 'Welcome email to Chen Dental Care', 'Client onboarding welcome email with next steps', 'Subject: Welcome to OmnicoreX — Here''s What Happens Next

Dr. Chen,

Welcome aboard! We''re excited to transform Chen Dental Care''s online presence.

Here''s your roadmap:
1. Discovery call (Monday, March 16 at 10 AM)
2. Brand asset collection (we''ll send a questionnaire)
3. Design phase begins (Week of March 23)

Questions? Reply to this email anytime.

Best,
Nasir Chase
OmnicoreX', 'pending', 'p1', '2026-03-15T21:28:00Z', NULL, '', '{"project_id": "660e8400-e29b-41d4-a716-446655440002", "email_type": "onboarding"}'::jsonb);

-- Insert Activities (8 activities)
INSERT INTO activities (id, agent_name, action, description, entity_type, entity_id, metadata, timestamp) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Nova', 'Scored new lead', 'Sarah Thompson — Thompson & Associates Law — Score: 68/100', 'lead', '550e8400-e29b-41d4-a716-446655440003', '{}'::jsonb, '2026-03-15T21:30:00Z'),
('aa0e8400-e29b-41d4-a716-446655440002', 'Compass', 'Submitted for approval', 'Welcome email for Chen Dental Care onboarding', 'approval', '990e8400-e29b-41d4-a716-446655440004', '{}'::jsonb, '2026-03-15T21:28:00Z'),
('aa0e8400-e29b-41d4-a716-446655440003', 'Prism', 'Started task', 'Creating homepage mockup for Kim Landscaping', 'project', '660e8400-e29b-41d4-a716-446655440001', '{}'::jsonb, '2026-03-15T21:25:00Z'),
('aa0e8400-e29b-41d4-a716-446655440004', 'Meridian', 'Completed SEO audit', 'Competitor analysis for Santos Plumbing — found 3 keyword gaps', 'lead', '550e8400-e29b-41d4-a716-446655440001', '{}'::jsonb, '2026-03-15T21:20:00Z'),
('aa0e8400-e29b-41d4-a716-446655440005', 'Nova', 'Submitted for approval', 'Follow-up email for Park Fitness Studio', 'approval', '990e8400-e29b-41d4-a716-446655440001', '{}'::jsonb, '2026-03-15T21:15:00Z'),
('aa0e8400-e29b-41d4-a716-446655440006', 'Apex', 'Assigned task', 'Assigned homepage mockup to Prism for Kim Landscaping project', 'project', '660e8400-e29b-41d4-a716-446655440001', '{}'::jsonb, '2026-03-15T20:30:00Z'),
('aa0e8400-e29b-41d4-a716-446655440007', 'Nova', 'Submitted for approval', 'Growth Package proposal for Santos Plumbing ($7,500)', 'approval', '990e8400-e29b-41d4-a716-446655440002', '{}'::jsonb, '2026-03-15T20:00:00Z'),
('aa0e8400-e29b-41d4-a716-446655440008', 'Nexus', 'Updated schema', 'Added booking_status enum to Supabase migration', 'system', NULL, '{}'::jsonb, '2026-03-15T17:30:00Z');

-- Insert Revenue Metrics (6 months)
INSERT INTO revenue_metrics (id, month, revenue, deals_closed, avg_deal_size, pipeline_value, created_at, updated_at) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', '2025-10-01', 0.00, 0, 0.00, 5000.00, '2026-03-16T00:00:00Z', '2026-03-16T00:00:00Z'),
('bb0e8400-e29b-41d4-a716-446655440002', '2025-11-01', 2500.00, 1, 2500.00, 12000.00, '2026-03-16T00:00:00Z', '2026-03-16T00:00:00Z'),
('bb0e8400-e29b-41d4-a716-446655440003', '2025-12-01', 5000.00, 1, 5000.00, 18000.00, '2026-03-16T00:00:00Z', '2026-03-16T00:00:00Z'),
('bb0e8400-e29b-41d4-a716-446655440004', '2026-01-01', 7500.00, 2, 3750.00, 25000.00, '2026-03-16T00:00:00Z', '2026-03-16T00:00:00Z'),
('bb0e8400-e29b-41d4-a716-446655440005', '2026-02-01', 12500.00, 2, 6250.00, 35000.00, '2026-03-16T00:00:00Z', '2026-03-16T00:00:00Z'),
('bb0e8400-e29b-41d4-a716-446655440006', '2026-03-01', 7500.00, 1, 7500.00, 48500.00, '2026-03-16T00:00:00Z', '2026-03-16T00:00:00Z');
