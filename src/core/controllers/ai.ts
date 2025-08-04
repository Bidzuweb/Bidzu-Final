import { compressFileForAI } from '@/utils/compressor'
import { BiddoSettings } from '../domain/settings'
import { AiGeneratedDataResult, AiRepository } from '../repositories/ai'
import { AppStore } from '../store'

class AiController {
  public async generateAuctionDataFromImages(params: {
    appSettings: BiddoSettings
    assets: File[]
    currency: string
  }): Promise<AiGeneratedDataResult | null> {
    const { appSettings, assets, currency } = params
    const aiEnabled = appSettings.aiEnabled
    if (!aiEnabled) {
      throw new Error('AI_DISABLED')
    }

    const usedAiResponses = AppStore.accountData?.aiResponsesCount ?? 0
    const maxAiResponsesReached = appSettings.maxAiResponsesPerUser <= usedAiResponses
    if (maxAiResponsesReached) {
      throw new Error('MAX_AI_RESPONSES_REACHED')
    }

    const coinsToSpend =
      usedAiResponses < appSettings.freeAiResponses ? 0 : appSettings.aiResponsesPriceInCoins
    if (coinsToSpend > (AppStore.accountData?.coins ?? 0)) {
      throw new Error('NOT_ENOUGH_COINS')
    }

    const compressedAssets = await Promise.all(
      assets.map(async (asset) => {
        return compressFileForAI(asset)
      })
    )

    return await AiRepository.generateDescription({
      files: compressedAssets,
      currency,
    })
  }
}

const aiController = new AiController()
export { aiController as AiController }
