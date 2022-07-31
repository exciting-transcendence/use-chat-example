import { IStorage, UpdateState } from '@chatscope/use-chat'
import { ExampleChatService } from '@chatscope/use-chat/dist/examples'

// Create serviceFactory
export const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
  return new ExampleChatService(storage, updateState)
}
