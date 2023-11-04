const useTix = (amount: number | string): number => {
  const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(parsedAmount)) {
    return 0
  }

  return Math.floor((parsedAmount * 100) / 5)
}

export default useTix
