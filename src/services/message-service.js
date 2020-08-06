class MessageService {
  constructor(
    message,
    userEmail,
    argument,
    command,
    currentState,
    vGroupID,
    user,
    isAdmin
  ) {
    this.message = message
    this.userEmail = userEmail
    this.argument = argument
    this.command = command
    this.currentState = currentState
    this.vGroupID = vGroupID
    this.user = user
    this.isAdmin = isAdmin
  }

  // TODO why use getters and setters here??
  getMessage() {
    return this.message
  }

  getArgument() {
    return this.argument
  }

  getUserEmail() {
    return this.userEmail
  }

  getVGroupID() {
    return this.vGroupID
  }

  getCommand() {
    return this.command
  }

  getCurrentState() {
    return this.currentState
  }

  getFile() {
    return this.file
  }

  getFilename() {
    return this.filename
  }

  getUser() {
    return this.user
  }

  getIsAdmin() {
    return this.isAdmin
  }

  affirmativeReply() {
    return (
      this.message.toLowerCase() === 'yes' || this.message.toLowerCase() === 'y'
    )
  }

  negativeReply() {
    return (
      this.message.toLowerCase() === 'no' || this.message.toLowerCase() === 'n'
    )
  }

  isInt() {
    if (!Number.isInteger(+this.message)) {
      return false
    }
    return true
  }

  static replyWithButtons() {
    // const buttons = [button1, button2]
    // Send message with buttons here
  }
}

export default MessageService
