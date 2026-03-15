import { useState } from 'react'
import { Save, Database, CreditCard, Mail, Calendar, Globe, Bell, Shield, Key, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import { mockApprovals } from '@/data/mock'
import { cn } from '@/utils/cn'

interface IntegrationCardProps {
  name: string
  description: string
  icon: React.ReactNode
  connected: boolean
  onConnect: () => void
}

function IntegrationCard({ name, description, icon, connected, onConnect }: IntegrationCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{name}</h3>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </div>
      {connected ? (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-400/10 px-3 py-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="text-sm text-emerald-400">Connected</span>
        </div>
      ) : (
        <button onClick={onConnect} className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:border-slate-600 hover:text-white">
          Connect
        </button>
      )}
    </div>
  )
}

const ENV_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_STRIPE_PUBLISHABLE_KEY',
  'VITE_GOOGLE_CLIENT_ID',
  'VITE_GOOGLE_CALENDAR_API_KEY',
] as const

function getEnvStatus(key: string): boolean {
  const val = import.meta.env[key]
  return typeof val === 'string' && val.length > 0
}

const DEFAULT_NOTIFICATIONS: Record<string, boolean> = {
  'New lead received': true,
  'Approval required': true,
  'Booking confirmed': true,
  'Project milestone': true,
  'Agent errors': true,
  'Weekly summary': false,
}

const DEFAULT_APPROVAL_RULES: Record<string, boolean> = {
  'All client-facing emails': true,
  'Proposals and quotes': true,
  'Production deployments': true,
  'Design presentations': true,
  'Financial commitments over $1,000': true,
  'Project scope changes': true,
  'Internal research tasks': false,
  'Code development (non-deploy)': false,
}

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState('general')
  const [notifs, setNotifs] = useState(DEFAULT_NOTIFICATIONS)
  const [rules, setRules] = useState(DEFAULT_APPROVAL_RULES)
  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending').length

  const toggleNotif = (key: string) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }))
  const toggleRule = (key: string) => setRules(prev => ({ ...prev, [key]: !prev[key] }))

  const supabaseConnected = getEnvStatus('VITE_SUPABASE_URL') && getEnvStatus('VITE_SUPABASE_ANON_KEY')
  const stripeConnected = getEnvStatus('VITE_STRIPE_PUBLISHABLE_KEY')
  const gmailConnected = getEnvStatus('VITE_GOOGLE_CLIENT_ID')
  const calendarConnected = getEnvStatus('VITE_GOOGLE_CALENDAR_API_KEY')

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'integrations', label: 'Integrations', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="min-h-screen">
      <Header title="Settings" subtitle="Configure your dashboard and integrations" pendingApprovals={pendingApprovals} />

      <div className="p-6">
        {/* Tab Navigation */}
        <div className="mb-6 flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === tab.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-300'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-4 text-base font-semibold text-white">Business Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="business-name" className="text-sm text-slate-400">Business Name</label>
                  <input id="business-name" type="text" defaultValue="OmnicoreX" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="business-email" className="text-sm text-slate-400">Email</label>
                  <input id="business-email" type="email" defaultValue="hello@omnicorex.com" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="business-phone" className="text-sm text-slate-400">Phone</label>
                  <input id="business-phone" type="tel" defaultValue="+1 (571) 444-9123" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="business-website" className="text-sm text-slate-400">Website</label>
                  <input id="business-website" type="url" defaultValue="https://omnicorex.com" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="business-address" className="text-sm text-slate-400">Address</label>
                  <input id="business-address" type="text" defaultValue="Northern Virginia" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none" />
                </div>
              </div>
              <button className="mt-4 flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-300">
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-4 text-base font-semibold text-white">Agent Configuration</h2>
              <p className="text-sm text-slate-400">Agent .md files are located in <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-cyan-400">.claude/agents/</code> directory. Edit these files to customize agent behavior, personality, and expertise.</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {['sales-agent.md', 'marketing-agent.md', 'design-agent.md', 'frontend-agent.md', 'backend-agent.md', 'qa-agent.md', 'operations-agent.md', 'orchestrator-agent.md'].map((file) => (
                  <div key={file} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
                    <span className="text-sm text-slate-300">{file}</span>
                    <button className="text-xs text-cyan-400 hover:text-cyan-300">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Integrations */}
        {activeTab === 'integrations' && (
          <div className="space-y-4">
            <IntegrationCard name="Supabase" description="PostgreSQL database, authentication, and real-time subscriptions" icon={<Database className="h-5 w-5 text-emerald-400" />} connected={supabaseConnected} onConnect={() => window.open('https://supabase.com/dashboard', '_blank')} />
            <IntegrationCard name="Stripe" description="Payment processing, invoices, and subscription management" icon={<CreditCard className="h-5 w-5 text-purple-400" />} connected={stripeConnected} onConnect={() => window.open('https://dashboard.stripe.com/apikeys', '_blank')} />
            <IntegrationCard name="Gmail" description="Send and receive emails, manage drafts and labels" icon={<Mail className="h-5 w-5 text-red-400" />} connected={gmailConnected} onConnect={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')} />
            <IntegrationCard name="Google Calendar" description="Schedule meetings, check availability, manage events" icon={<Calendar className="h-5 w-5 text-blue-400" />} connected={calendarConnected} onConnect={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')} />

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-2 text-base font-semibold text-white">Environment Variables</h2>
              <p className="mb-4 text-sm text-slate-400">Copy <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-cyan-400">.env.example</code> to <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-cyan-400">.env</code> and configure your API keys.</p>
              <div className="space-y-2">
                {ENV_KEYS.map((key) => {
                  const isSet = getEnvStatus(key)
                  return (
                    <div key={key} className="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2">
                      <code className="text-sm text-slate-300">{key}</code>
                      {isSet ? (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span className="text-xs text-emerald-400">Set</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-amber-400" />
                          <span className="text-xs text-amber-400">Missing</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-base font-semibold text-white">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { label: 'New lead received', description: 'Get notified when a new lead comes in from the website' },
                { label: 'Approval required', description: 'Alert when an agent submits work for your review' },
                { label: 'Booking confirmed', description: 'Notification when a discovery call is booked' },
                { label: 'Project milestone', description: 'Updates when a project reaches a new phase' },
                { label: 'Agent errors', description: 'Alert when an agent encounters an error' },
                { label: 'Weekly summary', description: 'Weekly digest of all activity and metrics' },
              ].map((pref) => {
                const isOn = notifs[pref.label] ?? false
                return (
                  <div key={pref.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">{pref.label}</p>
                      <p className="text-xs text-slate-400">{pref.description}</p>
                    </div>
                    <button
                      onClick={() => toggleNotif(pref.label)}
                      className={cn(
                        'relative h-6 w-11 rounded-full transition-colors',
                        isOn ? 'bg-cyan-400' : 'bg-slate-700'
                      )}
                      role="switch"
                      aria-checked={isOn}
                      aria-label={pref.label}
                    >
                      <span className={cn(
                        'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        isOn ? 'left-[22px]' : 'left-0.5'
                      )} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-4 text-base font-semibold text-white">Approval Rules</h2>
              <p className="mb-4 text-sm text-slate-400">Configure which actions require your approval before agents can proceed.</p>
              <div className="space-y-3">
                {Object.keys(DEFAULT_APPROVAL_RULES).map((label) => {
                  const isOn = rules[label] ?? false
                  return (
                    <div key={label} className="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-3">
                      <span className="text-sm text-slate-300">{label}</span>
                      <button
                        onClick={() => toggleRule(label)}
                        className={cn(
                          'relative h-6 w-11 rounded-full transition-colors',
                          isOn ? 'bg-cyan-400' : 'bg-slate-700'
                        )}
                        role="switch"
                        aria-checked={isOn}
                        aria-label={label}
                      >
                        <span className={cn(
                          'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                          isOn ? 'left-[22px]' : 'left-0.5'
                        )} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
