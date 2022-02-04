import { createActionHandler } from "remix-typed"
import { deleteFromWatching } from "~/modules/media/delete-from-watching"
import { updateMediaListEntry } from "~/modules/media/update-media-list-entry"

export const actionMap = {
  updateMediaListEntry,
  deleteFromWatching,
}

export const action = createActionHandler(actionMap)
