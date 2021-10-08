/**
 * @todo 转换脚本
 *
 * 临时方案：
 * @description 直接复制当前文件，重新命名对应国家的本土配置，再用下面脚本清空内容
 * @description 转换用来翻译的json需要的正则表达
 *
 * @example 文本比对，处理新词
 * @see https://text-compare.com/
 *
 * @example IDE使用正则去除内容： ('?.+')?:\s+('?.+'?) -> $1: ''
 */

export default {
    /**
     * @description 首页
     */
    WELCOME: '{account}， 欢迎!',
    'nav.home': '首页',
    'nav.mint': '铸造',
    'nav.burn': '销毁',
    'nav.trade': '商店',
    'nav.farm': '挖矿',
    'nav.pool': '质押',
    'nav.wallet': '资产',
    'nav.connectWallet': '连接钱包',
    'entry.learnmore': '了解更多',
    'entry.mint': '合成资产',
    'entry.mint.summary': '铸造合成资产fUSD',
    'entry.mint.desc':
        '可通过质押您的Token铸造fUSD。质押Token的一方通过交换可每周赚取质押奖励来管理质押率和债务。',
    'entry.trade': '货币交易',
    'entry.trade.desc': '赚取质押BS的奖励，您将需要一个币安钱包进行交易。',
    'entry.buyToken': '挖矿',
    'entry.buyToken.desc': '赚取质押BS的奖励，您将需要一个币安钱包进行交易。',
    'data.pledgrate': '当前质押率',
    'data.activedebt': '活动债务',

    /**
     * @description 合成资产
     */
    'mint.from': '铸币',
    'mint.to': '获得',
    'mint.selectCasting': '选择铸造',
    'mint.locked': '锁定',
    'mint.collateral': '质押物',
    'mint.ftoken': 'BS',
    'mint.approve': '授权铸币',
    'mint.cast': '铸造',
    'mint.fassets': 'F资产',
    'mint.title': '开始铸造',
    'mint.desc':
        '可通过质押您的Token铸造fUSD。质押Token的一方通过交换可每周赚取质押奖励来管理质押率和债务。',

    /**
     * @description 燃烧资产
     */
    'burn.from': '燃烧',
    'burn.to': '获得',
    'burn.title': '债务',
    'burn.desc': '可购买和燃烧您的F资产来清除总债务，分解出所有质押物。',
    'burn.search': '搜索债务',
    'burn.unstaking': '分解',
    'burn.collateral': '质押物',
    'burn.amount': '数量',
    'burn.ratio': '质押率',
    'burn.debt': '债务',
    'burn.debt:': '债务：',
    'burn.locked': '锁定',
    'burn.burn': '燃烧',
    'burn.burned': 'F资产',
    'burn.noassets': '暂无资产',
    'burn.tomint': '去铸造',
    'burn.initial': '初始化',
    'burn.max': '最大化',
    'burn.approve': '授权燃烧',

    /**
     * @description 交易商店
     */
    'trade.approve': '授权交易',
    'trade.from': 'From',
    'trade.to': 'To',
    'trade.marketing:': '交易行情：',
    'trade.24h.volume': '24H交易量',
    'trade.24h.marketcap': '市值',
    'trade.24h.hightest': '24H最高价',
    'trade.24h.lowest': '24H最低价',
    'trade.pricefeed': 'DEX合约',
    'trade.contract': '合约',
    'trade.button': '交换',
    'trade.selecttoken': '选择Token',
    'trade.feecost': '手续费：',

    /**
     * @description Defi挖矿
     */
    'liquidity.toprovide': '添加流动性',
    'liquidity.bs.price': 'BS价格',
    'liquidity.bs.vol': 'BS交易量',
    'liquidity.bs.circulatingsupply': 'BS流通市值',
    'liquidity.tab.provide': '提供',
    'liquidity.provide.asset0': '资产',
    'liquidity.provide.asset1': '资产',
    'liquidity.provide.approve': '授权提供流动性',
    'liquidity.provide': '提供流动性',
    'liquidity.tab.withdraw': '提现',
    'liquidity.withdraw': '提现',
    'liquidity.withdraw.lp': '货币对',
    'liquidity.withdraw.willreceive': '将会获得',
    'liquidity.withdraw.approve': '授权提现',

    'liquidity.bs.tvl': 'BS TVL',
    'liquidity.bs.circulatingVal': 'BS Circulating Value',
    'liquidity.bs.totalEarned': 'BS Total Earned',

    'liquidity.yourLiquidity': 'Your Liquidity',
    'liquidity.yourLiquidityDesc':
        'You can click Add Liquidity to add Lp quickly or remove liquidity to receive tokens back.',

    'pool.totalStaked': '质押总额',
    'pool.totalEarned': '收益总额',

    /**
     * @description 我的资产
     */
    'wallet.title': '我的资产',
    'wallet.pool': '池子',
    'wallet.farm': '挖矿',
    'wallet.earned': '已赚取',
    'wallet.staked': '已质押',
    'wallet.tab.all': '所有',
    'wallet.tab.mint': '铸造',
    'wallet.tab.burn': '燃烧',
    'wallet.tab.trade': '交易',
    'wallet.tab.farm': '挖矿',
    'wallet.tab.pool': '池子',

    /**
     * @description 公共组件
     */
    'assetsbar.staked': '质押物',
    'assetsbar.lockedtoken': '锁定BS',
    'assetsbar.acitvedebt': '活动债务',
    'assetsbar.fratio': 'F质押率',
    'assetsbar.fratio.desc': '这是一段解释f-ratio变化规则的文字',
    'assetsbar.fratio.current': '当前质押率：',
    'assetsbar.fratio.initial': '初始质押率：',
    'footer.ftoken.price': 'BS价格',
    'footer.ftoken.button': '购买BS',
    selecttoken: '选择Token',
    'selecttoken.search': '搜索',
    'history.mint': '铸造',
    'history.mint.col.collateral': '质押物',
    'history.mint.col.locked': '已锁定',
    'history.mint.col.minted': '已铸造',
    'history.mint.col.f-ratio': 'F资产质押率',
    'history.mint.col.type': '类型',
    'history.mint.col.date': '时间',
    'history.burn': '燃烧',
    'history.delivery': '交割',

    /**@description 空 */
    noAssets: '暂无资产',
    noTrades: '暂无交易记录',
    noConnection: '点击“连接钱包”后查看',
    /** @description 动词 */
    'verb.from': '从', //就当动词省略
    'verb.send': '发送',
    'verb.provide.liquidity': '提供流动性',
    'verb.withdraw.liquidity': '提现',
    'verb.stake.lp': '质押货币对',
    'verb.x': ' ',
    /** @description 连词 */
    'conj.to': '到',
    'conj.and': '和',
    'conj.x': ' ',
    /**@description 通用词 */
    perpetual: '永续合约',
    delivery: '交割合约',
    days: '天',
    history: '历史',
    apy: '年利率',
    'balance:': '余额：',
    balance: '余额',
    action: '操作',
    from: 'From',
    to: 'To',
    disconnect: '断开',
    change: '修改',
    changeWallet: '更换钱包',
    connectWallet: '连接钱包',
    rewards: '奖励',
    rewardsTip: '奖励50%可即刻提取,50%将于30天内线性释放',
    earningRatio: '收益率',
    earningRatioTip: '收益/锁仓',
    'app.unlockWallet': '解锁钱包',
    amount: 'Amount',
    stake: 'Stake',
    unstake: 'Unstake',
    approve: 'Approve',
    dontHave: "Dont't have ",
    get: 'Get ',
    APY: 'APY',
    earn: 'EARN',
    bsTotalEarned: 'BS Total Earned',
    harvest: 'Harvest',
    STAKED: 'STAKED',
    txRejected: '交易已取消',
    rejectedByUser: '用户取消了交易',
    txConfirm: '交易确认',
    txSent: '交易已发送',
    txSentSuccess: '交易已成功发送.',
    txReceived: '交易已上链',
    txReceivedSuccess: '交易已成功上链.',
    totalStaked: '总质押',
    activeDebt: '活动债务',
    collateral: '质押物',
    detail: '详情',
    claim: '提取',
    status: '状态',
    mint: '合成资产',
    doMint: '铸造',
    doBurn: '销毁',
    locked: '锁定资产',
    lockedTip: '选择质押物中BS的比例',
    lockedDetailTip:
        '质押物中BS锁仓量的占比越高，质押率F-Ratio越低，最低可至350%',
    fratioTip: '质押率会根据用户所选质押物类型和币价波动实时变化',
    ftokenTip:
        'IronForge提供永续和交割这两种类型的合成资产，交割类合成资产存在交割期限，其价格将于到期后锁定，不再随着公共债务池的变化而波动，而永续类合成资产没有交割期限，在用户销毁之前，其价格将永远随着公共债务池的变化而波动',
    transactionConfirm: '正在估算中，最少将收到{amount}，或者订单将会被恢复。',
    pending: '等待',
    orderPending: '等待订单提交',
    stakeToMint: '抵押{collateral}来铸造{fasset}',
    afterOrderTip: '订单提交后，可以在本页面或历史中找到。',
    txSuccess: '交易成功',
    txFail: '交易失败',
    iSee: '我知道了',
    accept: '同意',
    priceUpdated: '同步最新价格',
    type: '类型',
    unstaking: '解压',
    staking: '质押',
    mintCommentaryTitile: '开始铸造',
    mintCommentaryDesc: '用户可以通过单币质押或是组合质押来铸造合成资产',
    burnCommentaryTitile: '怎么销毁',
    burnCommentaryDesc: '用户可以通过燃烧fAssets来解除债务',
    butnToInitialTip: '燃烧一定数量的fAssets使得F-ratio回到初始值以避免被清算',
    butnToMaxTip: '燃烧全部fAssets清除债务以解锁抵押资产',
    noConnectionTip: '连接您的钱包以查看您的历史记录',
    noRecordTip: '找不到交易历史记录，请铸造合成资产并参与交易',
    activeTip: '参与公共债务池的债务，将随着公共债务的波动而波动',
    staticTip: '不再参与公共债务池的债务，请燃烧相应数额的fAssets解押',
    _55daysTip: '交割倒计时，在交割之前该笔铸造物不可通过燃烧来解押',
    apyTip: 'APY是包含复投的收益',
    bsTip: '奖励50%可即刻提取,50%将于30天内线性释放',
};
