import {
  Conversation,
  ConversationId,
  ConversationRole,
  IStorage,
  Participant,
  Presence,
  TypingUsersList,
  User,
  UserStatus,
} from '@chatscope/use-chat'

export function createConversation(
  id: ConversationId,
  names: string[],
): Conversation {
  return new Conversation({
    id,
    participants: names.map(name => {
      return new Participant({
        id: name,
        role: new ConversationRole([]),
      })
    }),
    unreadCounter: 0,
    typingUsers: new TypingUsersList({ items: [] }),
    draft: '',
  })
}

// Add users and conversations to the states
export const newUser = (user: { name: string; avatar: string }) => {
  return new User({
    id: user.name,
    presence: new Presence({
      status: UserStatus.Available,
      description: '',
    }),
    firstName: '',
    lastName: '',
    username: user.name,
    email: '',
    avatar: user.avatar,
    bio: '',
  })
}

export const conversationGetParticipant = (cv: Conversation, name: string) =>
  cv.participants.find(p => p.id === name)

export const storageGetParticipant = (storage: IStorage, name: string) =>
  storage
    .getState()
    .conversations.find(cv => conversationGetParticipant(cv, name))
