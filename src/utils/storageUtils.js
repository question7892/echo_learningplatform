/**
 * 本地缓存工具 — 浏览记录、搜索历史等
 */

const BROWSE_HISTORY_KEY = 'browseHistory'
const MAX_HISTORY_COUNT = 50

/**
 * 获取浏览记录
 * @returns {Array} 浏览记录数组
 */
function getBrowseHistory() {
  try {
    const raw = uni.getStorageSync(BROWSE_HISTORY_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (e) {
    console.log('读取浏览记录失败:', e)
  }
  return []
}

/**
 * 保存一条浏览记录（去重、限制数量）
 * @param {Object} item 浏览的内容对象
 */
function saveBrowseHistory(item) {
  if (!item) return
  let list = getBrowseHistory()

  // 构建用于去重的唯一标识
  const itemId = item.postId || item.id || item.viewId || ''

  // 移除已存在的相同记录（去重）
  list = list.filter(record => {
    const recordId = record.postId || record.id || record.viewId || ''
    return recordId !== itemId || !itemId
  })

  // 构建标准化的浏览记录条目
  const entry = {
    ...item,
    // 标准化字段，确保 PostPage 组件能正确渲染
    title: item.title || item.tittle || item.discuss_name || '',
    content: item.content || item.context || item.describe || '',
    createTime: item.createTime || item.creat_time || item.create_time || item.time || new Date().toLocaleString(),
    author: item.author || item.userName || item.nick_name || item.userId || '',
    readNum: item.readNum || item.visitNumber || item.visitnumber || 0,
    like: item.like || item.likeNumber || item.likenumber || 0,
    comment: item.comment || item.commentNumber || item.commentnumber || 0,
    contentImg: item.contentImg || item.coverImgUrl || item.imageUrl || item.imageurl || '',
    postId: item.postId || item.id || item.viewId || '',
    // 记录浏览时间戳，用于排序
    _browseTime: Date.now(),
  }

  // 插入到数组最前面（最新的在最前）
  list.unshift(entry)

  // 限制最大数量
  if (list.length > MAX_HISTORY_COUNT) {
    list = list.slice(0, MAX_HISTORY_COUNT)
  }

  try {
    uni.setStorageSync(BROWSE_HISTORY_KEY, JSON.stringify(list))
  } catch (e) {
    console.log('保存浏览记录失败:', e)
  }
}

/**
 * 删除单条浏览记录
 * @param {Number} index 要删除的索引
 */
function removeBrowseHistory(index) {
  let list = getBrowseHistory()
  if (index >= 0 && index < list.length) {
    list.splice(index, 1)
    uni.setStorageSync(BROWSE_HISTORY_KEY, JSON.stringify(list))
  }
}

/**
 * 清空所有浏览记录
 */
function clearBrowseHistory() {
  uni.removeStorageSync(BROWSE_HISTORY_KEY)
}

export {
  getBrowseHistory,
  saveBrowseHistory,
  removeBrowseHistory,
  clearBrowseHistory,
}
