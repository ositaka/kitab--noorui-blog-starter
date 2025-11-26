# Comment System Design Specification

**Version:** 1.0
**Status:** ✅ Implemented
**Target:** Kitab Blog Starter → noorui-rtl v0.4.0

---

## Overview

A comprehensive, RTL-first comment system designed for multilingual blogs and content platforms. Built with Supabase, featuring threaded discussions, reactions, moderation tools, and seamless bidirectional text support.

### Core Philosophy

- **Content-first**: Minimize visual noise, maximize readability
- **RTL-first**: Perfect support for Arabic, Urdu, Hebrew, and mixed content
- **Engagement-focused**: Thoughtful interactions over quantity
- **Professional**: Suitable for technical blogs and professional platforms
- **Reusable**: Leverage existing noorui-rtl components, create new generic primitives

---

## Component Architecture

### Reusability Strategy

**Build on existing noorui-rtl components:**
- Avatar, Card, Button, Badge, Separator, Tooltip, Popover
- DropdownMenu, Dialog, RichTextEditor, Skeleton, Textarea

**Create new generic components for noorui-rtl:**
1. **ReactionPicker** - Reusable emoji/reaction picker (LinkedIn-style)
2. **UserBadge** - Role/status badges (Author, Moderator, Verified, etc.)
3. **ContentRenderer** - Markdown renderer with RTL/LTR auto-detection
4. **useRelativeTime** - Hook for relative timestamps ("2 hours ago")
5. **Kbd** - Platform-aware keyboard shortcut display (⌘↵, Ctrl+Enter, etc.)

**Create comment-specific components:**
1. **CommentSection** - Main container with sorting/filtering
2. **Comment** - Individual comment display (compound component)
3. **CommentForm** - Comment editor wrapper
4. **CommentThread** - Threading/nesting logic

---

## Features

### 1. Comment Display

#### Visual Structure
```
┌─────────────────────────────────────────────────────────────┐
│  [Avatar] Nuno Marques  @ositaka  •  2 hours ago  [Author]  │
│           ─────────────────────────────────────────          │
│  This is an excellent article about RTL design! I especially │
│  loved the part about logical CSS properties.                │
│                                                               │
│  Mixed content works seamlessly: "التصميم ثنائي الاتجاه is    │
│  fundamental for modern web development!"                    │
│                                                               │
│  ```css                                                       │
│  margin-inline-start: 1rem; /* Auto RTL/LTR */               │
│  ```                                                          │
│                                                               │
│  [👍❤️💡 20]  •  Reply  •  Edit  •  ⋯                        │
│                                                               │
│  └─ [Avatar] Ahmed  @ahmed  •  1 hour ago                    │
│             Totally agree! The logical properties...         │
│             [👍 3]  •  Reply                                  │
│                                                               │
│     └─ [Avatar] Nuno  @ositaka  •  30 min  [Author]         │
│                Yes! Planning a follow-up on this...          │
│                [❤️ 1]  •  Reply                               │
└─────────────────────────────────────────────────────────────┘
```

#### Features

**Content Support:**
- Full Markdown support (bold, italic, links, lists, blockquotes)
- Syntax-highlighted code blocks
- Automatic mixed RTL/LTR text handling (`dir="auto"`)
- @mention support with autocomplete

**Visual Elements:**
- User avatar with fallback initials (using noorui **Avatar**)
- Username and optional handle
- Relative timestamps ("2 hours ago") with auto-update
- Author badge (post author)
- Moderator badge (site admins)
- Pinned badge (highlighted by author/moderator)
- Edit indicator ("edited 5 min ago")

### 2. Reactions System

#### Design: LinkedIn-Style (Merged)

**Why LinkedIn over Discord:**
- Reduces visual noise
- Keeps focus on content
- More elegant and professional
- Better space efficiency
- Still shows reaction diversity

**Display Logic:**
```tsx
// When no reactions
[React]

// With reactions (1-3 types)
[👍 12]           // Single type
[👍❤️ 17]         // Two types
[👍❤️💡 20]       // Three or more (show top 3)
```

**Interaction:**
- Click → Opens reaction picker popover
- Hover → Tooltip shows breakdown: "12 likes, 5 hearts, 3 lightbulbs"
- Picker shows all 6 reaction types with counts
- Active state for reactions you've given

**Available Reactions:**
- 👍 Like (general approval)
- ❤️ Love (strong appreciation)
- 💡 Insightful (valuable insight)
- 🚀 Useful (helpful/practical)
- 🎉 Celebrate (exciting news)
- 👀 Interesting (curious/noteworthy)

### 3. Threading & Replies

**Depth:** Up to 3 levels deep
- Level 0: Top-level comments
- Level 1: Direct replies
- Level 2: Nested replies
- Level 3+: Flattened (reply to deepest level)

**Visual Indentation:**
```css
/* Uses logical properties for RTL/LTR */
.comment-reply {
  margin-inline-start: 2.5rem;  /* LTR: left, RTL: right */
  border-inline-start: 2px solid var(--border);
  padding-inline-start: 1rem;
}
```

### 4. Comment Form (Editor)

**Features:**
- Markdown WYSIWYG editor (using noorui **RichTextEditor**)
- Live preview toggle
- @mention autocomplete
- Emoji picker
- Character counter (max 5000)
- Supports mixed RTL/LTR input

**Toolbar:**
- Bold, Italic, Link
- Code inline, Code block
- Lists (ordered, unordered)
- Blockquote

### 5. Moderation Features

**Pin Comment** (Author/Moderator only)
- Highlights best/most relevant comments
- Appears first (regardless of sort order)
- Badge: "📌 Pinned"

**Mark as Answer** (Author only)
- For Q&A style posts
- Badge: "✓ Answer"

**Edit Comment** (Author only)
- Edit your own comments within 24 hours
- Shows "edited X ago" indicator

**Delete Comment** (Author/Moderator)
- Soft delete: Shows "[deleted]" placeholder
- Preserves thread structure

**Report/Flag** (All users)
- Report inappropriate content
- Reasons: Spam, Abuse, Off-topic

### 6. Sorting & Filtering

**Sort Options:**
- **Newest first** (default)
- **Oldest first**
- **Most reactions**
- **Pinned first** (then by newest)

### 7. User Experience

**Optimistic Updates:**
- Comment appears immediately
- Reactions toggle instantly

**Pagination:**
- Load 20 initial comments
- "Load more" button

**Permalinks:**
- Each comment: `/blog/post-slug#comment-123`

**Keyboard Shortcuts:**
- `Cmd+Enter` / `Ctrl+Enter` - Submit comment (displayed with Kbd component)
- `Esc` - Cancel edit/reply (displayed with Kbd component)
- Visual shortcuts embedded in buttons for discoverability

---

## New Generic Components (noorui-rtl)

### 1. ReactionPicker

**Purpose:** Reusable emoji/reaction picker for any context (comments, posts, messages, etc.)

**Props:**
```tsx
interface ReactionPickerProps {
  // Current state
  reactions: {
    emoji: string;
    count: number;
    hasReacted: boolean;
  }[];

  // Configuration
  variant?: 'compact' | 'expanded'; // Default: compact (LinkedIn-style)
  availableReactions?: string[]; // Default: ['👍', '❤️', '💡', '🚀', '🎉', '👀']
  maxVisible?: number; // Default: 3 (for compact mode)

  // Callbacks
  onReact: (emoji: string) => void;

  // Accessibility
  ariaLabel?: string;
}
```

**Behavior:**
- **Compact mode (LinkedIn):** Shows `[👍❤️💡 20]` with top 3 emojis
- **Expanded mode (Discord):** Shows `[👍 12] [❤️ 5] [💡 3]` separately
- Click opens **Popover** with all reaction options
- Hover shows **Tooltip** with breakdown
- Active state for user's reactions

**Use Cases:**
- Blog post reactions
- Comment reactions
- Chat message reactions
- Forum post voting
- Product reviews

### 2. UserBadge

**Purpose:** Role/status badge for users across the platform

**Props:**
```tsx
interface UserBadgeProps {
  variant: 'author' | 'moderator' | 'verified' | 'admin' | 'custom';
  label?: string; // For custom variant
  icon?: React.ReactNode; // Optional icon
  className?: string;
}
```

**Variants:**
- **author** - Post/content author (secondary badge)
- **moderator** - Site moderator (outline badge)
- **verified** - Verified user (✓ icon)
- **admin** - Administrator (destructive badge)
- **custom** - Custom label and styling

**Use Cases:**
- Comment author identification
- User profiles
- Leaderboards
- Chat messages
- Forum posts

### 3. ContentRenderer

**Purpose:** Render markdown content with automatic RTL/LTR detection

**Props:**
```tsx
interface ContentRendererProps {
  content: string;
  format?: 'markdown' | 'html' | 'text'; // Default: markdown
  dir?: 'auto' | 'ltr' | 'rtl'; // Default: auto
  className?: string;

  // Markdown options
  enableCodeHighlight?: boolean; // Default: true
  enableGFM?: boolean; // GitHub Flavored Markdown, default: true
}
```

**Features:**
- Renders markdown with **rehype-pretty-code** for syntax highlighting
- `dir="auto"` handles mixed RTL/LTR content automatically
- Code blocks always LTR (`dir="ltr"`)
- Sanitizes HTML to prevent XSS
- Applies `.prose` classes for typography

**Use Cases:**
- Comment content
- Blog post content
- User bios
- Forum posts
- Documentation

### 4. useRelativeTime (Hook)

**Purpose:** Format dates as relative time strings ("2 hours ago") with auto-updates

**API:**
```tsx
function useRelativeTime(
  date: Date | string,
  locale: string,
  options?: {
    updateInterval?: number; // Default: 60000 (1 min)
    format?: 'short' | 'long'; // Default: long
  }
): string;
```

**Returns:**
```tsx
"just now"
"2 minutes ago"
"1 hour ago"
"3 days ago"
"2 weeks ago"
"3 months ago"
"1 year ago"
```

**Features:**
- Auto-updates based on `updateInterval`
- Localized strings (supports all 4 locales)
- Cleanup on unmount

**Use Cases:**
- Comment timestamps
- Post publish dates
- Activity feed
- Notification times
- Last updated indicators

### 5. Kbd (Keyboard Shortcut)

**Purpose:** Display keyboard shortcuts with platform-aware symbols

**API:**
```tsx
interface KbdProps {
  keys?: string[]; // e.g., ['mod', 'enter']
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}
```

**Examples:**
```tsx
// Platform-aware: ⌘↵ on Mac, Ctrl↵ on Windows
<Kbd keys={['mod', 'enter']} />

// Single key
<Kbd keys={['esc']} />

// In button
<Button>
  Submit <Kbd keys={['mod', 'enter']} size="sm" />
</Button>
```

**Platform Detection:**
- `mod` → `⌘` on Mac, `Ctrl` on Windows/Linux
- `enter` → `↵`
- `shift` → `⇧`
- `alt` → `⌥` on Mac, `Alt` on Windows
- Auto-detects platform on mount

**Features:**
- All keys in single badge (not separate)
- Monospace font for consistency
- Dark background with light text (matches noorui.com search)
- Vertical alignment fixes for arrow symbols
- RTL/LTR support

**Use Cases:**
- Form submit buttons
- Modal actions
- Command palettes
- Documentation
- Help tooltips

---

## Comment-Specific Components

### 1. CommentSection (Container)

**Props:**
```tsx
interface CommentSectionProps {
  postId: string;
  locale: 'en' | 'ar' | 'fr' | 'ur';
  currentUser?: User;

  // Configuration
  sortBy?: 'newest' | 'oldest' | 'most-reactions';
  allowReplies?: boolean;
  maxDepth?: number; // Default: 3
  enableReactions?: boolean;
  enableMarkdown?: boolean;

  // Moderation
  canPin?: boolean;
  canModerate?: boolean;

  // Callbacks
  onCommentAdded?: (comment: Comment) => void;
  onCommentDeleted?: (commentId: string) => void;
}
```

**Composition:**
Uses noorui components: Card, Button, Separator, Skeleton

### 2. Comment (Display)

**Props:**
```tsx
interface CommentProps {
  id: string;
  content: string;

  author: {
    id: string;
    name: string;
    avatar?: string;
    isPostAuthor?: boolean;
    isModerator?: boolean;
  };

  createdAt: Date;
  editedAt?: Date;
  isPinned?: boolean;
  isAnswer?: boolean;

  reactions: {
    emoji: string;
    count: number;
    hasReacted: boolean;
  }[];

  replies?: Comment[];
  depth: number;
  maxDepth: number;

  canEdit: boolean;
  canDelete: boolean;
  canPin: boolean;
  canReply: boolean;

  onReply: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onReact: (commentId: string, emoji: string) => void;
  onPin: (commentId: string) => void;
}
```

**Composition:**
```tsx
<Card>
  <Avatar /> {/* noorui */}
  <UserBadge variant="author" /> {/* NEW */}
  <RelativeTime /> {/* NEW: useRelativeTime hook */}
  <DropdownMenu /> {/* noorui */}

  <ContentRenderer content={content} /> {/* NEW */}

  <ReactionPicker reactions={reactions} /> {/* NEW */}
  <Button>Reply</Button> {/* noorui */}

  <CommentThread>{replies}</CommentThread>
</Card>
```

### 3. CommentForm (Editor)

**Props:**
```tsx
interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  initialContent?: string;
  placeholder?: string;
  maxLength?: number; // Default: 5000
  locale: 'en' | 'ar' | 'fr' | 'ur';
  user: User;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
}
```

**Composition:**
```tsx
<Card>
  <Avatar /> {/* noorui */}
  <Textarea dir="auto" /> {/* noorui */}
  <Button>
    Submit <Kbd keys={['mod', 'enter']} size="sm" />
  </Button>
  <Button variant="ghost">
    Cancel <Kbd keys={['esc']} size="sm" />
  </Button>
</Card>
```

**Features:**
- Textarea with auto-resize and character counter
- Keyboard shortcuts displayed inline with buttons
- Platform-aware shortcut symbols (⌘ on Mac, Ctrl on Windows)
- Supports `dir="auto"` for mixed RTL/LTR input
- Cancel button only shown when editing/replying

### 4. CommentThread (Threading Container)

**Props:**
```tsx
interface CommentThreadProps {
  comments: Comment[];
  depth: number;
  maxDepth: number;
  locale: string;
  currentUser?: User;
  onReply: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onReact: (commentId: string, emoji: string) => void;
}
```

**Handles:**
- Recursive rendering up to `maxDepth`
- Indentation with logical CSS properties
- Reply form state management

---

## Database Schema

### Tables

#### `comments`
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Content
  content TEXT NOT NULL,
  content_html TEXT, -- Rendered markdown (cached)

  -- Metadata
  is_pinned BOOLEAN DEFAULT false,
  is_answer BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_parent CHECK (id != parent_id)
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- Trigger: Prevent deeply nested threads (max 3 levels)
CREATE OR REPLACE FUNCTION check_comment_depth()
RETURNS TRIGGER AS $$
DECLARE
  depth INTEGER := 0;
  current_parent UUID := NEW.parent_id;
BEGIN
  WHILE current_parent IS NOT NULL LOOP
    depth := depth + 1;
    IF depth >= 3 THEN
      RAISE EXCEPTION 'Maximum comment depth (3 levels) exceeded';
    END IF;
    SELECT parent_id INTO current_parent FROM comments WHERE id = current_parent;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_comment_depth
  BEFORE INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION check_comment_depth();
```

#### `comment_reactions`
```sql
CREATE TABLE comment_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL CHECK (emoji IN ('👍', '❤️', '💡', '🚀', '🎉', '👀')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_comment_reaction UNIQUE(comment_id, user_id, emoji)
);

CREATE INDEX idx_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX idx_reactions_user_id ON comment_reactions(user_id);
```

### Row Level Security (RLS)

```sql
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

-- Anyone can read non-deleted comments
CREATE POLICY "read_comments" ON comments FOR SELECT
  USING (is_deleted = false);

-- Authenticated users can create
CREATE POLICY "create_comments" ON comments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can update their own
CREATE POLICY "update_own_comments" ON comments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

-- Users can delete their own (soft delete)
CREATE POLICY "delete_own_comments" ON comments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND is_deleted = true);

-- Reactions policies
CREATE POLICY "read_reactions" ON comment_reactions FOR SELECT USING (true);
CREATE POLICY "create_reactions" ON comment_reactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_reactions" ON comment_reactions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
```

---

## RTL/LTR Implementation

### CSS with Logical Properties

```css
/* Comment container - flexbox handles direction */
.comment {
  display: flex;
  gap: 0.75rem;
}

/* Reply indentation - logical properties */
.comment-reply {
  margin-inline-start: 2.5rem;
  border-inline-start: 2px solid var(--border);
  padding-inline-start: 1rem;
}

/* Content - auto-detect direction */
.comment-content {
  direction: auto;
  text-align: start;
}

/* Code always LTR */
.comment-content pre {
  direction: ltr;
  text-align: left;
}
```

### Component Implementation

```tsx
export function Comment({ author, content, dir, locale, ...props }: CommentProps) {
  const timeAgo = useRelativeTime(createdAt, locale);
  const direction = dir || (locale === 'ar' || locale === 'ur' ? 'rtl' : 'ltr');

  return (
    <Card className="p-4" dir={direction}>
      <div className="flex gap-3">
        <Avatar src={author.avatar} fallback={author.name[0]} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{author.name}</span>
            {author.isPostAuthor && <UserBadge variant="author" />}
            <span className="text-sm text-muted-foreground">• {timeAgo}</span>
          </div>

          <ContentRenderer
            content={content}
            dir="auto"
            className="mt-2"
          />

          <div className="flex items-center gap-3 mt-3">
            <ReactionPicker
              reactions={reactions}
              variant="compact"
              onReact={handleReact}
            />
            <Separator orientation="vertical" className="h-4" />
            <Button variant="ghost" size="sm">Reply</Button>
            {canEdit && <Button variant="ghost" size="sm">Edit</Button>}
          </div>
        </div>
      </div>

      {replies && replies.length > 0 && (
        <CommentThread
          comments={replies}
          depth={depth + 1}
          maxDepth={maxDepth}
          {...threadProps}
        />
      )}
    </Card>
  );
}
```

---

## Implementation Phases

### Phase 1: Database & API (Day 1) - 4-5 hours

- [ ] Create database schema (`comments`, `comment_reactions`)
- [ ] Set up RLS policies
- [ ] Create Server Actions (CRUD operations)
- [ ] Test with Supabase client

### Phase 2: Generic Components (Day 2) - 5-6 hours

- [ ] Build **ReactionPicker** component
- [ ] Build **UserBadge** component
- [ ] Build **ContentRenderer** component
- [ ] Create **useRelativeTime** hook
- [ ] Test in all 4 locales

### Phase 3: Comment Components (Day 3) - 5-6 hours

- [ ] Build **CommentForm** (editor)
- [ ] Build **Comment** (display)
- [ ] Build **CommentThread** (threading)
- [ ] Build **CommentSection** (container)
- [ ] Test threading, replies, RTL/LTR

### Phase 4: Features & Polish (Day 4) - 4-5 hours

- [ ] Pin comments
- [ ] Mark as answer
- [ ] Edit/delete functionality
- [ ] Sorting options
- [ ] Loading states (skeletons)
- [ ] Optimistic updates
- [ ] Error handling
- [ ] Accessibility audit
- [ ] Performance optimization

---

## Components for Migration to noorui-rtl

### New Generic Components (Ready for noorui-rtl v0.4.0)

1. **ReactionPicker** - `components/ui/reaction-picker.tsx`
2. **UserBadge** - `components/ui/user-badge.tsx`
3. **ContentRenderer** - `components/ui/content-renderer.tsx`
4. **useRelativeTime** - `hooks/use-relative-time.ts`

### Comment System Components (Ready for noorui-rtl v0.4.0)

5. **CommentSection** - `components/comments/comment-section.tsx`
6. **Comment** - `components/comments/comment.tsx`
7. **CommentForm** - `components/comments/comment-form.tsx`
8. **CommentThread** - `components/comments/comment-thread.tsx`

---

## Future Enhancements

### v1.1 - Real-time
- Supabase Realtime integration
- Live comment updates
- "New comments" notification

### v1.2 - Advanced Features
- @mention notifications
- Email notifications (new replies)
- Spam detection
- Comment search

---

## Design Decisions

### Why LinkedIn-Style Reactions?

**Problem:** Discord-style `[👍 12] [❤️ 5] [💡 3]` creates visual noise
**Solution:** Merged display `[👍❤️💡 20]` keeps focus on content
**Result:** Cleaner, more professional, better UX

### Why Max 3 Levels of Threading?

**Research:** Beyond 3 levels, threads become hard to follow
**Solution:** 3 levels sufficient for 95% of discussions
**Result:** Better readability on mobile and desktop

### Why Separate Generic Components?

**Reusability:** ReactionPicker, UserBadge, ContentRenderer useful across platform
**Maintainability:** Single source of truth for common patterns
**Result:** More complete noorui-rtl component library

---

## Resources

### Inspiration
- GitHub Discussions (threading, reactions)
- Linear (clean UI, keyboard shortcuts)
- LinkedIn (merged reactions)
- Discourse (moderation, threading)

### Technical
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [Bidirectional Text](https://www.w3.org/International/questions/qa-bidi-unicode-controls)
