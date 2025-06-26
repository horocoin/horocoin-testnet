import React, { useState, useEffect } from 'react';
import { Star, Coins, Calendar, Wallet, CheckCircle, Sparkles, Globe } from 'lucide-react';
import { useWallet, WalletProvider } from '@suiet/wallet-kit';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

// Network configuration
const NETWORK_CONFIG = {
  testnet: {
    url: 'https://fullnode.testnet.sui.io:443',
    chainId: 'sui:testnet'
  }
};

// Sui configuration - Use environment variables with fallbacks
const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID || '0x11e2d0f36ab6b92eb1cdd2371a0b017bf9da1ff306b9d5f7874eed34e9b8028e';
const TREASURY_ID = import.meta.env.VITE_TREASURY_ID || '0xc1958a258902c87002ec7f32c4bc2008ee43d1f9cd1221115507527354d4c5c6';
const CLAIMS_ID = import.meta.env.VITE_CLAIMS_ID || '0xa4c159f99b6dea65102587c2a8e95dd4b96d7f29c29be8cfb38c8986d6e4f624';
const PROGRESS_REGISTRY_ID = import.meta.env.VITE_PROGRESS_REGISTRY_ID || '0x9771dba7c63a92cc2656255d55c79aef560703cbcb8bec9a1860f727a09531e3';
const ADMIN_CAP_ID = import.meta.env.VITE_ADMIN_CAP_ID || '0x2745f544e3072eba7000fca0045ca63f692bb95a2859e7b4236886f74ab2969d';

const suiClient = new SuiClient({ 
  url: NETWORK_CONFIG.testnet.url
});

// Debug: Log the contract addresses
console.log('🔍 Contract addresses:', {
  PACKAGE_ID,
  TREASURY_ID, 
  CLAIMS_ID,
  PROGRESS_REGISTRY_ID,
  ADMIN_CAP_ID
});

// Language Support
const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇨🇴' },
  zh: { name: '中文', flag: '🇨🇳' },
  'zh-TR': { name: '繁體中文', flag: '🇨🇳' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  fr: { name: 'Français', flag: '🇫🇷' }
};

// Translations
const TRANSLATIONS = {
  en: {
    // Main UI
    dailyHoro: `Daily $HORO`,
    chooseZodiacSystem: `Choose Your Zodiac System`,
    chooseWesternZodiac: `Choose Your Western Zodiac Sign`,
    chooseChineseZodiac: `Choose Your Chinese Zodiac Sign`,
    western: `Western`,
    chinese: `Chinese`,
    weeklyProgress: `Weekly Progress`,
    todayVisitRecorded: `✓ Today's claim recorded!`,
    alreadyClaimedOnChain: `✅ Already claimed today (verified on blockchain)`,
    dailyReading: `Daily Reading`,
    dailyReward: `Daily $HORO Reward`,
    earnDailyHoro: `Earn {amount} $HORO today!`,
    todayRewardEarned: `✅ Today's {amount} $HORO earned!`,
    checkInToday: `Check-in & Earn $HORO`,
    checkingIn: `Earning $HORO...`,
    claiming: `Claiming...`,
    verifyingClaim: `Verifying claim status...`,
    streakBonus: `Streak Bonus`,
    daysStreak: `{days} day streak`,
    baseReward: `Base reward: {amount} $HORO`,
    bonusReward: `Streak bonus: +{amount} $HORO`,
    totalDailyReward: `Total today: {amount} $HORO`,
    blockchainTransaction: `This will create a blockchain transaction and transfer real $HORO tokens to your wallet!`,
    rewardsClaimedTitle: `✅ Rewards Claimed!`,
    rewardsClaimed: `You've already claimed your $HORO tokens this week.`,
    comeBackMonday: `Come back next Monday to start a new week!`,
    connectWallet: `Connect your Suiet wallet to automatically track your daily visits and claim $HORO rewards!`,
    connectSuietWallet: `Connect Suiet Wallet`,
    connectSuietWalletTitle: `Connect Suiet Wallet`,
    connectSuietPrompt: `Connect your Suiet wallet to automatically track your daily visits and claim $HORO rewards with cryptographic security!`,
    suietWalletSecure: `Secure wallet with message signing`,
    whySuiet: `Why Suiet?`,
    suietBenefitSigning: `Supports cryptographic message signing`,
    suietBenefitSecurity: `Enhanced security for NFT airdrops`,
    suietBenefitFraud: `Prevents check-in fraud`,
    suietBenefitCompatibility: `Best compatibility with $HORO features`,
    dontHaveSuiet: `Don't have Suiet wallet?`,
    downloadSuiet: `Download Suiet Wallet →`,
    useSuietForSigning: `Please use Suiet wallet for secure message signing`,
    autoSigning: `Automatically signing today's visit... ✨`,
    transitioningToZodiac: `Transitioning to zodiac selection...`,
    wallet: `Wallet`,
    
    // Loading States
    connecting: `Connecting...`,
    signing: `Signing...`,
    loading: `Loading...`,
    
    // Testnet Education
    testnetDisclaimer: `🧪 This app uses Sui Testnet`,
    testnetExplainer: `Testnet tokens have no real monetary value. This is a safe environment to learn and earn virtual $HORO tokens!`,
    learnMoreSuiet: `Learn how to install Suiet wallet`,
    needHelp: `Need help?`,
    
    // Gas Management
    gasLow: `⛽ Low Gas Balance`,
    gasNeeded: `Please add testnet SUI to your wallet for transactions`,
    getFreeGas: `Open Testnet Faucet`,
    gettingGas: `Opening faucet...`,
    gasSuccess: `✅ Free testnet SUI added to your wallet!`,
    gasError: `❌ Failed to open faucet. Please visit faucet.testnet.sui.io manually.`,
    gasBalance: `Gas Balance`,
    sufficientGas: `✅ Sufficient gas for transactions`,
    
    // Footer
    about: `About`,
    tokenomics: `Tokenomics`,
    help: `Help`,
    reset: `Reset`,
    
    // Claim Status Messages
    alreadyClaimedToday: `Already Claimed Today!`,
    alreadyClaimedMessage: `You've earned your daily $HORO! Come back tomorrow.`,
    nextClaimAvailable: `Next claim available: Tomorrow`,
    claimTodaysHoro: `🎁 Claim Today's $HORO`,
    missedDays: `Missed Days`,
    completedDays: `Completed Days`,
    claimedAmountToday: `Claimed {amount} $HORO today!`,
    completed: `Completed`,
    missed: `Missed`,
    available: `Available`,
    future: `Future`,
    
    // Network Status
    connected: `Connected`,
    connectionVerified: `Connection to Sui Testnet verified`,
    refreshStatus: `Refresh Status`,
    
    // Days of the Week
    sunday: `Sun`,
    monday: `Mon`, 
    tuesday: `Tue`,
    wednesday: `Wed`,
    thursday: `Thu`,
    friday: `Fri`,
    saturday: `Sat`,
    
    // Zodiac Signs
    aries: `aries`,
    taurus: `taurus`, 
    gemini: `gemini`,
    cancer: `cancer`,
    leo: `leo`,
    virgo: `virgo`,
    libra: `libra`,
    scorpio: `scorpio`,
    sagittarius: `sagittarius`,
    capricorn: `capricorn`,
    aquarius: `aquarius`,
    pisces: `pisces`,
    
    // Chinese Zodiac
    rat: `rat`,
    ox: `ox`,
    tiger: `tiger`, 
    rabbit: `rabbit`,
    dragon: `dragon`,
    snake: `snake`,
    horse: `horse`,
    goat: `goat`,
    monkey: `monkey`,
    rooster: `rooster`,
    dog: `dog`,
    pig: `pig`,
    
    // Elements
    water: `Water`,
    earth: `Earth`, 
    wood: `Wood`,
    fire: `Fire`,
    metal: `Metal`
  },
  es: {
    // Main UI
    dailyHoro: `$HORO Diario`,
    chooseZodiacSystem: `Elige Tu Sistema Zodiacal`,
    chooseWesternZodiac: `Elige Tu Signo Zodiacal Occidental`,
    chooseChineseZodiac: `Elige Tu Signo Zodiacal Chino`,
    western: `Occidental`,
    chinese: `Chino`,
    weeklyProgress: `Progreso Semanal`,
    todayVisitRecorded: `✓ ¡Reclamo de hoy registrado!`,
    alreadyClaimedOnChain: `✅ Ya reclamado hoy (verificado en blockchain)`,
    dailyReading: `Lectura Diaria`,
    dailyReward: `Recompensa $HORO Diaria`,
    earnDailyHoro: `¡Gana {amount} $HORO hoy!`,
    todayRewardEarned: `✅ ¡{amount} $HORO de hoy ganados!`,
    checkInToday: `Registrarse y Ganar $HORO`,
    checkingIn: `Ganando $HORO...`,
    claiming: `Reclamando...`,
    verifyingClaim: `Verificando estado del reclamo...`,
    streakBonus: `Bono de Racha`,
    daysStreak: `racha de {days} días`,
    baseReward: `Recompensa base: {amount} $HORO`,
    bonusReward: `Bono de racha: +{amount} $HORO`,
    totalDailyReward: `Total hoy: {amount} $HORO`,
    blockchainTransaction: `¡Esto creará una transacción blockchain y transferirá tokens $HORO reales a tu billetera!`,
    rewardsClaimedTitle: `✅ ¡Recompensas Reclamadas!`,
    rewardsClaimed: `Ya has reclamado tus tokens $HORO esta semana.`,
    comeBackMonday: `¡Vuelve el próximo lunes para comenzar una nueva semana!`,
    connectWallet: `¡Conecta tu billetera Suiet para rastrear automáticamente tus visitas diarias y reclamar recompensas $HORO!`,
    connectSuietWallet: `Conectar Billetera Suiet`,
    connectSuietWalletTitle: `Conectar Billetera Suiet`,
    connectSuietPrompt: `¡Conecta tu billetera Suiet para rastrear automáticamente tus visitas diarias y reclamar recompensas $HORO con seguridad criptográfica!`,
    suietWalletSecure: `Billetera segura con firma de mensajes`,
    whySuiet: `¿Por qué Suiet?`,
    suietBenefitSigning: `Soporta firma criptográfica de mensajes`,
    suietBenefitSecurity: `Seguridad mejorada para airdrops de NFT`,
    suietBenefitFraud: `Previene fraude en el registro`,
    suietBenefitCompatibility: `Mejor compatibilidad con características $HORO`,
    dontHaveSuiet: `¿No tienes billetera Suiet?`,
    downloadSuiet: `Descargar Billetera Suiet →`,
    useSuietForSigning: `Por favor usa la billetera Suiet para firma segura de mensajes`,
    autoSigning: `Firmando automáticamente la visita de hoy... ✨`,
    transitioningToZodiac: `Transicionando a selección zodiacal...`,
    wallet: `Billetera`,
    
    // Loading States
    connecting: `Conectando...`,
    signing: `Firmando...`,
    loading: `Cargando...`,
    
    // Testnet Education
    testnetDisclaimer: `🧪 Esta app usa Sui Testnet`,
    testnetExplainer: `Los tokens de testnet no tienen valor monetario real. ¡Este es un entorno seguro para aprender y ganar tokens $HORO virtuales!`,
    learnMoreSuiet: `Aprende cómo instalar la billetera Suiet`,
    needHelp: `¿Necesitas ayuda?`,
    
    // Gas Management
    gasLow: `⛽ Saldo de Gas Bajo`,
    gasNeeded: `Por favor añade SUI de testnet a tu billetera para transacciones`,
    getFreeGas: `Abrir Faucet de Testnet`,
    gettingGas: `Abriendo faucet...`,
    gasSuccess: `✅ ¡SUI gratuito de testnet añadido a tu billetera!`,
    gasError: `❌ Error al abrir faucet. Por favor visita faucet.testnet.sui.io manualmente.`,
    gasBalance: `Saldo de Gas`,
    sufficientGas: `✅ Gas suficiente para transacciones`,
    
    // Footer
    about: `Acerca de`,
    tokenomics: `Tokenómica`,
    help: `Ayuda`,
    reset: `Reiniciar`,
    
    // Claim Status Messages
    alreadyClaimedToday: `¡Ya Reclamado Hoy!`,
    alreadyClaimedMessage: `¡Has ganado tu $HORO diario! Vuelve mañana.`,
    nextClaimAvailable: `Próximo reclamo disponible: Mañana`,
    claimTodaysHoro: `🎁 Reclamar $HORO de Hoy`,
    missedDays: `Días Perdidos`,
    completedDays: `Días Completados`,
    claimedAmountToday: `¡Reclamados {amount} $HORO hoy!`,
    completed: `Completado`,
    missed: `Perdido`,
    available: `Disponible`,
    future: `Futuro`,
    
    // Network Status
    connected: `Conectado`,
    connectionVerified: `Conexión a Sui Testnet verificada`,
    refreshStatus: `Actualizar Estado`,
    
    // Days of the Week
    sunday: `Dom`,
    monday: `Lun`, 
    tuesday: `Mar`,
    wednesday: `Mié`,
    thursday: `Jue`,
    friday: `Vie`,
    saturday: `Sáb`,
    
    // Zodiac Signs
    aries: `aries`,
    taurus: `tauro`, 
    gemini: `géminis`,
    cancer: `cáncer`,
    leo: `leo`,
    virgo: `virgo`,
    libra: `libra`,
    scorpio: `escorpio`,
    sagittarius: `sagitario`,
    capricorn: `capricornio`,
    aquarius: `acuario`,
    pisces: `piscis`,
    
    // Chinese Zodiac
    rat: `rata`,
    ox: `buey`,
    tiger: `tigre`, 
    rabbit: `conejo`,
    dragon: `dragón`,
    snake: `serpiente`,
    horse: `caballo`,
    goat: `cabra`,
    monkey: `mono`,
    rooster: `gallo`,
    dog: `perro`,
    pig: `cerdo`,
    
    // Elements
    water: `Agua`,
    earth: `Tierra`, 
    wood: `Madera`,
    fire: `Fuego`,
    metal: `Metal`
  },
  ru: {
    // Main UI
    dailyHoro: `Ежедневная $HORO`,
    chooseZodiacSystem: `Выберите Вашу Зодиакальную Систему`,
    chooseWesternZodiac: `Выберите Ваш Западный Знак Зодиака`,
    chooseChineseZodiac: `Выберите Ваш Китайский Знак Зодиака`,
    western: `Западный`,
    chinese: `Китайский`,
    weeklyProgress: `Недельный Прогресс`,
    todayVisitRecorded: `✓ Сегодняшнее требование записано!`,
    alreadyClaimedOnChain: `✅ Уже получено сегодня (проверено в блокчейне)`,
    dailyReading: `Ежедневное Чтение`,
    dailyReward: `Ежедневная Награда $HORO`,
    earnDailyHoro: `Заработайте {amount} $HORO сегодня!`,
    todayRewardEarned: `✅ Сегодняшние {amount} $HORO заработаны!`,
    checkInToday: `Отметиться и Заработать $HORO`,
    checkingIn: `Зарабатываем $HORO...`,
    claiming: `Получаем...`,
    verifyingClaim: `Проверяем статус получения...`,
    streakBonus: `Бонус за Серию`,
    daysStreak: `серия {days} дней`,
    baseReward: `Базовая награда: {amount} $HORO`,
    bonusReward: `Бонус за серию: +{amount} $HORO`,
    totalDailyReward: `Всего сегодня: {amount} $HORO`,
    blockchainTransaction: `Это создаст транзакцию в блокчейне и переведет настоящие токены $HORO в ваш кошелек!`,
    rewardsClaimedTitle: `✅ Награды Получены!`,
    rewardsClaimed: `Вы уже получили ваши токены $HORO на этой неделе.`,
    comeBackMonday: `Возвращайтесь в следующий понедельник, чтобы начать новую неделю!`,
    connectWallet: `Подключите ваш кошелек Suiet для автоматического отслеживания ежедневных посещений и получения наград $HORO!`,
    connectSuietWallet: `Подключить Кошелек Suiet`,
    connectSuietWalletTitle: `Подключить Кошелек Suiet`,
    connectSuietPrompt: `Подключите ваш кошелек Suiet для автоматического отслеживания ежедневных посещений и получения наград $HORO с криптографической безопасностью!`,
    suietWalletSecure: `Безопасный кошелек с подписью сообщений`,
    whySuiet: `Почему Suiet?`,
    suietBenefitSigning: `Поддерживает криптографическую подпись сообщений`,
    suietBenefitSecurity: `Повышенная безопасность для NFT airdrop`,
    suietBenefitFraud: `Предотвращает мошенничество при регистрации`,
    suietBenefitCompatibility: `Лучшая совместимость с функциями $HORO`,
    dontHaveSuiet: `Нет кошелька Suiet?`,
    downloadSuiet: `Скачать Кошелек Suiet →`,
    useSuietForSigning: `Пожалуйста, используйте кошелек Suiet для безопасной подписи сообщений`,
    autoSigning: `Автоматически подписываем сегодняшнее посещение... ✨`,
    transitioningToZodiac: `Переходим к выбору зодиака...`,
    wallet: `Кошелек`,
    
    // Loading States
    connecting: `Подключаемся...`,
    signing: `Подписываем...`,
    loading: `Загружаем...`,
    
    // Testnet Education
    testnetDisclaimer: `🧪 Это приложение использует Sui Testnet`,
    testnetExplainer: `Токены тестнета не имеют реальной денежной стоимости. Это безопасная среда для изучения и заработка виртуальных токенов $HORO!`,
    learnMoreSuiet: `Узнайте, как установить кошелек Suiet`,
    needHelp: `Нужна помощь?`,
    
    // Gas Management
    gasLow: `⛽ Низкий Баланс Газа`,
    gasNeeded: `Пожалуйста, добавьте тестнет SUI в ваш кошелек для транзакций`,
    getFreeGas: `Открыть Тестнет Кран`,
    gettingGas: `Открываем кран...`,
    gasSuccess: `✅ Бесплатный тестнет SUI добавлен в ваш кошелек!`,
    gasError: `❌ Не удалось открыть кран. Пожалуйста, посетите faucet.testnet.sui.io вручную.`,
    gasBalance: `Баланс Газа`,
    sufficientGas: `✅ Достаточно газа для транзакций`,
    
    // Footer
    about: `О проекте`,
    tokenomics: `Токеномика`,
    help: `Помощь`,
    reset: `Сброс`,
    
    // Claim Status Messages
    alreadyClaimedToday: `Уже Получено Сегодня!`,
    alreadyClaimedMessage: `Вы заработали свои ежедневные $HORO! Возвращайтесь завтра.`,
    nextClaimAvailable: `Следующее получение доступно: Завтра`,
    claimTodaysHoro: `🎁 Получить Сегодняшние $HORO`,
    missedDays: `Пропущенные Дни`,
    completedDays: `Завершенные Дни`,
    claimedAmountToday: `Получено {amount} $HORO сегодня!`,
    completed: `Завершено`,
    missed: `Пропущено`,
    available: `Доступно`,
    future: `Будущее`,
    
    // Network Status
    connected: `Подключен`,
    connectionVerified: `Подключение к Sui Testnet проверено`,
    refreshStatus: `Обновить Статус`,
    
    // Days of the Week
    sunday: `Вс`,
    monday: `Пн`, 
    tuesday: `Вт`,
    wednesday: `Ср`,
    thursday: `Чт`,
    friday: `Пт`,
    saturday: `Сб`,
    
    // Zodiac Signs
    aries: `овен`,
    taurus: `телец`, 
    gemini: `близнецы`,
    cancer: `рак`,
    leo: `лев`,
    virgo: `дева`,
    libra: `весы`,
    scorpio: `скорпион`,
    sagittarius: `стрелец`,
    capricorn: `козерог`,
    aquarius: `водолей`,
    pisces: `рыбы`,
    
    // Chinese Zodiac
    rat: `крыса`,
    ox: `бык`,
    tiger: `тигр`, 
    rabbit: `кролик`,
    dragon: `дракон`,
    snake: `змея`,
    horse: `лошадь`,
    goat: `коза`,
    monkey: `обезьяна`,
    rooster: `петух`,
    dog: `собака`,
    pig: `свинья`,
    
    // Elements
    water: `Вода`,
    earth: `Земля`, 
    wood: `Дерево`,
    fire: `Огонь`,
    metal: `Металл`
  },
  fr: {
    // Main UI
    dailyHoro: `$HORO Quotidien`,
    chooseZodiacSystem: `Choisissez Votre Système Zodiacal`,
    chooseWesternZodiac: `Choisissez Votre Signe Zodiacal Occidental`,
    chooseChineseZodiac: `Choisissez Votre Signe Zodiacal Chinois`,
    western: `Occidental`,
    chinese: `Chinois`,
    weeklyProgress: `Progrès Hebdomadaire`,
    todayVisitRecorded: `✓ Réclamation d'aujourd'hui enregistrée!`,
    alreadyClaimedOnChain: `✅ Déjà réclamé aujourd'hui (vérifié sur blockchain)`,
    dailyReading: `Lecture Quotidienne`,
    dailyReward: `Récompense $HORO Quotidienne`,
    earnDailyHoro: `Gagnez {amount} $HORO aujourd'hui!`,
    todayRewardEarned: `✅ {amount} $HORO d'aujourd'hui gagnés!`,
    checkInToday: `S'enregistrer et Gagner $HORO`,
    checkingIn: `Gagner $HORO...`,
    claiming: `Réclamation...`,
    verifyingClaim: `Vérification du statut de réclamation...`,
    streakBonus: `Bonus de Série`,
    daysStreak: `série de {days} jours`,
    baseReward: `Récompense de base: {amount} $HORO`,
    bonusReward: `Bonus de série: +{amount} $HORO`,
    totalDailyReward: `Total aujourd'hui: {amount} $HORO`,
    blockchainTransaction: `Ceci créera une transaction blockchain et transférera de vrais tokens $HORO vers votre portefeuille!`,
    rewardsClaimedTitle: `✅ Récompenses Réclamées!`,
    rewardsClaimed: `Vous avez déjà réclamé vos tokens $HORO cette semaine.`,
    comeBackMonday: `Revenez lundi prochain pour commencer une nouvelle semaine!`,
    connectWallet: `Connectez votre portefeuille Suiet pour suivre automatiquement vos visites quotidiennes et réclamer les récompenses $HORO!`,
    connectSuietWallet: `Connecter Portefeuille Suiet`,
    connectSuietWalletTitle: `Connecter Portefeuille Suiet`,
    connectSuietPrompt: `Connectez votre portefeuille Suiet pour suivre automatiquement vos visites quotidiennes et réclamer les récompenses $HORO avec sécurité cryptographique!`,
    suietWalletSecure: `Portefeuille sécurisé avec signature de messages`,
    whySuiet: `Pourquoi Suiet?`,
    suietBenefitSigning: `Supporte la signature cryptographique de messages`,
    suietBenefitSecurity: `Sécurité renforcée pour les airdrops NFT`,
    suietBenefitFraud: `Prévient la fraude d'enregistrement`,
    suietBenefitCompatibility: `Meilleure compatibilité avec les fonctionnalités $HORO`,
    dontHaveSuiet: `Pas de portefeuille Suiet?`,
    downloadSuiet: `Télécharger Portefeuille Suiet →`,
    useSuietForSigning: `Veuillez utiliser le portefeuille Suiet pour la signature sécurisée de messages`,
    autoSigning: `Signature automatique de la visite d'aujourd'hui... ✨`,
    transitioningToZodiac: `Transition vers la sélection zodiacale...`,
    wallet: `Portefeuille`,
    
    // Loading States
    connecting: `Connexion...`,
    signing: `Signature...`,
    loading: `Chargement...`,
    
    // Testnet Education
    testnetDisclaimer: `🧪 Cette app utilise Sui Testnet`,
    testnetExplainer: `Les tokens testnet n'ont aucune valeur monétaire réelle. C'est un environnement sûr pour apprendre et gagner des tokens $HORO virtuels!`,
    learnMoreSuiet: `Apprenez comment installer le portefeuille Suiet`,
    needHelp: `Besoin d'aide?`,
    
    // Gas Management
    gasLow: `⛽ Solde Gas Faible`,
    gasNeeded: `Veuillez ajouter du SUI testnet à votre portefeuille pour les transactions`,
    getFreeGas: `Ouvrir Robinet Testnet`,
    gettingGas: `Ouverture du robinet...`,
    gasSuccess: `✅ SUI testnet gratuit ajouté à votre portefeuille!`,
    gasError: `❌ Échec d'ouverture du robinet. Veuillez visiter faucet.testnet.sui.io manuellement.`,
    gasBalance: `Solde Gas`,
    sufficientGas: `✅ Gas suffisant pour les transactions`,
    
    // Footer
    about: `À propos`,
    tokenomics: `Tokenomique`,
    help: `Aide`,
    reset: `Réinitialiser`,
    
    // Claim Status Messages
    alreadyClaimedToday: `Déjà Réclamé Aujourd'hui!`,
    alreadyClaimedMessage: `Vous avez gagné votre $HORO quotidien! Revenez demain.`,
    nextClaimAvailable: `Prochaine réclamation disponible: Demain`,
    claimTodaysHoro: `🎁 Réclamer $HORO d'Aujourd'hui`,
    missedDays: `Jours Manqués`,
    completedDays: `Jours Complétés`,
    claimedAmountToday: `Réclamé {amount} $HORO aujourd'hui!`,
    completed: `Terminé`,
    missed: `Manqué`,
    available: `Disponible`,
    future: `Futur`,
    
    // Network Status
    connected: `Connecté`,
    connectionVerified: `Connexion à Sui Testnet vérifiée`,
    refreshStatus: `Actualiser le Statut`,
    
    // Days of the Week
    sunday: `Dim`,
    monday: `Lun`, 
    tuesday: `Mar`,
    wednesday: `Mer`,
    thursday: `Jeu`,
    friday: `Ven`,
    saturday: `Sam`,
    
    // Zodiac Signs
    aries: `bélier`,
    taurus: `taureau`, 
    gemini: `gémeaux`,
    cancer: `cancer`,
    leo: `lion`,
    virgo: `vierge`,
    libra: `balance`,
    scorpio: `scorpion`,
    sagittarius: `sagittaire`,
    capricorn: `capricorne`,
    aquarius: `verseau`,
    pisces: `poissons`,
    
    // Chinese Zodiac
    rat: `rat`,
    ox: `bœuf`,
    tiger: `tigre`, 
    rabbit: `lapin`,
    dragon: `dragon`,
    snake: `serpent`,
    horse: `cheval`,
    goat: `chèvre`,
    monkey: `singe`,
    rooster: `coq`,
    dog: `chien`,
    pig: `cochon`,
    
    // Elements
    water: `Eau`,
    earth: `Terre`, 
    wood: `Bois`,
    fire: `Feu`,
    metal: `Métal`
  },
  zh: {
    // Main UI
    dailyHoro: `每日 $HORO`,
    chooseZodiacSystem: `选择您的星座系统`,
    chooseWesternZodiac: `选择您的西方星座`,
    chooseChineseZodiac: `选择您的生肖`,
    western: `西方`,
    chinese: `中国`,
    weeklyProgress: `每周进度`,
    todayVisitRecorded: `✓ 今日签到已记录！`,
    alreadyClaimedOnChain: `✅ 今日已领取（区块链已验证）`,
    dailyReading: `每日阅读`,
    dailyReward: `每日$HORO奖励`,
    earnDailyHoro: `今天赚取{amount} $HORO！`,
    todayRewardEarned: `✅ 今天的{amount} $HORO已赚取！`,
    checkInToday: `签到并赚取$HORO`,
    checkingIn: `正在赚取$HORO...`,
    claiming: `正在领取...`,
    verifyingClaim: `正在验证领取状态...`,
    streakBonus: `连续奖励`,
    daysStreak: `{days}天连续`,
    baseReward: `基础奖励：{amount} $HORO`,
    bonusReward: `连续奖励：+{amount} $HORO`,
    totalDailyReward: `今日总计：{amount} $HORO`,
    blockchainTransaction: `这将创建一个区块链交易并将真实的$HORO代币转移到您的钱包！`,
    rewardsClaimedTitle: `✅ 奖励已领取！`,
    rewardsClaimed: `您已经领取了本周的$HORO代币。`,
    comeBackMonday: `下周一回来开始新的一周！`,
    connectWallet: `连接您的Suiet钱包以自动跟踪每日访问并领取$HORO奖励！`,
    connectSuietWallet: `连接Suiet钱包`,
    connectSuietWalletTitle: `连接Suiet钱包`,
    connectSuietPrompt: `连接您的Suiet钱包以自动跟踪每日访问并通过加密安全领取$HORO奖励！`,
    suietWalletSecure: `带有消息签名的安全钱包`,
    whySuiet: `为什么选择Suiet？`,
    suietBenefitSigning: `支持加密消息签名`,
    suietBenefitSecurity: `增强NFT空投安全性`,
    suietBenefitFraud: `防止签到欺诈`,
    suietBenefitCompatibility: `与$HORO功能最佳兼容`,
    dontHaveSuiet: `没有Suiet钱包？`,
    downloadSuiet: `下载Suiet钱包 →`,
    useSuietForSigning: `请使用Suiet钱包进行安全消息签名`,
    autoSigning: `正在自动签署今日访问... ✨`,
    transitioningToZodiac: `正在转换到星座选择...`,
    wallet: `钱包`,
    
    // Loading States
    connecting: `连接中...`,
    signing: `签名中...`,
    loading: `加载中...`,
    
    // Testnet Education
    testnetDisclaimer: `🧪 此应用使用Sui测试网`,
    testnetExplainer: `测试网代币没有真实货币价值。这是一个安全的环境来学习和赚取虚拟$HORO代币！`,
    learnMoreSuiet: `了解如何安装Suiet钱包`,
    needHelp: `需要帮助？`,
    
    // Gas Management
    gasLow: `⛽ Gas余额不足`,
    gasNeeded: `请向您的钱包添加测试网SUI进行交易`,
    getFreeGas: `打开测试网水龙头`,
    gettingGas: `正在打开水龙头...`,
    gasSuccess: `✅ 免费测试网SUI已添加到您的钱包！`,
    gasError: `❌ 打开水龙头失败。请手动访问faucet.testnet.sui.io。`,
    gasBalance: `Gas余额`,
    sufficientGas: `✅ 交易Gas充足`,
    
    // Footer
    about: `关于`,
    tokenomics: `代币经济`,
    help: `帮助`,
    reset: `重置`,
    
    // Claim Status Messages
    alreadyClaimedToday: `今日已领取！`,
    alreadyClaimedMessage: `您已获得今日$HORO！明天再来。`,
    nextClaimAvailable: `下次领取时间：明天`,
    claimTodaysHoro: `🎁 领取今日$HORO`,
    missedDays: `错过的天数`,
    completedDays: `完成的天数`,
    claimedAmountToday: `今日已领取{amount} $HORO！`,
    completed: `已完成`,
    missed: `已错过`,
    available: `可用`,
    future: `未来`,
    
    // Network Status
    connected: `已连接`,
    connectionVerified: `Sui测试网连接已验证`,
    refreshStatus: `刷新状态`,
    
    // Days of the Week
    sunday: `周日`,
    monday: `周一`, 
    tuesday: `周二`,
    wednesday: `周三`,
    thursday: `周四`,
    friday: `周五`,
    saturday: `周六`,
    
    // Zodiac Signs
    aries: `白羊座`,
    taurus: `金牛座`, 
    gemini: `双子座`,
    cancer: `巨蟹座`,
    leo: `狮子座`,
    virgo: `处女座`,
    libra: `天秤座`,
    scorpio: `天蝎座`,
    sagittarius: `射手座`,
    capricorn: `摩羯座`,
    aquarius: `水瓶座`,
    pisces: `双鱼座`,
    
    // Chinese Zodiac
    rat: `鼠`,
    ox: `牛`,
    tiger: `虎`, 
    rabbit: `兔`,
    dragon: `龙`,
    snake: `蛇`,
    horse: `马`,
    goat: `羊`,
    monkey: `猴`,
    rooster: `鸡`,
    dog: `狗`,
    pig: `猪`,
    
    // Elements
    water: `水`,
    earth: `土`, 
    wood: `木`,
    fire: `火`,
    metal: `金`
  },
  'zh-TR': {
    // Main UI
    dailyHoro: `每日 $HORO`,
    chooseZodiacSystem: `選擇您的星座系統`,
    chooseWesternZodiac: `選擇您的西方星座`,
    chooseChineseZodiac: `選擇您的生肖`,
    western: `西方`,
    chinese: `中國`,
    weeklyProgress: `每週進度`,
    todayVisitRecorded: `✓ 今日簽到已記錄！`,
    alreadyClaimedOnChain: `✅ 今日已領取（區塊鏈已驗證）`,
    dailyReading: `每日閱讀`,
    dailyReward: `每日$HORO獎勵`,
    earnDailyHoro: `今天賺取{amount} $HORO！`,
    todayRewardEarned: `✅ 今天的{amount} $HORO已賺取！`,
    checkInToday: `簽到並賺取$HORO`,
    checkingIn: `正在賺取$HORO...`,
    claiming: `正在領取...`,
    verifyingClaim: `正在驗證領取狀態...`,
    streakBonus: `連續獎勵`,
    daysStreak: `{days}天連續`,
    baseReward: `基礎獎勵：{amount} $HORO`,
    bonusReward: `連續獎勵：+{amount} $HORO`,
    totalDailyReward: `今日總計：{amount} $HORO`,
    blockchainTransaction: `這將創建一個區塊鏈交易並將真實的$HORO代幣轉移到您的錢包！`,
    rewardsClaimedTitle: `✅ 獎勵已領取！`,
    rewardsClaimed: `您已經領取了本週的$HORO代幣。`,
    comeBackMonday: `下週一回來開始新的一週！`,
    connectWallet: `連接您的Suiet錢包以自動跟踪每日訪問並領取$HORO獎勵！`,
    connectSuietWallet: `連接Suiet錢包`,
    connectSuietWalletTitle: `連接Suiet錢包`,
    connectSuietPrompt: `連接您的Suiet錢包以自動跟踪每日訪問並通過加密安全領取$HORO獎勵！`,
    suietWalletSecure: `帶有消息簽名的安全錢包`,
    whySuiet: `為什麼選擇Suiet？`,
    suietBenefitSigning: `支持加密消息簽名`,
    suietBenefitSecurity: `增強NFT空投安全性`,
    suietBenefitFraud: `防止簽到欺詐`,
    suietBenefitCompatibility: `與$HORO功能最佳兼容`,
    dontHaveSuiet: `沒有Suiet錢包？`,
    downloadSuiet: `下載Suiet錢包 →`,
    useSuietForSigning: `請使用Suiet錢包進行安全消息簽名`,
    autoSigning: `正在自動簽署今日訪問... ✨`,
    transitioningToZodiac: `正在轉換到星座選擇...`,
    wallet: `錢包`,
    
    // Loading States
    connecting: `連接中...`,
    signing: `簽名中...`,
    loading: `加載中...`,
    
    // Testnet Education
    testnetDisclaimer: `🧪 此應用使用Sui測試網`,
    testnetExplainer: `測試網代幣沒有真實貨幣價值。這是一個安全的環境來學習和賺取虛擬$HORO代幣！`,
    learnMoreSuiet: `了解如何安裝Suiet錢包`,
    needHelp: `需要幫助？`,
    
    // Gas Management
    gasLow: `⛽ Gas餘額不足`,
    gasNeeded: `請向您的錢包添加測試網SUI進行交易`,
    getFreeGas: `打開測試網水龍頭`,
    gettingGas: `正在打開水龍頭...`,
    gasSuccess: `✅ 免費測試網SUI已添加到您的錢包！`,
    gasError: `❌ 打開水龍頭失敗。請手動訪問faucet.testnet.sui.io。`,
    gasBalance: `Gas餘額`,
    sufficientGas: `✅ 交易Gas充足`,
    
    // Footer
    about: `關於`,
    tokenomics: `代幣經濟`,
    help: `幫助`,
    reset: `重置`,
    
    // Claim Status Messages
    alreadyClaimedToday: `今日已領取！`,
    alreadyClaimedMessage: `您已獲得今日$HORO！明天再來。`,
    nextClaimAvailable: `下次領取時間：明天`,
    claimTodaysHoro: `🎁 領取今日$HORO`,
    missedDays: `錯過的天數`,
    completedDays: `完成的天數`,
    claimedAmountToday: `今日已領取{amount} $HORO！`,
    completed: `已完成`,
    missed: `已錯過`,
    available: `可用`,
    future: `未來`,
    
    // Network Status
    connected: `已連接`,
    connectionVerified: `Sui測試網連接已驗證`,
    refreshStatus: `刷新狀態`,
    
    // Days of the Week
    sunday: `週日`,
    monday: `週一`, 
    tuesday: `週二`,
    wednesday: `週三`,
    thursday: `週四`,
    friday: `週五`,
    saturday: `週六`,
    
    // Zodiac Signs
    aries: `牡羊座`,
    taurus: `金牛座`, 
    gemini: `雙子座`,
    cancer: `巨蟹座`,
    leo: `獅子座`,
    virgo: `處女座`,
    libra: `天秤座`,
    scorpio: `天蠍座`,
    sagittarius: `射手座`,
    capricorn: `摩羯座`,
    aquarius: `水瓶座`,
    pisces: `雙魚座`,
    
    // Chinese Zodiac
    rat: `鼠`,
    ox: `牛`,
    tiger: `虎`, 
    rabbit: `兔`,
    dragon: `龍`,
    snake: `蛇`,
    horse: `馬`,
    goat: `羊`,
    monkey: `猴`,
    rooster: `雞`,
    dog: `狗`,
    pig: `豬`,
    
    // Elements
    water: `水`,
    earth: `土`, 
    wood: `木`,
    fire: `火`,
    metal: `金`
  }
};

// Western Horoscopes with translations  
const $HOROSCOPES = {
  en: {
    aries: `The stars align for bold new beginnings. Your courage will be rewarded today.`,
    taurus: `Patience brings prosperity. Trust in your steady progress toward your goals.`, 
    gemini: `Communication flows freely today. Your words have the power to inspire others.`,
    cancer: `Emotional intuition guides you to hidden treasures. Trust your feelings.`,
    leo: `Your natural charisma shines bright. Leadership opportunities await your embrace.`,
    virgo: `Attention to detail reveals important insights. Your methodical approach pays off.`,
    libra: `Balance and harmony bring unexpected rewards. Seek partnerships that elevate you.`,
    scorpio: `Deep transformation begins today. Embrace the power of reinvention.`,
    sagittarius: `Adventure calls and fortune follows. Your optimism opens new doors.`,
    capricorn: `Steady climb toward success continues. Your discipline creates lasting value.`, 
    aquarius: `Innovation and originality set you apart. Your unique vision attracts abundance.`,
    pisces: `Intuitive gifts reveal profitable opportunities. Trust your psychic insights.`
  },
  es: {
    aries: `Las estrellas se alinean para nuevos comienzos audaces. Tu coraje será recompensado hoy.`,
    taurus: `La paciencia trae prosperidad. Confía en tu progreso constante hacia tus metas.`, 
    gemini: `La comunicación fluye libremente hoy. Tus palabras tienen el poder de inspirar a otros.`,
    cancer: `La intuición emocional te guía a tesoros ocultos. Confía en tus sentimientos.`,
    leo: `Tu carisma natural brilla intensamente. Las oportunidades de liderazgo esperan tu abrazo.`,
    virgo: `La atención al detalle revela perspectivas importantes. Tu enfoque metódico da frutos.`,
    libra: `El equilibrio y la armonía traen recompensas inesperadas. Busca asociaciones que te eleven.`,
    scorpio: `La transformación profunda comienza hoy. Abraza el poder de la reinvención.`,
    sagittarius: `La aventura llama y la fortuna sigue. Tu optimismo abre nuevas puertas.`,
    capricorn: `Continúa la escalada constante hacia el éxito. Tu disciplina crea valor duradero.`, 
    aquarius: `La innovación y originalidad te distinguen. Tu visión única atrae abundancia.`,
    pisces: `Los dones intuitivos revelan oportunidades rentables. Confía en tus percepciones psíquicas.`
  },
  zh: {
    aries: `星辰为大胆的新开始而排列。今天你的勇气将得到回报。`,
    taurus: `耐心带来繁荣。相信你朝着目标稳步前进。`, 
    gemini: `今天交流畅通无阻。你的话语有激励他人的力量。`,
    cancer: `情感直觉引导你找到隐藏的宝藏。相信你的感觉。`,
    leo: `你天生的魅力闪闪发光。领导机会等待着你的拥抱。`,
    virgo: `对细节的关注揭示了重要的洞察。你有条不紊的方法得到回报。`,
    libra: `平衡与和谐带来意想不到的回报。寻找能提升你的伙伴关系。`,
    scorpio: `深刻的转变今天开始。拥抱重新发明的力量。`,
    sagittarius: `冒险在召唤，财富随之而来。你的乐观打开新的大门。`,
    capricorn: `朝着成功的稳步攀登继续。你的纪律创造持久的价值。`, 
    aquarius: `创新和原创性让你与众不同。你独特的愿景吸引丰富。`,
    pisces: `直觉天赋揭示有利可图的机会。相信你的心理洞察。`
  },
  'zh-TR': {
    aries: `星辰為大膽的新開始而排列。今天你的勇氣將得到回報。`,
    taurus: `耐心帶來繁榮。相信你朝著目標穩步前進。`, 
    gemini: `今天交流暢通無阻。你的話語有激勵他人的力量。`,
    cancer: `情感直覺引導你找到隱藏的寶藏。相信你的感覺。`,
    leo: `你天生的魅力閃閃發光。領導機會等待著你的擁抱。`,
    virgo: `對細節的關注揭示了重要的洞察。你有條不紊的方法得到回報。`,
    libra: `平衡與和諧帶來意想不到的回報。尋找能提升你的夥伴關係。`,
    scorpio: `深刻的轉變今天開始。擁抱重新發明的力量。`,
    sagittarius: `冒險在召喚，財富隨之而來。你的樂觀打開新的大門。`,
    capricorn: `朝著成功的穩步攀登繼續。你的紀律創造持久的價值。`, 
    aquarius: `創新和原創性讓你與眾不同。你獨特的願景吸引豐富。`,
    pisces: `直覺天賦揭示有利可圖的機會。相信你的心理洞察。`
  },
  ru: {
    aries: `Звезды выстраиваются для смелых новых начинаний. Твоя храбрость будет вознаграждена сегодня.`,
    taurus: `Терпение приносит процветание. Доверься своему неуклонному движению к целям.`, 
    gemini: `Общение течет свободно сегодня. Твои слова имеют силу вдохновлять других.`,
    cancer: `Эмоциональная интуиция ведет тебя к скрытым сокровищам. Доверься своим чувствам.`,
    leo: `Твоя природная харизма ярко сияет. Возможности лидерства ждут твоих объятий.`,
    virgo: `Внимание к деталям раскрывает важные озарения. Твой методичный подход окупается.`,
    libra: `Баланс и гармония приносят неожиданные награды. Ищи партнерства, которые возвышают тебя.`,
    scorpio: `Глубокая трансформация начинается сегодня. Прими силу перерождения.`,
    sagittarius: `Приключения зовут, и удача следует. Твой оптимизм открывает новые двери.`,
    capricorn: `Неуклонное восхождение к успеху продолжается. Твоя дисциплина создает прочную ценность.`, 
    aquarius: `Инновации и оригинальность выделяют тебя. Твое уникальное видение привлекает изобилие.`,
    pisces: `Интуитивные дары раскрывают выгодные возможности. Доверься своим психическим озарениям.`
  },
  fr: {
    aries: `Les étoiles s'alignent pour de nouveaux débuts audacieux. Ton courage sera récompensé aujourd'hui.`,
    taurus: `La patience apporte la prospérité. Fais confiance à tes progrès constants vers tes objectifs.`, 
    gemini: `La communication coule librement aujourd'hui. Tes mots ont le pouvoir d'inspirer les autres.`,
    cancer: `L'intuition émotionnelle te guide vers des trésors cachés. Fais confiance à tes sentiments.`,
    leo: `Ton charisme naturel brille vivement. Les opportunités de leadership attendent ton étreinte.`,
    virgo: `L'attention aux détails révèle des aperçus importants. Ton approche méthodique porte ses fruits.`,
    libra: `L'équilibre et l'harmonie apportent des récompenses inattendues. Cherche des partenariats qui t'élèvent.`,
    scorpio: `Une transformation profonde commence aujourd'hui. Embrasse le pouvoir de la réinvention.`,
    sagittarius: `L'aventure appelle et la fortune suit. Ton optimisme ouvre de nouvelles portes.`,
    capricorn: `L'ascension constante vers le succès continue. Ta discipline crée une valeur durable.`, 
    aquarius: `L'innovation et l'originalité te distinguent. Ta vision unique attire l'abondance.`,
    pisces: `Les dons intuitifs révèlent des opportunités profitables. Fais confiance à tes aperçus psychiques.`
  }
};

// Chinese Horoscopes with translations
const CHINESE_$HOROSCOPES = {
  en: {
    rat: `Your quick wit and resourcefulness will lead to success today.`,
    ox: `Your strength and determination will help you overcome any obstacles.`,
    tiger: `Your natural leadership and courage will inspire others today.`,
    rabbit: `Your gentle nature and intuition will guide you to harmony.`,
    dragon: `Your powerful energy and charisma will attract good fortune.`,
    snake: `Your wisdom and insight will reveal hidden opportunities.`,
    horse: `Your energy and enthusiasm will drive you toward your goals.`,
    goat: `Your creativity and kindness will bring joy to those around you.`,
    monkey: `Your cleverness and adaptability will solve complex problems.`,
    rooster: `Your confidence and precision will lead to achievement.`,
    dog: `Your loyalty and honesty will strengthen important relationships.`,
    pig: `Your generosity and optimism will attract abundance.`
  },
  es: {
    rat: `Tu ingenio rápido y recursividad te llevarán al éxito hoy.`,
    ox: `Tu fuerza y determinación te ayudarán a superar cualquier obstáculo.`,
    tiger: `Tu liderazgo natural y coraje inspirarán a otros hoy.`,
    rabbit: `Tu naturaleza gentil e intuición te guiarán hacia la armonía.`,
    dragon: `Tu energía poderosa y carisma atraerán buena fortuna.`,
    snake: `Tu sabiduría y perspicacia revelarán oportunidades ocultas.`,
    horse: `Tu energía y entusiasmo te llevarán hacia tus metas.`,
    goat: `Tu creatividad y bondad traerán alegría a quienes te rodean.`,
    monkey: `Tu astucia y adaptabilidad resolverán problemas complejos.`,
    rooster: `Tu confianza y precisión te llevarán al logro.`,
    dog: `Tu lealtad y honestidad fortalecerán relaciones importantes.`,
    pig: `Tu generosidad y optimismo atraerán abundancia.`
  },
  zh: {
    rat: `你的机智和足智多谋今天将引领你走向成功。`,
    ox: `你的力量和决心将帮助你克服任何障碍。`,
    tiger: `你天生的领导力和勇气今天将激励他人。`,
    rabbit: `你温和的天性和直觉将引导你走向和谐。`,
    dragon: `你强大的能量和魅力将吸引好运。`,
    snake: `你的智慧和洞察力将揭示隐藏的机会。`,
    horse: `你的活力和热情将推动你朝着目标前进。`,
    goat: `你的创造力和善良将给周围的人带来快乐。`,
    monkey: `你的聪明和适应能力将解决复杂的问题。`,
    rooster: `你的自信和精确将引领你取得成就。`,
    dog: `你的忠诚和诚实将加强重要的关系。`,
    pig: `你的慷慨和乐观将吸引丰盛。`
  },
  'zh-TR': {
    rat: `你的機智和足智多謀今天將引領你走向成功。`,
    ox: `你的力量和決心將幫助你克服任何障礙。`,
    tiger: `你天生的領導力和勇氣今天將激勵他人。`,
    rabbit: `你溫和的天性和直覺將引導你走向和諧。`,
    dragon: `你強大的能量和魅力將吸引好運。`,
    snake: `你的智慧和洞察力將揭示隱藏的機會。`,
    horse: `你的活力和熱情將推動你朝著目標前進。`,
    goat: `你的創造力和善良將給周圍的人帶來快樂。`,
    monkey: `你的聰明和適應能力將解決複雜的問題。`,
    rooster: `你的自信和精確將引領你取得成就。`,
    dog: `你的忠誠和誠實將加強重要的關係。`,
    pig: `你的慷慨和樂觀將吸引豐盛。`
  },
  ru: {
    rat: `Твой быстрый ум и находчивость приведут к успеху сегодня.`,
    ox: `Твоя сила и решимость помогут преодолеть любые препятствия.`,
    tiger: `Твое природное лидерство и смелость вдохновят других сегодня.`,
    rabbit: `Твоя мягкая натура и интуиция приведут тебя к гармонии.`,
    dragon: `Твоя мощная энергия и харизма привлекут удачу.`,
    snake: `Твоя мудрость и проницательность раскроют скрытые возможности.`,
    horse: `Твоя энергия и энтузиазм продвинут тебя к целям.`,
    goat: `Твоя креативность и доброта принесут радость окружающим.`,
    monkey: `Твоя сообразительность и адаптивность решат сложные проблемы.`,
    rooster: `Твоя уверенность и точность приведут к достижениям.`,
    dog: `Твоя преданность и честность укрепят важные отношения.`,
    pig: `Твоя щедрость и оптимизм привлекут изобилие.`
  },
  fr: {
    rat: `Ton esprit vif et ta débrouillardise mèneront au succès aujourd'hui.`,
    ox: `Ta force et ta détermination t'aideront à surmonter tous les obstacles.`,
    tiger: `Ton leadership naturel et ton courage inspireront les autres aujourd'hui.`,
    rabbit: `Ta nature douce et ton intuition te guideront vers l'harmonie.`,
    dragon: `Ton énergie puissante et ton charisme attireront la bonne fortune.`,
    snake: `Ta sagesse et ton aperçu révéleront des opportunités cachées.`,
    horse: `Ton énergie et ton enthousiasme te pousseront vers tes objectifs.`,
    goat: `Ta créativité et ta gentillesse apporteront de la joie à ton entourage.`,
    monkey: `Ton intelligence et ton adaptabilité résoudront des problèmes complexes.`,
    rooster: `Ta confiance et ta précision mèneront à la réussite.`,
    dog: `Ta loyauté et ton honnêteté renforceront les relations importantes.`,
    pig: `Ta générosité et ton optimisme attireront l'abondance.`
  }
};

// Modal translations
const MODAL_TRANSLATIONS = {
  en: {
    aboutHoro: `⁉️ About $HORO`,
    whatIsHoro: `🧭 What`,
    whatIsHoroText: `$HORO is a Web3 horoscope dApp built on the Sui testnet. Users receive free $HORO tokens for checking their horoscope — no purchases, no gas fees, no crypto knowledge required.\n\nThis is a fun and educational token with no financial utility or speculative value. Just read your stars, sign your wallet, and enjoy the beginning of a magical, star-powered Web3 journey!`,
    whereIsHoro: `🌍 Where`, 
    whereIsHoroText: `$HORO lives on horocoin.com and runs entirely on the Sui testnet. Tokens are distributed through our dApp and used only in our Web3 learning ecosystem.`,
    whenIsHoro: `📅 When`,
    whenIsHoroText: `$HORO runs continuously with:\n• Daily check-ins: Read your horoscope and connect your wallet.\n• Instant rewards: Claim your $HORO tokens immediately when you check in.\n• Streak bonuses: Longer daily streaks earn bigger rewards.`,
    whatsNext: `🔮 What's Next`,
    whatsNextText: `We're continuously expanding $HORO to include more astrological traditions from around the world. Our roadmap includes adding Vedic astrology, Mayan astrology, Celtic astrology, and many other cultural zodiac systems to ensure all traditions are properly represented and honored.`,
    whyHoro: `🤔 Why`,
    whyHoroText: `$HORO exists to introduce astrology lovers and Web2 users to the basics of Web3 in a fun, low-pressure way. No trading, no volatility, just habit-forming, blockchain-powered cosmic interplay.`,
    whoHoro: `🧑‍💻 Who`,
    whoHoroText: `$HORO is operated by SVAC R&D, the Research and Development branch of the Silicon Valley Anime Club. We thank you for your earnest interest and honest participation!`,
    
    // Tokenomics
    tokenomics: `💰 $HORO Tokenomics`,
    totalSupplyTitle: `📦 Total Supply`,
    totalSupply: `10T $HORO`,
    fixedSupply: `Fixed total supply. Minted once, no inflation, no reminting.`,
    allocationBreakdown: `🧮 Allocation Breakdown`,
    dailyClaims: `Daily Claims`,
    ecosystemRewards: `Ecosystem Rewards`,
    socialEngagement: `Social Engagement`,
    developerInfraSupport: `Developer/Infra Support`,
    futureSurprises: `Future Surprises`,
    contractAddress: `Contract Address`,
    dailyClaimsAmount: `9T tokens`,
    ecosystemRewardsAmount: `500B tokens`,
    socialEngagementAmount: `300B tokens`, 
    developerInfraSupportAmount: `100B tokens`,
    futureSurprisesAmount: `100B tokens`,
    totalSupplyAmount: `10T tokens`,
    
    // Help
    help: `Help`,
    helpTitle: `💡 Help & Support`,
    switchToTestnet: `🔄 Switch Suiet to Testnet`,
    switchToTestnetText: `To use this app, your Suiet wallet must be connected to Sui Testnet:\n\n1. Open your Suiet wallet extension\n2. Click the network dropdown (usually shows 'Mainnet')\n3. Select 'Testnet' from the list\n4. Refresh this page and reconnect your wallet\n\nIf you don't see Testnet option, make sure you have the latest version of Suiet wallet.`,
    needTestnetSui: `💧 Need Testnet SUI?`,
    needTestnetSuiText: `Testnet SUI tokens are free and needed for gas fees:\n\n1. Copy your wallet address from Suiet\n2. Visit: faucet.testnet.sui.io\n3. Paste your address and request SUI\n4. Wait 30 seconds for tokens to arrive\n\nYou only need to do this once - a small amount lasts for many transactions.`,
    troubleshooting: `🔧 Troubleshooting`,
    troubleshootingText: `Common issues and solutions:\n\n• Wallet won't connect: Make sure Suiet is installed and unlocked\n• Claims not working: Check you're on Testnet and have gas\n• Progress not showing: Refresh page and reconnect wallet\n• Missing tokens: Verify network and check faucet\n\nStill having trouble? This is a testnet app for learning - no real money involved!`
  },
  es: {
    aboutHoro: `❓ Acerca de $HORO`,
    whatIsHoro: `🧭 Qué`,
    whatIsHoroText: `$HORO es una dApp de horóscopo Web3 construida en la testnet de Sui. Los usuarios reciben tokens $HORO gratuitos por consultar su horóscopo — sin compras, sin tarifas de gas, sin conocimiento de cripto requerido.\n\nEste es un token divertido y educativo sin utilidad financiera o valor especulativo. Solo lee tus estrellas, firma con tu billetera y disfruta de un viaje mágico Web3.`,
    whereIsHoro: `🌍 Dónde`,
    whereIsHoroText: `$HORO vive en horocoin.com y funciona completamente en la testnet de Sui. Los tokens se distribuyen a través de nuestra dApp y se usan solo en nuestro ecosistema de aprendizaje Web3.`,
    whenIsHoro: `📅 Cuándo`,
    whenIsHoroText: `$HORO funciona continuamente con:\n• Registros diarios: Lee tu horóscopo y conecta tu billetera.\n• Recompensas instantáneas: Reclama tus tokens $HORO inmediatamente al registrarte.\n• Bonos de racha: Las rachas diarias más largas ganan mayores recompensas.`,
    whatsNext: `🔮 Qué Sigue`,
    whatsNextText: `Estamos expandiendo continuamente $HORO para incluir más tradiciones astrológicas de todo el mundo. Nuestra hoja de ruta incluye agregar astrología védica, astrología maya, astrología celta y muchos otros sistemas zodiacales culturales para asegurar que todas las tradiciones estén adecuadamente representadas y honradas.`,
    whyHoro: `🤔 Por qué`,
    whyHoroText: `$HORO existe para introducir a los amantes de la astrología y usuarios Web2 a los conceptos básicos de Web3 de una manera divertida y sin presión. Sin comercio, sin volatilidad, solo juego cósmico que forma hábitos.`,
    whoHoro: `🧑‍💻 Quién`,
    whoHoroText: `$HORO es desarrollado por el Silicon Valley Anime Club 🌐 svac.com Creamos interfaces creativas entre la cultura fandom y la experimentación Web3.`,
    
    // Tokenomics
    tokenomics: `💰 Tokenómica de $HORO`,
    totalSupplyTitle: `📦 Suministro Total`,
    totalSupply: `10T $HORO`,
    fixedSupply: `Suministro total fijo. Acuñado una vez, sin inflación, sin re-acuñación.`,
    allocationBreakdown: `🧮 Desglose de Asignación`,
    dailyClaims: `Reclamos Diarios`,
    ecosystemRewards: `Recompensas del Ecosistema`,
    socialEngagement: `Participación Social`,
    developerInfraSupport: `Soporte de Desarrollador/Infraestructura`,
    futureSurprises: `Sorpresas Futuras`,
    contractAddress: `Dirección del Contrato`,
    dailyClaimsAmount: `9T tokens`,
    ecosystemRewardsAmount: `500B tokens`,
    socialEngagementAmount: `300B tokens`,
    developerInfraSupportAmount: `100B tokens`, 
    futureSurprisesAmount: `100B tokens`,
    totalSupplyAmount: `10T tokens`,
    
    // Help
    help: `Ayuda`,
    helpTitle: `💡 Ayuda y Soporte`,
    switchToTestnet: `🔄 Cambiar Suiet a Testnet`,
    switchToTestnetText: `Para usar esta app, tu billetera Suiet debe estar conectada a Sui Testnet:\n\n1. Abre tu extensión de billetera Suiet\n2. Haz clic en el menú de red (normalmente muestra 'Mainnet')\n3. Selecciona 'Testnet' de la lista\n4. Actualiza esta página y reconecta tu billetera\n\nSi no ves la opción Testnet, asegúrate de tener la última versión de Suiet.`,
    needTestnetSui: `💧 ¿Necesitas SUI de Testnet?`,
    needTestnetSuiText: `Los tokens SUI de testnet son gratuitos y necesarios para las tarifas de gas:\n\n1. Copia tu dirección de billetera desde Suiet\n2. Visita: faucet.testnet.sui.io\n3. Pega tu dirección y solicita SUI\n4. Espera 30 segundos para que lleguen los tokens\n\nSolo necesitas hacer esto una vez - una pequeña cantidad dura para muchas transacciones.`,
    troubleshooting: `🔧 Solución de Problemas`,
    troubleshootingText: `Problemas comunes y soluciones:\n\n• La billetera no se conecta: Asegúrate de que Suiet esté instalada y desbloqueada\n• Los reclamos no funcionan: Verifica que estés en Testnet y tengas gas\n• El progreso no se muestra: Actualiza la página y reconecta la billetera\n• Tokens faltantes: Verifica la red y revisa el faucet\n\n¿Sigues teniendo problemas? Esta es una app de testnet para aprender - ¡no hay dinero real involucrado!`
  },
  zh: {
    aboutHoro: `❓ 关于$HORO`,
    whatIsHoro: `🧭 什么`,
    whatIsHoroText: `$HORO是建立在Sui测试网上的Web3星座体验。用户通过查看星座获得免费的$HORO代币——无需购买、无gas费用、无需加密货币知识。\n\n这是一个有趣的教育代币，没有金融用途或投机价值。只需阅读你的星座，签署你的钱包，享受神奇的Web3之旅。`,
    whereIsHoro: `🌍 在哪里`,
    whereIsHoroText: `$HORO存在于horocoin.com，完全在Sui测试网上运行。代币通过我们的dApp分发，仅在我们的Web3学习生态系统中使用。`,
    whenIsHoro: `📅 什么时候`,
    whenIsHoroText: `$HORO持续运行：\n• 每日签到：阅读你的星座并连接你的钱包。\n• 即时奖励：签到时立即领取你的$HORO代币。\n• 连续奖励：更长的每日连续天数获得更大的奖励。`,
    whatsNext: `🔮 接下来`,
    whatsNextText: `我们正在不断扩展$HORO，以包括来自世界各地的更多占星传统。我们的路线图包括增加吠陀占星术、玛雅占星术、凯尔特占星术和许多其他文化星座系统，以确保所有传统都得到适当的代表和尊重。`,
    whyHoro: `🤔 为什么`,
    whyHoroText: `$HORO的存在是为了以有趣、低压力的方式向星座爱好者和Web2用户介绍Web3基础知识。没有交易，没有波动性，只是形成习惯的宇宙游戏。`,
    whoHoro: `🧑‍💻 谁`,
    whoHoroText: `$HORO由硅谷动漫俱乐部开发 🌐 svac.com 我们在粉丝文化和Web3实验之间创造创意界面。`,
    
    // Tokenomics
    tokenomics: `💰 $HORO代币经济学`,
    totalSupplyTitle: `📦 总供应量`,
    totalSupply: `10万亿 $HORO`,
    fixedSupply: `固定总供应量。一次铸造，无通胀，无重新铸造。`,
    allocationBreakdown: `🧮 分配明细`,
    dailyClaims: `每日领取`,
    ecosystemRewards: `生态系统奖励`,
    socialEngagement: `社交参与`,
    developerInfraSupport: `开发者/基础设施支持`,
    futureSurprises: `未来惊喜`,
    contractAddress: `合约地址`,
    dailyClaimsAmount: `9万亿代币`,
    ecosystemRewardsAmount: `5000亿代币`,
    socialEngagementAmount: `3000亿代币`,
    developerInfraSupportAmount: `1000亿代币`,
    futureSurprisesAmount: `1000亿代币`, 
    totalSupplyAmount: `10万亿代币`,
    
    // Help
    help: `帮助`,
    helpTitle: `💡 帮助与支持`,
    switchToTestnet: `🔄 将Suiet切换到测试网`,
    switchToTestnetText: `要使用此应用，您的Suiet钱包必须连接到Sui测试网：\n\n1. 打开您的Suiet钱包扩展\n2. 点击网络下拉菜单（通常显示"主网"）\n3. 从列表中选择"测试网"\n4. 刷新此页面并重新连接您的钱包\n\n如果您没有看到测试网选项，请确保您有最新版本的Suiet钱包。`,
    needTestnetSui: `💧 需要测试网SUI？`,
    needTestnetSuiText: `测试网SUI代币是免费的，gas费用需要：\n\n1. 从Suiet复制您的钱包地址\n2. 访问：faucet.testnet.sui.io\n3. 粘贴您的地址并请求SUI\n4. 等待30秒让代币到达\n\n您只需要做一次 - 少量就足够进行许多交易。`,
    troubleshooting: `🔧 故障排除`,
    troubleshootingText: `常见问题和解决方案：\n\n• 钱包无法连接：确保Suiet已安装并解锁\n• 领取不工作：检查您在测试网上并有gas\n• 进度不显示：刷新页面并重新连接钱包\n• 代币丢失：验证网络并检查水龙头\n\n仍有问题？这是一个用于学习的测试网应用 - 没有真钱参与！`
  },
  'zh-TR': {
    aboutHoro: `❓ 關於$HORO`,
    whatIsHoro: `🧭 什麼`,
    whatIsHoroText: `$HORO是建立在Sui測試網上的Web3星座體驗。用戶通過查看星座獲得免費的$HORO代幣——無需購買、無gas費用、無需加密貨幣知識。\n\n這是一個有趣的教育代幣，沒有金融用途或投機價值。只需閱讀你的星座，簽署你的錢包，享受神奇的Web3之旅。`,
    whereIsHoro: `🌍 在哪裡`,
    whereIsHoroText: `$HORO存在於horocoin.com，完全在Sui測試網上運行。代幣通過我們的dApp分發，僅在我們的Web3學習生態系統中使用。`,
    whenIsHoro: `📅 什麼時候`,
    whenIsHoroText: `$HORO持續運行：\n• 每日簽到：閱讀你的星座並連接你的錢包。\n• 即時獎勵：簽到時立即領取你的$HORO代幣。\n• 連續獎勵：更長的每日連續天數獲得更大的獎勵。`,
    whatsNext: `🔮 接下來`,
    whatsNextText: `我們正在不斷擴展$HORO，以包括來自世界各地的更多占星傳統。我們的路線圖包括增加吠陀占星術、瑪雅占星術、凱爾特占星術和許多其他文化星座系統，以確保所有傳統都得到適當的代表和尊重。`,
    whyHoro: `🤔 為什麼`,
    whyHoroText: `$HORO的存在是為了以有趣、低壓力的方式向星座愛好者和Web2用戶介紹Web3基礎知識。沒有交易，沒有波動性，只是形成習慣的宇宙遊戲。`,
    whoHoro: `🧑‍💻 誰`,
    whoHoroText: `$HORO由矽谷動漫俱樂部開發 🌐 svac.com 我們在粉絲文化和Web3實驗之間創造創意界面。`,
    
    // Tokenomics
    tokenomics: `💰 $HORO代幣經濟學`,
    totalSupplyTitle: `📦 總供應量`,
    totalSupply: `10兆 $HORO`,
    fixedSupply: `固定總供應量。一次鑄造，無通脹，無重新鑄造。`,
    allocationBreakdown: `🧮 分配明細`,
    dailyClaims: `每日領取`,
    ecosystemRewards: `生態系統獎勵`,
    socialEngagement: `社交參與`,
    developerInfraSupport: `開發者/基礎設施支持`,
    futureSurprises: `未來驚喜`,
    contractAddress: `合約地址`,
    dailyClaimsAmount: `9兆代幣`,
    ecosystemRewardsAmount: `5000億代幣`,
    socialEngagementAmount: `3000億代幣`,
    developerInfraSupportAmount: `1000億代幣`,
    futureSurprisesAmount: `1000億代幣`,
    totalSupplyAmount: `10兆代幣`,
    
    // Help
    help: `幫助`,
    helpTitle: `💡 幫助與支援`,
    switchToTestnet: `🔄 將Suiet切換到測試網`,
    switchToTestnetText: `要使用此應用，您的Suiet錢包必須連接到Sui測試網：\n\n1. 打開您的Suiet錢包擴展\n2. 點擊網路下拉選單（通常顯示「主網」）\n3. 從列表中選擇「測試網」\n4. 刷新此頁面並重新連接您的錢包\n\n如果您沒有看到測試網選項，請確保您有最新版本的Suiet錢包。`,
    needTestnetSui: `💧 需要測試網SUI？`,
    needTestnetSuiText: `測試網SUI代幣是免費的，gas費用需要：\n\n1. 從Suiet複製您的錢包地址\n2. 訪問：faucet.testnet.sui.io\n3. 貼上您的地址並請求SUI\n4. 等待30秒讓代幣到達\n\n您只需要做一次 - 少量就足夠進行許多交易。`,
    troubleshooting: `🔧 故障排除`,
    troubleshootingText: `常見問題和解決方案：\n\n• 錢包無法連接：確保Suiet已安裝並解鎖\n• 領取不工作：檢查您在測試網上並有gas\n• 進度不顯示：刷新頁面並重新連接錢包\n• 代幣遺失：驗證網路並檢查水龍頭\n\n仍有問題？這是一個用於學習的測試網應用 - 沒有真錢參與！`
  },
  ru: {
    aboutHoro: `❓ О $HORO`,
    whatIsHoro: `🧭 Что`,
    whatIsHoroText: `$HORO — это Web3-опыт гороскопов, построенный на тестнете Sui. Пользователи получают бесплатные токены $HORO за проверку своего гороскопа — никаких покупок, никаких комиссий за газ, никаких знаний о криптовалютах не требуется.\n\nЭто веселый и образовательный токен без финансовой полезности или спекулятивной ценности. Просто читайте свои звезды, подписывайтесь кошельком и наслаждайтесь магическим Web3-путешествием.`,
    whereIsHoro: `🌍 Где`,
    whereIsHoroText: `$HORO живет на horocoin.com и работает полностью на тестнете Sui. Токены распространяются через наше dApp и используются только в нашей экосистеме обучения Web3.`,
    whenIsHoro: `📅 Когда`,
    whenIsHoroText: `$HORO работает непрерывно с:\n• Ежедневные отметки: Читайте свой гороскоп и подключайте кошелек.\n• Мгновенные награды: Получайте токены $HORO сразу при отметке.\n• Бонусы за серии: Более длинные ежедневные серии дают большие награды.`,
    whatsNext: `🔮 Что Дальше`,
    whatsNextText: `Мы постоянно расширяем $HORO, чтобы включить больше астрологических традиций со всего мира. Наша дорожная карта включает добавление ведической астрологии, астрологии майя, кельтской астрологии и многих других культурных зодиакальных систем, чтобы обеспечить надлежащее представление и уважение всех традиций.`,
    whyHoro: `🤔 Почему`,
    whyHoroText: `$HORO существует для того, чтобы познакомить любителей астрологии и пользователей Web2 с основами Web3 веселым, непринужденным способом. Никакой торговли, никакой волатильности, только формирующая привычки космическая игра.`,
    whoHoro: `🧑‍💻 Кто`,
    whoHoroText: `$HORO разработан Клубом аниме Силиконовой долины 🌐 svac.com Мы создаем творческие интерфейсы между фанатской культурой и Web3-экспериментами.`,
    
    // Tokenomics
    tokenomics: `💰 Токеномика $HORO`,
    totalSupplyTitle: `📦 Общее Предложение`,
    totalSupply: `10трлн $HORO`,
    fixedSupply: `Фиксированное общее предложение. Отчеканено один раз, без инфляции, без перечеканки.`,
    allocationBreakdown: `🧮 Разбивка Распределения`,
    dailyClaims: `Ежедневные Претензии`,
    ecosystemRewards: `Награды Экосистемы`,
    socialEngagement: `Социальное Участие`,
    developerInfraSupport: `Поддержка Разработчиков/Инфраструктуры`,
    futureSurprises: `Будущие Сюрпризы`,
    contractAddress: `Адрес Контракта`,
    dailyClaimsAmount: `9трлн токенов`,
    ecosystemRewardsAmount: `500млрд токенов`, 
    socialEngagementAmount: `300млрд токенов`,
    developerInfraSupportAmount: `100млрд токенов`,
    futureSurprisesAmount: `100млрд токенов`,
    totalSupplyAmount: `10трлн токенов`,
    
    // Help
    help: `Помощь`,
    helpTitle: `💡 Помощь и Поддержка`,
    switchToTestnet: `🔄 Переключить Suiet на Тестнет`,
    switchToTestnetText: `Для использования этого приложения ваш кошелек Suiet должен быть подключен к Sui Testnet:\n\n1. Откройте расширение кошелька Suiet\n2. Нажмите на выпадающее меню сети (обычно показывает 'Mainnet')\n3. Выберите 'Testnet' из списка\n4. Обновите эту страницу и переподключите кошелек\n\nЕсли вы не видите опцию Testnet, убедитесь, что у вас последняя версия кошелька Suiet.`,
    needTestnetSui: `💧 Нужен Testnet SUI?`,
    needTestnetSuiText: `Токены Testnet SUI бесплатны и нужны для комиссий за газ:\n\n1. Скопируйте адрес вашего кошелька из Suiet\n2. Посетите: faucet.testnet.sui.io\n3. Вставьте ваш адрес и запросите SUI\n4. Подождите 30 секунд, пока токены прибудут\n\nВам нужно сделать это только один раз - небольшого количества хватает на много транзакций.`,
    troubleshooting: `🔧 Устранение Неполадок`,
    troubleshootingText: `Частые проблемы и решения:\n\n• Кошелек не подключается: Убедитесь, что Suiet установлен и разблокирован\n• Требования не работают: Проверьте, что вы в Testnet и у вас есть газ\n• Прогресс не отображается: Обновите страницу и переподключите кошелек\n• Отсутствующие токены: Проверьте сеть и краник\n\nВсе еще проблемы? Это приложение testnet для обучения - никаких реальных денег не задействовано!`
  },
  fr: {
    aboutHoro: `❓ À propos de $HORO`,
    whatIsHoro: `🧭 Quoi`,
    whatIsHoroText: `$HORO est une dApp d'horoscope Web3 construite sur le testnet Sui. Les utilisateurs reçoivent des tokens $HORO gratuits pour consulter leur horoscope — aucun achat, aucun frais de gas, aucune connaissance crypto requise.\n\nC'est un token amusant et éducatif sans utilité financière ou valeur spéculative. Lisez simplement vos étoiles, signez avec votre portefeuille et profitez d'un voyage Web3 magique.`,
    whereIsHoro: `🌍 Où`,
    whereIsHoroText: `$HORO vit sur horocoin.com et fonctionne entièrement sur le testnet Sui. Les tokens sont distribués via notre dApp et utilisés uniquement dans notre écosystème d'apprentissage Web3.`,
    whenIsHoro: `📅 Quand`,
    whenIsHoroText: `$HORO fonctionne en continu avec :\n• Enregistrements quotidiens : Lisez votre horoscope et connectez votre portefeuille.\n• Récompenses instantanées : Réclamez vos tokens $HORO immédiatement lors de l'enregistrement.\n• Bonus de série : Des séries quotidiennes plus longues donnent de plus grandes récompenses.`,
    whatsNext: `🔮 Et Ensuite`,
    whatsNextText: `Nous élargissons continuellement $HORO pour inclure plus de traditions astrologiques du monde entier. Notre feuille de route comprend l'ajout de l'astrologie védique, l'astrologie maya, l'astrologie celtique et de nombreux autres systèmes zodiacaux culturels pour s'assurer que toutes les traditions sont correctement représentées et honorées.`,
    whyHoro: `🤔 Pourquoi`,
    whyHoroText: `$HORO existe pour introduire les amateurs d'astrologie et les utilisateurs Web2 aux bases du Web3 de manière amusante et sans pression. Pas de trading, pas de volatilité, juste un jeu cosmique formant des habitudes.`,
    whoHoro: `🧑‍💻 Qui`,
    whoHoroText: `$HORO est développé par le Silicon Valley Anime Club 🌐 svac.com Nous créons des interfaces créatives entre la culture fandom et l'expérimentation Web3.`,
    
    // Tokenomics
    tokenomics: `💰 Tokenomique $HORO`,
    totalSupplyTitle: `📦 Offre Totale`,
    totalSupply: `10T $HORO`,
    fixedSupply: `Offre totale fixe. Frappé une fois, pas d'inflation, pas de re-frappe.`,
    allocationBreakdown: `🧮 Répartition de l'Allocation`,
    dailyClaims: `Réclamations Quotidiennes`,
    ecosystemRewards: `Récompenses de l'Écosystème`,
    socialEngagement: `Engagement Social`,
    developerInfraSupport: `Support Développeur/Infrastructure`,
    futureSurprises: `Surprises Futures`,
    contractAddress: `Adresse du Contrat`,
    dailyClaimsAmount: `9T tokens`,
    ecosystemRewardsAmount: `500B tokens`,
    socialEngagementAmount: `300B tokens`,
    developerInfraSupportAmount: `100B tokens`,
    futureSurprisesAmount: `100B tokens`, 
    totalSupplyAmount: `10T tokens`,
    
    // Help
    help: `Aide`,
    helpTitle: `💡 Aide et Support`,
    switchToTestnet: `🔄 Changer Suiet vers Testnet`,
    switchToTestnetText: `Pour utiliser cette app, votre portefeuille Suiet doit être connecté au Sui Testnet :\n\n1. Ouvrez votre extension de portefeuille Suiet\n2. Cliquez sur le menu déroulant de réseau (affiche généralement 'Mainnet')\n3. Sélectionnez 'Testnet' dans la liste\n4. Actualisez cette page et reconnectez votre portefeuille\n\nSi vous ne voyez pas l'option Testnet, assurez-vous d'avoir la dernière version du portefeuille Suiet.`,
    needTestnetSui: `💧 Besoin de SUI Testnet ?`,
    needTestnetSuiText: `Les tokens SUI testnet sont gratuits et nécessaires pour les frais de gas :\n\n1. Copiez l'adresse de votre portefeuille depuis Suiet\n2. Visitez : faucet.testnet.sui.io\n3. Collez votre adresse et demandez SUI\n4. Attendez 30 secondes que les tokens arrivent\n\nVous n'avez besoin de le faire qu'une fois - une petite quantité suffit pour de nombreuses transactions.`,
    troubleshooting: `🔧 Dépannage`,
    troubleshootingText: `Problèmes courants et solutions :\n\n• Le portefeuille ne se connecte pas : Assurez-vous que Suiet est installé et déverrouillé\n• Les réclamations ne fonctionnent pas : Vérifiez que vous êtes sur Testnet et avez du gas\n• Le progrès ne s'affiche pas : Actualisez la page et reconnectez le portefeuille\n• Tokens manquants : Vérifiez le réseau et le robinet\n\nToujours des problèmes ? C'est une app testnet pour apprendre - aucun vrai argent impliqué !`
  }
};


// Simple Network Detection - for display only, not blocking
const determineNetwork = (wallet) => {
  if (!wallet.connected || !wallet.chain) {
    return { network: 'unknown', status: 'disconnected' };
  }

  const chain = wallet.chain;
  console.log('🔍 Chain info:', chain);

  // Check chain name first
  if (chain.name) {
    const chainName = chain.name.toLowerCase();
    if (chainName.includes('mainnet')) {
      return { network: 'mainnet', status: 'detected', source: 'chain.name' };
    } else if (chainName.includes('testnet')) {
      return { network: 'testnet', status: 'detected', source: 'chain.name' };
    }
  }

  // Check RPC URL if available
  if (chain.rpcUrl) {
    const rpcUrl = chain.rpcUrl.toLowerCase();
    if (rpcUrl.includes('mainnet')) {
      return { network: 'mainnet', status: 'detected', source: 'rpcUrl' };
    } else if (rpcUrl.includes('testnet')) {
      return { network: 'testnet', status: 'detected', source: 'rpcUrl' };
    }
  }

  // Check chain ID
  if (chain.id) {
    const chainId = chain.id.toLowerCase();
    if (chainId.includes('mainnet')) {
      return { network: 'mainnet', status: 'detected', source: 'chainId' };
    } else if (chainId.includes('testnet')) {
      return { network: 'testnet', status: 'detected', source: 'chainId' };
    }
  }

  // Unknown network - just show warning
  return { network: 'unknown', status: 'unknown_network', source: 'metadata_unclear' };
};

// SVAC Static Logo Component
const StaticLogo = ({ size = "normal" }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "big": return "svac-logo-big";
      case "small": return "svac-logo-small";
      default: return "";
    }
  };

  return (
    <>
      <style>{`
        .svac-logo {
          transform: scale(1, 0.95);
          margin: 0;
          font-weight: 100;
          font-family: "Adam", -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
        .svac-sv { color: #ffd86b; }
        .svac-ac { color: #fefefe; }
        .svac-v { letter-spacing: -0.175em; }
        .svac-logo-small { font-size: 1.5em; }
      `}</style>
      
        <a href="https://svac.com" target="_blank">
          <h2 className={`svac-logo ${getSizeClasses()}`}>
            <span className="svac-sv">S<span className="svac-v">V</span></span>
            <span className="svac-ac">A<span className="svac-c">C</span></span>
          </h2>
        </a>
    </>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-red-900/30 rounded-xl p-6 border border-red-500/30">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong</h2>
              <p className="text-gray-300 mb-6">The app encountered an unexpected error. Please refresh the page to try again.</p>
              <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading Spinner Component
const LoadingSpinner = ({ size = "h-5 w-5" }) => (
  <div className={`animate-spin rounded-full ${size} border-2 border-white border-t-transparent`}></div>
);

// Gas Management Component
const GasManager = ({ wallet, suiClient, t }) => {
  const [gasBalance, setGasBalance] = useState(null);
  const [isRequestingGas, setIsRequestingGas] = useState(false);
  const [gasStatus, setGasStatus] = useState('checking');

  const MIN_GAS_BALANCE = 50_000_000;

  const checkGasBalance = async () => {
    if (!wallet.connected || !wallet.address) return;
    
    try {
      const balance = await suiClient.getBalance({
        owner: wallet.address,
        coinType: '0x2::sui::SUI'
      });
      
      const totalBalance = parseInt(balance.totalBalance);
      setGasBalance(totalBalance);
      setGasStatus(totalBalance >= MIN_GAS_BALANCE ? 'sufficient' : 'low');
    } catch (error) {
      console.error('Failed to check gas balance:', error);
      setGasStatus('low');
    }
  };

  const requestTestnetGas = async () => {
    if (!wallet.address || isRequestingGas) return;
    
    setIsRequestingGas(true);
    
    try {
      const faucetUrl = `https://faucet.testnet.sui.io/`;
      window.open(faucetUrl, '_blank');
      
      alert(`🚰 Testnet Faucet opened in new tab!\n\n📋 Your address: ${wallet.address}\n\n1. Please paste your address in the faucet\n2. Please click "Request SUI"\n3. Please come back here and try again\n\n(This takes ~30 seconds)`);
      
      setTimeout(() => {
        checkGasBalance();
        setIsRequestingGas(false);
      }, 5000);
      
    } catch (error) {
      console.error('Failed to open faucet:', error);
      alert(t('gasError') || 'Failed to open faucet');
      setIsRequestingGas(false);
    }
  };

  const formatSuiAmount = (amount) => {
    if (!amount) return '0';
    return (amount / 1_000_000_000).toFixed(4);
  };

  React.useEffect(() => {
    if (wallet.connected && wallet.address) {
      checkGasBalance();
    } else {
      setGasBalance(null);
      setGasStatus('checking');
    }
  }, [wallet.connected, wallet.address]);

  if (!wallet.connected) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">{t('gasBalance') || 'Gas Balance'}:</span>
        <span className={gasStatus === 'sufficient' ? 'text-green-400' : 'text-yellow-400'}>
          {gasBalance !== null ? `${formatSuiAmount(gasBalance)} SUI` : 'Loading...'}
        </span>
      </div>

      {gasStatus === 'low' && (
        <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-400/30">
          <div className="text-center space-y-3">
            <p className="text-yellow-300 font-semibold text-sm">{t('gasLow') || '⛽ Low Gas Balance'}</p>
            <p className="text-yellow-200 text-xs">{t('gasNeeded') || 'Please add testnet SUI to your wallet for transactions'}</p>
            <button
              onClick={requestTestnetGas}
              disabled={isRequestingGas}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2 mx-auto"
            >
              {isRequestingGas ? (
                <>
                  <LoadingSpinner size="h-4 w-4" />
                  <span>{t('gettingGas') || 'Opening faucet...'}</span>
                </>
              ) : (
                <span>{t('getFreeGas') || 'Open Testnet Faucet'}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {gasStatus === 'sufficient' && (
        <div className="text-center">
          <p className="text-green-400 text-xs">{t('sufficientGas') || '✅ Sufficient gas for transactions'}</p>
        </div>
      )}
    </div>
  );
};

// SUI Blockchain Time Management
const useSuiTime = () => {
  const [suiTimeData, setSuiTimeData] = useState({
    timestamp: null,
    dayOfWeek: null,
    currentDay: null,
    weekNumber: null,
    year: null,
    isLoaded: false,
    error: null
  });

  // Get SUI blockchain time directly from Clock object
  const getSuiTime = async () => {
    try {
      console.log('🕒 Fetching SUI blockchain time...');
      
      // Get the SUI Clock object to read current timestamp
      const clockObject = await suiClient.getObject({
        id: '0x6', // SUI Clock singleton object
        options: { showContent: true }
      });
      
      console.log('🕒 Clock object:', clockObject);
      
      if (clockObject.data?.content?.fields?.timestamp_ms) {
        const timestampMs = parseInt(clockObject.data.content.fields.timestamp_ms);
        const timestampSeconds = Math.floor(timestampMs / 1000);
        
        // Calculate day of week using SUI timestamp (same as contract logic)
        // SUI epoch started on a Thursday (day 4), so we adjust accordingly
        const daysSinceEpoch = Math.floor(timestampSeconds / 86400);
        const dayOfWeek = (daysSinceEpoch + 4) % 7; // +4 because epoch started on Thursday
        
        // Calculate week number and year
        const suiDate = new Date(timestampMs);
        const weekNumber = Math.floor(daysSinceEpoch / 7);
        const year = suiDate.getUTCFullYear();
        
        console.log('🕒 SUI time calculated:', {
          timestampMs,
          timestampSeconds,
          daysSinceEpoch,
          dayOfWeek,
          weekNumber,
          year,
          humanReadable: suiDate.toISOString()
        });
        
        setSuiTimeData({
          timestamp: timestampMs,
          dayOfWeek,
          currentDay: daysSinceEpoch,
          weekNumber,
          year,
          isLoaded: true,
          error: null
        });
        
        return {
          timestamp: timestampMs,
          dayOfWeek,
          currentDay: daysSinceEpoch,
          weekNumber,
          year
        };
      } else {
        throw new Error('Unable to read timestamp from SUI Clock object');
      }
    } catch (error) {
      console.error('❌ Failed to get SUI time:', error);
      
      // Fallback to local time if SUI time fails
      const localDate = new Date();
      const localDayOfWeek = localDate.getDay();
      const localDaysSinceEpoch = Math.floor(Date.now() / (1000 * 86400));
      
      console.log('🕒 Using local time fallback:', {
        localDayOfWeek,
        localDaysSinceEpoch
      });
      
      setSuiTimeData({
        timestamp: Date.now(),
        dayOfWeek: localDayOfWeek,
        currentDay: localDaysSinceEpoch,
        weekNumber: Math.floor(localDaysSinceEpoch / 7),
        year: localDate.getFullYear(),
        isLoaded: true,
        error: error.message
      });
      
      return {
        timestamp: Date.now(),
        dayOfWeek: localDayOfWeek,
        currentDay: localDaysSinceEpoch,
        weekNumber: Math.floor(localDaysSinceEpoch / 7),
        year: localDate.getFullYear()
      };
    }
  };

  return { suiTimeData, getSuiTime };
};

// Current zodiac season logic
const getCurrentZodiacSeason = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
};

const ZODIAC_SIGNS = [
  { name: 'aries', symbol: '♈', dates: 'Mar 21 - Apr 19' },
  { name: 'taurus', symbol: '♉', dates: 'Apr 20 - May 20' },
  { name: 'gemini', symbol: '♊', dates: 'May 21 - Jun 20' },
  { name: 'cancer', symbol: '♋', dates: 'Jun 21 - Jul 22' },
  { name: 'leo', symbol: '♌', dates: 'Jul 23 - Aug 22' },
  { name: 'virgo', symbol: '♍', dates: 'Aug 23 - Sep 22' },
  { name: 'libra', symbol: '♎', dates: 'Sep 23 - Oct 22' },
  { name: 'scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21' },
  { name: 'sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21' },
  { name: 'capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19' },
  { name: 'aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18' },
  { name: 'pisces', symbol: '♓', dates: 'Feb 19 - Mar 20' }
];

const CHINESE_ZODIAC_SIGNS = [
  { name: 'rat', symbol: '🐀', element: 'Water' },
  { name: 'ox', symbol: '🐂', element: 'Earth' },
  { name: 'tiger', symbol: '🐅', element: 'Wood' },
  { name: 'rabbit', symbol: '🐇', element: 'Wood' },
  { name: 'dragon', symbol: '🐉', element: 'Earth' },
  { name: 'snake', symbol: '🐍', element: 'Fire' },
  { name: 'horse', symbol: '🐎', element: 'Fire' },
  { name: 'goat', symbol: '🐐', element: 'Earth' },
  { name: 'monkey', symbol: '🐒', element: 'Metal' },
  { name: 'rooster', symbol: '🐓', element: 'Metal' },
  { name: 'dog', symbol: '🐕', element: 'Earth' },
  { name: 'pig', symbol: '🐖', element: 'Water' }
];

// Custom Connect Button Component - Suiet Only with Network Detection
const CustomConnectButton = ({ t }) => {
  const wallet = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('checking');
  const [detectedNetwork, setDetectedNetwork] = useState('unknown');
  const [networkSource, setNetworkSource] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (wallet.connected) {
      const checkNetwork = async () => {
        const networkInfo = determineNetwork(wallet);
        console.log('🔍 Network detection result:', networkInfo);
        
        setDetectedNetwork(networkInfo.network);
        setNetworkSource(networkInfo.source);
        
        if (networkInfo.status === 'detected') {
          if (networkInfo.network === 'testnet') {
            console.log('✅ Testnet detected from metadata');
            setNetworkStatus('testnet_confirmed');
          } else if (networkInfo.network === 'mainnet') {
            console.log('🚨 MAINNET detected - showing warning');
            setNetworkStatus('mainnet_detected');
          }
        } else {
          console.log('❓ Unknown network detected');
          setNetworkStatus('unknown_network');
        }
      };
      
      checkNetwork();
    } else {
      setNetworkStatus('checking');
      setDetectedNetwork('unknown');
      setNetworkSource('');
    }
  }, [wallet.connected, wallet.address]);

  const handleConnect = async () => {
    if (wallet.connected) {
      try {
        await wallet.disconnect();
      } catch (error) {
        console.log('Disconnect error:', error);
      }
    } else {
      setShowWalletModal(true);
    }
  };

  const handleRefreshNetwork = async () => {
    if (wallet.connected) {
      setNetworkStatus('checking');
      setDetectedNetwork('unknown');
      setNetworkSource('');
      
      // Simple refresh - just re-detect
      const networkInfo = determineNetwork(wallet);
      console.log('🔄 Network refresh result:', networkInfo);
      
      setDetectedNetwork(networkInfo.network);
      setNetworkSource(networkInfo.source);
      
      if (networkInfo.network === 'testnet') {
        setNetworkStatus('testnet_detected');
      } else if (networkInfo.network === 'mainnet') {
        setNetworkStatus('mainnet_detected');
      } else {
        setNetworkStatus('unknown_network');
      }
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      await wallet.select('Suiet');
      
      if (!wallet.connected && wallet.connect) {
        await wallet.connect();
      }
      
      if (!wallet.signTransaction) {
        throw new Error('Wallet does not support transaction signing');
      }
      
      setShowWalletModal(false);
    } catch (error) {
      console.error('Connection error:', error);
      
      if (wallet.connected && wallet.signTransaction) {
        console.log('Suiet connected successfully');
        setShowWalletModal(false);
      } else {
        alert('Failed to connect Suiet wallet. Please make sure you have Suiet wallet installed and that it supports transaction signing.');
      }
    }
    setIsConnecting(false);
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-3">
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
        >
          {isConnecting ? (
            <>
              <LoadingSpinner size="h-4 w-4" />
              <span>{t('connecting')}</span>
            </>
          ) : wallet.connected ? (
            <span>{t('connected')}: {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</span>
          ) : (
            <span>{t('connectSuietWallet')}</span>
          )}
        </button>
        
        {wallet.connected && (
          <div className="text-center">
            {networkStatus === 'checking' && (
              <div className="bg-gray-900/30 border border-gray-400/30 rounded-lg p-3 max-w-md">
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="h-4 w-4" />
                  <p className="text-gray-300 text-sm">Checking network...</p>
                </div>
              </div>
            )}
            
            {networkStatus === 'testnet_confirmed' && (
              <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-3 max-w-md">
                <p className="text-green-300 text-sm font-semibold mb-1">✅ Testnet Detected</p>
                <p className="text-green-200 text-xs">
                  Connected to Sui Testnet (detected via {networkSource})
                </p>
              </div>
            )}
            
            {networkStatus === 'mainnet_detected' && (
              <div className="bg-yellow-900/30 border border-yellow-400/30 rounded-lg p-3 max-w-md">
                <p className="text-yellow-300 text-sm font-semibold mb-1">⚠️ Mainnet Detected</p>
                <p className="text-yellow-200 text-xs mb-2">
                  Wallet connected to Mainnet. This app is designed for Testnet.
                </p>
                <p className="text-yellow-200 text-xs">
                  Contract calls will fail naturally on Mainnet - no harm possible.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {showWalletModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center"
          style={{ zIndex: 99999 }}
          onClick={() => setShowWalletModal(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('connectSuietWalletTitle') || 'Connect Suiet Wallet'}</h2>
              <button 
                onClick={() => setShowWalletModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">{t('testnetDisclaimer') || '🧪 This app uses Sui Testnet'}</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {t('testnetExplainer') || 'Testnet tokens have no real monetary value. This is a safe environment to learn and earn virtual $HORO tokens!'}
                </p>
              </div>

              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                  {isConnecting ? <LoadingSpinner size="h-5 w-5" /> : 'S'}
                </div>
                <div className="text-left flex-1">
                  <div className="text-gray-900 font-semibold">Suiet Wallet</div>
                  <div className="text-gray-500 text-sm">Secure wallet with transaction signing</div>
                </div>
                {isConnecting && (
                  <div className="ml-auto text-blue-600 text-sm">
                    {t('connecting') || 'Connecting...'}
                  </div>
                )}
              </button>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">{t('whySuiet') || 'Why Suiet?'}</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• {t('suietBenefitSigning') || 'Supports cryptographic message signing'}</li>
                  <li>• {t('suietBenefitSecurity') || 'Enhanced security for NFT airdrops'}</li>
                  <li>• {t('suietBenefitFraud') || 'Prevents check-in fraud'}</li>
                  <li>• {t('suietBenefitCompatibility') || 'Best compatibility with $HORO features'}</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                {t('dontHaveSuiet') || "Don't have Suiet wallet?"}
              </p>
              <a 
                href="https://suiet.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                {t('downloadSuiet') || 'Download Suiet Wallet →'}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowHelp(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{mt('helpTitle')}</h2>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-gray-100">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">{mt('switchToTestnet')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('switchToTestnetText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-green-400 mb-3">{mt('needTestnetSui')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('needTestnetSuiText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('troubleshooting')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('troubleshootingText')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Language Selector Component
const LanguageSelector = ({ currentLanguage, onLanguageChange, textColor = "text-yellow-200" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${textColor} hover:text-white transition-colors text-sm font-medium cursor-pointer flex items-center space-x-1`}
      >
        <Globe className="h-4 w-4" />
        <span>{LANGUAGES[currentLanguage]?.flag}</span>
        <span>{LANGUAGES[currentLanguage]?.name}</span>
      </button>
      
      {isOpen && (
        <div 
          className="absolute bottom-full mb-2 left-0 bg-black/80 backdrop-blur-sm rounded-lg border border-gray-600 shadow-lg min-w-max z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          {Object.entries(LANGUAGES).map(([code, language]) => (
            <button
              key={code}
              onClick={() => {
                onLanguageChange(code);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors text-white text-sm flex items-center space-x-2 first:rounded-t-lg last:rounded-b-lg"
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function HoroApp() {
  const wallet = useWallet();
  const { suiTimeData, getSuiTime } = useSuiTime();
  const [selectedSign, setSelectedSign] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [weeklyProgressByDay, setWeeklyProgressByDay] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentSeason, setCurrentSeason] = useState('');
  const [stars, setStars] = useState([]);
  const [showAbout, setShowAbout] = useState(false);
  const [showTokenomics, setShowTokenomics] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [autoSigningProgress, setAutoSigningProgress] = useState(false);
  const [language, setLanguage] = useState('en');
  
  // Blockchain claim verification state
  const [blockchainClaimStatus, setBlockchainClaimStatus] = useState('checking');
  const [isVerifyingClaim, setIsVerifyingClaim] = useState(false);
  const [todaysClaimAmount, setTodaysClaimAmount] = useState(0);

  // Translation helper function
  const t = (key, replacements = {}) => {
    let translation = TRANSLATIONS[language]?.[key] || key;
    Object.keys(replacements).forEach(placeholder => {
      translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
    });
    return translation;
  };

  // Modal translation helper
  const mt = (key) => {
    return MODAL_TRANSLATIONS[language]?.[key] || key;
  };

  // Get flag for Western zodiac button based on current language
  const getWesternFlag = () => {
    const westernLanguages = ['en', 'es', 'ru', 'fr'];
    if (westernLanguages.includes(language)) {
      return LANGUAGES[language].flag;
    }
    return '🇺🇸'; // Default to US flag for non-western languages
  };

  // Date formatting helper function
  const formatCurrentDate = () => {
    const now = new Date();
    
    // Language code mapping for Intl.DateTimeFormat
    const localeMap = {
      'en': 'en-US',
      'es': 'es-ES',
      'zh': 'zh-CN',
      'zh-TR': 'zh-TW',
      'ru': 'ru-RU',
      'fr': 'fr-FR'
    };
    
    const locale = localeMap[language] || 'en-US';
    
    try {
      return new Intl.DateTimeFormat(locale, {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(now);
    } catch (error) {
      // Fallback to English format if locale is not supported
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(now);
    }
  };

  // Helper function to get translated day names
  const getDayName = (dayIndex) => {
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return t(dayKeys[dayIndex]);
  };

const getZodiacSymbol = () => {
  const signs = selectedSystem === 'western' ? ZODIAC_SIGNS : CHINESE_ZODIAC_SIGNS;
  const sign = signs.find(s => s.name === selectedSign);
  return sign ? sign.symbol : '';
};

  // Get horoscope for current language and system
  const getCurrentHoroscope = () => {
    if (selectedSystem === 'western') {
      return $HOROSCOPES[language]?.[selectedSign] || $HOROSCOPES?.en?.[selectedSign] || 'Your daily horoscope will appear here.';
    } else {
      return CHINESE_$HOROSCOPES[language]?.[selectedSign] || CHINESE_$HOROSCOPES?.en?.[selectedSign] || 'Your daily horoscope will appear here.';
    }
  };

  // Use SUI blockchain time consistently
  const getCurrentDayOfWeek = () => {
    if (suiTimeData.isLoaded && suiTimeData.dayOfWeek !== null) {
      return suiTimeData.dayOfWeek;
    }
    
    // Fallback to GMT time calculation (same as SUI time calculation)
    const utcDate = new Date();
    const utcTimestamp = utcDate.getTime();
    const utcSeconds = Math.floor(utcTimestamp / 1000);
    const utcDaysSinceEpoch = Math.floor(utcSeconds / 86400);
    const utcDayOfWeek = (utcDaysSinceEpoch + 4) % 7; // Same calculation as SUI
    
    return utcDayOfWeek;
  };

  // Get date for a specific day of week using SUI time
  const getDateForDayOfWeek = (dayOfWeek) => {
    if (!suiTimeData.isLoaded || suiTimeData.timestamp === null || suiTimeData.dayOfWeek === null) {
      // Fallback to local time if SUI time not available
      const today = new Date();
      const currentDayOfWeek = today.getDay();
      const diff = dayOfWeek - currentDayOfWeek;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + diff);
      return targetDate.toISOString().split('T')[0];
    }
    
    // Use SUI blockchain time-based calculation
    const suiDate = new Date(suiTimeData.timestamp);
    const currentSuiDayOfWeek = suiTimeData.dayOfWeek;
    const diff = dayOfWeek - currentSuiDayOfWeek;
    const targetDate = new Date(suiDate);
    targetDate.setDate(suiDate.getDate() + diff);
    return targetDate.toISOString().split('T')[0];
  };

  // Check blockchain claim status using SUI time
  const checkBlockchainClaimStatus = async () => {
    if (!wallet.connected || !wallet.address) {
      setBlockchainClaimStatus('checking');
      return;
    }

    setIsVerifyingClaim(true);
    
    try {
      // Always get fresh SUI time to ensure we have current data
      const currentSuiTime = await getSuiTime();
      
      console.log('🔍 Checking blockchain claim status for:', wallet.address);
      console.log('🔍 Using SUI day of week:', currentSuiTime.dayOfWeek);
      
      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: (() => {
          const txb = new Transaction();
          txb.moveCall({
            target: `${PACKAGE_ID}::horo::has_claimed_today`,
            arguments: [
              txb.object(CLAIMS_ID),
              txb.object('0x6'), // Sui Clock object
              txb.pure.address(wallet.address)
            ]
          });
          return txb;
        })(),
        sender: wallet.address,
      });

      console.log('🔍 Has claimed today result:', result);
      
      if (result.results && result.results[0] && result.results[0].returnValues && result.results[0].returnValues[0]) {
        const returnValue = result.results[0].returnValues[0];
        let hasClaimed = false;
        
        if (Array.isArray(returnValue) && returnValue.length >= 2) {
          const dataArray = returnValue[0];
          if (Array.isArray(dataArray) && dataArray.length > 0) {
            hasClaimed = dataArray[0] === 1;
          }
        }
        
        console.log('🔍 Has claimed today (parsed):', hasClaimed);
        console.log('🔍 Based on SUI time, today is day:', currentSuiTime.dayOfWeek);
        setBlockchainClaimStatus(hasClaimed ? 'claimed' : 'not_claimed');
      } else {
        setBlockchainClaimStatus('not_claimed');
      }
    } catch (error) {
      console.error('❌ Failed to check has_claimed_today:', error);
      setBlockchainClaimStatus('not_claimed');
    }
    
    setIsVerifyingClaim(false);
  };

  // Load weekly progress using SUI time
  const loadWeeklyProgress = async () => {
    if (!wallet.address) {
      setWeeklyProgressByDay({});
      return;
    }
    
    setIsLoading(true);
    try {
      // Always get fresh SUI time to ensure we have current data
      const currentSuiTime = await getSuiTime();
      
      console.log('📊 Loading weekly progress from blockchain for:', wallet.address);
      console.log('📊 SUI day of week:', currentSuiTime.dayOfWeek);
      console.log('📊 SUI current day:', currentSuiTime.currentDay);
      
      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: (() => {
          const txb = new Transaction();
          txb.moveCall({
            target: `${PACKAGE_ID}::horo::get_weekly_progress`,
            arguments: [
              txb.object(PROGRESS_REGISTRY_ID),
              txb.pure.address(wallet.address),
              txb.object('0x6'), // Clock
            ]
          });
          return txb;
        })(),
        sender: wallet.address,
      });
      
      console.log('📊 Blockchain progress query result:', result);
      
      const weeklyData = parseWeeklyProgressResult(result);
      setWeeklyProgressByDay(weeklyData);
      
      console.log('📊 Parsed weekly progress by day:', weeklyData);
      console.log('📊 Number of days with progress:', Object.keys(weeklyData).length);
      
      // Log each day's progress using translated day names
      Object.keys(weeklyData).forEach(dayOfWeek => {
        console.log(`📊 ${getDayName(dayOfWeek)} (${dayOfWeek}): ${weeklyData[dayOfWeek].dailyReward} $HORO`);
      });
      
    } catch (error) {
      console.error('❌ Failed to load weekly progress from blockchain:', error);
      setWeeklyProgressByDay({});
    }
    setIsLoading(false);
  };

  // Parse weekly progress result from blockchain
  const parseWeeklyProgressResult = (result) => {
    try {
      console.log('🔍 Full blockchain result:', JSON.stringify(result, null, 2));
      
      if (result.results && result.results[0] && result.results[0].returnValues && result.results[0].returnValues[0]) {
        const returnValue = result.results[0].returnValues[0];
        console.log('🔍 Raw progress return value:', returnValue);
        
        if (Array.isArray(returnValue) && returnValue.length >= 1) {
          const serializedData = returnValue[0]; // This is the serialized byte array
          console.log('🔍 Serialized data:', serializedData);
          console.log('🔍 Serialized data length:', serializedData.length);
          
          if (Array.isArray(serializedData) && serializedData.length > 0) {
            return parseFlatClaimData(serializedData);
          }
        }
      }
      
      console.log('🔍 No valid return values found');
      return {};
    } catch (error) {
      console.error('❌ Error parsing weekly progress:', error);
      return {};
    }
  };

  // Parse flat claim data from Move vector serialization
  const parseFlatClaimData = (data) => {
    const progressByDay = {};
    let offset = 0;
    
    console.log('🔍 Parsing flat claim data, total bytes:', data.length);
    
    // First byte(s) are the vector length (ULEB128 encoded, but for small numbers it's just 1 byte)
    if (offset >= data.length) {
      console.log('🔍 No data to parse');
      return {};
    }
    
    const vectorLength = data[offset];
    offset += 1;
    console.log('🔍 Vector contains', vectorLength, 'claims');
    
    // Parse each DailyClaimInfo struct in the vector
    for (let i = 0; i < vectorLength; i++) {
      try {
        const result = parseSingleClaim(data, offset);
        if (result.claim) {
          progressByDay[result.claim.dayOfWeek] = result.claim;
          console.log(`✅ Parsed claim ${i} for day ${result.claim.dayOfWeek}:`, result.claim);
          offset = result.nextOffset;
        } else {
          console.log(`🔍 Failed to parse claim ${i} at offset:`, offset);
          break;
        }
      } catch (error) {
        console.error(`❌ Error parsing claim ${i} at offset`, offset, ':', error);
        break;
      }
    }
    
    console.log('📊 Final progressByDay object:', progressByDay);
    return progressByDay;
  };

  // Parse a single DailyClaimInfo struct
  const parseSingleClaim = (data, startOffset) => {
    let offset = startOffset;
    
    console.log(`🔍 Parsing single claim starting at offset ${offset}`);
    
    if (offset >= data.length) {
      return { claim: null, nextOffset: offset };
    }
    
    // Parse day_of_week (u8 - 1 byte)
    const dayOfWeek = data[offset];
    offset += 1;
    console.log(`🔍 Day of week: ${dayOfWeek}`);
    
    if (dayOfWeek > 6) {
      console.log('🔍 Invalid day of week, stopping parse');
      return { claim: null, nextOffset: offset };
    }
    
    // Parse amount_claimed (u64 - 8 bytes, little endian)
    if (offset + 8 > data.length) {
      console.log('🔍 Not enough bytes for amount, stopping parse');
      return { claim: null, nextOffset: offset };
    }
    
    let amount = 0;
    for (let i = 0; i < 8; i++) {
      amount += data[offset + i] * Math.pow(256, i);
    }
    offset += 8;
    console.log(`🔍 Amount: ${amount} (${Math.floor(amount / 1_000_000)} $HORO)`);
    
    // Parse timestamp (u64 - 8 bytes, little endian)
    if (offset + 8 > data.length) {
      console.log('🔍 Not enough bytes for timestamp, stopping parse');
      return { claim: null, nextOffset: offset };
    }
    
    let timestamp = 0;
    for (let i = 0; i < 8; i++) {
      timestamp += data[offset + i] * Math.pow(256, i);
    }
    offset += 8;
    console.log(`🔍 Timestamp: ${timestamp}`);
    
    // Parse zodiac_sign vector (length prefix + bytes)
    if (offset >= data.length) {
      console.log('🔍 Not enough bytes for zodiac sign length, stopping parse');
      return { claim: null, nextOffset: offset };
    }
    
    const zodiacLength = data[offset];
    offset += 1;
    console.log(`🔍 Zodiac sign length: ${zodiacLength}`);
    
    // Parse zodiac_sign bytes
    if (offset + zodiacLength > data.length) {
      console.log('🔍 Not enough bytes for zodiac sign, stopping parse');
      return { claim: null, nextOffset: offset };
    }
    
    const zodiacBytes = data.slice(offset, offset + zodiacLength);
    offset += zodiacLength;
    
    let zodiacSign = '';
    try {
      if (zodiacLength > 0) {
        zodiacSign = new TextDecoder().decode(new Uint8Array(zodiacBytes));
      }
    } catch (e) {
      console.warn('Failed to decode zodiac sign:', e);
      zodiacSign = 'unknown';
    }
    console.log(`🔍 Zodiac sign: "${zodiacSign}"`);
    
    // Parse claim_day (u64 - 8 bytes, little endian)
    if (offset + 8 > data.length) {
      console.log('🔍 Not enough bytes for claim day, stopping parse');
      return { claim: null, nextOffset: offset };
    }
    
    let claimDay = 0;
    for (let i = 0; i < 8; i++) {
      claimDay += data[offset + i] * Math.pow(256, i);
    }
    offset += 8;
    console.log(`🔍 Claim day: ${claimDay}`);
    
    const claim = {
      dayOfWeek,
      amount: amount,
      dailyReward: Math.floor(amount / 1_000_000), // Convert from 6 decimals to display value
      timestamp,
      zodiacSign,
      claimDay,
      date: getDateForDayOfWeek(dayOfWeek)
    };
    
    return { claim, nextOffset: offset };
  };

  const calculateDailyReward = (dayCount) => {
    const baseReward = 10;
    const streakBonus = Math.floor(dayCount / 3) * 5;
    return baseReward + streakBonus;
  };

  // Get daily streak from blockchain data
  const getDailyStreak = () => {
    return Object.keys(weeklyProgressByDay).length;
  };

  // Check if today is completed using both blockchain and localStorage data
  const isTodayCompleted = () => {
    const currentDayOfWeek = getCurrentDayOfWeek();
    const hasProgressToday = weeklyProgressByDay[currentDayOfWeek];
    return blockchainClaimStatus === 'claimed' || !!hasProgressToday;
  };

  // Update today's claim amount from blockchain data
  const updateTodaysClaimAmount = () => {
    const currentDayOfWeek = getCurrentDayOfWeek();
    const todaysProgress = weeklyProgressByDay[currentDayOfWeek];
    
    if (blockchainClaimStatus === 'claimed' || todaysProgress) {
      if (todaysProgress && todaysProgress.dailyReward) {
        setTodaysClaimAmount(todaysProgress.dailyReward);
      } else {
        // Estimate based on current streak
        const currentStreak = getDailyStreak();
        const estimatedAmount = calculateDailyReward(currentStreak || 1);
        setTodaysClaimAmount(estimatedAmount);
      }
    } else {
      setTodaysClaimAmount(0);
    }
  };

  useEffect(() => {
    // Load saved language
    const savedLanguage = localStorage.getItem('horoLanguage');
    if (savedLanguage && LANGUAGES[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('horoLanguage', language);
  }, [language]);

  useEffect(() => {
    const season = getCurrentZodiacSeason();
    setCurrentSeason(season);
    
    const newStars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 10,
      duration: Math.random() * 3 + 4
    }));
    setStars(newStars);

    // Check for saved zodiac sign
    const savedSign = localStorage.getItem('horoZodiacSign');
    const savedSystem = localStorage.getItem('horoZodiacSystem');
    if (savedSign && savedSystem) {
      setSelectedSign(savedSign);
      setSelectedSystem(savedSystem);
    }
  }, [wallet.connected, language]);

  // Initialize SUI time and then check claim status
  useEffect(() => {
    if (wallet.connected && wallet.address && selectedSign) {
      // Get SUI time first, then check status and load progress
      getSuiTime().then((currentSuiTime) => {
        console.log('🕒 SUI time initialized:', currentSuiTime);
        checkBlockchainClaimStatus();
        loadWeeklyProgress();
      }).catch((error) => {
        console.error('❌ Failed to initialize SUI time:', error);
        // Still try to check status with fallback time
        checkBlockchainClaimStatus();
        loadWeeklyProgress();
      });
    } else {
      setBlockchainClaimStatus('checking');
      setTodaysClaimAmount(0);
      setWeeklyProgressByDay({});
    }
  }, [wallet.connected, wallet.address, selectedSign]);
  
  useEffect(() => {
    if (wallet.connected) {
      updateTodaysClaimAmount();
    }
  }, [blockchainClaimStatus, weeklyProgressByDay, suiTimeData]);

  // Claim function
  const claimTodaysHoro = async (sign) => {
    const hasAlreadyClaimed = isTodayCompleted();
    
    if (hasAlreadyClaimed || !wallet.signTransaction) {
      console.log('❌ Cannot claim: already claimed or no signing capability');
      if (hasAlreadyClaimed) {
        alert(`💫 You've already claimed your daily $HORO! ✨\n\nCome back tomorrow for another cosmic blessing~`);
      }
      return;
    }
    
    setAutoSigningProgress(true);
    
    try {
      // Ensure we have fresh SUI time data
      const currentSuiTime = await getSuiTime();
      console.log('🕒 Using SUI time for claim:', currentSuiTime);
      
      const currentStreak = getDailyStreak();
      const dailyReward = calculateDailyReward(currentStreak + 1);
      const amount = dailyReward * 1_000_000; // Convert to 6 decimals
      
      console.log('🚀 Preparing to claim', dailyReward, '$HORO tokens...');
      
      // Validate contract objects
      const treasuryObject = await suiClient.getObject({
        id: TREASURY_ID,
        options: { showContent: true, showType: true }
      });
      
      const claimsObject = await suiClient.getObject({
        id: CLAIMS_ID,
        options: { showContent: true, showType: true }
      });

      const progressObject = await suiClient.getObject({
        id: PROGRESS_REGISTRY_ID,
        options: { showContent: true, showType: true }
      });
      
      if (!claimsObject.data?.type?.includes('DailyClaims')) {
        throw new Error(`Invalid claims object - expected DailyClaims, got: ${claimsObject.data?.type}`);
      }
      
      if (!treasuryObject.data?.type?.includes('Treasury')) {
        throw new Error(`Invalid treasury object - expected Treasury, got: ${treasuryObject.data?.type}`);
      }

      if (!progressObject.data?.type?.includes('UserProgressRegistry')) {
        throw new Error(`Invalid progress registry object - expected UserProgressRegistry, got: ${progressObject.data?.type}`);
      }
      
      console.log('✅ Contract objects validated successfully');
      
      // Convert zodiac sign to bytes for the contract
      const zodiacSignBytes = Array.from(new TextEncoder().encode(sign));
      console.log('🔤 Zodiac sign bytes:', zodiacSignBytes);
      
      // Build transaction
      const txb = new Transaction();
      
      try {
        txb.moveCall({
          target: `${PACKAGE_ID}::horo::claim_daily_reward`,
          arguments: [
            txb.object(TREASURY_ID),
            txb.object(CLAIMS_ID),
            txb.object(PROGRESS_REGISTRY_ID),
            txb.object('0x6'), // Sui Clock object
            txb.pure.u64(amount),
            txb.pure.vector('u8', zodiacSignBytes)
          ]
        });
        
        console.log('📋 Transaction built successfully');
      } catch (buildError) {
        console.error('❌ Transaction build error:', buildError);
        throw new Error(`Failed to build transaction: ${buildError.message}`);
      }
      
      // Sign and execute transaction
      console.log('✍️ Requesting wallet signature...');
      
      let signedTx;
      try {
        signedTx = await wallet.signTransaction({
          transaction: txb
        });
        console.log('✅ Transaction signed successfully');
      } catch (signError) {
        console.error('❌ Transaction signing error:', signError);
        throw new Error(`Failed to sign transaction: ${signError.message}`);
      }
      
      const transactionBytes = signedTx.transactionBlockBytes || signedTx.bytes || signedTx.transactionBytes;
      const signature = signedTx.signature || signedTx.signatures?.[0];
      
      if (!transactionBytes || !signature) {
        console.error('❌ Missing transaction data. Available keys:', Object.keys(signedTx));
        throw new Error(`Missing transaction data. Available: ${Object.keys(signedTx).join(', ')}`);
      }
      
      console.log('⚡ Executing transaction...');
      let txResult;
      try {
        txResult = await suiClient.executeTransactionBlock({
          transactionBlock: transactionBytes,
          signature: signature,
          options: {
            showEffects: true,
            showObjectChanges: true,
            showEvents: true,
          }
        });
        console.log('✅ Transaction executed:', txResult.digest);
      } catch (executeError) {
        console.error('❌ Transaction execution error:', executeError);
        throw executeError;
      }
      
      if (txResult.effects?.status?.status === 'success' && txResult.digest) {
        // Update blockchain claim status
        setBlockchainClaimStatus('claimed');
        
        // Reload weekly progress from blockchain
        await loadWeeklyProgress();
        
        alert(`🎉 Daily Check-in Complete!\n\n+${dailyReward} $HORO earned today!\nStreak: ${currentStreak + 1} days\n\nTransaction: ${txResult.digest}`);
        
        console.log('✅ Daily check-in completed successfully');
      } else {
        throw new Error(`Transaction failed: ${JSON.stringify(txResult.effects?.status)}`);
      }
    } catch (error) {
      console.error('Daily check-in failed:', error);
      const errorMessage = error.message || '';
      
      if (errorMessage.includes('EAlreadyClaimedToday') || 
          errorMessage.includes('Abort(1)') || 
          errorMessage.includes('), 1)') ||
          errorMessage.includes('MoveAbort') && errorMessage.includes(', 1)') ||
          (errorMessage.includes('Dry run failed') && (errorMessage.includes('1)') || errorMessage.includes('), 1)')))) {
        setBlockchainClaimStatus('claimed');
        alert(`💫 You've already claimed your daily $HORO! ✨\n\nCome back tomorrow for another cosmic blessing~`);
      } else if (errorMessage.includes('EGlobalPeriodLimitExceeded') || errorMessage.includes('Abort(4)')) {
        alert('🌟 The cosmic energy is at maximum capacity right now!\n\nPlease try again in a few hours when the stars realign~ ✨');
      } else if (errorMessage.includes('Insufficient gas')) {
        alert('Need testnet SUI for gas. Please use the "Open Testnet Faucet" button to get free gas!');
      } else if (errorMessage.includes('User rejected')) {
        alert('Transaction was cancelled. No $HORO tokens were awarded.');
      } else {
        alert(`🔮 The cosmic connection seems unstable right now.\n\nError: ${errorMessage.slice(0, 100)}...\n\nPlease try again in a moment!`);
      }
    }
    
    setAutoSigningProgress(false);
  };

  const selectZodiacSign = async (sign) => {
    const weekStart = getWeekStartDate();
    const savedWeekSign = localStorage.getItem(`horoWeekSign_${weekStart}`);
    
    if (savedWeekSign && savedWeekSign !== sign) {
      alert(`You've already selected ${savedWeekSign} for this week. Please continue with your chosen sign or wait until next Monday to change it.`);
      return;
    }
    
    setSelectedSign(sign);
    localStorage.setItem('horoZodiacSign', sign);
    localStorage.setItem('horoZodiacSystem', selectedSystem);
    localStorage.setItem(`horoWeekSign_${weekStart}`, sign);
    
    // Get SUI time and load progress after selecting sign
    if (wallet.connected) {
      try {
        const currentSuiTime = await getSuiTime();
        console.log('🕒 SUI time loaded after sign selection:', currentSuiTime);
        await checkBlockchainClaimStatus();
        await loadWeeklyProgress();
      } catch (error) {
        console.error('❌ Failed to load SUI time after sign selection:', error);
        // Still try to check status with fallback
        await checkBlockchainClaimStatus();
        await loadWeeklyProgress();
      }
    }
  };

  const getWeekStartDate = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek + 1);
    return startOfWeek.toISOString().split('T')[0];
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Show zodiac system selection if no system selected
  if (!selectedSystem) {
    return (
      <>
        <div className="min-h-screen relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #b45309 75%, #92400e 100%)'
        }}>
          {stars.map(star => (
            <div
              key={star.id}
              className="absolute text-yellow-200"
              style={{
                left: `${star.x}%`,
                top: '-50px',
                fontSize: `${star.size * 2}px`,
                animation: `fallingStar ${star.duration}s linear infinite`,
                animationDelay: `${star.delay}s`,
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 0, 0.8))',
                zIndex: 10
              }}
            >
              ⭐
            </div>
          ))}

          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-6xl font-bold text-white mb-4 tracking-wider" style={{
                textShadow: '3px 3px 0px rgba(0,0,0,0.3), 6px 6px 0px rgba(0,0,0,0.1)'
              }}>
                {t('dailyHoro')}
              </h1>
              <p className="text-2xl text-yellow-200 font-semibold">
                {t('chooseZodiacSystem')}
              </p>
            </div>

            <div className="max-w-md w-full space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => setSelectedSystem('western')}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-6 rounded-xl transition-all duration-200 transform hover:scale-105 text-center"
                >
                  <div className="text-4xl mb-2">{getWesternFlag()}</div>
                  <div className="text-white font-semibold text-lg">{t('western')}</div>
                </button>
                <button
                  onClick={() => setSelectedSystem('chinese')}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-6 rounded-xl transition-all duration-200 transform hover:scale-105 text-center"
                >
                  <div className="text-4xl mb-2">🇨🇳</div>
                  <div className="text-white font-semibold text-lg">{t('chinese')}</div>
                </button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="flex space-x-4 mb-4 justify-center">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                <Sparkles className="h-8 w-8 text-yellow-200 animate-pulse" style={{animationDelay: '0.3s'}} />
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" style={{animationDelay: '0.6s'}} />
              </div>
              
              <div className="flex space-x-6 text-yellow-200 justify-center">
                <button 
                  onClick={() => setShowAbout(true)}
                  className="hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  {t('about')}
                </button>
                <button 
                  onClick={() => setShowTokenomics(true)}
                  className="hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  {t('tokenomics')}
                </button>
                <button 
                  onClick={() => setShowHelp(true)}
                  className="hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  {t('help')}
                </button>
                <LanguageSelector 
                  currentLanguage={language} 
                  onLanguageChange={handleLanguageChange}
                />
              </div>

              {/* SVAC Static Logo - Centered below footer */}
              <div className="flex justify-center items-center mt-12">
                <div className="text-gray-500">
                  {/* <StaticLogo size="small" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* About Modal */}
      {showAbout && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowAbout(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{mt('aboutHoro')}</h2>
              <button 
                onClick={() => setShowAbout(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-gray-100">
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whatIsHoro')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('whatIsHoroText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whereIsHoro')}</h3>
                <p className="leading-relaxed">{mt('whereIsHoroText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whenIsHoro')}</h3>
                <div className="leading-relaxed whitespace-pre-line">{mt('whenIsHoroText')}</div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whyHoro')}</h3>
                <p className="leading-relaxed">{mt('whyHoroText')}</p>
              </div>

              {/* <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whoHoro')}</h3>
                <p className="leading-relaxed">{mt('whoHoroText')}</p>
              </div> */}

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whatsNext')}</h3>
                <p className="leading-relaxed">{mt('whatsNextText')}</p>
              </div>

              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                <h4 className="font-semibold text-blue-300 mb-2">{mt('contractAddress')}</h4>
                <div className="font-mono text-xs text-blue-200 break-all bg-black/30 p-2 rounded">
                  {PACKAGE_ID}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tokenomics Modal */}
      {showTokenomics && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowTokenomics(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{mt('tokenomics')}</h2>
              <button 
                onClick={() => setShowTokenomics(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-gray-100">
              <div className="text-center">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">{mt('totalSupplyTitle')}</h3>
                <h4 className="text-2xl font-bold text-white mb-2">{mt('totalSupply')}</h4>
                <p className="text-green-400 font-semibold">{mt('fixedSupply')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-4">{mt('allocationBreakdown')}</h3>
                <div className="space-y-3">
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-400/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-purple-300">{mt('dailyClaims')}</div>
                        <div className="text-xs text-gray-400">{language === 'zh' ? '9万亿' : language === 'zh-TR' ? '9兆' : language === 'ru' ? '9трлн' : '9T'} tokens</div>
                      </div>
                      <div className="text-2xl font-bold text-purple-300">90%</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-blue-300">{mt('ecosystemRewards')}</div>
                        <div className="text-xs text-gray-400">{language === 'zh' ? '5000亿' : language === 'zh-TR' ? '5000億' : language === 'ru' ? '500млрд' : '500B'} tokens</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-300">5%</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-900/30 p-4 rounded-lg border border-green-400/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-green-300">{mt('socialEngagement')}</div>
                        <div className="text-xs text-gray-400">{language === 'zh' ? '3000亿' : language === 'zh-TR' ? '3000億' : language === 'ru' ? '300млрд' : '300B'} tokens</div>
                      </div>
                      <div className="text-2xl font-bold text-green-300">3%</div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-400/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-yellow-300">{mt('developerInfraSupport')}</div>
                        <div className="text-xs text-gray-400">{language === 'zh' ? '1000亿' : language === 'zh-TR' ? '1000億' : language === 'ru' ? '100млрд' : '100B'} tokens</div>
                      </div>
                      <div className="text-2xl font-bold text-yellow-300">1%</div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-400/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-orange-300">{mt('futureSurprises')}</div>
                        <div className="text-xs text-gray-400">{language === 'zh' ? '1000亿' : language === 'zh-TR' ? '1000億' : language === 'ru' ? '100млрд' : '100B'} tokens</div>
                      </div>
                      <div className="text-2xl font-bold text-orange-300">1%</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-white">TOTAL</div>
                      <div className="text-xl font-bold text-white">100%</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{language === 'zh' ? '10万亿' : language === 'zh-TR' ? '10兆' : language === 'ru' ? '10трлн' : '10T'} tokens</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                <h4 className="font-semibold text-blue-300 mb-2">{mt('contractAddress')}</h4>
                <div className="font-mono text-xs text-blue-200 break-all bg-black/30 p-2 rounded">
                  {PACKAGE_ID}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowHelp(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{mt('helpTitle')}</h2>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-gray-100">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">{mt('switchToTestnet')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('switchToTestnetText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-green-400 mb-3">{mt('needTestnetSui')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('needTestnetSuiText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('troubleshooting')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('troubleshootingText')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      </>
    );
  }

  // Show zodiac selection if no sign selected
  if (!selectedSign) {
    return (
      <>
        <div className="min-h-screen relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #b45309 75%, #92400e 100%)'
        }}>
          {stars.map(star => (
            <div
              key={star.id}
              className="absolute text-yellow-200"
              style={{
                left: `${star.x}%`,
                top: '-50px',
                fontSize: `${star.size * 2}px`,
                animation: `fallingStar ${star.duration}s linear infinite`,
                animationDelay: `${star.delay}s`,
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 0, 0.8))',
                zIndex: 10
              }}
            >
              ⭐
            </div>
          ))}

          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-6xl font-bold text-white mb-4 tracking-wider" style={{
                textShadow: '3px 3px 0px rgba(0,0,0,0.3), 6px 6px 0px rgba(0,0,0,0.1)'
              }}>
                {t('dailyHoro')}
              </h1>
              <p className="text-2xl text-yellow-200 font-semibold">
                {selectedSystem === 'western' ? t('chooseWesternZodiac') : t('chooseChineseZodiac')}
              </p>
            </div>

            <div className="max-w-md w-full space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {(selectedSystem === 'western' ? ZODIAC_SIGNS : CHINESE_ZODIAC_SIGNS).map(sign => (
                  <button
                    key={sign.name}
                    onClick={() => selectZodiacSign(sign.name)}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-4 rounded-xl transition-all duration-200 transform hover:scale-105 text-center"
                  >
                    <div className="text-2xl mb-1">{sign.symbol}</div>
                    <div className="text-white font-semibold capitalize text-sm">{t(sign.name)}</div>
                    {selectedSystem === 'western' && (
                      <div className="text-yellow-200 text-xs">{sign.dates}</div>
                    )}
                    {selectedSystem === 'chinese' && (
                      <div className="text-yellow-200 text-xs">{t(sign.element.toLowerCase())}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="flex space-x-4 mb-4 justify-center">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                <Sparkles className="h-8 w-8 text-yellow-200 animate-pulse" style={{animationDelay: '0.3s'}} />
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" style={{animationDelay: '0.6s'}} />
              </div>
              
              <div className="flex space-x-6 text-yellow-200 justify-center">
                <button 
                  onClick={() => setShowAbout(true)}
                  className="hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  {t('about')}
                </button>
                <button 
                  onClick={() => setShowTokenomics(true)}
                  className="hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  {t('tokenomics')}
                </button>
                <button 
                  onClick={() => setShowHelp(true)}
                  className="hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  {t('help')}
                </button>
                <LanguageSelector 
                  currentLanguage={language} 
                  onLanguageChange={handleLanguageChange}
                />
              </div>

              {/* SVAC Static Logo - Centered below footer */}
              <div className="flex justify-center items-center mt-12">
                <div className="text-gray-500">
                  {/* <StaticLogo size="small" /> */}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* About Modal */}
        {showAbout && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
            style={{ zIndex: 99999 }}
            onClick={() => setShowAbout(false)}
          >
            <div 
              className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{mt('aboutHoro')}</h2>
                <button 
                  onClick={() => setShowAbout(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-6 text-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whatIsHoro')}</h3>
                  <p className="leading-relaxed whitespace-pre-line">{mt('whatIsHoroText')}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whereIsHoro')}</h3>
                  <p className="leading-relaxed">{mt('whereIsHoroText')}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whenIsHoro')}</h3>
                  <div className="leading-relaxed whitespace-pre-line">{mt('whenIsHoroText')}</div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whyHoro')}</h3>
                  <p className="leading-relaxed">{mt('whyHoroText')}</p>
                </div>

                {/* <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whoHoro')}</h3>
                  <p className="leading-relaxed">{mt('whoHoroText')}</p>
                </div> */}

                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whatsNext')}</h3>
                  <p className="leading-relaxed">{mt('whatsNextText')}</p>
                </div>

                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                  <h4 className="font-semibold text-blue-300 mb-2">{mt('contractAddress')}</h4>
                  <div className="font-mono text-xs text-blue-200 break-all bg-black/30 p-2 rounded">
                    {PACKAGE_ID}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tokenomics Modal */}
        {showTokenomics && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
            style={{ zIndex: 99999 }}
            onClick={() => setShowTokenomics(false)}
          >
            <div 
              className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{mt('tokenomics')}</h2>
                <button 
                  onClick={() => setShowTokenomics(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-6 text-gray-100">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">{mt('totalSupplyTitle')}</h3>
                  <h4 className="text-2xl font-bold text-white mb-2">{mt('totalSupply')}</h4>
                  <p className="text-green-400 font-semibold">{mt('fixedSupply')}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">{mt('allocationBreakdown')}</h3>
                  <div className="space-y-3">
                    <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-400/30">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-purple-300">{mt('dailyClaims')}</div>
                          <div className="text-xs text-gray-400">{language === 'zh' ? '9万亿' : language === 'zh-TR' ? '9兆' : language === 'ru' ? '9трлн' : '9T'} tokens</div>
                        </div>
                        <div className="text-2xl font-bold text-purple-300">90%</div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-blue-300">{mt('ecosystemRewards')}</div>
                          <div className="text-xs text-gray-400">{language === 'zh' ? '5000亿' : language === 'zh-TR' ? '5000億' : language === 'ru' ? '500млрд' : '500B'} tokens</div>
                        </div>
                        <div className="text-2xl font-bold text-blue-300">5%</div>
                      </div>
                    </div>
                    
                    <div className="bg-green-900/30 p-4 rounded-lg border border-green-400/30">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-green-300">{mt('socialEngagement')}</div>
                          <div className="text-xs text-gray-400">{language === 'zh' ? '3000亿' : language === 'zh-TR' ? '3000億' : language === 'ru' ? '300млрд' : '300B'} tokens</div>
                        </div>
                        <div className="text-2xl font-bold text-green-300">3%</div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-400/30">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-yellow-300">{mt('developerInfraSupport')}</div>
                          <div className="text-xs text-gray-400">{language === 'zh' ? '1000亿' : language === 'zh-TR' ? '1000億' : language === 'ru' ? '100млрд' : '100B'} tokens</div>
                        </div>
                        <div className="text-2xl font-bold text-yellow-300">1%</div>
                      </div>
                    </div>
                    
                    <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-400/30">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-orange-300">{mt('futureSurprises')}</div>
                          <div className="text-xs text-gray-400">{language === 'zh' ? '1000亿' : language === 'zh-TR' ? '1000億' : language === 'ru' ? '100млрд' : '100B'} tokens</div>
                        </div>
                        <div className="text-2xl font-bold text-orange-300">1%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-white">TOTAL</div>
                        <div className="text-xl font-bold text-white">100%</div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{language === 'zh' ? '10万亿' : language === 'zh-TR' ? '10兆' : language === 'ru' ? '10трлн' : '10T'} tokens</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                  <h4 className="font-semibold text-blue-300 mb-2">{mt('contractAddress')}</h4>
                  <div className="font-mono text-xs text-blue-200 break-all bg-black/30 p-2 rounded">
                    {PACKAGE_ID}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Modal */}
        {showHelp && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
            style={{ zIndex: 99999 }}
            onClick={() => setShowHelp(false)}
          >
            <div 
              className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{mt('helpTitle')}</h2>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-6 text-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-3">{mt('switchToTestnet')}</h3>
                  <p className="leading-relaxed whitespace-pre-line">{mt('switchToTestnetText')}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-3">{mt('needTestnetSui')}</h3>
                  <p className="leading-relaxed whitespace-pre-line">{mt('needTestnetSuiText')}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('troubleshooting')}</h3>
                  <p className="leading-relaxed whitespace-pre-line">{mt('troubleshootingText')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Main horoscope view
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-12 w-12 text-yellow-400 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {t('dailyHoro')}
              </h1>
            </div>

          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Auto-claiming progress */}
            {autoSigningProgress && (
              <div className="bg-blue-900/50 rounded-xl p-4 text-center">
                <p className="text-blue-300">Claiming today's $HORO tokens... ✨</p>
              </div>
            )}

            {/* Blockchain verification progress */}
            {isVerifyingClaim && (
              <div className="bg-yellow-900/50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="h-4 w-4" />
                  <p className="text-yellow-300">{t('verifyingClaim')}</p>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <CustomConnectButton t={t} />
            </div>

            {/* Today's horoscope */}
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold capitalize">{t(selectedSign)} {t('dailyReading')} {getZodiacSymbol()}</h2>
                <h2 className="text-2xl">{formatCurrentDate()}</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-xl leading-relaxed text-gray-100">
                  {getCurrentHoroscope()}
                </p>
              </div>
            </div>

            {/* Wallet connection prompt */}
            {!wallet.connected && (
              <div className="bg-blue-900/30 rounded-xl p-8 border border-blue-400/30 text-center">
                <div className="space-y-4">
                  <div className="text-4xl">💧</div>
                  <h3 className="text-xl font-bold text-blue-300">Connect Your Wallet</h3>
                  <p className="text-blue-300">
                    {t('connectSuietPrompt')}
                  </p>
                  <div className="flex justify-center">
                    <CustomConnectButton t={t} />
                  </div>
                  <div className="text-sm text-blue-400 mt-4">
                    <h4>{t('testnetDisclaimer')}</h4>
                    <p className="text-xs mt-1">{t('testnetExplainer')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Progress indicator with proper blockchain data representation */}
            {wallet.connected && (
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{t('weeklyProgress')}</h2>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-400">{getCurrentDayOfWeek() + 1}/7</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 mb-8 mt-2">
                  {[...Array(7)].map((_, i) => {
                    // i represents day of week: 0=Sunday, 1=Monday, etc.
                    const isToday = i === getCurrentDayOfWeek();
                    const isPastDay = i < getCurrentDayOfWeek();
                    const isFutureDay = i > getCurrentDayOfWeek();
                    
                    // Check blockchain data for this day
                    const dayProgress = weeklyProgressByDay[i];
                    const isTodayCompletedFlag = isToday && (blockchainClaimStatus === 'claimed' || !!dayProgress);
                    
                    let bgColor, label, topText, topTextColor;
                    
                    if (dayProgress) {
                      // Day was claimed - show amount earned from blockchain
                      bgColor = 'bg-green-500';
                      label = '✓';
                      topText = `+${dayProgress.dailyReward}`;
                      topTextColor = 'text-green-400';
                    } else if (isTodayCompletedFlag) {
                      // Today was claimed - show estimated amount
                      bgColor = 'bg-green-500';
                      label = '✓';
                      topText = todaysClaimAmount > 0 ? `+${todaysClaimAmount}` : '+10';
                      topTextColor = 'text-green-400';
                    } else if (isPastDay) {
                      // Missed day
                      bgColor = 'bg-red-500';
                      label = '✗';
                      topText = '+0';
                      topTextColor = 'text-red-400';
                    } else if (isToday && blockchainClaimStatus === 'not_claimed') {
                      // Today, ready to claim
                      bgColor = 'bg-yellow-500 animate-pulse';
                      label = '!';
                      topText = 'Today';
                      topTextColor = 'text-green-400';
                    } else if (isToday) {
                      // Today, checking status
                      bgColor = 'bg-yellow-600';
                      label = '?';
                      topText = 'Today';
                      topTextColor = 'text-yellow-400';
                    } else {
                      // Future days
                      bgColor = 'bg-gray-600';
                      label = '';
                      topText = '⭐';
                      topTextColor = 'text-yellow-200';
                    }
                    
                    return (
                      <div key={i} className="flex-1 relative py-2">
                        {/* Top text showing earnings or status */}
                        {topText && (
                          <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs ${topTextColor} whitespace-nowrap font-semibold`}>
                            {topText}
                          </div>
                        )}
                        
                        {/* Day indicator bar */}
                        <div
                          className={`h-4 rounded-full ${bgColor} flex items-center justify-center`}
                          title={`${getDayName(i)}${dayProgress ? ` - Earned ${dayProgress.dailyReward} $HORO` : isTodayCompletedFlag ? ` - Earned ${todaysClaimAmount || 10} $HORO` : isPastDay ? ' - Missed (+0 $HORO)' : isToday ? ' - Today' : ' - Future'}`}
                        >
                          {label && (
                            <span className="text-white text-xs font-bold">{label}</span>
                          )}
                        </div>
                        
                        {/* Day label underneath */}
                        <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap ${
                          isToday ? 'text-green-400 font-semibold' : 'text-gray-400'
                        }`}>
                          {getDayName(i).slice(0, 3)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Progress Legend */}
                <div className="flex justify-center space-x-4 text-xs mb-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-400">{t('completed')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-400">{t('missed')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-400">{t('available')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <span className="text-gray-400">{t('future')}</span>
                  </div>
                </div>
                
                {/* Claim status UI */}
                {wallet.connected && wallet.signTransaction ? (
                  <div className="mt-2 space-y-2">
                    {(() => {
                      const hasAlreadyClaimed = isTodayCompleted();
                      const isCheckingStatus = isVerifyingClaim && blockchainClaimStatus === 'checking';
                      const isCurrentlyClaiming = autoSigningProgress;
                      
                      if (hasAlreadyClaimed) {
                        return (
                          <>
                            <button
                              disabled={true}
                              className="bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm flex items-center space-x-2 w-full justify-center cursor-not-allowed"
                            >
                              <span>✅ {todaysClaimAmount > 0 ? t('claimedAmountToday', { amount: todaysClaimAmount }) : t('alreadyClaimedToday')}</span>
                            </button>
                            <div className="text-center space-y-1">
                              <p className="text-green-400 text-sm">{t('alreadyClaimedMessage')}</p>
                              <p className="text-gray-400 text-xs">{t('nextClaimAvailable')}</p>
                            </div>
                          </>
                        );
                      } else if (isCheckingStatus) {
                        return (
                          <>
                            <button
                              disabled={true}
                              className="bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm flex items-center space-x-2 w-full justify-center"
                            >
                              <LoadingSpinner size="h-4 w-4" />
                              <span>{t('verifyingClaim')}</span>
                            </button>
                            <p className="text-xs text-gray-400 text-center">
                              Checking blockchain status...
                            </p>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <button
                              onClick={() => claimTodaysHoro(selectedSign)}
                              disabled={isCurrentlyClaiming}
                              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 w-full justify-center"
                            >
                              {isCurrentlyClaiming ? (
                                <>
                                  <LoadingSpinner size="h-4 w-4" />
                                  <span>{t('claiming')}</span>
                                </>
                              ) : (
                                <span>{t('claimTodaysHoro')}</span>
                              )}
                            </button>
                            <p className="text-xs text-gray-400 text-center">
                              Click to claim your daily $HORO tokens (protected by smart contract)
                            </p>
                          </>
                        );
                      }
                    })()}
                  </div>
                ) : wallet.connected ? (
                  <p className="text-red-400 text-sm mt-2">
                    {t('useSuietForSigning')}
                  </p>
                ) : null}
                
                {wallet.address && (
                  <div className="mt-3 space-y-2">
                    <p className="text-gray-400 text-xs">
                      {t('wallet')}: {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                    </p>
                    <GasManager wallet={wallet} suiClient={suiClient} t={t} />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="text-center mt-12 mb-8">
            <div className="flex justify-center space-x-6 text-gray-400">
              <button 
                onClick={() => setShowAbout(true)}
                className="hover:text-yellow-400 transition-colors text-sm font-medium cursor-pointer"
              >
                {t('about')}
              </button>
              <button 
                onClick={() => setShowTokenomics(true)}
                className="hover:text-yellow-400 transition-colors text-sm font-medium cursor-pointer"
              >
                {t('tokenomics')}
              </button>
              <button 
                onClick={() => setShowHelp(true)}
                className="hover:text-yellow-400 transition-colors text-sm font-medium cursor-pointer"
              >
                {t('help')}
              </button>
              <LanguageSelector 
                currentLanguage={language} 
                onLanguageChange={handleLanguageChange}
                textColor="text-gray-400"
              />
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="hover:text-red-400 transition-colors text-sm font-medium cursor-pointer"
              >
                {t('reset')}
              </button>
            </div>
          </div>

          {/* SVAC Static Logo - Centered below footer */}
          <div className="flex justify-center items-center mt-8">
            <div className="text-gray-500">
              {/* <StaticLogo size="small" /> */}
            </div>
          </div>
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowAbout(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{mt('aboutHoro')}</h2>
              <button 
                onClick={() => setShowAbout(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-gray-100">
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whatIsHoro')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('whatIsHoroText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whereIsHoro')}</h3>
                <p className="leading-relaxed">{mt('whereIsHoroText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whenIsHoro')}</h3>
                <div className="leading-relaxed whitespace-pre-line">{mt('whenIsHoroText')}</div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whyHoro')}</h3>
                <p className="leading-relaxed">{mt('whyHoroText')}</p>
              </div>

              {/* <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whoHoro')}</h3>
                <p className="leading-relaxed">{mt('whoHoroText')}</p>
              </div> */}

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whatsNext')}</h3>
                <p className="leading-relaxed">{mt('whatsNextText')}</p>
              </div>

              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                <h4 className="font-semibold text-blue-300 mb-2">{mt('contractAddress')}</h4>
                <div className="font-mono text-xs text-blue-200 break-all bg-black/30 p-2 rounded">
                  {PACKAGE_ID}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{/* Tokenomics Modal */}
{showTokenomics && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowTokenomics(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{mt('tokenomics')}</h2>
              <button 
                onClick={() => setShowTokenomics(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-gray-100">
              <div className="text-center">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">{mt('totalSupplyTitle')}</h3>
                <h4 className="text-2xl font-bold text-white mb-2">{mt('totalSupply')}</h4>
                <p className="text-green-400 font-semibold">{mt('fixedSupply')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-4">{mt('allocationBreakdown')}</h3>
                <div className="space-y-3">
                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-400/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-purple-300">{mt('dailyClaims')}</div>
                      <div className="text-xs text-gray-400">{mt('dailyClaimsAmount')}</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-300">90%</div>
                  </div>
                </div>
                
                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-blue-300">{mt('ecosystemRewards')}</div>
                      <div className="text-xs text-gray-400">{mt('ecosystemRewardsAmount')}</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-300">5%</div>
                  </div>
                </div>
                
                <div className="bg-green-900/30 p-4 rounded-lg border border-green-400/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-green-300">{mt('socialEngagement')}</div>
                      <div className="text-xs text-gray-400">{mt('socialEngagementAmount')}</div>
                    </div>
                    <div className="text-2xl font-bold text-green-300">3%</div>
                  </div>
                </div>
                
                <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-400/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-yellow-300">{mt('developerInfraSupport')}</div>
                      <div className="text-xs text-gray-400">{mt('developerInfraSupportAmount')}</div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-300">1%</div>
                  </div>
                </div>
                
                <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-400/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-orange-300">{mt('futureSurprises')}</div>
                      <div className="text-xs text-gray-400">{mt('futureSurprisesAmount')}</div>
                    </div>
                    <div className="text-2xl font-bold text-orange-300">1%</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-white">TOTAL</div>
                    <div className="text-xl font-bold text-white">100%</div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{mt('totalSupplyAmount')}</div>
                </div>
              </div>
              </div>

              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                <h4 className="font-semibold text-blue-300 mb-2">{mt('contractAddress')}</h4>
                <div className="font-mono text-xs text-blue-200 break-all bg-black/30 p-2 rounded">
                  {PACKAGE_ID}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowHelp(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{mt('helpTitle')}</h2>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-gray-100">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">{mt('switchToTestnet')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('switchToTestnetText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-green-400 mb-3">{mt('needTestnetSui')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('needTestnetSuiText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('troubleshooting')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('troubleshootingText')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Wrapper component with WalletProvider - Suiet Only
export default function HoroAppWithWallet() {
  return (
    <ErrorBoundary>
      <WalletProvider
        chains={['sui:testnet']}
        autoConnect={true}
        supportedWallets={['Suiet']}
      >
        <HoroApp />
      </WalletProvider>
    </ErrorBoundary>
  );
}