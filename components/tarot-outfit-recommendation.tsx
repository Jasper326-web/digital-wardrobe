"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/lib/lang-context'
import { Sparkles, Star, Moon, Sun, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface TarotCard {
  name: string
  meaning: string
  outfitStyle: string
  colors: string[]
  mood: string
  advice: string
}

interface ZodiacSign {
  name: string
  element: string
  luckyColors: string[]
  style: string
  traits: string[]
}

// 塔罗牌数据
const tarotCards: TarotCard[] = [
  {
    name: "愚者",
    meaning: "新的开始，冒险精神",
    outfitStyle: "轻松休闲，充满活力",
    colors: ["黄色", "白色", "蓝色"],
    mood: "乐观开朗",
    advice: "选择明亮色彩，展现你的冒险精神"
  },
  {
    name: "魔术师",
    meaning: "创造力，自信",
    outfitStyle: "精致优雅，展现魅力",
    colors: ["红色", "金色", "黑色"],
    mood: "自信满满",
    advice: "选择经典款式，突出你的个人魅力"
  },
  {
    name: "女祭司",
    meaning: "智慧，直觉",
    outfitStyle: "简约优雅，知性美",
    colors: ["白色", "银色", "深蓝"],
    mood: "冷静理性",
    advice: "选择简约设计，展现内在智慧"
  },
  {
    name: "皇后",
    meaning: "丰盛，母性",
    outfitStyle: "温暖舒适，自然美",
    colors: ["绿色", "粉色", "棕色"],
    mood: "温暖亲切",
    advice: "选择自然色调，展现你的亲和力"
  },
  {
    name: "皇帝",
    meaning: "权威，领导力",
    outfitStyle: "正式商务，专业感",
    colors: ["深蓝", "灰色", "黑色"],
    mood: "稳重可靠",
    advice: "选择正式款式，展现你的领导气质"
  },
  {
    name: "恋人",
    meaning: "和谐，选择",
    outfitStyle: "浪漫甜美，和谐美",
    colors: ["粉色", "白色", "淡紫"],
    mood: "浪漫温馨",
    advice: "选择柔和色彩，展现你的温柔魅力"
  },
  {
    name: "战车",
    meaning: "胜利，决心",
    outfitStyle: "运动活力，充满干劲",
    colors: ["橙色", "红色", "白色"],
    mood: "充满活力",
    advice: "选择动感款式，展现你的决心和活力"
  },
  {
    name: "力量",
    meaning: "内在力量，勇气",
    outfitStyle: "自信大胆，展现力量",
    colors: ["红色", "金色", "橙色"],
    mood: "勇敢自信",
    advice: "选择大胆色彩，展现你的内在力量"
  },
  {
    name: "隐者",
    meaning: "内省，智慧",
    outfitStyle: "低调内敛，知性美",
    colors: ["灰色", "深蓝", "黑色"],
    mood: "深沉内敛",
    advice: "选择低调款式，展现你的深度思考"
  },
  {
    name: "命运之轮",
    meaning: "变化，机遇",
    outfitStyle: "多变时尚，抓住机遇",
    colors: ["紫色", "金色", "银色"],
    mood: "充满期待",
    advice: "选择时尚元素，展现你的适应能力"
  }
]

// 星座数据
const zodiacSigns: ZodiacSign[] = [
  {
    name: "白羊座",
    element: "火",
    luckyColors: ["红色", "橙色", "黄色"],
    style: "大胆前卫，充满活力",
    traits: ["勇敢", "热情", "领导力"]
  },
  {
    name: "金牛座",
    element: "土",
    luckyColors: ["绿色", "棕色", "粉色"],
    style: "经典优雅，注重品质",
    traits: ["稳重", "务实", "品味"]
  },
  {
    name: "双子座",
    element: "风",
    luckyColors: ["黄色", "蓝色", "绿色"],
    style: "多变时尚，善于搭配",
    traits: ["灵活", "好奇", "沟通"]
  },
  {
    name: "巨蟹座",
    element: "水",
    luckyColors: ["银色", "白色", "淡蓝"],
    style: "温柔舒适，注重细节",
    traits: ["敏感", "关怀", "直觉"]
  },
  {
    name: "狮子座",
    element: "火",
    luckyColors: ["金色", "橙色", "红色"],
    style: "华丽耀眼，王者风范",
    traits: ["自信", "慷慨", "魅力"]
  },
  {
    name: "处女座",
    element: "土",
    luckyColors: ["绿色", "灰色", "白色"],
    style: "简约精致，注重细节",
    traits: ["完美", "分析", "服务"]
  },
  {
    name: "天秤座",
    element: "风",
    luckyColors: ["粉色", "蓝色", "淡紫"],
    style: "平衡和谐，优雅知性",
    traits: ["公正", "和谐", "美感"]
  },
  {
    name: "天蝎座",
    element: "水",
    luckyColors: ["深红", "黑色", "紫色"],
    style: "神秘深邃，充满魅力",
    traits: ["神秘", "洞察", "激情"]
  },
  {
    name: "射手座",
    element: "火",
    luckyColors: ["紫色", "蓝色", "绿色"],
    style: "自由奔放，充满冒险",
    traits: ["乐观", "自由", "探索"]
  },
  {
    name: "摩羯座",
    element: "土",
    luckyColors: ["黑色", "棕色", "深蓝"],
    style: "经典实用，专业可靠",
    traits: ["务实", "野心", "责任"]
  },
  {
    name: "水瓶座",
    element: "风",
    luckyColors: ["蓝色", "银色", "白色"],
    style: "前卫独特，充满创意",
    traits: ["创新", "独立", "人道"]
  },
  {
    name: "双鱼座",
    element: "水",
    luckyColors: ["海蓝", "紫色", "银色"],
    style: "梦幻浪漫，富有想象力",
    traits: ["浪漫", "同情", "直觉"]
  }
]

export function TarotOutfitRecommendation() {
  const { t } = useLanguage()
  const [selectedZodiac, setSelectedZodiac] = useState<string>("")
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [recommendation, setRecommendation] = useState<any>(null)
  const [wardrobeNames, setWardrobeNames] = useState<string[]>([])

  const handleZodiacSelect = (zodiac: string) => {
    setSelectedZodiac(zodiac)
    setDrawnCard(null)
    setRecommendation(null)
  }

  const drawTarotCard = async () => {
    if (!selectedZodiac) return
    
    setIsDrawing(true)
    // 拉取用户衣橱物品名称
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('clothing_items')
          .select('name')
          .eq('user_id', user.id)
          .limit(200)
        setWardrobeNames((data || []).map((d: any) => d.name))
      } else {
        setWardrobeNames([])
      }
    } catch {
      setWardrobeNames([])
    }

    // 直接生成结果
    const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)]
    setDrawnCard(randomCard)
    // 生成推荐
    generateRecommendation(randomCard, selectedZodiac)
    setIsDrawing(false)
  }

  const generateRecommendation = (card: TarotCard, zodiacName: string) => {
    const zodiac = zodiacSigns.find(z => z.name === zodiacName)
    if (!zodiac) return

    // 结合塔罗牌和星座生成推荐
    const combinedColors = [...new Set([...card.colors, ...zodiac.luckyColors])]
    const style = `${card.outfitStyle}，结合${zodiac.style}`
    
    // 从衣橱按名称关键词匹配（颜色/风格关键词）
    const keywords = [...combinedColors, card.name, zodiac.name]
    const matched = wardrobeNames.filter(n =>
      keywords.some(k => n?.toLowerCase().includes(String(k).toLowerCase()))
    ).slice(0, 6)
    
    const recommendation = {
      card: card,
      zodiac: zodiac,
      combinedStyle: style,
      recommendedColors: combinedColors.slice(0, 4),
      mood: card.mood,
      advice: `${card.advice}，同时考虑${zodiac.name}的${zodiac.traits[0]}特质。`,
      luckyElements: [card.name, zodiac.element],
      matchedItems: matched
    }
    
    setRecommendation(recommendation)
  }

  const getElementIcon = (element: string) => {
    switch (element) {
      case "火": return <Zap className="w-4 h-4 text-orange-500" />
      case "土": return <Star className="w-4 h-4 text-yellow-600" />
      case "风": return <Sparkles className="w-4 h-4 text-blue-500" />
      case "水": return <Moon className="w-4 h-4 text-blue-400" />
      default: return <Sun className="w-4 h-4 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔮 塔罗牌星座穿搭推荐
        </h2>
        <p className="text-gray-600">
          结合塔罗牌的神秘指引和星座的个性特质，为你推荐今日最佳穿搭
        </p>
      </div>

      {/* 星座选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>选择你的星座</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {zodiacSigns.map((zodiac) => (
              <Button
                key={zodiac.name}
                variant={selectedZodiac === zodiac.name ? "default" : "outline"}
                onClick={() => handleZodiacSelect(zodiac.name)}
                className="h-auto p-3 flex flex-col items-center space-y-1"
              >
                <span className="text-sm font-medium">{zodiac.name}</span>
                <div className="flex items-center space-x-1">
                  {getElementIcon(zodiac.element)}
                  <span className="text-xs text-muted-foreground">{zodiac.element}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 抽牌区域 */}
      {selectedZodiac && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>抽取今日塔罗牌</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={drawTarotCard}
              disabled={isDrawing}
              className="w-full max-w-xs"
              size="lg"
            >
              {isDrawing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>正在抽牌...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>抽取塔罗牌</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 抽牌结果 */}
      {drawnCard && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Moon className="w-5 h-5 text-blue-500" />
              <span>今日塔罗牌：{drawnCard.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">牌面含义</h4>
                <p className="text-gray-600">{drawnCard.meaning}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">穿搭风格</h4>
                <p className="text-gray-600">{drawnCard.outfitStyle}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">推荐色彩</h4>
                <div className="flex flex-wrap gap-2">
                  {drawnCard.colors.map((color) => (
                    <Badge key={color} variant="secondary">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 综合推荐 */}
      {recommendation && (
        <Card className="border-2 border-gradient-to-r from-purple-500 to-pink-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-600">
              <Sparkles className="w-5 h-5" />
              <span>✨ 今日穿搭推荐</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 星座信息 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {recommendation.zodiac.name} ({recommendation.zodiac.element}象)
                </h4>
                <p className="text-gray-600 mb-2">{recommendation.zodiac.style}</p>
                <div className="flex flex-wrap gap-1">
                  {recommendation.zodiac.traits.map((trait) => (
                    <Badge key={trait} variant="outline" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 综合推荐 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">🎨 推荐穿搭风格</h4>
                <p className="text-gray-700 mb-3">{recommendation.combinedStyle}</p>
                
                <h5 className="font-medium text-gray-900 mb-2">幸运色彩</h5>
                <div className="flex flex-wrap gap-2 mb-3">
                  {recommendation.recommendedColors.map((color) => (
                    <Badge key={color} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {color}
                    </Badge>
                  ))}
                </div>

                <h5 className="font-medium text-gray-900 mb-2">今日心情</h5>
                <p className="text-gray-700 mb-3">{recommendation.mood}</p>

                <h5 className="font-medium text-gray-900 mb-2">穿搭建议</h5>
                <p className="text-gray-700">{recommendation.advice}</p>
              </div>

              {/* 幸运元素 */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">🍀 幸运元素</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">塔罗牌：{recommendation.luckyElements[0]}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getElementIcon(recommendation.luckyElements[1])}
                    <span className="text-sm">元素：{recommendation.luckyElements[1]}</span>
                  </div>
                </div>
              </div>

              {/* 衣橱匹配单品（基于名称关键词） */}
              {!!recommendation.matchedItems?.length && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">👗 衣橱推荐匹配</h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.matchedItems.map((name: string) => (
                      <Badge key={name} variant="outline" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
