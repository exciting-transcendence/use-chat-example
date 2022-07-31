import { AutoDraft, ChatProvider, IStorage, User } from '@chatscope/use-chat'
import { serviceFactory } from '../service'
import { Chat } from './Chat'

export const ChatComponent = ({
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
