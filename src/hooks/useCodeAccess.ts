import { useState, useEffect } from 'react'

// 101 Unified Access Codes - All provide identical full access
const VALID_ACCESS_CODES = [
  'GLITCH2024', 'FANTASY101', 'CHAMPION23', 'DYNASTY24', 'PLAYOFF25',
  'WINNER2024', 'ELITE101', 'PREMIUM24', 'VICTORY23', 'LEGEND101',
  'MASTER24', 'GENIUS23', 'EXPERT101', 'WIZARD24', 'TITAN23',
  'ALPHA101', 'OMEGA24', 'SIGMA23', 'BETA101', 'GAMMA24',
  'DELTA23', 'THETA101', 'LAMBDA24', 'PHOENIX23', 'DRAGON101',
  'EAGLE24', 'LION23', 'TIGER101', 'SHARK24', 'WOLF23',
  'BEAR101', 'HAWK24', 'FALCON23', 'VIPER101', 'COBRA24',
  'STORM23', 'THUNDER101', 'LIGHTNING24', 'BLAZE23', 'FIRE101',
  'ICE24', 'FROST23', 'SNOW101', 'WIND24', 'EARTH23',
  'WATER101', 'STEEL24', 'IRON23', 'GOLD101', 'SILVER24',
  'BRONZE23', 'DIAMOND101', 'RUBY24', 'EMERALD23', 'SAPPHIRE101',
  'CRYSTAL24', 'PEARL23', 'JADE101', 'ONYX24', 'AMBER23',
  'COSMIC101', 'STELLAR24', 'GALAXY23', 'NEBULA101', 'QUASAR24',
  'PULSAR23', 'NOVA101', 'COMET24', 'METEOR23', 'ASTEROID101',
  'ROCKET24', 'SHUTTLE23', 'ORBIT101', 'LUNAR24', 'SOLAR23',
  'MARS101', 'VENUS24', 'JUPITER23', 'SATURN101', 'NEPTUNE24',
  'URANUS23', 'PLUTO101', 'MERCURY24', 'EARTH101', 'MOON101',
  'STAR24', 'SUN23', 'UNIVERSE101', 'INFINITY24', 'ETERNAL23',
  'IMMORTAL101', 'DIVINE24', 'SACRED23', 'HOLY101', 'BLESSED24',
  'MAGIC23', 'MYSTIC101', 'ENCHANT24', 'SPELL23', 'CHARM101',
  'POWER24', 'FORCE23', 'ENERGY101', 'SPIRIT24', 'SOUL23',
  'MIND101', 'HEART24', 'DREAM23', 'VISION101', 'FUTURE24',
  'DESTINY23', 'FORTUNE101', 'LUCK24', 'CHANCE23', 'FATE101',
  'GLORY24', 'HONOR23', 'PRIDE101', 'COURAGE24', 'BRAVE23',
  'HERO101', 'KNIGHT24', 'WARRIOR23', 'FIGHTER101', 'BATTLE24',
  'QUEST23', 'ADVENTURE101', 'JOURNEY24', 'PATH23', 'ROAD101',
  'BRIDGE24', 'GATE23', 'DOOR101', 'KEY24', 'LOCK23',
  'SECRET101', 'HIDDEN24', 'MYSTERY23', 'PUZZLE101', 'RIDDLE24',
  'ANSWER23', 'SOLUTION101', 'SUCCESS24', 'ACHIEVE23', 'GOAL101',
  'TARGET24', 'AIM23', 'FOCUS101', 'SHARP24', 'CLEAR23',
  'BRIGHT101', 'SHINE24', 'GLOW23', 'SPARK101', 'FLASH24'
]

export function useCodeAccess() {
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user already has access stored
    const storedCode = localStorage.getItem('fantasy-glitch-access-code')
    if (storedCode && VALID_ACCESS_CODES.includes(storedCode)) {
      setHasAccess(true)
    }
    setLoading(false)
  }, [])

  const validateCode = (code: string): boolean => {
    const upperCode = code.toUpperCase().trim()
    return VALID_ACCESS_CODES.includes(upperCode)
  }

  const submitCode = (code: string): boolean => {
    setError(null)
    const upperCode = code.toUpperCase().trim()
    
    if (!upperCode) {
      setError('Please enter an access code')
      return false
    }

    if (validateCode(upperCode)) {
      localStorage.setItem('fantasy-glitch-access-code', upperCode)
      setHasAccess(true)
      return true
    } else {
      setError('Invalid access code. Please check your code and try again.')
      return false
    }
  }

  const revokeAccess = () => {
    localStorage.removeItem('fantasy-glitch-access-code')
    setHasAccess(false)
  }

  const getStoredCode = (): string | null => {
    return localStorage.getItem('fantasy-glitch-access-code')
  }

  return {
    hasAccess,
    loading,
    error,
    submitCode,
    revokeAccess,
    getStoredCode,
    validateCode,
    totalCodes: VALID_ACCESS_CODES.length
  }
}