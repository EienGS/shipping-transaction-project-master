// 参考船舶数据库 - 用于设计和建造需求的相似船舶推荐
export const referenceVessels = [
  {
    id: 1,
    name: '3900吨LNG ECO自卸式散货船',
    shipType: '散货船',
    tonnage: 3900,
    length: 79.5,
    width: 16.5,
    depth: 7.1,
    draft: null,
    speed: null,
    image: '/images/vessels/bulk-carrier-3900.png',
    description: '该船总长79.5m，型宽16.5m，型深7.1m，载重量（设计吃水）3900吨，满足极地Polar C要求，是一艘单机单浆混合动力推进的散杂货船。',
    features: [
      '满足极地Polar C要求',
      '单机单浆混合动力推进',
      'LNG ECO自卸式设计'
    ]
  },
  {
    id: 2,
    name: '49900吨散货船',
    shipType: '散货船',
    tonnage: 49900,
    length: 199.9,
    width: 32.26,
    depth: 16.5,
    draft: 10.65,
    speed: 13,
    image: '/images/vessels/bulk-carrier-49900.png',
    description: '49900吨级散货船为一艘单螺旋桨柴油驱动散货船，总长199.9米，型宽32.26米，型深16.5米，设计吃水10.65米，在静水、深海中的服务航速不小于13节。适用于国内近海航区范围运输散装货物，包括谷物、煤、铁矿石和其他干燥货物。',
    features: [
      '单螺旋桨柴油驱动',
      '服务航速不小于13节',
      '适用于国内近海航区',
      '可运输谷物、煤、铁矿石等'
    ]
  },
  {
    id: 3,
    name: '64000吨散货船',
    shipType: '散货船',
    tonnage: 64000,
    length: null,
    width: null,
    depth: null,
    draft: null,
    speed: null,
    image: '/images/vessels/bulk-carrier-64000.png',
    description: '64000吨散货船为一艘螺旋桨低速柴油机驱动的散货船，适用于国内近海航区范围内运输散装货物，包括谷物、煤、铁矿石和其他干燥货物。本船货舱和机舱采用双层底结构。本船货舱区域设有五个货舱，货舱区域为单壳结构，以高强度钢材为主的肥大型散货船；机舱区域设置一台额定最大持续功率为10680kW的MAN B&W 6S50ME-C9.5 TierII的主机。',
    features: [
      '低速柴油机驱动',
      '双层底结构',
      '五个货舱设计',
      '主机功率10680kW',
      '高强度钢材建造'
    ]
  }
]

/**
 * 根据船舶类型和吨位查找相似船舶
 * @param {string} shipType - 船舶类型
 * @param {number} tonnage - 吨位（DWT）
 * @param {number} tolerance - 吨位容差（默认500吨）
 * @returns {Array} 符合条件的相似船舶列表
 */
export function findSimilarVessels(shipType, tonnage, tolerance = 500) {
  // 如果不是散货船，返回空数组
  if (shipType !== '散货船') {
    return []
  }

  // 如果没有输入吨位，返回空数组
  if (!tonnage || tonnage <= 0) {
    return []
  }

  // 筛选吨位差值在容差范围内的船舶
  return referenceVessels.filter(vessel => {
    return vessel.shipType === shipType && 
           Math.abs(vessel.tonnage - tonnage) <= tolerance
  })
}
