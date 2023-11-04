export interface isDrawing {
  state: boolean
}

export const getIsDrawing = async (): Promise<isDrawing | null> => {
  try {
    const drawResponse = await fetch(`https://api.metalistings.xyz/is_drawing`)
    const potDraw = await drawResponse.json()
    return potDraw.is_draw_in_progress
  } catch (error) {
    console.error('Error fetching pot data:', error)
    return null
  }
}
