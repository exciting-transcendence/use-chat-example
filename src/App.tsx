import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { Col, Container, Row } from 'react-bootstrap'

import { ChatComponent } from './components/ChatContainer'
import { createChat } from './utils'
import { mockUserDatabase } from './data'

const [akane, eliot, emily, joe] = Array.from(Object.values(mockUserDatabase))

createChat(akane, eliot, emily, joe)
createChat(akane, eliot, emily)
createChat(akane, eliot)
createChat(akane, eliot)
createChat(eliot, akane)

function App() {
  return (
    <div className="h-100 d-flex flex-column overflow-hidden">
      <Container
        fluid
        className="p-4 flex-grow-1 position-relative overflow-hidden"
      >
        <Row className="h-50 pb-2 flex-nowrap">
          <Col>
            <ChatComponent userEntry={akane} />
          </Col>
          <Col>
            <ChatComponent userEntry={eliot} />
          </Col>
        </Row>
        <Row className="h-50 pt-2 flex-nowrap">
          <Col>
            <ChatComponent userEntry={emily} />
          </Col>
          <Col>
            <ChatComponent userEntry={joe} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default App
