import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {
  BasicStorage,
  ChatMessage,
  ChatProvider,
  Conversation,
  ConversationId,
  ConversationRole,
  IStorage,
  MessageContentType,
  Participant,
  Presence,
  TypingUsersList,
  UpdateState,
  User,
  UserStatus,
} from '@chatscope/use-chat'
import { ExampleChatService } from '@chatscope/use-chat/dist/examples'
import { Chat } from './components/Chat'
import { nanoid } from 'nanoid'
import { Col, Container, Row } from 'react-bootstrap'
import {
  akaneModel,
  eliotModel,
  emilyModel,
  joeModel,
  users,
} from './data/data'
import { AutoDraft } from '@chatscope/use-chat/dist/enums/AutoDraft'

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

// Create serviceFactory
const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
  return new ExampleChatService(storage, updateState)
}

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

const chats = [
  { name: 'Akane', storage: akaneStorage },
  { name: 'Eliot', storage: eliotStorage },
  { name: 'Emily', storage: emilyStorage },
  { name: 'Joe', storage: joeStorage },
]

function createConversation(id: ConversationId, names: string[]): Conversation {
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
const newUser = (u: { name: string; avatar: string }) => {
  return new User({
    id: u.name,
    presence: new Presence({
      status: UserStatus.Available,
      description: '',
    }),
    firstName: '',
    lastName: '',
    username: u.name,
    email: '',
    avatar: u.avatar,
    bio: '',
  })
}

const conversationGetParticipant = (cv: Conversation, name: string) =>
  cv.participants.find(p => p.id === name)

const storageGetParticipant = (storage: IStorage, name: string) =>
  storage
    .getState()
    .conversations.find(cv => conversationGetParticipant(cv, name))

chats.forEach(c => {
  const otherUsers = users.filter(u => u.name !== c.name)
  otherUsers.forEach(u => c.storage.addUser(newUser(u)))

  const usersThatIsntParticipant = otherUsers.filter(
    u => !storageGetParticipant(c.storage, u.name),
  )

  usersThatIsntParticipant.forEach(u => {
    const conversationId = nanoid()
    c.storage.addConversation(createConversation(conversationId, [u.name]))

    const myChat = chats.find(chat => chat.name === u.name)
    if (myChat && !storageGetParticipant(myChat.storage, c.name)) {
      myChat.storage.addConversation(
        createConversation(conversationId, [c.name]),
      )
    }
  })
})

const ChatContainer = ({
  user,
  storage,
}: {
  user: User
  storage: IStorage
}) => {
  return (
    <ChatProvider
      serviceFactory={serviceFactory}
      storage={storage}
      config={{
        typingThrottleTime: 250,
        typingDebounceTime: 900,
        debounceTyping: true,
        autoDraft: AutoDraft.Save | AutoDraft.Restore,
      }}
    >
      <Chat user={user} />
    </ChatProvider>
  )
}

function App() {
  return (
    <div className="h-100 d-flex flex-column overflow-hidden">
      <Container
        fluid
        className="p-4 flex-grow-1 position-relative overflow-hidden"
      >
        <Row className="h-50 pb-2 flex-nowrap">
          <Col>
            <ChatContainer user={akane} storage={akaneStorage} />
          </Col>
          <Col>
            <ChatContainer user={eliot} storage={eliotStorage} />
          </Col>
        </Row>
        <Row className="h-50 pt-2 flex-nowrap">
          <Col>
            <ChatContainer user={emily} storage={emilyStorage} />
          </Col>
          <Col>
            <ChatContainer user={joe} storage={joeStorage} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App
