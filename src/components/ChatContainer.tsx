import { AutoDraft, ChatProvider } from '@chatscope/use-chat'
import { serviceFactory } from '../service'
import { UserEntry } from '../utils'
import { Chat } from './Chat'

export const ChatComponent = ({ user, storage }: UserEntry) => {
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
