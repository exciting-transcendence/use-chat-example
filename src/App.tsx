import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {
  BasicStorage,
  ChatMessage,
  IStorage,
  MessageContentType,
} from '@chatscope/use-chat'
import { nanoid } from 'nanoid'
import { Col, Container, Row } from 'react-bootstrap'
import {
  akaneModel,
  eliotModel,
  emilyModel,
  joeModel,
  users,
} from './data/data'
import { createConversation, newUser, storageGetParticipant } from './utils'
import { ChatComponent } from './components/ChatContainer'

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

const akane = newUser(akaneModel)
const emily = newUser(emilyModel)
const eliot = newUser(eliotModel)
const joe = newUser(joeModel)

type chatData = {
  name: string
  storage: IStorage
}
const chats: chatData[] = [
  { name: 'Akane', storage: akaneStorage },
  { name: 'Eliot', storage: eliotStorage },
  { name: 'Emily', storage: emilyStorage },
  { name: 'Joe', storage: joeStorage },
]

const groupChatId = nanoid()

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

  const groupConversation = createConversation(
    groupChatId,
    users.map(u => u.name),
  )
  c.storage.addConversation(groupConversation)
})

function App() {
  return (
    <div className="h-100 d-flex flex-column overflow-hidden">
      <Container
        fluid
        className="p-4 flex-grow-1 position-relative overflow-hidden"
      >
        <Row className="h-50 pb-2 flex-nowrap">
          <Col>
            <ChatComponent user={akane} storage={akaneStorage} />
          </Col>
          <Col>
            <ChatComponent user={eliot} storage={eliotStorage} />
          </Col>
        </Row>
        <Row className="h-50 pt-2 flex-nowrap">
          <Col>
            <ChatComponent user={emily} storage={emilyStorage} />
          </Col>
          <Col>
            <ChatComponent user={joe} storage={joeStorage} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App
