import {
  BasicStorage,
  ChatMessage,
  Conversation,
  ConversationId,
  ConversationRole,
  IStorage,
  MessageContentType,
  Participant,
  Presence,
  TypingUsersList,
  User,
  UserStatus,
} from '@chatscope/use-chat'
import { nanoid } from 'nanoid'

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

// const conversationGetParticipant = (cv: Conversation, name: string) =>
//   cv.participants.find(p => p.id === name)

// const storageGetParticipant = (storage: IStorage, name: string) =>
//   storage
//     .getState()
//     .conversations.find(cv => conversationGetParticipant(cv, name))

function setsAreEqual<T>(a: Set<T>, b: Set<T>) {
  if (a.size !== b.size) {
    return false
  }

  return Array.from(a).every(element => b.has(element))
}

const conversationHasSameMembers = (
  conversation: Conversation,
  /** must not include itself */
  userIDs: string[],
) => {
  const participants = conversation.participants

  if (participants.length !== userIDs.length) {
    return false
  }

  const participantIDsSet = new Set(participants.map(p => p.id))
  const userIDsSet = new Set(userIDs)

  return setsAreEqual(participantIDsSet, userIDsSet)
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

    if (
      conversations.some(cv => conversationHasSameMembers(cv, otherUserIDs))
    ) {
      continue
    }

    const newConversation = createConversation(chatID, otherUserIDs)

    otherUsers.forEach(u => userEntry.storage.addUser(u))
    userEntry.storage.addConversation(newConversation)
  }
}

// sendMessage and addMessage methods can automagically generate id for messages and groups
// This allows you to omit doing this manually, but you need to provide a message generator
// The message id generator is a function that receives message and returns id for this message
// The group id generator is a function that returns string
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const messageIdGenerator = (message: ChatMessage<MessageContentType>) =>
  nanoid()
const groupIdGenerator = () => nanoid()

export interface UserEntry {
  user: User
  storage: IStorage
}

const mockUserEntry = (name: string): UserEntry => {
  const avatar = `https://picsum.photos/200/300/?random&rnd${nanoid()}`
  const user = new User({
    id: nanoid(),
    presence: new Presence({
      status: UserStatus.Available,
      description: '',
    }),
    firstName: '',
    lastName: '',
    username: name,
    email: '',
    avatar: avatar,
    bio: '',
  })
  const storage = new BasicStorage({ groupIdGenerator, messageIdGenerator })

  return { user, storage }
}

const mockNames = ['Akane', 'Eliot', 'Emily', 'Joe']

export const mockUserDatabase: Record<string, UserEntry> = Object.fromEntries(
  mockNames.map(name => [name, mockUserEntry(name)]),
)
