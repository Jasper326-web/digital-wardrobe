export interface UpdateItem {
  id: string
  date: string
  title: string
  content: string
  type: 'feature' | 'fix' | 'improvement' | 'announcement'
}

export const updates: UpdateItem[] = [
  {
    id: '1',
    date: '2024-12-19',
    title: '🎉 新功能上线：塔罗牌星座穿搭推荐',
    content: '结合塔罗牌和星座，为您推荐今日最佳穿搭！快来体验神秘的穿搭指引吧～',
    type: 'feature'
  },
  {
    id: '2',
    date: '2024-12-19',
    title: '🔧 修复登录跳转问题',
    content: '优化了注册和Google登录的跳转体验，现在应该更加流畅了！',
    type: 'fix'
  },
  {
    id: '3',
    date: '2024-12-18',
    title: '✨ 新增滚动更新说明',
    content: '在这里您可以看到最新的功能更新和改进，让我们一起共建更好的数字衣柜！',
    type: 'improvement'
  }
]


