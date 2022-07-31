import {
  BasicStorage,
  ChatMessage,
  MessageContentType,
  Presence,
  User,
  UserStatus,
} from '@chatscope/use-chat'
import { nanoid } from 'nanoid'
import { akaneModel, eliotModel, emilyModel, joeModel, users } from './data'

const akane = new User({
  id: akaneModel.name,
  presence: new Presence({ status: UserStatus.Available, description: '' }),
  firstName: '',
  lastName: '',
  username: akaneModel.name,
  email: '',
  avatar: akaneModel.avatar,
  bio: '',
})

const emily = new User({
  id: emilyModel.name,
  presence: new Presence({ status: UserStatus.Available, description: '' }),
  firstName: '',
  lastName: '',
  username: emilyModel.name,
  email: '',
  avatar: emilyModel.avatar,
  bio: '',
})

const eliot = new User({
  id: eliotModel.name,
  presence: new Presence({ status: UserStatus.Available, description: '' }),
  firstName: '',
  lastName: '',
  username: eliotModel.name,
  email: '',
  avatar: eliotModel.avatar,
  bio: '',
})

const joe = new User({
  id: joeModel.name,
  presence: new Presence({ status: UserStatus.Available, description: '' }),
  firstName: '',
  lastName: '',
  username: joeModel.name,
  email: '',
  avatar: joeModel.avatar,
  bio: '',
})

// sendMessage and addMessage methods can automagically generate id for messages and groups
// This allows you to omit doing this manually, but you need to provide a message generator
// The message id generator is a function that receives message and returns id for this message
// The group id generator is a function that returns string
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const messageIdGenerator = (message: ChatMessage<MessageContentType>) =>
  nanoid()
const groupIdGenerator = () => nanoid()

const akaneStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator })
const eliotStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator })
const emilyStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator })
const joeStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator })

export const userList = [akane, emily, eliot, joe]
export const chats = [
  { name: 'Akane', storage: akaneStorage },
  { name: 'Eliot', storage: eliotStorage },
  { name: 'Emily', storage: emilyStorage },
  { name: 'Joe', storage: joeStorage },
]
