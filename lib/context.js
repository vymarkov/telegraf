const Telegram = require('./telegram/client')
const platform = require('./telegram/platform')
const Extra = require('./telegram/extra')

class TelegrafContext {

  constructor (token, update, options, telegramOptions) {
    this.telegramInstance = new Telegram(token, telegramOptions)
    this.update = update
    this.options = options
    this.contextState = {}
  }

  get me () {
    return this.options.username
  }

  get telegram () {
    return this.telegramInstance
  }

  get updateType () {
    return platform.updateTypes.find((key) => this.update[key])
  }

  get updateSubType () {
    return this.update.message && platform.messageSubTypes.find((key) => this.update.message[key])
  }

  get message () {
    return this.update.message
  }

  get editedMessage () {
    return this.update.edited_message
  }

  get inlineQuery () {
    return this.update.inline_query
  }

  get chosenInlineResult () {
    return this.update.chosen_inline_result
  }

  get callbackQuery () {
    return this.update.callback_query
  }

  get chat () {
    return (this.message && this.message.chat) ||
      (this.editedMessage && this.editedMessage.chat) ||
      (this.callbackQuery && this.callbackQuery.message && this.callbackQuery.message.chat)
  }

  get from () {
    return (this.message && this.message.from) ||
      (this.editedMessage && this.editedMessage.from) ||
      (this.callbackQuery && this.callbackQuery.from) ||
      (this.inlineQuery && this.inlineQuery.from) ||
      (this.chosenInlineResult && this.chosenInlineResult.from)
  }

  get state () {
    return this.contextState
  }

  set state (val) {
    this.contextState = Object.assign({}, val)
  }

  assertShortcut (value, method) {
    if (!value) {
      throw new Error(`${method} is not available for ${this.updateType}`)
    }
  }

  answerInlineQuery (...args) {
    this.assertShortcut(this.inlineQuery, 'answerInlineQuery')
    return this.telegram.answerInlineQuery(this.inlineQuery.id, ...args)
  }

  answerCallbackQuery (...args) {
    this.assertShortcut(this.callbackQuery, 'answerCallbackQuery')
    return this.telegram.answerCallbackQuery(this.callbackQuery.id, ...args)
  }

  editMessageText (text, extra) {
    this.assertShortcut(this.callbackQuery, 'editMessageText')
    return this.callbackQuery.message
      ? this.telegram.editMessageText(this.chat.id, this.callbackQuery.message.message_id, undefined, text, extra)
      : this.telegram.editMessageText(undefined, undefined, this.callbackQuery.inline_message_id, text, extra)
  }

  editMessageCaption (caption, markup) {
    this.assertShortcut(this.callbackQuery, 'editMessageCaption')
    return this.callbackQuery.message
      ? this.telegram.editMessageCaption(this.chat.id, this.callbackQuery.message.message_id, undefined, caption, markup)
      : this.telegram.editMessageCaption(undefined, undefined, this.callbackQuery.inline_message_id, caption, markup)
  }

  editMessageReplyMarkup (markup) {
    this.assertShortcut(this.callbackQuery, 'editMessageReplyMarkup')
    return this.callbackQuery.message
      ? this.telegram.editMessageReplyMarkup(this.chat.id, this.callbackQuery.message.message_id, undefined, markup)
      : this.telegram.editMessageReplyMarkup(undefined, undefined, this.callbackQuery.inline_message_id, markup)
  }

  reply (...args) {
    this.assertShortcut(this.chat, 'reply')
    return this.telegram.sendMessage(this.chat.id, ...args)
  }

  getChat (...args) {
    this.assertShortcut(this.chat, 'getChat')
    return this.telegram.getChat(this.chat.id, ...args)
  }

  leaveChat (...args) {
    this.assertShortcut(this.chat, 'leaveChat')
    return this.telegram.leaveChat(this.chat.id, ...args)
  }

  getChatAdministrators (...args) {
    this.assertShortcut(this.chat, 'getChatAdministrators')
    return this.telegram.getChatAdministrators(this.chat.id, ...args)
  }

  getChatMember (...args) {
    this.assertShortcut(this.chat, 'getChatMember')
    return this.telegram.getChatMember(this.chat.id, ...args)
  }

  getChatMembersCount (...args) {
    this.assertShortcut(this.chat, 'getChatMembersCount')
    return this.telegram.getChatMembersCount(this.chat.id, ...args)
  }

  replyWithPhoto (...args) {
    this.assertShortcut(this.chat, 'replyWithPhoto')
    return this.telegram.sendPhoto(this.chat.id, ...args)
  }

  replyWithAudio (...args) {
    this.assertShortcut(this.chat, 'replyWithAudio')
    return this.telegram.sendAudio(this.chat.id, ...args)
  }

  replyWithDocument (...args) {
    this.assertShortcut(this.chat, 'replyWithDocument')
    return this.telegram.sendDocument(this.chat.id, ...args)
  }

  replyWithSticker (...args) {
    this.assertShortcut(this.chat, 'replyWithSticker')
    return this.telegram.sendSticker(this.chat.id, ...args)
  }

  replyWithVideo (...args) {
    this.assertShortcut(this.chat, 'replyWithVideo')
    return this.telegram.sendVideo(this.chat.id, ...args)
  }

  replyWithVoice (...args) {
    this.assertShortcut(this.chat, 'replyWithVoice')
    return this.telegram.sendVoice(this.chat.id, ...args)
  }

  replyWithChatAction (...args) {
    this.assertShortcut(this.chat, 'replyWithChatAction')
    return this.telegram.sendChatAction(this.chat.id, ...args)
  }

  replyWithLocation (...args) {
    this.assertShortcut(this.chat, 'replyWithLocation')
    return this.telegram.sendLocation(this.chat.id, ...args)
  }

  replyWithVenue (...args) {
    this.assertShortcut(this.chat, 'replyWithVenue')
    return this.telegram.sendVenue(this.chat.id, ...args)
  }

  replyWithContact (...args) {
    this.assertShortcut(this.chat, 'replyWithContact')
    return this.telegram.sendContact(this.chat.id, ...args)
  }

  replyWithMarkdown (markdown, extra) {
    return this.reply(markdown, Extra.load(extra).markdown())
  }

  replyWithHTML (html, extra) {
    return this.reply(html, Extra.load(extra).HTML())
  }
}

module.exports = TelegrafContext