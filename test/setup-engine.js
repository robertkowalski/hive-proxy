'use strict'

const Sock = require('../lib/socket-base.js')
const Redis = require('ioredis')
const redis = new Redis()

function setup () {
  return new Promise((resolve) => {
    const s = new Sock({
      gateway: 'ipc:///tmp/proxy0',
      order0: 'ipc:///tmp/order0',
      user0: 'ipc:///tmp/user0'
    })

    s.send('order0', ['test_engine_reset', []])
    s.send('user0', ['test_engine_reset', []])
    s.send('gateway', ['set_gw_status', { 'trigger_tickers': true, 'trigger_liq': true }])

    s.send('user0', ['update_user_conf', [1, { 'ccys_margin': ['USD', 'BTC', 'ETH', 'LTC', 'JPY', 'EUR'], 'margin_version': 2 }]])
    s.send('user0', ['set_wallet_balance', [1, 'exchange', 'USD', '1000.00', null, null]])
    s.send('user0', ['set_wallet_balance', [1, 'exchange', 'BTC', '1000.00', null, null]])
    s.send('user0', ['set_wallet_balance', [1, 'trading', 'USD', '500.00', null, null]])
    s.send('user0', ['set_wallet_balance', [1, 'trading', 'BTC', '600.00', null, null]])

    s.send('user0', ['update_user_conf', [2, { 'ccys_margin': ['USD', 'BTC', 'ETH', 'LTC', 'JPY', 'EUR'], 'margin_version': 2 }]])
    s.send('user0', ['set_wallet_balance', [2, 'exchange', 'USD', '1000.00', null, null]])
    s.send('user0', ['set_wallet_balance', [2, 'exchange', 'BTC', '1000.00', null, null]])
    s.send('user0', ['set_wallet_balance', [2, 'trading', 'USD', '500.00', null, null]])
    s.send('user0', ['set_wallet_balance', [2, 'trading', 'BTC', '600.00', null, null]])

    const marginSettings = { 'offers_long_BTCUSD': 10000, 'offers_short_BTCUSD': 10000 }
    const msg = {
      t: 1,
      seq: 1,
      a: 'update_settings',
      o: marginSettings
    }

    redis.rpush('global_engine_v2', JSON.stringify(msg))

    setTimeout(() => {
      s.close()
      redis.disconnect()

      resolve()
    }, 250)
  })
}

module.exports = setup
