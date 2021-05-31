// const expect = require('chai').expect;
const sinon = require('sinon')

const assert = require('assert')
const AddProxy = require('../build/commands/add-proxy')

describe('add-proxy validation', () => {
  /* ================================================================================ */
  it('shouldExecute false if /add is not the command', async () => {
    const messageService = {
      command: '/cancel',
    }

    const proxyService = {
      getMembers: sinon.fake(),
      addMember: sinon.fake(),
    }

    const addProxy = new AddProxy({
      proxyService: proxyService,
      messageService: messageService,
    })

    assert.equal(addProxy.shouldExecute(messageService), false)
  })

  /* ================================================================================ */
  it('shouldExecute true if /add is the command', async () => {
    const proxyService = {
      getMembers: sinon.fake(),
      addMember: sinon.fake(),
    }

    const messageService = {
      command: '/add',
    }

    const addProxy = new AddProxy({
      proxyService: proxyService,
      messageService: messageService,
    })

    assert.equal(addProxy.shouldExecute(messageService), true)
  })

  /* ================================================================================ */
  it('execute() returns an error string if number of arguments not correct', async () => {
    const proxyService = {
      getMembers: sinon.fake(),
      addMember: sinon.fake(),
    }

    const messageService = {
      command: '/add',
      getArgument: sinon.fake.returns(''),
    }

    const addProxy = new AddProxy({
      proxyService: proxyService,
      messageService: messageService,
    })

    const reply = 'Must have a UserID and Alias, usage: /add <UserID> <Alias>'
    assert.equal(addProxy.execute(messageService), reply)
  })
  /* ================================================================================ */
  it("execute() returns an error reply if user doesn't exist", async () => {
    const proxyService = {
      getMembers: sinon.fake(),
      addMember: sinon.fake(),
    }

    const messageService = {
      command: '/add',
      getArgument: sinon.fake.returns(''),
    }

    const addProxy = new AddProxy({
      proxyService: proxyService,
      messageService: messageService,
    })

    const reply = 'Must have a UserID and Alias, usage: /add <UserID> <Alias>'
    assert.equal(addProxy.execute(messageService), reply)

    // sinon.assertWasCalled(bot.getVersions)
    // assert.ok(replyvalue.reply)
  })
})
