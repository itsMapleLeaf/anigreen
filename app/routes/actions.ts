import { deleteFromWatching } from "~/modules/media/delete-from-watching"
import { updateMediaListEntry } from "~/modules/media/update-media-list-entry"
import { createActionHandler } from "~/modules/remix-typed/remix-typed-action"

export const actionMap = {
  updateMediaListEntry,
  deleteFromWatching,
}

export const action = createActionHandler(actionMap)
