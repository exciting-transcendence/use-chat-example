import { AutoDraft, ChatProvider } from '@chatscope/use-chat'
import { serviceFactory } from '../service'
import { UserEntry } from '../data'
import { Chat } from './Chat'
import { useEffect } from 'react'

export const ChatComponent = ({ userEntry }: { userEntry: UserEntry }) => {
  useEffect(() => {
    setInterval(() => {
      const data = JSON.stringify(userEntry)
      localStorage.setItem(userEntry.user.username, data)
      console.log(`${userEntry.user.username}: data saved`)
    }, 3000)
  }, [])

  return (
    <ChatProvider
      serviceFactory={serviceFactory}
      storage={userEntry.storage}
      config={{
        typingThrottleTime: 250,
        typingDebounceTime: 900,
        debounceTyping: true,
        autoDraft: AutoDraft.Save | AutoDraft.Restore,
      }}
    >
      <Chat user={userEntry.user} />
    </ChatProvider>
  )
}
