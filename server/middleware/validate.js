export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message).join(', ')
      return res.status(400).json({ message: messages })
    }
    req.validated = result.data
    next()
  }
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message).join(', ')
      return res.status(400).json({ message: messages })
    }
    req.validated = result.data
    next()
  }
}
