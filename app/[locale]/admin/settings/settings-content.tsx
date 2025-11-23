'use client'

import { useRouter } from 'next/navigation'
import { Button, Badge, Separator, Avatar, AvatarFallback, AvatarImage } from 'noorui-rtl'
import { User, Globe, Info, LogOut, Github, ExternalLink, Shield, Eye } from 'lucide-react'
import type { Locale } from '@/lib/supabase/types'
import { useAuth } from '../auth-provider'
import { toast } from 'sonner'

interface SettingsContentProps {
  locale: Locale
  translations: {
    title: string
    description: string
    profile: {
      title: string
      description: string
      name: string
      email: string
      role: string
      admin: string
      guest: string
    }
    site: {
      title: string
      description: string
      siteName: string
      siteUrl: string
      locales: string
      enabledLocales: string
    }
    demo: {
      title: string
      description: string
      viewOnGithub: string
      builtWith: string
    }
    actions: {
      signOut: string
      signOutDescription: string
    }
  }
}

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-2 bg-muted rounded-md">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Separator className="my-4" />
      {children}
    </div>
  )
}

function SettingsRow({
  label,
  value,
  badge,
  badgeVariant = 'secondary',
}: {
  label: string
  value: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{value}</span>
        {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
      </div>
    </div>
  )
}

export function SettingsContent({ locale, translations: t }: SettingsContentProps) {
  const router = useRouter()
  const { user, isAdmin, isGuest, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      router.push(`/${locale}/admin/login`)
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground mt-1">{t.description}</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <SettingsCard
          icon={User}
          title={t.profile.title}
          description={t.profile.description}
        >
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback className="text-lg">
                {user?.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'G'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{user?.name || 'Guest'}</p>
              <p className="text-sm text-muted-foreground">{user?.email || 'guest@kitab.blog'}</p>
            </div>
          </div>
          <SettingsRow
            label={t.profile.role}
            value={isAdmin ? t.profile.admin : t.profile.guest}
            badge={isAdmin ? undefined : undefined}
            badgeVariant={isAdmin ? 'default' : 'secondary'}
          />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">{t.profile.role}</span>
            <Badge variant={isAdmin ? 'default' : 'secondary'} className="gap-1">
              {isAdmin ? (
                <>
                  <Shield className="h-3 w-3" />
                  {t.profile.admin}
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3" />
                  {t.profile.guest}
                </>
              )}
            </Badge>
          </div>
        </SettingsCard>

        {/* Site Information */}
        <SettingsCard
          icon={Globe}
          title={t.site.title}
          description={t.site.description}
        >
          <SettingsRow label={t.site.siteName} value="Kitab" />
          <SettingsRow label={t.site.siteUrl} value="blog-starter.noorui.com" />
          <SettingsRow label={t.site.locales} value={t.site.enabledLocales} />
        </SettingsCard>

        {/* Demo Information */}
        <SettingsCard
          icon={Info}
          title={t.demo.title}
          description={t.demo.description}
        >
          <p className="text-sm text-muted-foreground mb-4">
            {t.demo.builtWith}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href="https://github.com/ositaka/noorui-blog-starter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                {t.demo.viewOnGithub}
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </SettingsCard>

        {/* Sign Out */}
        <SettingsCard
          icon={LogOut}
          title={t.actions.signOut}
          description={t.actions.signOutDescription}
        >
          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 me-2" />
            {t.actions.signOut}
          </Button>
        </SettingsCard>
      </div>
    </div>
  )
}
