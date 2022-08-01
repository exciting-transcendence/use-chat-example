import {
  BasicStorage,
  ChatMessage,
  IStorage,
  MessageContentType,
  Presence,
  User,
  UserStatus,
} from '@chatscope/use-chat'
import { nanoid } from 'nanoid'

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

const mockUser = (name: string, avatar: string) => {
  return new User({
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
}

const mockUserEntry = (name: string): UserEntry => {
  const data = window.localStorage.getItem(name)
  if (data) {
    console.log(`Loading data for ${name}`)
    return JSON.parse(data) as UserEntry
  } else {
    console.log(`Creating data for ${name}`)

    const avatar = `https://picsum.photos/200/300/?random&rnd${nanoid()}`
    const user = mockUser(name, avatar)
    const storage = new BasicStorage({ groupIdGenerator, messageIdGenerator })
    return { user, storage }
  }
}

const mockNames = ['Akane', 'Eliot', 'Emily', 'Joe']

export const mockUserDatabase: Record<string, UserEntry> = Object.fromEntries(
  mockNames.map(name => [name, mockUserEntry(name)]),
)
