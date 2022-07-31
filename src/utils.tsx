import {
  Conversation,
  ConversationId,
  ConversationRole,
  Participant,
  TypingUsersList,
} from '@chatscope/use-chat'
import { nanoid } from 'nanoid'
import { UserEntry } from './data'

export function createConversation(
  conversationID: ConversationId,
  userIDs: string[],
): Conversation {
  return new Conversation({
    id: conversationID,
    participants: userIDs.map(
      id => new Participant({ id, role: new ConversationRole([]) }),
    ),
    unreadCounter: 0,
    typingUsers: new TypingUsersList({ items: [] }),
    draft: '',
  })
}

function setsAreEqual<T>(a: Set<T>, b: Set<T>) {
  if (a.size !== b.size) {
    return false
  }

  return Array.from(a).every(element => b.has(element))
}

const hasDuplicateMembers = (
  conversation: Conversation,
  /** must not include owner of the conversation */
  otherUserIDs: string[],
) => {
  const participants = conversation.participants

  if (participants.length !== otherUserIDs.length) {
    return false
  }

  const participantIDsSet = new Set(participants.map(p => p.id))
  const otherUserIDsSet = new Set(otherUserIDs)

  return setsAreEqual(participantIDsSet, otherUserIDsSet)
}

export const createChat = (
  ...userEntries: [UserEntry, UserEntry, ...UserEntry[]]
) => {
  const chatID = nanoid()
  const userIDs = userEntries.map(ue => ue.user.id)

  for (const userEntry of userEntries) {
    const conversations = userEntry.storage.getState().conversations
    const userID = userEntry.user.id
    const otherUsers = userEntries.map(e => e.user).filter(u => u.id !== userID)
    const otherUserIDs = userIDs.filter(u => u !== userID)

    if (conversations.some(cv => hasDuplicateMembers(cv, otherUserIDs))) {
      continue
    }

    const newConversation = createConversation(chatID, otherUserIDs)

    otherUsers.forEach(u => userEntry.storage.addUser(u))
    userEntry.storage.addConversation(newConversation)
  }
}
