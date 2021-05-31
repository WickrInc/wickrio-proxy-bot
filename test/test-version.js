// const expect = require('chai').expect;
const sinon = require('sinon')

const assert = require('assert')
const Version = require('../build/commands/version')

describe('version validation', () => {
  /* ================================================================================ */
  it('shouldExecute false if /version is not the command', async () => {
    const bot = {
      getVersions: sinon.fake(),
    }

    const messageService = {
      getCommand: sinon.fake.returns('/cancel'),
    }

    const version = new Version({
      messageService: messageService,
      bot: bot,
    })

    assert.equal(version.shouldExecute(messageService), false)
  })

  /* ================================================================================ */
  it('shouldExecute true if /version is the command', async () => {
    const bot = {
      getVersions: sinon.fake(),
    }

    const messageService = {
      getCommand: sinon.fake.returns('/version'),
    }

    const version = new Version({
      messageService: messageService,
      bot: bot,
    })

    assert.equal(version.shouldExecute(messageService), true)
  })

  /* ================================================================================ */
  it('execute() returns a reply', async () => {
    const bot = {
      getVersions: sinon.fake(),
    }

    const messageService = {
      getCommand: sinon.fake.returns('/version'),
    }

    const version = new Version({
      messageService: messageService,
      bot: bot,
    })

    const replyvalue = version.execute()

    sinon.assert.called(bot.getVersions)
    assert.ok(replyvalue.reply)
  })
})
