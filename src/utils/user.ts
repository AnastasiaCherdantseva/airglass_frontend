import { Status } from "@/types/enums"
import { User } from "@/types/models"

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0]?.charAt(0) ?? ''
  const second = parts.length > 1 ? (parts[1]?.charAt(0) ?? '') : ''
  return (first + second).toUpperCase()
}

// interface AvatarColors {
//   backgroundColor: string
//   color: string
// }

// const AVATAR_PALETTE: AvatarColors[] = [
//   { backgroundColor: '#dbeafe', color: '#1d4ed8' },
//   { backgroundColor: '#ede9fe', color: '#6d28d9' },
//   { backgroundColor: '#dcfce7', color: '#15803d' },
//   { backgroundColor: '#fef3c7', color: '#b45309' },
//   { backgroundColor: '#ffe4e6', color: '#be123c' },
// ]

// export function getAvatarColors(id: string): AvatarColors {
//   let hash = 0
//   for (let i = 0; i < id.length; i++) {
//     hash = (hash * 31 + id.charCodeAt(i)) >>> 0
//   }
//   return AVATAR_PALETTE[hash % AVATAR_PALETTE.length] ?? AVATAR_PALETTE[0]!
// }

export function getUserStatus(user: Pick<User, 'isActive'| 'emailVerified'>): Status {
    if (!user.emailVerified) return Status.Pending
  return user.isActive ? Status.Active : Status.Inactive
}