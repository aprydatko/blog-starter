import { Extension } from '@tiptap/core'

export interface UiStateOptions {
  lockDragHandle: boolean
  hideDragHandle: boolean
  isDragging: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    uiState: {
      setLockDragHandle: (lock: boolean) => ReturnType
      setHideDragHandle: (hide: boolean) => ReturnType
      setIsDragging: (isDragging: boolean) => ReturnType
    }
  }
}

export const UiState = Extension.create<UiStateOptions>({
  name: 'uiState',

  addOptions() {
    return {
      lockDragHandle: false,
      hideDragHandle: false,
      isDragging: false,
    }
  },

  addStorage() {
    return {
      lockDragHandle: false,
      hideDragHandle: false,
      isDragging: false,
    }
  },

  addCommands() {
    return {
      setLockDragHandle:
        (lock: boolean) =>
        ({ storage }) => {
          storage.lockDragHandle = lock
          return true
        },
      setHideDragHandle:
        (hide: boolean) =>
        ({ storage }) => {
          storage.hideDragHandle = hide
          return true
        },
      setIsDragging:
        (isDragging: boolean) =>
        ({ storage }) => {
          storage.isDragging = isDragging
          return true
        },
    }
  },
})

