import { Comment } from '@/app/types/Comment'
import { createSlice } from '@reduxjs/toolkit'

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    value: [] as Comment[],
  },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setValue } = commentsSlice.actions

export default commentsSlice.reducer