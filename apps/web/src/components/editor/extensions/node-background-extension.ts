import { Extension } from '@tiptap/core'

export interface NodeBackgroundOptions {
  types: string[]
}

declare module '@tiptap/core' {
  interface NodeConfig<Options, Storage> {
    nodeBackground?: {
      setNodeBackground?: (color: string) => boolean
      unsetNodeBackground?: () => boolean
    }
  }
}

export const NodeBackground = Extension.create<NodeBackgroundOptions>({
  name: 'nodeBackground',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'blockquote'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          nodeBackground: {
            default: null,
            parseHTML: (element) => element.getAttribute('data-node-background'),
            renderHTML: (attributes) => {
              if (!attributes.nodeBackground) {
                return {}
              }
              return {
                'data-node-background': attributes.nodeBackground,
                style: `background-color: ${attributes.nodeBackground};`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setNodeBackground:
        (color: string) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const { from, to } = selection

          tr.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                nodeBackground: color,
              })
            }
          })

          if (dispatch) {
            dispatch(tr)
          }
          return true
        },
      unsetNodeBackground:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const { from, to } = selection

          tr.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const { nodeBackground, ...attrs } = node.attrs
              tr.setNodeMarkup(pos, undefined, attrs)
            }
          })

          if (dispatch) {
            dispatch(tr)
          }
          return true
        },
    }
  },
})

